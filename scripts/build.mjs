import assert from 'node:assert/strict';
import {cp,mkdir,writeFile} from 'node:fs/promises';
import {entries,byId,sources,markers,routes,timeline} from '../src/atlas.mjs';

assert.equal(Object.keys(byId).length,entries.length,'Entry IDs must be unique');
for (const entry of entries){
  assert.match(entry.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(entry.body && entry.citations.length,entry.id);
  for(const id of entry.citations) assert.ok(Object.hasOwn(sources,id),entry.id+' has missing source '+id);
  for(const id of entry.related) assert.ok(Object.hasOwn(byId,id),entry.id+' has missing related entry '+id);
}
for (const marker of markers) assert.ok(Object.hasOwn(byId,marker.id)&&marker.from<=marker.to,marker.id);
for (const route of routes) assert.ok(Object.hasOwn(byId,route.id)&&Object.hasOwn(sources,route.source),route.id);
for (const [type,total] of [['Office',17],['Law',26],['Event tile',7],['Scenario',4]]) assert.equal(entries.filter(entry=>entry.type===type).length,total,type);
assert.equal(entries.flatMap(entry=>entry.variants??[]).length,20,'Physical event tile count');
for (const [start,end] of [['bengal','scenario-1758'],['scenario-1758','plassey'],['plassey','president-of-bengal'],['calico-acts','calico-history'],['calico-history','parliament']]){
  assert.ok(byId[start].related.includes(end),start+' must link to '+end);
}
assert.ok(timeline.some(entry=>entry.id==='transfer-1858'));

const dest = new URL('../dist/',import.meta.url);
await mkdir(dest,{recursive:true});
await cp(new URL('../src/',import.meta.url),dest,{recursive:true});
await writeFile(new URL('.nojekyll',dest),'');
console.log('Built '+entries.length+' validated atlas entries in dist/.');
