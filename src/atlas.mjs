import { entries as history, sources } from './history.mjs';
import { components } from './components.mjs';

Object.assign(sources, {
  pnp: ['Wehrlegig Games · Official print-and-play folder','https://www.dropbox.com/scl/fo/4poovyp3gbfkgpsgaumoe/AAsIOpx2eXzsY-9EQqp6OUY?rlkey=8a3bpbi0l1hg6g1ptvi1nbrby&dl=0'],
  bridge: ['Wehrlegig Games · Bridge card fronts','https://www.dropbox.com/scl/fo/4poovyp3gbfkgpsgaumoe/ADGIwqTCfIVCpGBNlK-ur9E/Cards/John%20Company%20Cards%20%28Bridge%2C%20Fronts%29.pdf?rlkey=8a3bpbi0l1hg6g1ptvi1nbrby&dl=0'],
  mini: ['Wehrlegig Games · MiniEuro setup card fronts','https://www.dropbox.com/scl/fo/4poovyp3gbfkgpsgaumoe/AJKz2QgFKVSQ9hzmPExoa4M/Cards/John%20Company%20Cards%20%28MiniEuro%2C%20Fronts%29.pdf?rlkey=8a3bpbi0l1hg6g1ptvi1nbrby&dl=0'],
  crafts: ['Banglapedia · Art and Crafts','https://en.banglapedia.org/index.php?title=Art_and_Crafts'],
  cape: ['Royal Museums Greenwich · Cape of Good Hope','https://www.rmg.co.uk/collections/objects/rmgc-object-106055'],
  ganjifa: ['Wehrlegig Games · Ganjifa tile backs and pairing guide','https://www.dropbox.com/scl/fo/4poovyp3gbfkgpsgaumoe/AMh14sf1UP4ZPTHzKHo77y4/Punchboard/John%20Company%20Ganjifa%20Tiles%20%28Backs%29.pdf?rlkey=8a3bpbi0l1hg6g1ptvi1nbrby&dl=0'],
  appointments: ['House of Lords · Government of India, 13 May 1853','https://hansard.parliament.uk/lords/1853-05-13/debates/88fc0f13-9db2-45e4-b50a-f67a0c889889/GovernmentOfIndia'],
  proprietors: ['House of Lords · East India Company’s Charter, 2 April 1852','https://api.parliament.uk/historic-hansard/lords/1852/apr/02/the-east-india-companys-charter'],
  regulation: ['House of Commons · East India Company’s affairs, 1813 retrospective','https://hansard.parliament.uk/Commons/1813-05-31/debates/30d76ed5-51da-48b9-9500-1867135975cd/EastIndiaCompanySAffairs%E2%80%94'],
  cantonSource: ['British Library · Canton records and correspondence','https://searcharchives.bl.uk/?f%5Brelated_places_ssim%5D%5B%5D=Canton%2C+Kwangtung%2C+China'],
  mysoreSource: ['National Army Museum · Tipu Sultan’s war turban','https://www.nam.ac.uk/explore/tipu-sultans-war-turban'],
  marathaSource: ['Maharashtra State Gazetteers · Poona, the British period','https://gazetteers.maharashtra.gov.in/cultural.maharashtra.gov.in/english/gazetteer/Poona/PART%20II/Chap%20%282%29/British%20Period.htm'],
  hyderabadSource: ['NCERT · From Trade to Territory','https://www.ncert.nic.in/textbook/pdf/hess202.pdf'],
  punjabSource: ['National Army Museum · Second Sikh War','https://www.nam.ac.uk/explore/second-sikh-war'],
  awadhSource: ['NCERT · Rebels and the Raj','https://cdnbbsr.s3waas.gov.in/s3kv01f3f445bcd060de295eb489d0232d/uploads/2024/05/2024051681.pdf'],
  windows: ['UK Parliament · Window Tax','https://www.parliament.uk/about/living-heritage/evolutionofparliament/towncountry/towns/tyne-and-wear-case-study/about-the-group/housing/window-tax/'],
  enclosure: ['UK Parliament · Enclosing the land','https://www.parliament.uk/about/living-heritage/transformingsociety/towncountry/landscape/overview/enclosingland/'],
  reform: ['UK Parliament · The Reform Act 1832','https://www.parliament.uk/about/living-heritage/evolutionofparliament/houseofcommons/reformacts/overview/reformact1832/'],
  hastings: ['British Library · Papers relating to the trial of Warren Hastings','https://searcharchives.bl.uk/catalog/036-002020673'],
  backerkit: ['Cole Wehrle · Announcement of the print-and-play kit','https://john-company.backerkit.com/hosted_preorders/project_updates'],
  license: ['Creative Commons · Attribution-NonCommercial-ShareAlike 4.0','https://creativecommons.org/licenses/by-nc-sa/4.0/'],
});
export { sources };
export const entries = [...history,...components];
for (const entry of entries) {
  const printSheet = {Office:'bridge',Law:'bridge',Scenario:'bridge','Setup material':'mini','Event tile':'ganjifa'}[entry.type];
  if (printSheet) entry.citations.unshift(printSheet);
}
export const byId = Object.assign(Object.create(null),Object.fromEntries(entries.map(entry => [entry.id,entry])));
export const componentTypes = ['Office','Law','Event tile','Scenario','Setup material'];
export const timeline = entries.filter(entry => entry.year).sort((a,b)=>a.year-b.year);

const places = [
 // id, longitude, latitude, layer, first visible year, last visible year, display label
 ['punjab',74.34,31.55,'Region',1710,1858,'Punjab'],
 ['delhi',77.23,28.61,'Region',1710,1858,'Delhi'],
 ['bengal',87.2,24.6,'Region',1710,1858,'Bengal'],
 ['bombay',72.88,19.07,'Presidency',1710,1858,'Bombay'],
 ['madras',80.27,13.08,'Presidency',1710,1858,'Madras'],
 ['kolkata',88.36,22.57,'Presidency',1710,1858,'Calcutta'],
 ['hyderabad',78.49,17.39,'State',1724,1858,'Hyderabad'],
 ['mysore',76.64,12.30,'State',1710,1858,'Mysore'],
 ['maratha',73.86,18.52,'State',1710,1818,'Maratha'],
 ['ranjit-singh',74.34,31.55,'State',1799,1849,'Sikh kingdom'],
 ['awadh',80.95,26.85,'State',1722,1856,'Awadh'],
 ['surat',72.83,21.17,'Port',1710,1858,'Surat'],
 ['dhaka-city',90.41,23.81,'Settlement',1710,1858,'Dhaka'],
 ['murshidabad',88.27,24.18,'Settlement',1710,1858,'Murshidabad'],
 ['plassey',88.25,23.8,'Battle',1757,1858,'Plassey'],
 ['seringapatam',76.68,12.42,'Battle',1799,1858,'Seringapatam'],
 ['london',-0.13,51.51,'Port',1710,1858,'London'],
 ['canton',113.26,23.13,'Port',1710,1834,'Canton'],
];
export const markers = places.map(([id,lon,lat,layer,from,to,label])=>({id,lon,lat,layer,from,to,label}));
export const routes = [
 {id:'monopoly', label:'Britain to India via the Cape', view:'network', from:1710,to:1834, source:'cape', points:[[-0.13,51.51],[-14,37],[-22,11],[-17,-14],[18,-37],[48,-24],[62,-2],[72.88,19.07]]},
 {id:'canton', label:'Company commerce with Canton',view:'network',from:1710,to:1834,source:'cantonSource',points:[[88.36,22.57],[89,11],[96,4],[104,1],[111,10],[113.26,23.13]]},
 {id:'plassey',label:'Calcutta to Plassey · 1757',view:'india',from:1757,to:1757,source:'colonial',points:[[88.36,22.57],[88.3,23.1],[88.25,23.8]]},
];
export const credits = [
 ['Map coastline and cartographic styling','Original schematic artwork drawn in canvas. Coastlines are simplified and there are no historical boundary polygons.'],
 ['Map locations and lines','Original point data and route sketches. Locations mark representative centers. Routes are approximate, with sources listed beside them. Dates filter displayed context, including the year of a battle or the activity of a polity.'],
 ['Institutional diagram','Original diagram. Solid and dashed lines distinguish Company organization from parliamentary oversight.'],
 ['Game content','John Company: Second Edition was designed by Cole Wehrle and published by Wehrlegig Games. The illustrated catalogue uses game artwork from the publisher’s print-and-play files as reproduced by Ludex.'],
];
