import {translate,localNumber} from './locale.mjs';

// Original simplified coastline paths, in longitude and latitude.
const india = [
 [63,25],[66,25],[68,23.7],[68.6,22.6],[69.3,22.9],[68.9,22.2],[69.4,21.2],[70.6,20.7],[72,21.3],[72.7,22.3],[72.6,20.4],[72.7,18.9],[73.3,17],[73.4,15.4],[74.4,13.9],[75.2,12.6],[76.2,10.4],[77.55,8.05],[78.45,9.15],[79.55,10.2],[79.8,12.2],[80.3,13.3],[80.1,15.2],[81.15,16.2],[82.3,16.8],[83.3,17.7],[85.3,19.8],[86.8,20.7],[88,21.65],[89,21.55],[90.1,21.8],[91.7,22.05],[92.3,20.7],[93.5,19.7],[94.3,17.6],[95.3,16.15],[96.1,16.4],[97.2,17.3],[98.1,15.5],[98.35,12.8],[99.2,11],[101,8],[108,9],[111,20],[116,26],[118,34],[90,44],[65,42]
];
const sriLanka = [[79.85,9.7],[80.45,9.6],[81.5,7.9],[81.9,6.2],[80.8,5.9],[79.8,6.8],[79.7,8.1]];
const africa = [[-7,35],[-10,31],[-17,21],[-17,14],[-12,8],[-4,5],[8,4],[10,-1],[11,-7],[13,-12],[12,-17],[15,-25],[18,-34],[25,-34],[31,-29],[34,-25],[35,-18],[40,-13],[42,-1],[51,11],[44,11],[39,17],[33,29],[25,32],[12,34],[1,36]];
const eurasia = [[-9,43],[-10,37],[-4,36],[1,39],[4,43],[10,43],[16,39],[23,36],[26,40],[32,41],[36,36],[35,29],[43,12],[51,16],[58,23],[60,25],[...india[0]],...india.slice(1,-2),[123,37],[133,54],[126,59],[-5,60]];
const britain = [[-6,50],[-5,51],[-4,52],[-5,54],[-3,55],[-6,57],[-4,59],[-1,58],[-2,56],[0,53],[1,51]];
const madagascar = [[49,-12],[50,-15],[49,-22],[46,-26],[44,-24],[43,-20],[45,-15]];
const islands = [[95,5],[100,2],[104,-4],[106,-6],[103,-6],[98,-1]];
const views = {
 india:{minX:64,maxX:95,minY:6,maxY:34,w:760,h:575,grid:5, labels:[['ARABIAN SEA',68,14],['BAY OF BENGAL',89,15],['INDIAN OCEAN',70,8]]},
 network:{minX:-24,maxX:125,minY:-40,maxY:59,w:760,h:465,grid:20,labels:[['ATLANTIC',-15,0],['INDIAN OCEAN',69,-21],['AFRICA',19,9],['ASIA',88,44]]},
};
export function projection(view) {
 const {minX,maxX,minY,maxY,w,h}=views[view];
 return {
  w,h, point: ([lon,lat])=>[(lon-minX)/(maxX-minX)*w,(maxY-lat)/(maxY-minY)*h],
  contains: ({lon,lat})=>lon>=minX&&lon<=maxX&&lat>=minY&&lat<=maxY
 };
}
export function drawMap(canvas,view,routes=[],language='en'){
 const {w,h,point}=projection(view);
 const {minX,maxX,minY,maxY,grid,labels}=views[view];
 canvas.width=w*2;
 canvas.height=h*2;
 const ctx=canvas.getContext('2d');
 ctx.scale(2,2);
 function path(coords,close=false){
  ctx.beginPath();
  coords.forEach((coordinate,i)=>{
    const [x,y]=point(coordinate);
    if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  if(close)ctx.closePath();
 }
 const sea=ctx.createLinearGradient(0,0,w,h);
 sea.addColorStop(0,'#214342');sea.addColorStop(1,'#102d30');
 ctx.fillStyle=sea;ctx.fillRect(0,0,w,h);
 const land=ctx.createLinearGradient(0,0,w,h);
 land.addColorStop(0,'#647263');land.addColorStop(1,'#384e47');
 ctx.fillStyle=land;ctx.strokeStyle='#99a18a';ctx.lineWidth=0.9;
 (view==='india'?[india,sriLanka]:[africa,eurasia,britain,madagascar,sriLanka,islands]).forEach(coords=>{
   path(coords,true);ctx.fill();ctx.stroke();
 });
 ctx.strokeStyle='#dfe1bd28';ctx.lineWidth=0.7;
 ctx.fillStyle='#d9dcc070';ctx.font='10px Georgia';
 for(let x=Math.ceil(minX/grid)*grid;x<maxX;x+=grid){
   path([[x,minY],[x,maxY]]);ctx.stroke();
   ctx.fillText(localNumber(x,language)+'°',point([x,0])[0]+4,h-10);
 }
 for(let y=Math.ceil(minY/grid)*grid;y<maxY;y+=grid){path([[minX,y],[maxX,y]]);ctx.stroke();}
 ctx.fillStyle='#e2d9b990';ctx.font=language === 'fa' ? '13px Tahoma' : 'italic 13px Georgia';
 labels.forEach(([name,x,y])=>ctx.fillText(translate(name,language),...point([x,y])));
 ctx.setLineDash([5,5]);ctx.lineWidth=2.3;ctx.strokeStyle='#eec984';
 routes.forEach(route=>{path(route.points);ctx.stroke();});
 ctx.setLineDash([]);
 const [x,y]=[w-54,h-51];
 ctx.strokeStyle='#e4cf946e';ctx.fillStyle='#e4cf94';ctx.lineWidth=1;
 ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x-4,y+6);ctx.lineTo(x,y+2);ctx.lineTo(x+4,y+6);ctx.closePath();ctx.fill();
 ctx.font='11px Tahoma';ctx.textAlign='center';ctx.fillText(translate('N',language),x,y-23);
}
