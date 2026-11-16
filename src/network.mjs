import {relationships,periods,factions,networkPositions,relationshipKind} from './relationships.mjs';

export function showNetwork({params,byId,t,bilingual,number,set,heading,escape,link,cite,tag,main}){
 const period = periods.find(([start])=>String(start)===params.get('period'));
 const faction = Object.hasOwn(factions,params.get('faction')) ? params.get('faction') : '';
 const visible = relationships.filter(edge=>
  (!period || (edge.start<=period[1] && edge.end>=period[0])) &&
  (!faction || edge.factions.includes(faction))
 );
 const ids = [...new Set(visible.flatMap(edge=>[edge.first,edge.second]))];
 ids.sort((a,b)=>networkPositions[a][1]-networkPositions[b][1] || networkPositions[a][0]-networkPositions[b][0]);
 const query = new URLSearchParams({view:'relationships'});
 if (period) query.set('period',period[0]);
 if (faction) query.set('faction',faction);
 const title = t('Full network');

 set(title,heading(t('Historical relationships'),title,t('Select a node to open its focused map and find related profiles and game cards.'))+`
  <section class="wrap">
   <form class="maptools" action="./">
    <input type="hidden" name="view" value="relationships">
    <label>${t('Time period')}
     <select name="period">
      <option value="">${t('All periods')}</option>
      ${periods.map(([start,end])=>`
       <option value="${start}" ${period?.[0]===start?'selected':''}>${number(start)}–${number(end)}</option>`).join('')}
     </select>
    </label>
    <label>${t('Faction')}
     <select name="faction">
      <option value="">${t('All factions')}</option>
      ${Object.entries(factions).map(([id,label])=>`
       <option value="${id}" ${id===faction?'selected':''}>${bilingual(label)}</option>`).join('')}
     </select>
    </label>
    <button>${t('Apply filters')}</button>
    ${period || faction ? `<a href="?view=relationships">${t('Reset network filters')}</a>` : ''}
   </form>
   <p class="intro">${t('Dates are approximate for long-running relationships. Faction filters include relationships involving the selected faction.')}</p>
   <p role="status">${number(ids.length)}${t(' nodes · ')}${number(visible.length)}${t(' relationships')}</p>
   ${ids.length ? `
    <div class="network-controls" role="group" aria-label="${t('Network controls')}">
     <button type="button" data-network-zoom="in" aria-label="${t('Zoom in')}">＋</button>
     <button type="button" data-network-zoom="out" aria-label="${t('Zoom out')}">−</button>
     <button type="button" data-network-reset>${t('Reset view')}</button>
     <output class="network-zoom" aria-live="polite"></output>
    </div>
    <p class="network-pan-help">${t('Drag to pan, or swipe on touchscreens. Use the zoom buttons to change scale.')}</p>
    <div class="network-scroll" role="region" tabindex="0" aria-label="${t('Relationship network graph. Drag or scroll to pan.')}">
     <div class="network-stage"><div class="full-network">
      <canvas aria-hidden="true"></canvas>
      ${ids.map(id=>{
       const [x,y]=networkPositions[id];
       const entry=byId[id];
       return `<a class="relation-node" data-kind="${relationshipKind(entry)}" data-network-id="${id}"
          style="grid-column:${x+1};grid-row:${y+1}" href="?${query}&selected=${id}">
        <small>${t(relationshipKind(entry))}</small>${escape(entry.title)}
       </a>`;
      }).join('')}
     </div>
    </div></div>
    <section class="section">
     <h2>${t('Documented connections')}</h2>
     <ul class="relationship-records">
      ${visible.map(edge=>`
       <li>
        <h3>${link(edge.first)} · ${link(edge.second)}</h3>
        ${tag(number(edge.start===edge.end ? edge.start : edge.start+'–'+edge.end))}
        <p>${escape(bilingual(edge.description))}</p>
        ${cite(edge.citations)}
       </li>`).join('')}
     </ul>
    </section>` : `<p>${t('No relationships match these filters.')}</p>`}
   <p><a href="?view=company">${t('Company and Parliament diagram')}</a></p>
  </section>`);
 if (ids.length) {
  const graph = main.querySelector('.full-network');
  const nodes = new Map([...graph.querySelectorAll('[data-network-id]')].map(node=>[node.dataset.networkId,node]));
  enableNetworkControls(main,graph,number);
  drawRelationshipLines(graph,visible.map(edge=>[nodes.get(edge.first),nodes.get(edge.second)]));
 }
}

export function drawRelationshipLines(graph,pairs){
 const canvas=graph.querySelector('canvas');
 const ctx=canvas.getContext('2d');
 if (!ctx) return;
 function redraw(){
  const bounds=graph.getBoundingClientRect();
  const transformScale=bounds.width/graph.offsetWidth;
  const scale=window.devicePixelRatio || 1;
  canvas.width=Math.round(graph.offsetWidth*scale);
  canvas.height=Math.round(graph.offsetHeight*scale);
  ctx.scale(scale,scale);
  ctx.strokeStyle='#9c8966';
  ctx.lineWidth=1.25;
  const point=element=>{
   const rect=element.getBoundingClientRect();
   return [(rect.left-bounds.left+rect.width/2)/transformScale,(rect.top-bounds.top+rect.height/2)/transformScale];
  };
  ctx.beginPath();
  for (const [first,second] of pairs) {
   ctx.moveTo(...point(first));
   ctx.lineTo(...point(second));
  }
  ctx.stroke();
 }
 new ResizeObserver(redraw).observe(graph);
 redraw();
}

function enableNetworkControls(main,graph,number){
 const viewport=main.querySelector('.network-scroll');
 const stage=main.querySelector('.network-stage');
 const output=main.querySelector('.network-zoom');
 const zoomIn=main.querySelector('[data-network-zoom="in"]');
 const zoomOut=main.querySelector('[data-network-zoom="out"]');
 let zoom=1;
 let drag=null;
 let suppressClick=false;

 function applyZoom(next,reset=false){
  const old=zoom;
  const centerX=(viewport.scrollLeft+viewport.clientWidth/2)/old;
  const centerY=(viewport.scrollTop+viewport.clientHeight/2)/old;
  zoom=Math.max(.5,Math.min(2.5,next));
  graph.style.transform='scale('+zoom+')';
  stage.style.width=graph.offsetWidth*zoom+'px';
  stage.style.height=graph.offsetHeight*zoom+'px';
  viewport.scrollLeft=reset ? 0 : centerX*zoom-viewport.clientWidth/2;
  viewport.scrollTop=reset ? 0 : centerY*zoom-viewport.clientHeight/2;
  output.value=number(Math.round(zoom*100))+'%';
  zoomIn.disabled=zoom>=2.5;
  zoomOut.disabled=zoom<=.5;
 }
 zoomIn.addEventListener('click',()=>applyZoom(zoom+.25));
 zoomOut.addEventListener('click',()=>applyZoom(zoom-.25));
 main.querySelector('[data-network-reset]').addEventListener('click',()=>applyZoom(1,true));
 viewport.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse' || event.button!==0) return;
  suppressClick=false;
  drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop,moved:false};
 });
 viewport.addEventListener('pointermove',event=>{
  if(!drag) return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(Math.hypot(dx,dy)>5) {
   drag.moved=true;
   viewport.setPointerCapture(event.pointerId);
   viewport.classList.add('panning');
  }
  if(drag.moved) {
   viewport.scrollLeft=drag.left-dx;
   viewport.scrollTop=drag.top-dy;
  }
 });
 viewport.addEventListener('pointerup',()=>{
  suppressClick=Boolean(drag?.moved);
  drag=null;
  viewport.classList.remove('panning');
 });
 viewport.addEventListener('pointerleave',()=>{
  if (!drag?.moved) drag=null;
 });
 viewport.addEventListener('pointercancel',()=>{
  drag=null;
  viewport.classList.remove('panning');
 });
 viewport.addEventListener('click',event=>{
  if(suppressClick) {
   event.preventDefault();
   event.stopPropagation();
   suppressClick=false;
  }
 },true);
 viewport.addEventListener('dragstart',event=>event.preventDefault());
 viewport.addEventListener('keydown',event=>{
  if(event.target!==viewport) return;
  if(event.key==='+' || event.key==='=') { event.preventDefault(); applyZoom(zoom+.25); }
  if(event.key==='-') { event.preventDefault(); applyZoom(zoom-.25); }
  if(event.key==='0') { event.preventDefault(); applyZoom(1,true); }
 });
 new ResizeObserver(()=>applyZoom(zoom)).observe(graph);
 applyZoom(1,true);
}
