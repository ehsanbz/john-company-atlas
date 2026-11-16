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
    <p class="network-scroll-hint">${t('Scroll to explore the graph. The relationship list follows below.')}</p>
    <div class="network-scroll" role="region" tabindex="0" aria-label="${t('Relationship network graph. Scroll to view all nodes.')}">
     <div class="full-network">
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
    </div>
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
  drawRelationshipLines(graph,visible.map(edge=>[nodes.get(edge.first),nodes.get(edge.second)]));
 }
}

export function drawRelationshipLines(graph,pairs){
 const canvas=graph.querySelector('canvas');
 const ctx=canvas.getContext('2d');
 if (!ctx) return;
 function redraw(){
  const bounds=graph.getBoundingClientRect();
  const scale=window.devicePixelRatio || 1;
  canvas.width=Math.round(bounds.width*scale);
  canvas.height=Math.round(bounds.height*scale);
  ctx.scale(scale,scale);
  ctx.strokeStyle='#9c8966';
  ctx.lineWidth=1.25;
  const point=element=>{
   const rect=element.getBoundingClientRect();
   return [rect.left-bounds.left+rect.width/2,rect.top-bounds.top+rect.height/2];
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
