import {entries as englishEntries,sources,componentTypes,timeline,markers,routes,credits} from './atlas.mjs';
import {drawMap,projection} from './cartography.mjs';
import {translate,localNumber,normalizeSearch} from './locale.mjs';
import {persianEntries} from './persian.mjs';

const main = document.querySelector('main');
const params = new URLSearchParams(location.search);
const language = params.get('lang') === 'fa' ? 'fa' : 'en';
const t = text => translate(text,language);
const number = value => localNumber(value,language);
const entries = englishEntries.map(entry => {
 const persian = persianEntries[entry.id];
 return {
  ...entry,
  ...(language === 'fa' ? persian : {}),
  aliases: language === 'fa' ? [...new Set([entry.title,...entry.aliases])] : entry.aliases,
  searchText: normalizeSearch([entry.title,entry.body,...entry.aliases,persian.title,persian.body,entry.year].join(' ')),
 };
});
const byId = Object.assign(Object.create(null),Object.fromEntries(entries.map(entry=>[entry.id,entry])));
const localizedTimeline = timeline.map(entry=>byId[entry.id]);

function withLanguage(path) {
 if (language === 'en') return path;
 const url = new URL(path,location.href);
 url.searchParams.set('lang',language);
 return url.pathname + url.search + url.hash;
}

document.documentElement.lang = language;
document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
document.querySelectorAll('[data-text]').forEach(el => { el.textContent=t(el.dataset.text); });
document.querySelector('nav').setAttribute('aria-label',t('Main navigation'));
const languageLink = document.querySelector('.language-switch');
const alternate = new URL(location.href);
if (language === 'fa') alternate.searchParams.delete('lang');
else alternate.searchParams.set('lang','fa');
languageLink.href = alternate.href;
languageLink.lang = language === 'fa' ? 'en' : 'fa';
languageLink.hreflang = languageLink.lang;
languageLink.textContent = language === 'fa' ? 'English' : 'فارسی';

const view = params.get('view') || (params.has('entry') ? 'entry' : 'home');
const escape = text => String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const link = (id,label) => '<a href="'+withLanguage('?entry='+encodeURIComponent(id))+'">'+escape(label || byId[id]?.title || id)+'</a>';
const cite = ids => '<ul class="citations">'+ids.map(id=>'<li><a target="_blank" rel="noopener" href="'+escape(sources[id][1])+'">'+'<bdi lang="en">'+escape(sources[id][0])+'</bdi>'+' ↗</a></li>').join('')+'</ul>';
const tag = text => '<span class="eyebrow">'+escape(t(text))+'</span>';
const heading = (eyebrow,title,intro) => '<div class="pagehead wrap">'+tag(eyebrow)+'<h1>'+title+'</h1>'+(intro?'<p class="intro">'+intro+'</p>':'')+'</div>';
const card = entry => '<a class="entrycard" href="'+withLanguage('?entry='+entry.id)+'">'+tag(t(entry.type)+(entry.year?' · '+number(entry.year):''))+'<h3>'+escape(entry.title)+'</h3><p>'+escape(entry.body.slice(0,140))+'…</p><span class="arrow" aria-hidden="true">↗</span></a>';
function set(title,html){
 document.title=title+' · '+t('John Company Atlas');
 main.innerHTML=html;
 document.querySelectorAll('nav a').forEach(a=>{
  if (new URL(a.href).searchParams.get('view') === view) a.setAttribute('aria-current','page');
 });
 document.querySelectorAll('a[href^="?"], a[href="./"]').forEach(a=>{
  a.href=withLanguage(a.getAttribute('href'));
 });
 if (language === 'fa') main.querySelectorAll('form').forEach(form=>{
  const input=document.createElement('input');
  input.type='hidden';
  input.name='lang';
  input.value=language;
  form.append(input);
 });
}
function searchForm(value=''){
 return `<form class="searchform" action="./"><input type="hidden" name="view" value="search"><label class="sr" for="query">${t("Search the atlas")}</label><input id="query" name="q" type="search" value="`+escape(value)+`" placeholder="${t("Search Bengal, a law, a person…")}"><button>${t("Search")} <span aria-hidden="true">↗</span></button></form>`;
}
function home(){
 set(t("Historical companion"), '<section class="hero"><div class="wrap herogrid"><div class="herocopy">'+tag(t("An unofficial companion · Second Edition"))+`<h1>${t("A company.")}<br>${t("An empire.")}<br><em>${t("A world of interests.")}</em></h1><p>${t("Follow the people, places and institutions behind ")}<cite>${t("John Company")}</cite>${t(". Explore how trade, family ambition and political power remade a connected world.")}</p><a class="button gold" href="?view=map">${t("Explore the atlas")} <span aria-hidden="true">↗</span></a><a class="textlink" href="?view=scenarios">${t("Choose a scenario →")}</a><p class="byline">${t("A historical companion to the game by Cole Wehrle")}<br>${t("Published by Wehrlegig Games")}</p></div><div class="heroatlas"><div id="hero-map" class="mapframe hero-map"></div><div class="mapcaption"><span>${t("THE INDIAN OCEAN WORLD")}</span><span>${t("1710 — 1858")}</span></div></div></div></section><section class="quicksearch wrap">`+searchForm()+'</section><section class="wrap section"><div class="sectionhead"><div>'+tag(t("Follow the connections"))+`<h2>${t("Begin with what’s on the table.")}</h2></div><a href="?view=components">${t("Browse the component index →")}</a></div><div class="threegrid"><a class="feature" href="?view=scenarios"><span class="featureicon">◷</span><h3>${t("Four ways into history")}</h3><p>${t("Start in 1710, 1758 or 1813. Understand the world each setup compresses.")}</p><span>${t("Scenarios →")}</span></a><a class="feature" href="?view=company"><span class="featureicon">♜</span><h3>${t("Who holds the power?")}</h3><p>${t("Trace appointments, commercial interests and the reach of Parliament.")}</p><span>${t("Company &amp; Parliament →")}</span></a><a class="feature" href="?view=timeline"><span class="featureicon">⟶</span><h3>${t("Trade becomes government")}</h3><p>${t("Connect the game’s turning points to a documented historical chronology.")}</p><span>${t("Timeline →")}</span></a></div></section><section class="band"><div class="wrap section"><div class="sectionhead"><div>`+tag(t("A connected history"))+`<h2>${t("Look beyond the Company’s accounts.")}</h2></div><a href="?view=people">${t("People, places &amp; glossary →")}</a></div><div class="threegrid">`+['bengal','jagat-sheth','calico-acts'].map(id=>card(byId[id])).join('')+'</div></div></section>');
 renderMap('hero-map',{year:1758,layer:'All',geo:'india',preview:true});
}
function entryPage(){
 const entry=byId[params.get('entry')];
 if(!entry){set(t("Entry unavailable"),heading(t("Catalogue"),t("Entry unavailable"),t("Use global search to find an entry."))+'<div class="wrap">'+searchForm()+'</div>');return;}
 const reverse=entries.filter(other=>other.related.includes(entry.id)).map(other=>other.id);
 const related=[...new Set([...entry.related,...reverse])].filter(id=>id!==entry.id);
 const component=componentTypes.includes(entry.type);
 set(entry.title,'<article class="wrap article"><a class="back" href="?view='+(component?'components':'search')+'">← '+(component?t("Component index"):t("Explore entries"))+'</a>'+tag(t(entry.type)+(entry.year?' · '+number(entry.year):''))+'<h1>'+escape(entry.title)+'</h1>'+(entry.aliases.length?`<p class="aliases">${t("Also indexed as ")}`+entry.aliases.map(alias=>'<bdi>'+escape(alias)+'</bdi>').join(' · ')+'</p>':'')+'<div class="articlegrid"><div><p class="bodycopy">'+escape(entry.body)+'</p>'+cite(entry.citations)+(component?'<aside class="note"><strong>'+escape(t(entry.connection||'Scenario abstraction'))+'</strong><p>'+((entry.type==='Event tile')?t("These event families describe recurring conditions. A link to an incident provides context. These links are thematic and the event’s outcome depends on the game state."):t("The historical explanation is original interpretation of the component’s subject. Historical Acts and game laws can operate at different dates and through different procedures."))+`</p><p>${t("Inventory status · ")}`+(entry.type==='Law'&&entry.id==='calico-acts'?t("Title confirmed in the publisher’s rulebook example on printed page 34."):t("Checked against the publisher’s print-and-play sheets. The official errata page was unavailable."))+'</p></aside>':'')+(entry.variants?`<h2>${t("Physical tile variants")}</h2><ul>`+entry.variants.map(v=>'<li>'+escape(number(v.replace(/^[A-Za-z]+/,t)))+'</li>').join('')+'</ul>':'')+`</div><aside class="related"><h2>${t("Follow the connections")}</h2>`+related.map(id=>'<div>'+tag(byId[id].type)+link(id)+'</div>').join('')+'<a class="button outline" href="?view=map&selected='+entry.id+`">${t("Locate in the atlas ↗")}</a>`+(entry.year?'<a href="?view=timeline&focus='+entry.id+`">${t("Open in the timeline →")}</a>`:'')+'</aside></div></article>');
}
function catalogue(mode){
 const isScenarios=mode==='scenarios',isPeople=mode==='people';
 const title=isScenarios?t("Choose your starting world."):isPeople?t("People, places &amp; language."):t("From component to context.");
 const introduction=isScenarios?t("Two 1710 variants share an opening world. Each scenario compresses historical time and relationships."):isPeople?t("Browse historical actors, trading centers and the terms used across the game."):t("17 office cards, 26 laws including Deregulation, seven India event families covering 20 tiles, and scenario materials. Read the coverage notes for verification limits.");
 const allowed=isScenarios?['Scenario']:isPeople?['Person','Community','Place','Region','Glossary']:componentTypes;
 set(title,heading(t("The companion"),title,introduction)+`<section class="wrap"><div class="filters"><label>${t("Find an entry ")}<input id="filter-query" type="search" placeholder="${t("Name or alias")}"></label><label>${t("Type ")}<select id="filter-type"><option value="">${t("All types")}</option>`+allowed.map(type=>'<option value="'+type+'">'+t(type)+'</option>').join('')+`</select></label><a href="?view=sources#coverage">${t("Coverage notes ↗")}</a></div><p id="count" role="status"></p><div id="catalogue" class="threegrid"></div></section>`);
 const update=()=>{
  const q=normalize(document.querySelector('#filter-query').value.trim());
  const type=document.querySelector('#filter-type').value;
  const result=entries.filter(e=>allowed.includes(e.type)&&(!type||e.type===type)&&matches(e,q));
  document.querySelector('#count').textContent=number(result.length)+t(" entries");
  document.querySelector('#catalogue').innerHTML=result.length?result.map(card).join(''):`<p>${t("No matching entries. Try another name or clear the filters.")}</p>`;
 };
 document.querySelector('#filter-query').addEventListener('input',update);
 document.querySelector('#filter-type').addEventListener('change',update);update();
}
const normalize=normalizeSearch;
const matches=(e,q)=>!q||q.split(/\s+/).every(word=>e.searchText.includes(word));
function searchPage(){
 const q=params.get('q')||'';
 const normalized=normalize(q.trim());
 const found=entries.filter(e=>matches(e,normalized)).sort((a,b)=>Number(normalize(b.title)===normalized)-Number(normalize(a.title)===normalized)||a.title.localeCompare(b.title,language));
 const groups=[...new Set(found.map(e=>e.type))];
 set(t("Search"),heading(t("Global search"),t("Find a connection."),t("Search exact component names, historical names, alternate spellings and entry text."))+'<section class="wrap searchpage">'+searchForm(q)+'<p role="status">'+number(found.length)+t(" results")+(q?t(" for “")+escape(q)+t("”"):'')+'</p>'+groups.map(type=>'<section class="resultgroup"><h2>'+escape(t(type))+'</h2><div class="threegrid">'+found.filter(e=>e.type===type).map(card).join('')+'</div></section>').join('')+(!found.length?`<p>${t("No matching entries. Try “Bengal”, “Calico Acts” or “Palashi”.")}</p>`:'')+'</section>');
}
function renderMap(target,state){
 const {w,h,point,contains}=projection(state.geo);
 const visible=markers.filter(m=>contains(m)&&m.from<=state.year&&m.to>=state.year&&(state.layer==='All'||m.layer===state.layer));
 const activeRoutes=state.routes?routes.filter(r=>r.view===state.geo&&r.from<=state.year&&r.to>=state.year):[];
 const box=document.getElementById(target);
 box.style.aspectRatio=w+'/'+h;
 box.innerHTML='<canvas aria-hidden="true"></canvas><div class="map-labels">'+visible.map(m=>{
 const [x,y]=point([m.lon,m.lat]);
 return '<a class="marker '+(state.selected===m.id?'selected':'')+'" data-label="'+escape(m.label)+'" href="'+withLanguage('?'+(state.preview?'entry='+m.id:'view=map&year='+state.year+'&geo='+state.geo+'&layer='+encodeURIComponent(state.layer)+'&selected='+m.id+(state.routes?'&routes=1':'')))+'" style="left:'+x/w*100+'%;top:'+y/h*100+'%" aria-label="'+escape(t(m.label))+' · '+t(m.layer)+'"><i aria-hidden="true"></i><span>'+escape(t(m.label))+'</span></a>';
 }).join('')+'</div>';
 drawMap(box.querySelector('canvas'),state.geo,activeRoutes,language);
 return {visible,activeRoutes};
}
function mapPage(){
 const year=Math.max(1710,Math.min(1858,Number(params.get('year'))||1758));
 const geo=params.get('geo')==='network'?'network':'india';
 const layer=params.get('layer')||'All';
 const selected=byId[params.get('selected')]||byId.bengal;
 set(t("Interactive atlas"),heading(t("The atlas"),t("A world connected by trade &amp; power."),t("Explore representative centers of board regions and the wider Company network. Schematic geography and approximate routes. State markers identify seats of power, with dates indicating the period shown."))+`<section class="wrap"><form class="maptools"><input type="hidden" name="view" value="map"><label>${t("Year ")}<select name="year" id="map-year">`+[1710,1757,1758,1765,1773,1784,1799,1813,1818,1833,1849,1857,1858].map(y=>'<option value="'+y+'" '+(y===year?'selected':'')+'>'+number(y)+'</option>').join('')+`</select></label><label>${t("Geography ")}<select name="geo"><option value="india">${t("South Asia")}</option><option value="network" `+(geo==='network'?'selected':'')+`>${t("Britain, India &amp; China")}</option></select></label><label>${t("Layer ")}<select name="layer">`+['All','Region','Presidency','State','Port','Settlement','Battle'].map(l=>'<option value="'+l+'" '+(l===layer?'selected':'')+'>'+t(l)+'</option>').join('')+'</select></label><label class="check"><input name="routes" type="checkbox" value="1" '+(params.has('routes')?'checked':'')+`>${t(" Approximate routes")}</label><button>${t("Apply layers")}</button></form><div class="atlasgrid"><div><div class="mapframe" id="atlas-map"></div><div class="mapcaption"><span>`+number(year)+' · '+t(geo.toUpperCase())+`</span><span>${t("SCHEMATIC · CENTERS, NOT BORDERS")}</span></div></div><aside class="mapdetail">`+tag(selected.type)+'<h2>'+escape(selected.title)+'</h2><p>'+escape(selected.body)+'</p>'+cite(selected.citations)+'<a class="button gold" href="?entry='+selected.id+`">${t("Open full entry ↗")}</a><h3>${t("Connected entries")}</h3>`+selected.related.slice(0,5).map(id=>'<p>'+link(id)+'</p>').join('')+`</aside></div><details class="maplist" open><summary>${t("Accessible list of map entries")}</summary><p id="map-count"></p><div id="map-list" class="listlinks"></div></details><div id="route-notes"></div><aside class="note">${t("Map dates show trading or political context and battle occurrences. Historical region names cover changing areas. The map omits reconstructed boundaries. Settlement dots use approximate modern coordinates for orientation.")}</aside></section>`);
 const result=renderMap('atlas-map',{year,geo,layer,selected:selected.id,routes:params.has('routes')});
 document.querySelector('#map-count').textContent=number(result.visible.length)+t(" locations in this view");
 document.querySelector('#map-list').innerHTML=result.visible.map(m=>'<div>'+link(m.id,t(m.label))+'<span>'+t(m.layer)+' · '+number(m.from)+'–'+number(m.to)+'</span></div>').join('')||`<p>${t("No locations match these layers.")}</p>`;
 document.querySelector('#route-notes').innerHTML=result.activeRoutes.length?`<h3>${t("Routes shown")}</h3>`+result.activeRoutes.map(r=>'<p>'+link(r.id,t(r.label))+`${t(" · approximate schematic path")}</p>`+cite([r.source])).join(''):'';
}
function timelinePage(){
 set(t("Timeline"),heading(t("1710 — 1858"),t("The terms of power keep changing."),t("Scenario starts sit alongside documented history. The decisions and dates generated during a game can diverge from this chronology."))+`<section class="wrap"><div class="filters"><label>${t("From ")}<input id="timeline-from" type="number" min="1710" max="1858" value="1710"></label><label>${t("To ")}<input id="timeline-to" type="number" min="1710" max="1858" value="1858"></label><label>${t("Show ")}<select id="timeline-type"><option value="">${t("History &amp; scenario starts")}</option><option value="History">${t("Documented history")}</option><option value="Scenario">${t("Scenario starts")}</option></select></label></div><p role="status" id="timeline-count"></p><div id="timeline" class="timeline"></div></section>`);
 function update(){
  const from=Number(document.querySelector('#timeline-from').value);
  const to=Number(document.querySelector('#timeline-to').value);
  const type=document.querySelector('#timeline-type').value;
  const found=localizedTimeline.filter(e=>e.year>=from&&e.year<=to&&(!type||e.type===type));
  document.querySelector('#timeline-count').textContent=number(found.length)+t(" entries")+(from>to?t(" · choose an end after the start"):'');
  document.querySelector('#timeline').innerHTML=found.map(e=>'<article id="'+e.id+'" class="timeitem"><div class="timeyear">'+number(e.year)+'</div><div>'+tag(e.type==='Scenario'?t("Game scenario start"):t("Documented historical event"))+'<h2>'+link(e.id)+'</h2><p>'+escape(e.body)+'</p>'+cite(e.citations)+'<div class="inline-related">'+e.related.slice(0,3).map(id=>link(id)).join('')+'</div></div></article>').join('');
 }
 ['timeline-from','timeline-to','timeline-type'].forEach(id=>document.getElementById(id).addEventListener('input',update));update();
 const focused=document.getElementById(params.get('focus'));if(focused)focused.scrollIntoView();
}
const institutionIds=['families','shareholders','directors','chairman','regional-administration','parliament'];
function companyPage(){
 const year=Number(params.get('year'))||1758;
 const selected=byId[params.get('selected')]||byId.directors;
 const oversight=year>=1784?t("Board of Control supervises political, military and revenue affairs"):year>=1773?t("Regulating Act creates stronger parliamentary oversight"):t("Charter renewals define exclusive trade privileges");
 set(t("Company and Parliament"),heading(t("Institutions &amp; interests"),t("Who can direct the Company?"),t("Choose a node to follow the relationships between families, Company institutions and the British state. The diagram compresses changing historical arrangements."))+`<section class="wrap"><form class="maptools"><input type="hidden" name="view" value="company"><label>${t("Institutional context ")}<select name="year">`+[1710,1758,1773,1784,1813,1833,1858].map(y=>'<option value="'+y+'" '+(y===year?'selected':'')+'>'+number(y)+'</option>').join('')+`</select></label><button>${t("Update diagram")}</button></form><div class="companygrid"><div class="institutiondiagram">`+institutionIds.map((id,i)=>'<div class="diagramrow"><a class="node '+(selected.id===id?'selected':'')+'" href="?view=company&year='+year+'&selected='+id+'">'+escape(byId[id].title)+'</a>'+(i<institutionIds.length-1?'<div class="connector '+(i===4?'dashed':'')+'">'+escape([t("Members acquire stock and seek posts"),t("Qualifying proprietors elect directors"),t("Directors manage and appoint"),t("Instructions, budgets and appointments"),t("Charter and parliamentary oversight")][i])+'</div>':'')+'</div>').join('')+'<p class="diagramnote">'+escape(oversight)+(year>=1833?t(". Commercial operations cease."):'.')+(year>=1858?t(" Crown government replaces Company administration."):'')+'</p></div><aside class="mapdetail">'+tag(selected.type)+'<h2>'+escape(selected.title)+'</h2><p>'+escape(selected.body)+'</p>'+cite(selected.citations)+'<p>'+link(selected.id,t("Read full entry →"))+`</p><h3>${t("Connected offices &amp; laws")}</h3>`+[...new Set([...selected.related,...(selected.id==='regional-administration'?['president-of-bengal','governor-of-bengal','governor-general-office']:[])])].map(id=>'<p>'+link(id)+'</p>').join('')+`</aside></div><h2>${t("Authority changes over time")}</h2><div class="threegrid">`+['regulating-act','oversight-1784','act-1833'].map(id=>card(byId[id])).join('')+`</div><aside class="note">${t("The Chairman and families are game-facing points of entry. Historical directors acted as a body, presidencies contained councils and subordinate establishments, and rulers and communities in South Asia pursued their own interests. Follow the regional profiles for those contexts.")}</aside></section>`);
}
function sourcesPage(){
 set(t("Sources and credits"),heading(t("Research &amp; attribution"),t("Sources, scope &amp; open questions."),t("An unofficial English-language historical companion to John Company: Second Edition, designed by Cole Wehrle and published by Wehrlegig Games."))+`<article class="wrap prose"><section id="coverage"><h2>${t("Component coverage")}</h2><p>${t("The catalogue covers the names and historical themes of 17 office cards, 26 law cards including the two-sided Deregulation card, seven event families covering 20 physical India event tiles, four scenario variants across three starting years, and the scenario/setup card sets collectively. Each of the 20 event copies is listed under its family by reverse-side region and modifier where applicable.")}</p><p>${t("Office, law and scenario titles were checked against the publisher’s Bridge card fronts, pages 4–9. The MiniEuro sheets identify the dated setup cards and mark the extras. India event families and region pairings were checked using the Pocket Guide to India on page 10, the Ganjifa print sheets and the photographed component gallery. The official errata page returned HTTP 403 during the review on 16 November 2026. Numbered setup cards are represented as sets. Prestige, blackmail, failure and Crown solo materials are outside this catalogue.")}</p>`+cite(['publisher','pnp','bridge','mini','ganjifa','rules','rulesMirror','cards','errata','bgg'])+`</section><section><h2>${t("How to read the historical links")}</h2><p>${t("Entries distinguish named historical references, broader patterns and interpretations. A generic event can be connected to a documented example without having been designed to depict that incident. The timeline places actual events beside labeled scenario starts. Source citations support the preceding entry paragraph. Interpretive comparisons with game procedures remain the atlas author’s.")}</p><p>${t("Banglapedia supplies South Asian scholarship on provincial government, banking, revenue and rural society. NCERT supplies Indian educational history. Parliament and India Office records give evidence of British institutional interests. Parliamentary speeches are situated arguments, with retrospective claims and contested assessments. Museum and archive catalogues supply further context. This initial edition has short profiles and emphasizes Bengal. Coverage of southern and northwestern polities is introductory.")}</p><p>${t("Contested points are labeled in their entries, including the Nanda Kumar prosecution. Famine mortality figures are omitted because estimates are uncertain. Dates on the map show broad context and the recorded year of a battle. Route lines are approximate sketches. The map uses points in place of territorial polygons.")}</p></section><section><h2>${t("Asset rights &amp; credits")}</h2>`+credits.map(([title,body])=>'<h3>'+escape(t(title))+'</h3><p>'+escape(t(body))+'</p>').join('')+`<p>${t("The first-printing rulebook (2022, p. 48) identifies the game’s licence as Creative Commons Attribution-NonCommercial-ShareAlike 4.0. Cole Wehrle also announced the kit on BackerKit. Cole Wehrle’s print-and-play note explains how to assemble a set. It does not specify asset-level reuse terms. Before importing artwork, confirm the licence attached to that particular second-edition file, its attribution and any underlying third-party rights. No third-party illustrations, map layers, remote fonts or game asset files are used by this build. The schematic coastline, route sketches, CSS and diagram are original.")}</p><p>${t("Original prose and code in this project are offered under CC BY-NC-SA 4.0. Attribute this atlas, identify changes, use it noncommercially and share adaptations under the same terms. The licence does not grant rights to external source pages or to the game’s trademarks. There is no publisher endorsement.")}</p>`+cite(['rulesMirror','design','backerkit','license','pamir'])+`</section><section><h2>${t("Source register")}</h2><p>${t("Review date · 16 November 2026. Links open the original records. Some require a browser or may be unavailable.")}</p>`+cite(Object.keys(sources))+'</section></article>');
}
const pages={home,map:mapPage,timeline:timelinePage,company:companyPage,components:()=>catalogue('components'),scenarios:()=>catalogue('scenarios'),people:()=>catalogue('people'),sources:sourcesPage,search:searchPage,entry:entryPage};
(Object.hasOwn(pages,view)?pages[view]:pages.home)();
