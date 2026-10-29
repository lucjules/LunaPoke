// Personnages humains en 3D (style chibi)
// ---------- PERSONNAGES EN 3D (style chibi, comme les créatures) ----------
// A : {w:amplitude marche, ph:phase, wave:0..1, pt:0..1 pointer, jump:hauteur, sd:graine}
function mdHuman(t,L,A){A=A||{};const o=[],br=Math.sin(t/760)*.008,bl=blinkK(t+(A.sd||0)*733);
 const SK=L.skin||'#ffd7a8',HR=L.hair||'#3a2a1a',SH=L.shirt||'#4a8a4a',PA=L.pants||'#3a3a55',CO=L.coat||null,w=A.w||0,ph=A.ph||0,sw=Math.sin(ph)*w,jp=A.jump||0,y0=jp;
 const hx=c=>hex3(c),sh=(c,f)=>{const h=hx(c);return'#'+h.map(v=>Math.max(0,Math.min(255,v*f|0)).toString(16).padStart(2,'0')).join('')};
 const limb=(b,th,fi,len,r,col,s,op)=>{const sT=Math.sin(th),cT=Math.cos(th),sF=Math.sin(fi),cF=Math.cos(fi),dx=s*sT,dy=-cT*cF,dz=cT*sF,rx=Math.asin(Math.max(-1,Math.min(1,-cT*sF))),rz=Math.atan2(s*sT,cT*cF);
  o.push(MP([b[0]+dx*len/2,b[1]+dy*len/2,b[2]+dz*len/2],[r[0],len/2+r[1],r[0]],col,Object.assign({rot:[rx,0,rz]},op||{})));return[b[0]+dx*len,b[1]+dy*len,b[2]+dz*len]};
 const bell=!!L.robe,hipY=.34+y0;
 // jambes + chaussures
 if(bell){o.push(MP([0,.3+y0,0],[.3,.3,.25],L.robe,{g:.1}));o.push(MP([0,.06+y0,0],[.33,.05,.28],sh(L.robe,.7),{ao:1}));for(const s of[-1,1])o.push(MP([s*.1,.035+y0,.16+s*sw*.05],[.075,.04,.11],'#3a2a20'))}
 else for(const s of[-1,1]){const a=s*sw*.62,f=limb([s*.095,hipY,0],.03,a,.235,[.075,.02],PA,s);o.push(MP([f[0],Math.max(.04,f[1]-.02)+y0*0,f[2]+.035],[.088,.056,.13],L.shoe||'#2c2622',{ao:1,g:.15}))}
 // bassin + torse
 if(!bell){o.push(MP([0,hipY+.01,0],[.19,.11,.15],PA,{g:.05}))}
 o.push(MP([0,.54+br+y0,0],[.205,.2,.155],SH,{g:.12}));
 if(CO){o.push(MP([0,.4+br+y0,0],[.24,.27,.185],CO,{g:.1}));o.push(MP([0,.57+br+y0,.1],[.075,.17,.09],SH));o.push(MP([0,.3+y0,.15],[.02,.2,.04],sh(CO,.8)))}
 else{o.push(MP([0,.42+y0,0],[.2,.03,.155],'#34283c'));o.push(MP([0,.42+y0,.15],[.04,.026,.02],'#e8c050',{g:.6}))}
 o.push(MP([0,.69+br+y0,.02],[.135,.045,.115],sh(CO||SH,1.18)));o.push(MP([0,.725+br+y0,0],[.065,.05,.065],SK));
 // bras
 const col=CO||SH,sh0=[0,.61+br+y0,0],wv=A.wave||0,pt=A.pt||0,idl=Math.sin(t/900+(A.sd||0))*.03;
 for(const s of[-1,1]){const base=[s*.225,sh0[1],0];let th=.16+idl,fi=-s*sw*.55;if(s==1){if(wv>0){th=2.3+Math.sin(t/120)*.28*wv;fi=.15}else if(pt>0){th=.25;fi=1.45*pt;}}if(A.broom){th=.3;fi=1.12+Math.sin(t/350+s)*.1}
  const hd=limb(base,th,fi,.2,[.062,.02],col,s);o.push(MP(hd,[.058,.058,.058],SK,{g:.1}))}
 if(A.broom){const bx=Math.sin(t/350)*.16;o.push(MP([bx*.5,.27,.36],[.013,.28,.013],'#8a6a3a',{rot:[-.53,0,0]}));o.push(MP([bx,.04,.52],[.075,.04,.055],'#c8a45a',{g:.1}))}
 if(L.back){o.push(MP([0,.5+br+y0,-.17],[.14,.17,.075],L.back,{g:.1}));o.push(MP([0,.63+br+y0,-.17],[.1,.035,.07],sh(L.back,1.25)))}
 if(L.apron){o.push(MP([0,.37+y0,.162],[.13,.17,.012],L.apron,{g:.1}));o.push(MP([0,.53+br+y0,.162],[.08,.07,.01],L.apron))}
 // tête
 const hy=.92+br*1.5+y0;
 o.push(MP([0,hy,0],[.265,.25,.24],SK,{g:.15}));
 for(const s of[-1,1]){o.push(MP([s*.092,hy+.012,.218],[.04,.058*bl,.028],'#1a1418',{g:.9}));o.push(MP([s*.092+s*.012,hy+.034,.238],[.016,.02*bl,.012],'#fff',{e:1}));
  o.push(MP([s*.092,hy+.092,.2],[.052,.012,.02],HR,{rot:[0,0,s*.14]}));o.push(MP([s*.158,hy-.062,.17],[.05,.032,.025],'#ff9aa8'));o.push(MP([s*.256,hy-.01,.0],[.03,.048,.04],SK))}
 o.push(MP([0,hy-.115,.225],[.034,.011,.012],'#a8443f'));o.push(MP([0,hy-.035,.242],[.02,.018,.016],sh(SK,.9)));
 if(L.glasses){const gc=L.glasses;for(const s of[-1,1]){o.push(MP([s*.092,hy+.052,.248],[.056,.009,.008],gc));o.push(MP([s*.092,hy-.03,.248],[.056,.009,.008],gc));o.push(MP([s*.092+s*.052,hy+.01,.248],[.009,.044,.008],gc));o.push(MP([s*.092-s*.052,hy+.01,.248],[.009,.044,.008],gc))}o.push(MP([0,hy+.02,.25],[.03,.008,.008],gc))}
 if(L.scarf){o.push(MP([0,.69+br+y0,.02],[.155,.055,.13],L.scarf,{g:.1}));o.push(MP([.075,.6+br+y0,.14],[.04,.11,.02],L.scarf))}
 // cheveux
 const noH=L.wiz&&!L.beard;
 if(!noH){o.push(MP([0,hy+.04,-.04],[.275,.25,.255],HR,{g:.25}));o.push(MP([0,hy+.14,.13],[.225,.085,.13],HR,{g:.2}));for(const s of[-1,1])o.push(MP([s*.215,hy-.01,.02],[.07,.14,.15],HR));if(!L.hat&&!L.wiz&&!L.crown)o.push(MP([.03,hy+.26,.03],[.045,.06,.045],HR))}
 if(L.long){o.push(MP([0,hy-.17,-.14],[.255,.33,.13],HR,{g:.2}));for(const s of[-1,1])o.push(MP([s*.245,hy-.12,.05],[.05,.2,.08],HR))}
 if(L.beard){o.push(MP([0,hy-.15,.13],[.17,.14,.12],HR,{g:.15}));o.push(MP([0,hy-.085,.21],[.085,.022,.03],HR))}
 if(L.hat){const hc=L.hat;o.push(MP([0,hy+.11,-.01],[.29,.17,.27],hc,{g:.25}));o.push(MP([0,hy+.08,.2],[.235,.03,.17],hc,{g:.3,rot:[.2,0,0]}))}
 if(L.wiz){const wc=L.wiz;o.push(MP([0,hy+.1,0],[.42,.045,.38],wc,{g:.2}));o.push(MP([0,hy+.2,0],[.25,.13,.23],wc));o.push(MP([.03,hy+.34,0],[.17,.14,.16],wc));o.push(MP([.09,hy+.47,0],[.08,.12,.08],wc));o.push(MP([0,hy+.12,.0],[.27,.025,.25],'#ffd23f',{e:1}))}
 if(L.crown){for(let i=0;i<5;i++){const a=-.9+i*.45;o.push(MP([Math.sin(a)*.2,hy+.255+(i%2?0:.05),Math.cos(a)*.1],[.034,.065+(i%2?0:.025),.034],'#ffd23f',{e:1}))}o.push(MP([0,hy+.205,0],[.22,.04,.2],'#ffd23f',{e:1}))}
 const sc=L.wiz?.86:1;if(sc!=1)for(const q of o){q.p=[q.p[0]*sc,q.p[1]*sc,q.p[2]*sc];q.r=[q.r[0]*sc,q.r[1]*sc,q.r[2]*sc]}
 return o}
function humFor(L,key,t,yaw,A,R){V3.mdt=V3.mdt||{};if(V3.hbT!==Math.floor(t/12)){V3.hbT=Math.floor(t/12);V3.hb=0}V3.hb=V3.hb||0;const q=V3.mdt[key];R=R||88;
 if(q&&t-q.t<(A&&A.slow?110:40)&&t>=q.t&&V3.mdc&&V3.mdc[key])return V3.mdc[key];
 if(q&&V3.hb>=4&&V3.mdc&&V3.mdc[key])return V3.mdc[key];if(V3.hb>=6)return null;V3.hb++;V3.mdt[key]={t};
 return mdRender(mdHuman(t,L,A),key,R,yaw,.1,{t})}
