import assert from 'node:assert/strict';
import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {entries,byId,sources,markers,routes,timeline,componentTypes} from '../src/atlas.mjs';

import {persianEntries} from '../src/persian.mjs';
import {artwork,imagesFor} from '../src/artwork.mjs';
import {chapters} from '../src/story.mjs';
import {relationships} from '../src/relationships.mjs';

const relationshipPairs = new Set();
for (const {first,second,description,citations} of relationships) {
 assert.ok(byId[first] && byId[second] && first !== second,'Invalid relationship: '+first+' / '+second);
 assert.ok(description.every(Boolean) && citations.length,'Missing relationship text or source');
 for (const id of citations) assert.ok(Object.hasOwn(sources,id),'Missing relationship source '+id);
 const pair = [first,second].sort().join('/');
 assert.ok(!relationshipPairs.has(pair),'Duplicate relationship '+pair);
 relationshipPairs.add(pair);
}

for (const [key,url] of Object.entries(artwork)) {
  assert.equal(new URL(url).hostname,'img.ludex.dev');
  const image=await readFile(new URL('../src/assets/game/'+key+'.webp',import.meta.url));
  assert.equal(image.toString('ascii',8,12),'WEBP','Invalid game image '+key);
}
for (const entry of entries) {
  const images=imagesFor(entry);
  if(componentTypes.includes(entry.type)) assert.ok(images.length,'No game image for '+entry.id);
  for (const key of images) assert.ok(Object.hasOwn(artwork,key),'Missing game image '+key);
}
for (const chapter of chapters) {
  assert.ok(Object.hasOwn(artwork,chapter.image));
  for (const id of chapter.entries) assert.ok(Object.hasOwn(byId,id),'Missing story entry '+id);
}

assert.deepEqual(Object.keys(persianEntries).sort(),entries.map(entry=>entry.id).sort(),'Persian entries must match the English IDs');
assert.equal(Object.keys(byId).length,entries.length,'Entry IDs must be unique');
for (const entry of entries){
  assert.match(entry.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(persianEntries[entry.id].title && persianEntries[entry.id].body,entry.id+' lacks Persian text');
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
