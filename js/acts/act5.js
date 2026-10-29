// Acte V : les Terres d'Aube
// ---------- ACTE V : les Terres d'Aube ----------
const A5=maps.length,FIN5=A5+14,FT5=[1,3,5,7,9,11,13].map(i=>A5+i);
const N5=['Sentier des Terrasses','Hautes-Terrasses','Berges du Miroir','Lac-Miroir','Gorges Rouges','Forgeval','Col Blanc','Cimeneige',"Dunes d'Or",'Sablerune','Bois Hurlants','Sylvéclat','Falaises du Large','Havre-Citadelle','Sommet des Légendes'];
const RS5=[[71,79,68,87,56],[52,54,58,95,91],[62,66,64,47,18],[85,89,91,81,45],[93,81,75,77,73],[97,69,73,56,86],[89,91,95,59,54],[85,62,59,97,77]];
const LV5=[[66,69],[68,71],[70,73],[72,75],[74,77],[76,79],[78,81],[80,83]];
maps.push(...N5.map((n,i)=>i==14?{n,e:{s:RS5[7],l:LV5[7]}}:i%2==0?{n,e:{s:RS5[i/2],l:LV5[i/2]}}:{n}));
Object.assign(BIO,{[A5]:'meadow',[A5+2]:'lake',[A5+4]:'volcano',[A5+6]:'snow',[A5+8]:'desert',[A5+10]:'autumn',[A5+12]:'coast',[A5+14]:'dawn'});
// --- générateurs de villes de formes différentes ---
const grs5=()=>mk(40,28,(x,y)=>(x<=1||x>=38||y<=1||y>=26)?'T':(rnd(x,y)%13==0?'f':'.'));
const bl5=(g,t,x,y,w)=>{rect(g,x,y,x+w-1,y+2,'H');if(t!='H')g[y+2][x+(w>>1)]=t};
const rd5=(g,x1,y1,x2,y2,c)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)g[y][x]=c||'='};
const ent5=(g,dx,ux,c)=>{rd5(g,dx,25,dx,26,c);g[27][dx]='D';rd5(g,ux,1,ux,2,c);g[0][ux]='U'};
// 1. collines en terrasses : escaliers en zigzag
const tw1=()=>{const g=grs5();
 [[21,34],[16,4],[11,34],[6,4]].forEach(([y,gx])=>{for(let x=2;x<=37;x++)g[y][x]=(x==gx||x==gx+1)?'=':(rnd(x,y)%3?'q':'T')});
 [25,20,15,10,5].forEach(y=>rd5(g,2,y,37,y));rd5(g,34,22,35,24);rd5(g,4,17,5,19);rd5(g,34,12,35,14);rd5(g,4,7,5,9);rd5(g,20,1,20,5);
 [['H',4,22,5],['H',11,22,5],['H',17,22,5],['H',29,22,4],['C',9,17,5],['H',16,17,5],['H',23,17,5],['H',30,17,5],['B',12,12,7],['H',22,12,5],['H',28,12,5],['H',8,7,5],['H',15,7,5],['H',23,7,5],['H',30,7,5],['H',5,2,5],['H',11,2,5],['H',24,2,5],['H',30,2,5]].forEach(b=>bl5(g,...b));
 g[24][27]='M';ent5(g,20,20);return g};
// 2. île sur un lac, deux ponts opposés
const tw2=()=>{const g=grs5();rect(g,2,4,37,22,'w');rect(g,8,8,31,18,'.');
 for(let y=8;y<=18;y++)for(let x=8;x<=31;x++)if(rnd(x,y)%11==0)g[y][x]='f';
 for(let y=19;y<=22;y++)g[y][8]='j';for(let y=4;y<=7;y++)g[y][31]='j';
 rd5(g,8,23,8,26);rd5(g,8,16,8,18);rd5(g,8,11,31,11);rd5(g,8,16,31,16);rd5(g,17,12,17,15);rd5(g,31,8,31,11);rd5(g,31,1,31,3);
 [['H',9,8,5],['B',15,8,7],['C',23,8,5],['H',28,8,3],['H',9,13,5],['H',19,13,5],['H',25,13,5]].forEach(b=>bl5(g,...b));g[15][15]='M';
 g[27][8]='D';g[0][31]='U';return g};
// 3. canyon et rivière sinueuse, deux ponts, mur à l'est
const tw3=()=>{const g=grs5(),cx=y=>19+Math.round(3*Math.sin(y/3.2));
 for(let y=2;y<=25;y++)for(let x=cx(y)-1;x<=cx(y)+1;x++)g[y][x]='w';
 const row=(y,x1,x2)=>{for(let x=x1;x<=x2;x++)g[y][x]=g[y][x]=='w'?'j':'='};
 rd5(g,4,2,4,25);[8,19].forEach(y=>row(y,4,33));[6,12,24].forEach(y=>{rd5(g,4,y,cx(y)-2,y);rd5(g,cx(y)+2,y,33,y)});
 rd5(g,33,1,33,12);rd5(g,33,14,33,26);for(let x=cx(13)+2;x<=37;x++)g[13][x]='T';
 [['B',6,3,7],['C',6,9,5],['H',6,15,5],['H',6,21,5],['H',25,21,5],['H',26,15,5],['H',25,3,5],['H',25,9,5]].forEach(b=>bl5(g,...b));g[23][12]='M';
 g[27][33]='D';g[0][33]='U';return g};
// 4. forteresse de neige : murs concentriques, il faut traverser la place
const tw4=()=>{const g=grs5();rect(g,4,4,35,23,'.');
 for(let y=4;y<=23;y++)for(let x=4;x<=35;x++)if(rnd(x,y)%6==0)g[y][x]=rnd(y,x)%2?'b':'f';
 for(let x=3;x<=36;x++){g[3][x]='T';g[24][x]='T'}for(let y=3;y<=24;y++){g[y][3]='T';g[y][36]='T'}
 for(let x=9;x<=30;x++){g[8][x]='T';g[19][x]='T'}for(let y=8;y<=19;y++){g[y][9]='T';g[y][30]='T'}
 rect(g,10,9,29,18,'.');
 rd5(g,6,4,6,24);rd5(g,33,3,33,23);rd5(g,6,5,33,5);rd5(g,6,22,33,22);rect(g,17,4,19,7,'T');rect(g,17,20,19,23,'T');
 rd5(g,6,13,9,13);rd5(g,9,12,30,13);rd5(g,30,13,33,13);rd5(g,10,18,29,18);rd5(g,19,14,19,17);
 [['B',11,9,7],['C',20,9,5],['H',26,9,3],['H',11,15,5],['H',21,15,5],['H',26,15,4]].forEach(b=>bl5(g,...b));g[17][17]='M';
 for(let x=2;x<=37;x++){g[2][x]=g[25][x]='T'}for(let y=2;y<=25;y++){g[y][2]=g[y][37]='T'}
 g[27][6]='D';rd5(g,6,25,6,26);g[0][33]='U';rd5(g,33,1,33,2);return g};
// 5. oasis central : place radiale, il faut contourner l'eau
const tw5=()=>{const g=grs5();rect(g,15,9,24,17,'w');[[13,8],[14,8],[25,8],[26,8],[13,18],[14,18],[25,18],[26,18]].forEach(([x,y])=>g[y][x]='T');
 rd5(g,3,24,36,24);rd5(g,20,20,20,26);rd5(g,12,7,27,7);rd5(g,12,19,27,19);rd5(g,12,7,12,19);rd5(g,27,7,27,19);rd5(g,20,1,20,7);
 [6,13,17].forEach(y=>{rd5(g,3,y,12,y);rd5(g,27,y,36,y)});
 [['B',4,10,7],['C',4,14,5],['H',4,3,5],['H',4,21,5],['H',10,21,5],['H',30,10,5],['H',29,14,5],['H',30,3,5],['H',25,21,5],['H',31,21,5]].forEach(b=>bl5(g,...b));g[16][34]='M';
 ent5(g,20,20);return g};
// 6. forêt dense : sentier de terre en serpentin avec des clairières
const tw6=()=>{const g=grs5();
 for(let y=2;y<=25;y++)for(let x=2;x<=37;x++)g[y][x]=[8,13,18].includes(y)?'T':rnd(x,y)%7==0?'.':rnd(y,x)%9==0?'b':'T';
 const B=[['H',10,19,5],['H',22,19,5],['C',11,14,5],['B',17,14,7],['H',26,14,4],['H',11,9,5],['H',18,9,5],['H',25,9,4],['H',11,4,5],['H',18,4,5],['H',25,4,4]];
 B.forEach(([t,x,y,w])=>rect(g,x-1,y,x+w,y+2,'.'));
 rd5(g,6,22,31,22,'_');rd5(g,6,23,6,26,'_');rd5(g,31,17,31,22,'_');rd5(g,8,17,31,17,'_');rd5(g,8,12,8,17,'_');rd5(g,8,12,31,12,'_');rd5(g,31,7,31,12,'_');rd5(g,8,7,31,7,'_');rd5(g,8,1,8,7,'_');
 B.forEach(b=>bl5(g,...b));rect(g,17,20,19,21,'.');g[21][18]='M';
 g[27][6]='D';g[0][8]='U';return g};
// 7. port-citadelle : baie, quai, remparts et cour du château
const tw7=()=>{const g=grs5();rect(g,2,10,13,25,'w');for(const y of [14,20])for(let x=7;x<=13;x++)g[y][x]='j';
 for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)g[y][x]=rnd(x,y)%4?'T':'q';
 for(let x=14;x<=37;x++)g[9][x]='T';rd5(g,14,10,14,24);rd5(g,14,24,34,24);rd5(g,14,18,36,18);rd5(g,14,14,36,14);rd5(g,14,10,26,10);rd5(g,26,6,26,14);rd5(g,26,6,34,6);rd5(g,34,1,34,6);rd5(g,34,25,34,26);
 [['C',17,21,5],['H',23,21,5],['H',30,21,4],['H',17,15,5],['H',23,15,5],['H',29,15,5],['H',16,11,5],['H',21,11,4],['H',28,11,5],['B',23,3,7],['H',16,3,5],['H',31,3,3]].forEach(b=>bl5(g,...b));g[23][29]='M';
 g[27][34]='D';g[0][34]='U';return g};
const TOWN5=[[1,tw1,20,20,'meadow'],[3,tw2,8,31,'lake'],[5,tw3,33,33,'volcano'],[7,tw4,6,33,'snow'],[9,tw5,20,20,'desert'],[11,tw6,6,8,'autumn'],[13,tw7,34,34,'coast']];
TOWN5.forEach(([i,f,dx,ux,th])=>{const m=maps[A5+i];m.g=f();m.px=dx;m.ux=ux;m.sp=[dx,25];m.tn=1;m.th=th});
// --- routes ---
const RT5={[A5]:[34,84,{px:16,amp:5,ph:.7,s:35,tr:[66,44],bridge:[34,4],passes:[[54,0],[16,1]],ponds:[[8,56,3,2],[26,24,3,2]]}],
 [A5+2]:[34,86,{px:19,amp:6,ph:1.6,s:37,tr:[68,48,28],bridge:[38,4],passes:[[58,1],[18,0]],ponds:[[26,64,5,4],[7,30,3,2]]}],
 [A5+4]:[34,88,{px:15,amp:6,ph:2.4,s:39,tr:[70,56,40],bridge:[48,4],passes:[[62,0],[28,1],[14,0]],ponds:[[8,70,3,2]]}],
 [A5+6]:[34,88,{px:18,amp:5,ph:.3,s:41,tr:[72,58,42,26],bridge:[34,4],passes:[[64,1],[50,0],[16,1]],ponds:[[26,20,4,3]]}],
 [A5+8]:[34,90,{px:17,amp:7,ph:1.1,s:43,tr:[74,60,46,30],bridge:[40,4],passes:[[66,0],[52,1],[22,0]],ponds:[[8,74,3,2],[26,36,3,2]]}],
 [A5+10]:[34,92,{px:20,amp:6,ph:2.7,s:45,tr:[76,62,48,34],bridge:[44,4],passes:[[68,1],[54,0],[24,1]],ponds:[[8,50,3,2]]}],
 [A5+12]:[34,92,{px:16,amp:6,ph:.9,s:47,tr:[78,64,50,34],bridge:[42,4],passes:[[70,0],[56,1],[20,0]],ponds:[[26,28,4,3],[7,60,3,2]]}],
 [A5+14]:[34,96,{px:17,amp:6,ph:3.3,s:49,tr:[84,72,60,46,32],boss:[8,'Y'],td:1.1,top:10,noU:1,passes:[[78,1],[66,0],[52,1],[38,0],[20,1]]}]};
for(const k in RT5){const [w,h,o]=RT5[k];maps[k].th=BIO[k];maps[k].g=mkRoute(w,h,Object.assign({th:BIO[k]},o));maps[k].px=o.px;maps[k].tr=o.tr;maps[k].sp=[o.px,h-4];if(o.boss)maps[k].boss=o.boss[0]}
// ORIM s'ouvre vers le nord après Orion
maps[ORIM].g[0][17]='U';
{const ch=[ORIM];for(let i=0;i<=14;i++)ch.push(A5+i);for(let i=0;i<ch.length-1;i++){UP[ch[i]]=ch[i+1];DN[ch[i+1]]=ch[i]}ch.slice(1).forEach(k=>CHAIN.push(k))}
const GT5={[ORIM]:[()=>G.f.o4,"Un rideau d'étoiles ferme le ciel : Maître Orion garde encore le passage."]};
[12,13,14,15,16,17,18].forEach((b,i)=>GT5[A5+1+2*i]=[()=>G.badge>=b,`Le chemin est fermé : il te faut ${b} badges.`]);
const L5={};for(let i=0;i<=14;i+=2)L5[A5+i]=[67,69,71,73,75,77,79,82][i/2];
const TP5=[[71,79],[54,58],[62,66],[85,81],[93,75],[97,69],[89,95],[85,77]];TP5.forEach((p,i)=>TP[A5+2*i]=p);
// arènes
GY[A5+1]={n:'Flora',i:12,t:[[71,68],[69,69],[56,70],[73,70],[97,71]],h:"Je suis Flora, jardinière des Hautes-Terrasses. Chaque étage de ma colline est un jardin !",w:["Flora : Magnifique ! Voici le Badge Terrasse.","Flora : Les Berges du Miroir sont à l'est. Nérée y garde le lac."]};
GY[A5+3]={n:'Nérée',i:13,t:[[54,70],[58,71],[91,72],[95,72],[52,71],[59,73]],h:"Je suis Nérée, gardien du Lac-Miroir. Mon eau ne reflète que les vrais dresseurs !",w:["Nérée : Belle bataille ! Voici le Badge Miroir.","Nérée : Les Gorges Rouges brûlent au nord. Cendra y forge ses flammes."]};
GY[A5+5]={n:'Cendra',i:14,t:[[62,73],[64,74],[66,74],[47,75],[18,75]],h:"Je suis Cendra, forgeronne de Forgeval. Ma forge ne s'éteint jamais !",w:["Cendra : Tu as de l'acier dans le cœur ! Voici le Badge Forge.","Cendra : Le Col Blanc mène à Cimeneige. Couvre-toi, Bora n'est pas tendre."]};
GY[A5+7]={n:'Bora',i:15,t:[[85,75],[89,76],[87,76],[84,77],[45,77]],h:"Je suis Bora, maître des cols de Cimeneige. Le vent glacé trie les dresseurs !",w:["Bora : Quel souffle ! Voici le Badge Cime.","Bora : Au nord, les Dunes d'Or et la ville de Sablerune."]};
GY[A5+9]={n:'Sablon',i:16,t:[[81,77],[93,78],[79,78],[77,79],[75,79],[82,80]],h:"Je suis Sablon, gardien des dunes. Le sable enterre les faibles !",w:["Sablon : Tu as la peau dure ! Voici le Badge Dune.","Sablon : Les Bois Hurlants t'attendent. Ronce y règne."]};
GY[A5+11]={n:'Ronce',i:17,t:[[56,79],[73,79],[71,80],[69,80],[97,81],[46,81]],h:"Je suis Ronce, esprit des Bois Hurlants. Rares sont ceux qui retrouvent leur chemin !",w:["Ronce : Tu t'es frayé un chemin jusqu'à moi. Voici le Badge Sylve.","Ronce : Les Falaises du Large mènent au dernier port, Havre-Citadelle."]};
GY[A5+13]={n:'Houle',i:18,t:[[59,81],[91,82],[95,82],[89,83],[54,83],[48,83]],h:"Je suis l'amiral Houle, gardien de la citadelle. Les marées obéissent à mon pavillon !",w:["Houle : Bien navigué ! Voici le Badge Citadelle.","Houle : Le Sommet des Légendes est au nord. La Grande Maîtresse Solène t'y attend."]};
NOA[A5+3]=[70,'n14',"Noa : Le Lac-Miroir ! Je me suis perdu sur l'île, mais pas pour un duel. On y va ?","Noa : Toujours aussi fort. Je file vers les Gorges Rouges."];
NOA[A5+7]=[74,'n15',"Noa : Cimeneige… j'ai les doigts gelés ! Un combat pour me réchauffer ?","Noa : Brr, tu m'as encore battu. Rendez-vous dans les dunes."];
NOA[A5+11]=[78,'n16',"Noa : Sylvéclat ! Ces bois m'ont fait tourner en rond. Un duel avant l'arène de Ronce ?","Noa : Je te laisse la gloire, {J}. Moi, j'ai déjà la mienne."];
// habitants (placés sur des cases accessibles, hors des routes)
{const D=[[1,0],[-1,0],[0,1],[0,-1]];const near=(m,x,y)=>{const g=maps[m].g,sp=maps[m].sp,seen=new Set([sp[0]+','+sp[1]]),q=[[sp[0],sp[1]]];let best=null,bd=1e9;
  while(q.length){const [a,b]=q.shift();for(const [dx,dy] of D){const nx=a+dx,ny=b+dy,c=g[ny]?.[nx];if(!c||seen.has(nx+','+ny)||SOLID.includes(c))continue;seen.add(nx+','+ny);q.push([nx,ny]);if('.f'.includes(c)){const d=(nx-x)**2+(ny-y)**2;if(d<bd){bd=d;best=[nx,ny]}}}}return best};
 [[1,[30,24],'🧑‍🌾',["Jardinier : Chaque terrasse a son escalier, mais jamais du même côté !","Jardinier : Flora cultive la colline depuis toute petite."]],[1,[12,19],'👧',["Fillette : Pour monter, il faut zigzaguer. Les escaliers sont aux extrémités !"]],
  [3,[20,14],'🧓',["Vieux pêcheur : Le lac est un miroir. Les ponts sont aux deux bouts de l'île !","Vieux pêcheur : Nérée parle aux poissons, dit-on."]],[3,[12,13],'👦',["Garçon : L'arène est le grand bâtiment au milieu de l'île."]],
  [5,[8,22],'👨',["Forgeron : La rivière coupe la ville en deux. Il faut passer deux ponts !","Forgeron : Cendra forge ses flammes ici même."]],[5,[28,26],'👧',["Fillette : Le mur à l'est empêche de passer tout droit. Traverse la rivière !"]],
  [7,[13,14],'🧓',["Garde : Les remparts de Cimeneige ont deux enceintes. Passe par la place centrale !","Garde : Bora vit au cœur de la citadelle."]],[7,[8,21],'🧑‍🌾',["Voyageur : Les couloirs extérieurs sont fermés au milieu. Pas le choix, traverse la place."]],
  [9,[6,8],'🧙',["Sage du désert : L'oasis est au centre. Fais le tour pour monter vers le nord !","Sage du désert : Sablon règne sur les dunes."]],[9,[34,20],'👦',["Garçon : Le Sablon de l'arène est le plus fort du désert !"]],
  [11,[14,21],'🧙',["Esprit des bois : Suis le sentier de terre, il serpente de clairière en clairière.","Esprit des bois : Ne quitte pas le chemin, les arbres se ressemblent tous."]],[11,[22,8],'👧',["Fillette : Ronce se cache tout en bas. Le sentier fait quatre grands virages !"]],
  [13,[18,16],'🧑‍🌾',["Marin : Havre-Citadelle ! La baie est à gauche, le château tout en haut.","Marin : La porte du château est au bout de la grand-rue."]],[13,[30,12],'🧓',["Vieil amiral : Houle garde la cour du château. Passe la porte au nord !"]]
 ].forEach(([i,p,e,l])=>{const m=A5+i,q=near(m,p[0],p[1]);if(q)NP.push({m,e,x:q[0],y:q[1],l})})}
// objets
{const D=[[1,0],[-1,0],[0,1],[0,-1]];[[23,A5,[24,40],'sp',3],[24,A5+4,[26,50],'gold',2000],[25,A5+8,[10,46],'balls',6],[26,A5+12,[26,30],'sp',4]].forEach(([id,m,p,t,n])=>{const g=maps[m].g,sp=maps[m].sp,seen=new Set([sp[0]+','+sp[1]]),q=[[sp[0],sp[1]]];let best=null,bd=1e9;
  while(q.length){const [x,y]=q.shift();for(const [dx,dy] of D){const nx=x+dx,ny=y+dy,c=g[ny]?.[nx];if(!c||seen.has(nx+','+ny)||SOLID.includes(c))continue;seen.add(nx+','+ny);q.push([nx,ny]);if('._=f'.includes(c)){const d=(nx-p[0])**2+(ny-p[1])**2;if(d<bd){bd=d;best=[nx,ny]}}}}
  ITM.push({id,m,x:best[0],y:best[1],t,n})})}
// scénario
{const n=CH_N.indexOf("Après l'aventure");CH_N.splice(n,0,"Les Terres d'Aube");STORY.forEach(x=>{if(x.c>=n)x.c++});
const li=STORY.findIndex(x=>x.t=='La Ligue');
const S=[{c:n,t:"Au-delà des étoiles",obj:"Depuis la Voie des Étoiles, prends la sortie nord et gagne Hautes-Terrasses.",h:["Après Maître Orion, un passage s'ouvre tout au nord de la Voie des Étoiles."],done:()=>G.vis.includes(A5+1),m:A5+1,ch:null}];
[['Hautes-Terrasses','Flora','la Plante',"Monte les escaliers en zigzag : ils sont aux deux extrémités des terrasses."],['Lac-Miroir','Nérée','l\'Eau',"Traverse l'île d'un pont à l'autre."],['Forgeval','Cendra','le Feu',"Traverse la rivière par deux ponts : le mur de l'est coupe la route."],['Cimeneige','Bora','le Vol',"Traverse la grande place entre les deux enceintes."],['Sablerune','Sablon','le Normal',"Contourne l'oasis par l'anneau central."],['Sylvéclat','Ronce','la Plante',"Suis le sentier de terre, il fait quatre grands virages."],['Havre-Citadelle','Houle','l\'Eau',"Suis le quai, puis passe la porte du château."]].forEach(([v,l,t,hint],i)=>{
 S.push({c:n,t:`Arène de ${v}`,obj:`Bats ${l} à l'arène de ${v} (badge ${12+i}).`,h:[`${l} utilise ${t}.`,hint,"L'arène est le grand bâtiment avec la porte dorée."],done:()=>G.badge>=12+i,m:A5+1+2*i,ch:'B',inn:9});
 if(i<6)S.push({c:n,t:`Vers ${N5[3+2*i]}`,obj:`Passe par ${N5[2+2*i]} jusqu'à ${N5[3+2*i]}.`,h:[`Il faut ${12+i} badges pour franchir la sortie nord de ${v}.`],done:()=>G.vis.includes(A5+3+2*i),m:A5+3+2*i,ch:null})});
S.push({c:n,t:'Le Sommet des Légendes',obj:"Gravis le Sommet des Légendes et affronte la Grande Maîtresse Solène (badge 19).",h:["Il faut 18 badges pour quitter Havre-Citadelle.","Quatre gardes protègent la montée, puis Solène tout en haut."],done:()=>G.f.v5,m:FIN5,ch:'Y'});
STORY.splice(li,0,...S)}
SQ.push({id:'aur',t:"Aurélion, le dragon solaire",vis:()=>!!G.f.v5,done:()=>G.dex.c.includes(98),obj:()=>"Retourne au Sommet des Légendes et capture Aurélion.",h:["Aurélion apparaît sur la dalle, après Solène.","Affaiblis-le sans le mettre K.O. et lance beaucoup de Capsules."],tg:()=>({m:FIN5,ch:'Y'})},
 {id:'aby',t:"Abyssia, le colosse des abysses",vis:()=>G.dex.c.includes(98),done:()=>G.dex.c.includes(99),obj:()=>"Retourne au Sommet des Légendes : Abyssia s'éveille quand Aurélion est capturé.",h:["Abyssia apparaît sur la même dalle, une fois Aurélion capturé."],tg:()=>({m:FIN5,ch:'Y'})});
// carte du monde
const WN3=[[ORIM,220,528,'Voie des Étoiles']];for(let i=0;i<=14;i++)WN3.push([A5+i,Math.round(220+150*Math.sin(i*.9)),Math.round(495-i*33),N5[i],i%2]);
for(let i=0;i<=14;i++)WE.push([i?A5+i-1:ORIM,A5+i]);
Object.assign(WI,{[ORIM]:["Niveaux 63 à 66","Maître Orion et l'étoile Astraël."]});
N5.forEach((nm,i)=>{WI[A5+i]=i==14?["Niveaux 80 à 83","Solène et deux légendes : Aurélion et Abyssia."]:i%2==0?[`Niveaux ${LV5[i/2][0]} à ${LV5[i/2][1]}`,"Une route des Terres d'Aube, avec des barrières à contourner."]:[`Arène ${GY[A5+i].n} (badge ${GY[A5+i].i})`,"Une ville d'une forme unique : centre, boutique et arène."]});
// boss final
function final5(){
 if(G.f.v5){if(!G.dex.c.includes(98))return say(['Une lumière dorée envahit la dalle… Aurélion est de retour !'],async()=>{await battle([mkC(98,82)],null,true);save()});
  if(!G.dex.c.includes(99))return say(['Les eaux montent autour de la dalle… Abyssia s\'éveille !'],async()=>{await battle([mkC(99,84)],null,true);save()});return}
 if(G.badge<18)return say(['Un rideau de lumière te barre la route : il te faut 18 badges.']);
 sayB(["Solène : Tu as traversé les terrasses, le lac, la forge, la neige, le désert, la forêt et la citadelle…","Solène : Je suis Solène, Grande Maîtresse des Terres d'Aube. Un dernier badge t'attend !"],async()=>{
  const r=await battle([mkC(64,82),mkC(85,83),mkC(59,83),mkC(75,84),mkC(97,84),mkC(50,86)],'Solène',false,true);
  if(r=='win'){G.f.v5=1;G.badge=19;G.gold+=20000;save();say(["Solène : Magnifique… Dix-neuf badges, c'est un record.","Solène : Regarde le ciel, {J}. Aurélion t'a choisi !","Une lueur dorée descend sur la dalle…"],async()=>{await battle([mkC(98,82)],null,true);save();say(["Solène : Capturé ou non, l'aube est à toi.","— LES TERRES D'AUBE —"],credits5)})}})}
function credits5(){panel(`<h3>🌄 LES TERRES D'AUBE</h3><p>Tu as vaincu Solène, {J}. Dix-neuf badges, sept villes uniques et les légendes d'Aérélia.</p><p>⏱ ${fmt(G.sx.time)} · ⚔ ${G.sx.wins} victoires · 📖 ${G.dex.s.length}/${SP.length} vus · 🎯 ${G.dex.c.length} capturés</p><p>Abyssia dort encore au Sommet des Légendes. Il reste la Ligue, le Palais de combat, les quêtes annexes et le Bestiaire à compléter. Merci d'avoir joué !</p>`)}
ACH.push(['Douze badges','Obtenir 12 badges',()=>G.badge>=12],['Dix-neuf badges','Obtenir les 19 badges',()=>G.badge>=19],['Grande Maîtresse','Vaincre Solène',()=>G.f.v5],['Dragon solaire','Capturer Aurélion',()=>G.dex.c.includes(98)],['Colosse des abysses','Capturer Abyssia',()=>G.dex.c.includes(99)],['Explorateur d\'Aube','Visiter les 7 villes des Terres d\'Aube',()=>FT5.every(m=>G.vis.includes(m))]);
