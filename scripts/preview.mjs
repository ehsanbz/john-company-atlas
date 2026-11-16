import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const base = '/john-company-atlas/';
const dir = new URL('../dist/',import.meta.url);
const files = new Set(['index.html','style.css','app.mjs','atlas.mjs','history.mjs','components.mjs','cartography.mjs','locale.mjs','persian.mjs','artwork.mjs','story.mjs','relationships.mjs','.nojekyll']);
const mime = {html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',mjs:'text/javascript; charset=utf-8',webp:'image/webp'};
const server = createServer(async (req,res)=>{
  const {pathname} = new URL(req.url,'http://localhost');
  if (pathname==='/'){res.writeHead(302,{Location:base});res.end();return;}
  const file = pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : '';
  if (!files.has(file) && !/^assets\/game\/[a-z0-9-]+\.webp$/.test(file)){res.writeHead(404);res.end('Unavailable');return;}
  try{
    const content = await readFile(new URL(file,dir));
    res.writeHead(200,{'Content-Type':mime[file.split('.').pop()]||'text/plain'});
    res.end(content);
  }catch{
    res.writeHead(503);res.end('Run node scripts/build.mjs first.');
  }
});
server.listen(Number(process.env.ATLAS_PORT || 4173),'127.0.0.1',()=>console.log('Local http://127.0.0.1:'+server.address().port+base));
