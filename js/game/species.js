// Espèces de base, attaques, table des types
// ---------- Données ----------
const SP=[
{n:'Braisou',t:'F',h:45,a:55,d:40,e:'🦊'},{n:'Ondin',t:'E',h:50,a:45,d:50,e:'🐙'},{n:'Feuillon',t:'P',h:55,a:45,d:50,e:'🌱'},
{n:'Rattou',t:'N',h:40,a:45,d:35,e:'🐀'},{n:'Piaf',t:'V',h:40,a:50,d:35,e:'🐦'},{n:'Mousse',t:'P',h:45,a:40,d:45,e:'🍄'},
{n:'Crabi',t:'E',h:45,a:50,d:55,e:'🦀'},{n:'Cendrelin',t:'F',h:55,a:60,d:45,e:'🔥'},{n:'Lunard',t:'N',h:55,a:55,d:55,e:'🌙'}];
SP.push({n:'Flamgrin',t:'F',h:65,a:75,d:55,e:'🦁'},{n:'Ondaros',t:'E',h:72,a:62,d:70,e:'🐋'},{n:'Sylvaros',t:'P',h:75,a:62,d:68,e:'🌳'},{n:'Aigrin',t:'V',h:58,a:70,d:52,e:'🦅'},{n:'Luciole',t:'P',h:42,a:48,d:42,e:'🐛'},{n:'Galet',t:'N',h:60,a:50,d:70,e:'🪨'},{n:'Spectro',t:'N',h:50,a:62,d:45,e:'👻'},{n:'Luniel',t:'V',h:75,a:75,d:75,e:'🌟'},{n:'Ratalpha',t:'N',h:62,a:70,d:55,e:'🐺'},{n:'Titancrabe',t:'E',h:68,a:72,d:85,e:'🦞'},{n:'Fongidor',t:'P',h:70,a:58,d:70,e:'🍄'},{n:'Bélier',t:'N',h:60,a:65,d:55,e:'🐏'},{n:'Hulotte',t:'V',h:55,a:60,d:50,e:'🦉'},{n:'Magmite',t:'F',h:60,a:70,d:60,e:'🌋'},{n:'Coralie',t:'E',h:58,a:55,d:75,e:'🐚'},{n:'Pétale',t:'P',h:60,a:62,d:58,e:'🌸'},{n:'Tempestor',t:'V',h:70,a:78,d:60,e:'🌪'},{n:'Titanor',t:'N',h:80,a:75,d:80,e:'🗿'},{n:'Braseron',t:'F',h:75,a:85,d:65,e:'🦎'},{n:'Givrelin',t:'E',h:72,a:68,d:80,e:'🧊'},{n:'Cristalor',t:'N',h:80,a:70,d:95,e:'💎'},{n:'Foudrion',t:'V',h:70,a:90,d:62,e:'⚡'},{n:'Ombrelin',t:'N',h:72,a:82,d:70,e:'🦇'},{n:'Sylvanide',t:'P',h:82,a:72,d:78,e:'🌲'},{n:'Éclipsor',t:'N',h:95,a:95,d:85,e:'🌑'});
[[0,9,10],[1,10,10],[2,11,10],[4,12,9],[3,17,12],[6,18,14],[5,19,12]].forEach(([a,b,l])=>SP[a].ev=[l,b]);
SP.push({n:'Volcanor',t:'F',h:70,a:80,d:60,e:'🌋'},{n:'Récifor',t:'E',h:78,a:66,d:76,e:'🪸'},{n:'Floralune',t:'P',h:76,a:68,d:74,e:'🌸'},{n:'Nocturne',t:'N',h:72,a:72,d:72,e:'🌑'});
SP[7].se=['pf',34];SP[23].se=['pm',35];SP[24].se=['ps',36];SP[8].se=['pl',37];
const mvs=c=>{const t=SP[c.s].t;return c.lv>=20?['N',t,t+'2',t+'3']:c.lv>=8?['N',t,t+'2']:['N',t]};
const spd=c=>{const b=SP[c.s];return Math.floor((100-b.d)*.6+b.a*.5)+c.lv*2+(c.st=='par'?-15:0)};
const MV={N:['Charge',40],F:['Flammèche',50],E:["Jet d'eau",50],P:['Fouet-lianes',50],V:['Picore',45],F2:['Canicule',75],E2:['Raz-de-marée',75],P2:['Tempête verte',75],V2:['Rafale',70],N2:['Plaquage',70],F3:['Explosion solaire',95],E3:['Tsunami',95],P3:['Rayon de verdure',95],V3:['Ouragan',90],N3:['Coup de tonnerre',95]};
const up=['F>P','P>E','E>F','V>P'],dn=['P>F','F>E','E>P'];
const eff=(a,d)=>up.includes(a+'>'+d)?2:(dn.includes(a+'>'+d)||(a==d&&a!='N'))?.5:1;
