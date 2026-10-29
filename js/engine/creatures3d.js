// Modèles 3D des créatures (ellipsoïdes, ombrage « toon »)
// ---------- vrais modèles 3D (ellipsoïdes lancés par rayons, ombrage « toon » + contours) ----------
const MDm=(rx,ry,rz)=>{const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);return[cz*cy,cz*sy*sx-sz*cx,cz*sy*cx+sz*sx,sz*cy,sz*sy*sx+cz*cx,sz*sy*cx-cz*sx,-sy,cy*sx,cy*cx]};
const MDx=(A,B)=>{const r=new Array(9);for(let i=0;i<3;i++)for(let j=0;j<3;j++)r[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return r};
const MP=(p,r,c,o)=>Object.assign({p,r,c:typeof c=='string'?hex3(c):c,rot:null},o||{});
const MD={};
const mdLight=(()=>{const l=[-.45,.72,.55],n=Math.hypot(...l);return l.map(v=>v/n)})(),mdH=(()=>{const l=[mdLight[0],mdLight[1],mdLight[2]+1],n=Math.hypot(...l);return l.map(v=>v/n)})();
function mdBuf(R){V3.mdb=V3.mdb||{};let b=V3.mdb[R];if(b)return b;const cv=cv3(R,R),c=cv.getContext('2d'),id=c.createImageData(R,R);return V3.mdb[R]={cv,c,id,d32:new Uint32Array(id.data.buffer),z:new Float32Array(R*R),pid:new Int16Array(R*R),col:new Uint32Array(R*R)}}
// rend un modèle dans un canvas R×R ; vue orthographique, y de -0.08 à 1.42
function mdRender(prims,key,R,yaw,pitch,o){o=o||{};const B=mdBuf(R),d32=B.d32,zb=B.z,pb=B.pid;V3.mdc=V3.mdc||{};let out=V3.mdc[key];if(!out){out=V3.mdc[key]=cv3(R,R)}
 zb.fill(-1e9);pb.fill(-1);d32.fill(0);const W=1.5,Y0=1.42,s=W/R,Z0=6,M0=MDx(MDm(pitch,0,0),MDm(0,yaw,0)),L=mdLight,H=mdH,bri=o.bri||1,fl=o.flash||0;
 for(let pi=0;pi<prims.length;pi++){const pr=prims[pi],p=pr.p,rr=pr.r;
  const cxm=M0[0]*p[0]+M0[1]*p[1]+M0[2]*p[2],cym=M0[3]*p[0]+M0[4]*p[1]+M0[5]*p[2],czm=M0[6]*p[0]+M0[7]*p[1]+M0[8]*p[2];
  const M=pr.rot?MDx(M0,MDm(pr.rot[0],pr.rot[1],pr.rot[2])):M0,rx=rr[0],ry=rr[1],rz=rr[2],
   ux=M[0]/rx,uy=M[1]/ry,uz=M[2]/rz,vx=M[3]/rx,vy=M[4]/ry,vz=M[5]/rz,wx=M[6]/rx,wy=M[7]/ry,wz=M[8]/rz,A=wx*wx+wy*wy+wz*wz,
   obx=-ux*cxm-vx*cym+wx*(Z0-czm),oby=-uy*cxm-vy*cym+wy*(Z0-czm),obz=-uz*cxm-vz*cym+wz*(Z0-czm),rho=Math.max(rx,ry,rz)*1.04,
   i0=Math.max(0,Math.floor((cxm-rho+W/2)/s)),i1=Math.min(R-1,Math.ceil((cxm+rho+W/2)/s)),j0=Math.max(0,Math.floor((Y0-cym-rho)/s)),j1=Math.min(R-1,Math.ceil((Y0-cym+rho)/s)),
   cr=pr.c[0]*bri,cg=pr.c[1]*bri,cb=pr.c[2]*bri,gl=pr.g||0,em=pr.e||0;
  for(let j=j0;j<=j1;j++){const py=Y0-(j+.5)*s;for(let i=i0;i<=i1;i++){const px=(i+.5)*s-W/2,ox=obx+ux*px+vx*py,oy=oby+uy*px+vy*py,oz=obz+uz*px+vz*py,ow=ox*wx+oy*wy+oz*wz,disc=ow*ow-A*(ox*ox+oy*oy+oz*oz-1);if(disc<=0)continue;
    const t=(ow-Math.sqrt(disc))/A,z=Z0-t,k=j*R+i;if(z<=zb[k])continue;zb[k]=z;pb[k]=pi;
    const qx=(ox-t*wx)/rx,qy=(oy-t*wy)/ry,qz=(oz-t*wz)/rz;let nx=M[0]*qx+M[1]*qy+M[2]*qz,ny=M[3]*qx+M[4]*qy+M[5]*qz,nz=M[6]*qx+M[7]*qy+M[8]*qz;const nl=1/Math.hypot(nx,ny,nz);nx*=nl;ny*=nl;nz*=nl;
    let r,g,b;
    if(em){const f=1+.12*Math.sin(o.t/120+pi);r=Math.min(255,cr*f);g=Math.min(255,cg*f);b=Math.min(255,cb*f)}
    else{const d=Math.max(0,nx*L[0]+ny*L[1]+nz*L[2]);let sh=.5+.52*Math.min(1,d/.8);sh=Math.round(sh*5)/5;if(pr.ao&&ny<.1)sh*=.78;
     const rim=Math.pow(1-Math.max(0,nz),2.4)*.28,sp=gl?Math.pow(Math.max(0,nx*H[0]+ny*H[1]+nz*H[2]),34)*gl*210:0;
     r=cr*sh+rim*70+sp;g=cg*sh+rim*95+sp;b=cb*sh+rim*130+sp}
    if(fl){r+=(255-r)*fl;g+=(255-g)*fl;b+=(255-b)*fl}
    d32[k]=(255<<24)|((b>255?255:b)<<16)|((g>255?255:g)<<8)|(r>255?255:r)}}}
 // contours
 for(let j=0;j<R;j++)for(let i=0;i<R;i++){const k=j*R+i,id=pb[k];if(id<0)continue;let e=0;const z=zb[k];
  if(i==0||pb[k-1]<0||j==0||pb[k-R]<0||i==R-1||pb[k+1]<0||j==R-1||pb[k+R]<0)e=2;
  else{const zl=zb[k-1],zr=zb[k+1],zu=zb[k-R],zd=zb[k+R];if(zl-z>.06||zr-z>.06||zu-z>.06||zd-z>.06)e=1}
  if(e){const c=d32[k],f=e==2?.3:.62;d32[k]=(255<<24)|((((c>>16)&255)*f*.9)<<16)|((((c>>8)&255)*f*.85)<<8)|(((c&255)*f))}}
 B.c.putImageData(B.id,0,0);const oc=out.getContext('2d');oc.clearRect(0,0,R,R);oc.drawImage(B.cv,0,0);return out}
function tailChain(o,n,fn,col1,col2,r0,r1){for(let i=0;i<n;i++){const u=i/(n-1),q=fn(u);o.push(MP(q,[r0+(r1-r0)*Math.sin(u*Math.PI*.9+.3)*.6+.02,r0+(r1-r0)*Math.sin(u*Math.PI*.9+.3)*.6+.02,r0*.95],i%2?col1:col2,{g:.1}))}}
const blinkK=t=>((t%3900)<130)?.12:1;
// Braisou — renard de feu
MD[0]=t=>{const o=[],br=Math.sin(t/620)*.012,wag=Math.sin(t/430),ear=Math.sin(t/950)*.07,bl=blinkK(t);const OR='#ee6a2c',OD='#c9481f',CR='#ffd5a8',BR='#74291a',YL='#ffc84a';
 for(const s of[-1,1]){o.push(MP([s*.15,.075,.13],[.125,.075,.155],BR,{ao:1}));o.push(MP([s*.15,.2,.04],[.1,.13,.1],OD))}
 o.push(MP([0,.4+br,0],[.27,.26+br,.23],OR,{g:.2}));o.push(MP([0,.38+br,.14],[.17,.19,.12],CR));
 for(const s of[-1,1])o.push(MP([s*.3,.42+br,.09],[.075,.13,.075],OD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.83+br,.02],[.37,.29,.31],OR,{g:.25}));o.push(MP([0,.745+br,.25],[.175,.12,.11],CR));o.push(MP([0,.78+br,.345],[.042,.03,.03],'#3a1810',{g:.7}));
 for(const s of[-1,1]){o.push(MP([s*.145,.875+br,.285],[.052,.07*bl,.03],'#1a1010',{g:.9}));o.push(MP([s*.145+s*.013,.9+br,.312],[.019,.021*bl,.012],'#ffffff',{e:1}));o.push(MP([s*.235,.765+br,.25],[.055,.036,.03],'#ff8f7c'));
  o.push(MP([s*.24,1.1+br,.0],[.12,.18,.06],OR,{rot:[0,0,-s*(.5+ear)],g:.15}));o.push(MP([s*.235,1.09+br,.04],[.07,.12,.03],CR,{rot:[0,0,-s*(.5+ear)]}));o.push(MP([s*.315,1.25+br,0],[.055,.075,.045],YL,{rot:[0,0,-s*(.5+ear)],e:1}))}
 o.push(MP([0,1.14+br,.03],[.06,.11,.05],YL,{e:1}));o.push(MP([-.1,1.1+br,.03],[.045,.085,.045],YL,{rot:[0,0,.35],e:1}));o.push(MP([.1,1.1+br,.03],[.045,.085,.045],YL,{rot:[0,0,-.35],e:1}));
 tailChain(o,6,u=>[.1+u*.38+wag*.05*u,.3+u*.52-u*u*.05+Math.sin(t/300+u*3)*.01,-.2-u*.14],'#8a3a1c','#b8732e',.1,.15);
 o.push(MP([.5+wag*.06,.9,-.34],[.16,.2,.15],'#ff8a1c',{e:1}));o.push(MP([.5+wag*.07,1.06+Math.sin(t/140)*.03,-.34],[.09,.14,.09],'#ffd24a',{e:1}));return o};
// Ondin — méduse d'eau
MD[1]=t=>{const o=[],bob=Math.sin(t/700)*.02,bl=blinkK(t+900);const BL='#3f86dc',BD='#2a64b8',LT='#a9d6ff',DR='#d6eeff';
 for(const [sx,sz,i] of [[-1,1,0],[1,1,1],[-1,-1,2],[1,-1,3]]){const sw=Math.sin(t/520+i*1.7)*.03,ph=sz<0?.85:1;o.push(MP([sx*.32*ph,.33,sz*.17],[.1,.1,.1],BD));o.push(MP([sx*(.46+sw)*ph,.21,sz*.23],[.09,.11,.09],BD,{rot:[0,0,sx*.5]}));o.push(MP([sx*(.52+sw*1.4)*ph,.07,sz*.3],[.085,.07,.09],BD,{ao:1}))}
 o.push(MP([0,.34,0],[.36,.1,.31],BD,{ao:1}));
 o.push(MP([0,.58+bob,0],[.43,.37,.39],BL,{g:.4}));o.push(MP([0,.5+bob,.2],[.29,.24,.2],'#68a8ef'));
 o.push(MP([0,.97+bob,0],[.13,.08,.12],BL));o.push(MP([0,1.12+bob,0],[.115,.17,.105],'#9fd2ff',{g:1}));o.push(MP([0,1.27+bob,0],[.06,.09,.06],'#cfeaff',{g:1}));o.push(MP([-.04,1.15+bob,.07],[.025,.05,.02],'#ffffff',{e:1}));
 for(const s of[-1,1]){o.push(MP([s*.16,.64+bob,.33],[.055,.072*bl,.03],'#141a2a',{g:.9}));o.push(MP([s*.16+s*.014,.665+bob,.36],[.02,.022*bl,.012],'#ffffff',{e:1}));o.push(MP([s*.29,.55+bob,.27],[.058,.038,.03],'#ff8fa0'))}
 o.push(MP([0,.5+bob,.37],[.05,.016,.02],'#1a2a4a'));return o};
// Feuillon — grenouille-feuille
MD[2]=t=>{const o=[],br=Math.sin(t/640)*.012,sway=Math.sin(t/800)*.06,bl=blinkK(t+1700);const GR='#6cc04c',GD='#4a9a34',GL='#c2ee90',LF='#b9e866',LD='#7cc04a',FT='#2f6e28';
 for(const s of[-1,1]){o.push(MP([s*.17,.075,.135],[.135,.075,.155],FT,{ao:1}));o.push(MP([s*.17,.2,.04],[.1,.13,.1],GD))}
 o.push(MP([0,.4+br,0],[.31,.3+br,.27],GR,{g:.2}));o.push(MP([0,.36+br,.16],[.2,.22,.13],GL));
 for(const s of[-1,1])o.push(MP([s*.32,.43+br,.09],[.08,.13,.08],GD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.83+br,.02],[.36,.28,.31],GR,{g:.25}));
 for(const s of[-1,1]){o.push(MP([s*.135,.87+br,.285],[.058,.075*bl,.032],'#142010',{g:.9}));o.push(MP([s*.135+s*.014,.895+br,.315],[.02,.023*bl,.012],'#ffffff',{e:1}));o.push(MP([s*.235,.77+br,.26],[.056,.036,.03],'#ff8fa6'));
  o.push(MP([s*.26,1.12+br+sway*.3,.02],[.25,.1,.04],LF,{rot:[0,0,s*(.3+sway)],g:.3}));o.push(MP([s*.27,1.13+br+sway*.3,.045],[.19,.05,.02],LD,{rot:[0,0,s*(.3+sway)]}))}
 o.push(MP([0,1.07+br,0],[.06,.055,.06],LD));o.push(MP([0,.74+br,.3],[.06,.022,.03],'#1c3a18'));return o};
// ---- lot 2 : créatures de base ----
const mdEye=(o,x,y,z,r,bl,col)=>{o.push(MP([x,y,z],[r,r*1.3*bl,r*.55],col||'#1a1010',{g:.9}));o.push(MP([x+Math.sign(x||1)*r*.25,y+r*.32*bl,z+r*.5],[r*.36,r*.4*bl,r*.2],'#ffffff',{e:1}))};
const mdCheek=(o,x,y,z,c)=>o.push(MP([x,y,z],[.058,.038,.03],c||'#ff8fa6'));
const mdFeet=(o,xs,col,r)=>{for(const s of[-1,1])o.push(MP([s*xs,.075,.13],r||[.12,.075,.15],col,{ao:1}))};
// Rattou — souris violette
MD[3]=t=>{const o=[],br=Math.sin(t/600)*.012,bl=blinkK(t+400),tw=Math.sin(t/900)*.06;const PU='#8a7a9a',PD='#6c5c7e',LG='#cfc6d6',PK='#f08ab0';
 mdFeet(o,.15,'#4a3a5a');for(const s of[-1,1])o.push(MP([s*.15,.2,.04],[.1,.13,.1],PD));
 o.push(MP([0,.4+br,0],[.27,.26+br,.23],PU,{g:.2}));o.push(MP([0,.37+br,.14],[.17,.19,.12],LG));
 for(const s of[-1,1])o.push(MP([s*.29,.42+br,.09],[.07,.12,.07],PD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.82+br,.02],[.34,.27,.29],PU,{g:.25}));o.push(MP([0,.745+br,.24],[.15,.105,.1],'#b9acc4'));o.push(MP([0,.775+br,.335],[.042,.032,.03],'#e8789a',{g:.7}));
 for(const s of[-1,1]){mdEye(o,s*.14,.86+br,.275,.05,bl);mdCheek(o,s*.24,.76+br,.245);
  o.push(MP([s*.3,1.07+br+tw*s*.3,-.02],[.18,.18,.045],PU,{rot:[0,-s*.35,s*(.1+tw)],g:.15}));o.push(MP([s*.3,1.07+br+tw*s*.3,.015],[.12,.12,.03],PK,{rot:[0,-s*.35,s*(.1+tw)]}))}
 o.push(MP([0,.69+br,.3],[.035,.012,.02],'#3a2a4a'));
 tailChain(o,8,u=>[.1+u*.5,.13+Math.sin(u*2.8+t/500)*.05+u*.12,-.2-u*.18],'#dba3b8','#c98fa5',.03,.045);return o};
// Piaf — oiseau bleu
MD[4]=t=>{const o=[],br=Math.sin(t/520)*.014,bl=blinkK(t+1100),fl=Math.sin(t/230)*.07*(Math.sin(t/2700)>.6?3:1);const BL='#4a9be0',BD='#3578c4',LT='#bfe0ff',YE='#ffb52e';
 for(const s of[-1,1]){o.push(MP([s*.1,.14,.05],[.026,.075,.026],YE));o.push(MP([s*.1,.06,.1],[.075,.04,.11],YE,{ao:1}))}
 o.push(MP([0,.3,-.26],[.12,.06,.2],'#e8a830',{rot:[-.5,0,0]}));o.push(MP([0,.34,-.3],[.07,.05,.18],BD,{rot:[-.6,0,0]}));
 o.push(MP([0,.62+br,0],[.42,.42+br,.37],BL,{g:.3}));o.push(MP([0,.55+br,.2],[.28,.28,.2],LT));
 o.push(MP([0,.69+br,.37],[.07,.045,.085],YE,{g:.5}));o.push(MP([0,.63+br,.36],[.055,.025,.07],'#e89818'));
 for(const s of[-1,1]){mdEye(o,s*.16,.8+br,.31,.055,bl);mdCheek(o,s*.28,.7+br,.28);
  o.push(MP([s*.44,.58+br,-.02],[.09,.26,.17],BD,{rot:[0,0,s*(.28+fl)],g:.2}));o.push(MP([s*.5,.4+br,-.02],[.06,.14,.12],'#2a5aa0',{rot:[0,0,s*(.28+fl)]}))}
 o.push(MP([0,1.07+br,.02],[.05,.12,.05],BD,{rot:[0,0,.1+fl*.5]}));o.push(MP([-.07,1.04+br,.02],[.04,.1,.04],BL,{rot:[0,0,.5]}));o.push(MP([.07,1.04+br,.02],[.04,.1,.04],BL,{rot:[0,0,-.5]}));return o};
// Mousse — champignon
MD[5]=t=>{const o=[],br=Math.sin(t/660)*.012,bl=blinkK(t+2100),sw=Math.sin(t/1100)*.02;const RD='#d8403a',CR='#f2ecd8',BE='#cdb48c',BD='#a88c64';
 mdFeet(o,.14,'#7a5e3e',[.11,.075,.14]);for(const s of[-1,1])o.push(MP([s*.14,.19,.05],[.09,.12,.09],BD));
 o.push(MP([0,.36+br,0],[.27,.25,.24],BD,{g:.15}));o.push(MP([0,.34+br,.13],[.17,.17,.12],'#e4d4b4'));
 for(const s of[-1,1])o.push(MP([s*.29,.4+br,.09],[.07,.12,.07],BD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.65+br,0],[.31,.27,.28],BE,{g:.2}));
 for(const s of[-1,1]){mdEye(o,s*.13,.66+br,.26,.05,bl);mdCheek(o,s*.22,.58+br,.24)}o.push(MP([0,.56+br,.285],[.05,.015,.025],'#5a3a2a'));
 const cy=1.0+br,cxo=sw;o.push(MP([cxo,cy-.08,0],[.55,.09,.49],'#b8302e',{ao:1}));o.push(MP([cxo,cy,0],[.52,.31,.46],RD,{g:.35}));
 for(const [dx,dy,dz,r] of[[0,.8,.6,.085],[-.62,.66,.42,.075],[.62,.66,.42,.075],[-.28,.95,-.1,.07],[.34,.9,-.3,.08],[0,.38,.92,.065],[-.78,.4,-.48,.06],[.82,.3,-.1,.055]]){const n=Math.hypot(dx,dy,dz);o.push(MP([cxo+.52*dx/n*.97,cy+.31*dy/n*.97,.46*dz/n*.97],[r,r*.9,r*.7],'#fff6ee',{g:.2}))}return o};
// Crabi — crabe
MD[6]=t=>{const o=[],br=Math.sin(t/560)*.012,bl=blinkK(t+300),sn=Math.sin(t/420)*.09,bob=Math.sin(t/900)*.012;const RE='#ee6a4a',RD='#c04a30',BL='#9fd6e6';
 for(const s of[-1,1])for(let i=0;i<3;i++){const z=-.14+i*.14,w=Math.sin(t/500+i*1.5+(s>0?1:0))*.02;o.push(MP([s*(.42+i*.02),.12,z],[.17,.045,.04],RD,{rot:[0,0,s*.3],ao:1}));o.push(MP([s*(.56+i*.02+w),.06,z],[.05,.075,.04],RD,{ao:1}))}
 o.push(MP([0,.34+br+bob,0],[.46,.2+br,.34],RE,{g:.25}));o.push(MP([0,.44+br+bob,-.02],[.38,.12,.28],'#f58060'));o.push(MP([0,.33+br+bob,.22],[.27,.13,.14],BL));
 for(const s of[-1,1]){o.push(MP([s*.16,.58+br+bob,.1],[.03,.11,.03],'#f6e8d8'));o.push(MP([s*.16,.72+br+bob,.12],[.095,.105*bl,.09],'#ffffff',{g:.5}));o.push(MP([s*.16,.72+br+bob,.2],[.05,.055*bl,.03],'#1a1010',{g:.9}));
  o.push(MP([s*.5,.5+bob,.12],[.08,.16,.08],RE,{rot:[0,0,-s*.5]}));o.push(MP([s*.58,.82+bob,.12],[.17,.13,.13],RE,{g:.25}));
  o.push(MP([s*(.68+sn*.4),1.02+bob,.12],[.09,.17,.09],RE,{rot:[0,0,-s*(.3+sn)],g:.2}));o.push(MP([s*(.5-sn*.4),1.02+bob,.12],[.09,.17,.09],RE,{rot:[0,0,s*(.3+sn)],g:.2}));mdCheek(o,s*.3,.38+bob,.3,'#ff9a8a')}
 o.push(MP([0,.3+br+bob,.33],[.06,.015,.02],'#6a2a1a'));return o};
// Cendrelin — goutte de feu
MD[7]=t=>{const o=[],br=Math.sin(t/480)*.02,bl=blinkK(t+1500),fk=Math.sin(t/140)*.035,fk2=Math.sin(t/190+1)*.03;const Y1='#ffc83a',Y2='#ffe27a',OR='#ff9a2a';
 o.push(MP([0,.14,0],[.3,.07,.26],OR,{ao:1}));
 o.push(MP([0,.45+br,0],[.4,.36+br,.34],Y1,{g:.3}));o.push(MP([0,.42+br,.18],[.28,.27,.18],Y2));
 o.push(MP([fk*.3,.86+br,0],[.31,.42,.26],Y1,{g:.3}));o.push(MP([fk*.7,1.1+br,0],[.17,.28,.13],'#ffb52e',{g:.3}));o.push(MP([fk*1.1,1.28+br,0],[.08,.16,.065],OR,{g:.3,e:1}));o.push(MP([fk*1.4,1.38+br,0],[.035,.08,.03],'#ffe27a',{e:1}));
 o.push(MP([.34+fk2,1.0+br,-.02],[.07,.13,.05],OR,{rot:[0,0,-.4+fk2*3],e:1}));
 for(const s of[-1,1]){mdEye(o,s*.14,.5+br,.31,.052,bl);mdCheek(o,s*.25,.4+br,.27,'#ff8a70')}o.push(MP([0,.37+br,.335],[.05,.014,.02],'#8a3a1a'));return o};
// Lunard — chat lunaire
MD[8]=t=>{const o=[],br=Math.sin(t/640)*.012,wag=Math.sin(t/470),ear=Math.sin(t/1000)*.07,bl=blinkK(t+2600);const PU='#6a5ab8',PD='#4e3f96',LT='#a79de0',PK='#ff9ac0',YL='#ffe27a';
 mdFeet(o,.15,'#3a2f78');for(const s of[-1,1])o.push(MP([s*.15,.2,.04],[.1,.13,.1],PD));
 o.push(MP([0,.4+br,0],[.27,.26+br,.23],PU,{g:.2}));o.push(MP([0,.38+br,.14],[.17,.19,.12],LT));
 for(const s of[-1,1])o.push(MP([s*.3,.42+br,.09],[.075,.13,.075],PD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.83+br,.02],[.36,.28,.31],'#7466c8',{g:.25}));o.push(MP([0,.745+br,.25],[.16,.11,.1],LT));o.push(MP([0,.775+br,.345],[.036,.026,.026],'#ff8fb0',{g:.6}));
 for(const s of[-1,1]){mdEye(o,s*.145,.87+br,.285,.062,bl,'#241a58');mdCheek(o,s*.235,.765+br,.25);
  o.push(MP([s*.23,1.12+br,0],[.11,.18,.06],PU,{rot:[0,0,-s*(.45+ear)],g:.15}));o.push(MP([s*.225,1.11+br,.04],[.06,.12,.03],PK,{rot:[0,0,-s*(.45+ear)]}))}
 o.push(MP([0,1.0+br,.29],[.075,.075,.03],YL,{e:1}));o.push(MP([.035,1.015+br,.31],[.068,.068,.03],'#7466c8'));
 tailChain(o,6,u=>[.12+u*.38+wag*.05*u,.3+u*.55-u*u*.05+Math.sin(t/300+u*3)*.01,-.2-u*.14],'#4e3f96','#6a5ab8',.07,.08);
 o.push(MP([.52+wag*.06,.88,-.34],[.12,.12,.12],YL,{e:1}));return o};
// ---- lot 3 : évolutions et espèces 12-16 ----
const mdBrow=(o,x,y,z,rz,col)=>o.push(MP([x,y,z],[.075,.02,.03],col||'#2a2030',{rot:[0,0,rz]}));
// Flamgrin — lion de feu
MD[9]=t=>{const o=[],br=Math.sin(t/600)*.012,wag=Math.sin(t/430),bl=blinkK(t+800);const OR='#e8552a',OD='#b8401e',CR='#ffd8a8';
 mdFeet(o,.17,'#6a2a1a',[.14,.08,.17]);for(const s of[-1,1])o.push(MP([s*.17,.2,.04],[.11,.14,.11],OD));
 o.push(MP([0,.42+br,0],[.31,.28+br,.26],OR,{g:.2}));o.push(MP([0,.4+br,.15],[.19,.2,.13],CR));
 for(const s of[-1,1])o.push(MP([s*.32,.44+br,.09],[.08,.14,.08],OD,{rot:[0,0,s*.4]}));
 for(let i=0;i<12;i++){const th=i/12*Math.PI*2,L=.16+Math.sin(t/190+i*1.7)*.02,rr=.41;o.push(MP([Math.sin(th)*rr,.88+br+Math.cos(th)*rr*.95,-.1],[.12,L,.08],i%2?'#ffb02e':'#ff7a1c',{rot:[0,0,-th],e:1}))}
 o.push(MP([0,.88+br,-.04],[.4,.38,.14],'#c8421e',{g:.1}));
 o.push(MP([0,.88+br,.04],[.33,.28,.28],OR,{g:.25}));o.push(MP([0,.8+br,.25],[.17,.12,.1],CR));o.push(MP([0,.835+br,.34],[.045,.032,.03],'#3a1810',{g:.7}));
 for(const s of[-1,1]){mdEye(o,s*.15,.94+br,.27,.052,bl);mdBrow(o,s*.15,1.02+br,.29,-s*.3,'#6a2a1a');mdCheek(o,s*.24,.82+br,.24);o.push(MP([s*.25,1.13+br,.05],[.1,.1,.05],OR));o.push(MP([s*.25,1.13+br,.08],[.06,.06,.03],CR))}
 tailChain(o,6,u=>[.12+u*.42+wag*.05*u,.28+u*.4+Math.sin(t/300+u*3)*.01,-.22-u*.14],'#8a4a22','#a85c2c',.1,.13);
 o.push(MP([.58+wag*.06,.78,-.36],[.14,.17,.12],'#ff8a1c',{e:1}));o.push(MP([.58+wag*.07,.94+Math.sin(t/140)*.03,-.36],[.08,.12,.08],'#ffd24a',{e:1}));return o};
// Ondaros — baleine d'eau
MD[10]=t=>{const o=[],bob=Math.sin(t/760)*.025,bl=blinkK(t+1300),fin=Math.sin(t/600)*.1,tl=Math.sin(t/500)*.06;const BL='#3a7ad0',BD='#2a5aa8',LT='#a9d4f2';
 o.push(MP([0,.12,0],[.4,.05,.32],'#2a5aa8',{ao:1}));
 o.push(MP([0,.56+bob,0],[.5,.44,.42],BL,{g:.35}));o.push(MP([0,.44+bob,.22],[.36,.27,.22],LT));
 for(const s of[-1,1]){o.push(MP([s*.54,.42+bob,.08],[.21,.07,.11],BD,{rot:[0,0,s*(.5+fin)],g:.2}));mdEye(o,s*.22,.68+bob,.34,.055,bl);mdCheek(o,s*.34,.55+bob,.3);
  o.push(MP([s*.035,1.08+bob,0],[.025,.13,.022],'#e6f4ff',{g:.9,e:1}));o.push(MP([s*(.09+Math.abs(tl)*.2),1.22+bob,0],[.03,.07,.025],'#cfeaff',{g:.9,e:1}))}
 o.push(MP([0,.5+bob,.4],[.11,.022,.03],'#1a2a4a'));
 for(let i=0;i<5;i++){const u=i/4;o.push(MP([.24+u*.32+tl*u,.3+u*.5+bob,-.34-u*.12],[.12-u*.04,.11-u*.03,.11],i%2?BL:BD,{g:.1}))}
 o.push(MP([.58+tl,.86+bob,-.46],[.2,.045,.12],BD,{rot:[0,0,.5]}));o.push(MP([.52+tl,.78+bob,-.46],[.2,.045,.12],BD,{rot:[0,0,-.5]}));return o};
// Sylvaros — arbre gardien
MD[11]=t=>{const o=[],br=Math.sin(t/700)*.01,bl=blinkK(t+2400),sw=Math.sin(t/900)*.025;const BK='#7a5a36',BL='#a07a4c',G1='#4aa83c',G2='#78c860',G3='#3a8a30';
 for(const s of[-1,1]){o.push(MP([s*.16,.075,.13],[.13,.075,.15],'#3a2a18',{ao:1}));o.push(MP([s*.16,.2,.04],[.1,.13,.1],BK))}
 o.push(MP([0,.45+br,0],[.31,.34+br,.27],BK,{g:.1}));o.push(MP([0,.52+br,.15],[.23,.22,.13],BL));
 for(const s of[-1,1]){o.push(MP([s*.33,.5+br,.06],[.07,.13,.07],BK,{rot:[0,0,s*.5]}));o.push(MP([s*.42,.38+br,.06],[.1,.05,.04],G2,{rot:[0,0,s*.6]}))}
 for(const s of[-1,1]){mdEye(o,s*.11,.58+br,.27,.05,bl);mdCheek(o,s*.2,.49+br,.24)}o.push(MP([0,.45+br,.285],[.04,.012,.02],'#2a1a10'));
 o.push(MP([sw,1.0+br,0],[.52,.3,.46],G1,{g:.2}));o.push(MP([-.3+sw,1.1+br,.06],[.3,.24,.28],G1,{g:.2}));o.push(MP([.3+sw,1.1+br,.06],[.3,.24,.28],G1,{g:.2}));
 o.push(MP([sw*1.4,1.24+br,-.06],[.36,.2,.32],G2,{g:.3}));o.push(MP([-.16+sw,1.08+br,.28],[.2,.12,.12],G2));o.push(MP([.2+sw,1.04+br,.3],[.18,.1,.1],G3));o.push(MP([-.4+sw,.94+br,-.02],[.18,.12,.2],G3));o.push(MP([.42+sw,.96+br,-.02],[.18,.12,.2],G3));return o};
// Aigrin — aigle bleu
MD[12]=t=>{const o=[],br=Math.sin(t/560)*.012,bl=blinkK(t+1900),fl=Math.sin(t/300)*.05;const BL='#6aa8e0',BD='#4a88c4',LT='#d0e4f6',YE='#e8c860',OR='#ffb52e';
 for(const s of[-1,1]){o.push(MP([s*.12,.14,.05],[.03,.08,.03],OR));o.push(MP([s*.12,.06,.11],[.08,.04,.12],OR,{ao:1}))}
 o.push(MP([0,.28,-.2],[.14,.06,.2],YE,{rot:[-.5,0,0]}));
 o.push(MP([0,.55+br,0],[.31,.42+br,.27],BL,{g:.3}));o.push(MP([0,.5+br,.17],[.2,.3,.14],LT));
 for(const s of[-1,1]){o.push(MP([s*.5,.7+br,-.04],[.14,.36,.05],YE,{rot:[0,0,s*(.5+fl)],g:.3}));o.push(MP([s*.62,.55+br,-.04],[.1,.28,.04],'#d8aa40',{rot:[0,0,s*(.65+fl)]}))}
 o.push(MP([0,1.0+br,.02],[.29,.25,.26],BL,{g:.3}));o.push(MP([0,.93+br,.2],[.15,.12,.1],LT));o.push(MP([0,.95+br,.3],[.05,.045,.07],OR,{g:.5}));
 for(const s of[-1,1]){mdEye(o,s*.13,1.03+br,.235,.05,bl);mdBrow(o,s*.14,1.12+br,.25,-s*.45);mdCheek(o,s*.22,.92+br,.21)}
 o.push(MP([0,1.27+br,.0],[.07,.14,.05],YE,{e:1}));o.push(MP([-.11,1.22+br,.0],[.05,.12,.04],YE,{rot:[0,0,.5],e:1}));o.push(MP([.11,1.22+br,.0],[.05,.12,.04],YE,{rot:[0,0,-.5],e:1}));return o};
// Luciole — chenille
MD[13]=t=>{const o=[],bl=blinkK(t+700);const GR='#7cd24a',GD='#4a9a32',LT='#d8f090',YL='#ffe27a';
 for(let i=4;i>=1;i--){const u=i/4,w=Math.sin(t/500-i*.9)*.025,r=.27-i*.025;o.push(MP([-.2-i*.17,.27+w+(i%2?.02:0),-.05-i*.1],[r,r*.95,r],GR,{g:.3}));o.push(MP([-.2-i*.17,.2+w,-.02-i*.1+.12],[r*.55,r*.4,r*.5],LT));if(i!=3)o.push(MP([-.2-i*.17,.27+r*.85+w,-.05-i*.1],[r*.4,r*.2,r*.4],GD))
  for(const s of[-1,1])o.push(MP([-.2-i*.17+s*.04,.07,.0-i*.1+.05],[.05,.05,.06],LT,{ao:1}))}
 o.push(MP([-.1,.3,.02],[.3,.28,.27],GR,{g:.3}));o.push(MP([-.08,.2,.14],[.2,.15,.14],LT));o.push(MP([-.1,.52,0],[.1,.08,.1],GD));
 o.push(MP([.08,.55,.1],[.35,.32,.3],GR,{g:.35}));o.push(MP([.08,.46,.3],[.17,.12,.09],LT));
 for(const s of[-1,1]){mdEye(o,.08+s*.14,.6,.37,.055,bl);mdCheek(o,.08+s*.24,.5,.33,'#ff9ab0');
  const sw=Math.sin(t/420+s)*.05;o.push(MP([.08+s*.12,.9,.08],[.018,.1,.018],GD,{rot:[0,0,-s*(.15)+sw]}));o.push(MP([.08+s*(.17+sw*1.2),1.04,.08],[.055,.055,.055],YL,{e:1}))}
 o.push(MP([.08,.43,.4],[.045,.015,.02],'#2a5a20'));return o};
// Galet — rocher
MD[14]=t=>{const o=[],br=Math.sin(t/900)*.01,bl=blinkK(t+3100);const RK='#8a8478',RD='#6a665c',RL='#aaa498';
 for(const s of[-1,1])o.push(MP([s*.22,.08,.12],[.15,.08,.16],RD,{ao:1}));
 o.push(MP([0,.5+br,0],[.46,.42+br,.38],RK,{g:.15}));
 for(const [x,y,z,rx,ry,rz,c] of[[-.3,.82,.05,.2,.15,.18,RL],[.3,.8,.0,.2,.16,.18,RD],[0,.92,-.1,.24,.14,.2,RK],[-.42,.45,.08,.14,.18,.16,RD],[.42,.42,.06,.15,.2,.16,RL],[.18,.3,.3,.14,.1,.1,RL],[-.2,.62,-.25,.18,.18,.14,RD],[.1,.7,.3,.12,.08,.08,RL]])o.push(MP([x,y+br,z],[rx,ry,rz],c,{g:.1}));
 o.push(MP([0,.58+br,.3],[.34,.26,.15],'#a39c8e'));
 for(const s of[-1,1]){mdBrow(o,s*.14,.73+br,.43,-s*.4,'#2a2420');mdEye(o,s*.14,.65+br,.43,.04,bl);}o.push(MP([0,.5+br,.45],[.08,.012,.02],'#2a2420'));
 for(const s of[-1,1])o.push(MP([s*.5,.42+br,.04],[.1,.14,.1],RD,{g:.1}));return o};
// Spectro — fantôme
MD[15]=t=>{const o=[],fl=Math.sin(t/650)*.04,bl=blinkK(t+500);const PU='#9a88d8',PD='#7a68b8',LT='#c8b8f0';
 o.push(MP([0,.1,0],[.34,.04,.28],'#5a4a90',{ao:1}));
 o.push(MP([0,.66+fl,0],[.43,.45,.37],PU,{g:.3}));o.push(MP([0,.5+fl,.2],[.3,.28,.18],'#a898e4'));
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2,w=Math.sin(t/300+i*1.3)*.03;o.push(MP([Math.cos(a)*.33,.28+fl+w,Math.sin(a)*.27],[.12,.16,.12],i%2?PU:PD,{g:.2}))}
 for(const x of[-.22,0,.22])o.push(MP([x,1.08+fl,-.02],[.09,.14,.08],PU,{rot:[0,0,-x*1.5]}));
 for(const s of[-1,1]){o.push(MP([s*.15,.74+fl,.31],[.09,.1*bl,.05],'#ffffff',{g:.6}));o.push(MP([s*.15,.73+fl,.355],[.045,.055*bl,.025],'#1a1030',{g:.9}));mdCheek(o,s*.28,.6+fl,.29)}
 o.push(MP([0,.5+fl,.35],[.1,.075,.03],LT));o.push(MP([0,.5+fl,.375],[.055,.045,.02],'#3a2a60'));
 for(const s of[-1,1])o.push(MP([s*.44,.52+fl+Math.sin(t/400+s)*.03,.04],[.1,.07,.08],PD,{rot:[0,0,s*.4]}));return o};
// Luniel — étoile lunaire
MD[16]=t=>{const o=[],bob=Math.sin(t/700)*.035,rk=Math.sin(t/1300)*.07,bl=blinkK(t+2000);const PU='#8a70d0',PL='#b8a0f0',CR='#fff0b0';
 const cy=.74+bob;
 [[0,.3,PU],[1,.38,PL],[2,.24,PU],[3,.24,PU],[4,.38,PL]].forEach(([k,L,c])=>{const th=k*Math.PI*2/5+rk,lf=1+Math.sin(t/500+k)*.04;o.push(MP([Math.sin(th)*(.22+L*.5*lf),cy+Math.cos(th)*(.22+L*.5*lf)*.9,0],[.15+(k==1||k==4?.03:0),(L+.2)*lf,.1],c,{rot:[0,0,-th],g:.4}))});
 o.push(MP([0,cy,0],[.36,.36,.17],PU,{g:.3}));o.push(MP([0,cy,.12],[.27,.27,.11],CR,{g:.35,e:0}));
 for(const s of[-1,1]){mdEye(o,s*.09,cy+.04,.215,.04,bl);mdCheek(o,s*.17,cy-.05,.2)}o.push(MP([0,cy-.07,.225],[.05,.016,.02],'#8a4a2a'));
 o.push(MP([0,.1,0],[.2,.03,.16],'#5a4a90',{ao:1}));return o};
// ---- lot 4 : espèces 17-24 ----
// Ratalpha — loup violet
MD[17]=t=>{const o=[],br=Math.sin(t/620)*.012,wag=Math.sin(t/520),ear=Math.sin(t/1100)*.06;const PU='#6a5a8a',PD='#4a3a68',LT='#b8a8cc',GY='#8a7aa6';
 mdFeet(o,.16,'#3a2a58',[.13,.075,.16]);for(const s of[-1,1])o.push(MP([s*.16,.2,.04],[.1,.13,.1],PD));
 o.push(MP([0,.42+br,0],[.29,.27+br,.24],PU,{g:.2}));o.push(MP([0,.4+br,.15],[.18,.2,.12],LT));
 for(const s of[-1,1])o.push(MP([s*.31,.44+br,.09],[.08,.14,.08],PD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.86+br,.02],[.38,.28,.31],PU,{g:.25}));o.push(MP([0,.77+br,.26],[.17,.12,.11],LT));o.push(MP([0,.805+br,.355],[.045,.032,.03],'#1a1020',{g:.7}));
 for(const s of[-1,1]){o.push(MP([s*.14,.9+br,.285],[.06,.017,.03],'#1a1020'));mdBrow(o,s*.15,.96+br,.27,-s*.35,'#2a1a40');mdCheek(o,s*.25,.79+br,.25,'#d89ac8');
  o.push(MP([s*.37,.8+br,.04],[.08,.13,.07],GY,{rot:[0,0,-s*.7]}));o.push(MP([s*.27,1.17+br,0],[.12,.2,.06],PU,{rot:[0,0,-s*(.35+ear)],g:.15}));o.push(MP([s*.265,1.15+br,.04],[.065,.13,.03],'#b89ad8',{rot:[0,0,-s*(.35+ear)]}))}
 tailChain(o,7,u=>[.1+u*.45+wag*.05*u,.25+u*.45+Math.sin(t/300+u*3)*.012,-.22-u*.16],'#5a4a78','#7a6a98',.09,.12);o.push(MP([.55+wag*.06,.76,-.4],[.12,.13,.12],GY));return o};
// Titancrabe — homard géant
MD[18]=t=>{const o=[],br=Math.sin(t/620)*.012,sn=Math.sin(t/480)*.1,bob=Math.sin(t/900)*.012;const RE='#e8603c',RD='#b84028',BL='#a8c8e4';
 for(const s of[-1,1])for(let i=0;i<4;i++){const z=-.2+i*.14,w=Math.sin(t/520+i*1.4+(s>0?1:0))*.02;o.push(MP([s*(.44+i*.01),.14,z],[.18,.045,.045],RD,{rot:[0,0,s*.35],ao:1}));o.push(MP([s*(.58+w),.06,z],[.05,.08,.045],RD,{ao:1}))}
 o.push(MP([0,.4+br+bob,0],[.5,.28+br,.38],RE,{g:.25}));o.push(MP([0,.5+br+bob,-.04],[.4,.14,.3],'#f07650'));o.push(MP([0,.36+br+bob,.28],[.3,.17,.14],BL));
 for(const s of[-1,1]){o.push(MP([s*.15,.58+br+bob,.33],[.05,.06*blinkK(t+s*300),.03],'#1a1010',{g:.9}));o.push(MP([s*.15+.012,.6+br+bob,.355],[.018,.02,.01],'#fff',{e:1}));mdBrow(o,s*.15,.67+br+bob,.34,-s*.4,'#3a1a10');
  o.push(MP([s*.14,.9+bob,.05],[.02,.17,.02],'#2a1a1a',{rot:[0,0,s*(.5+sn*.5)]}));
  o.push(MP([s*.52,.55+bob,.1],[.09,.17,.09],RE,{rot:[0,0,-s*.5]}));o.push(MP([s*.62,.84+bob,.1],[.2,.15,.14],RE,{g:.25}));
  o.push(MP([s*(.7+sn*.4),1.0+bob,.1],[.1,.18,.1],RE,{rot:[0,0,-s*(.3+sn)],g:.2}));o.push(MP([s*(.52-sn*.4),1.0+bob,.1],[.1,.18,.1],RE,{rot:[0,0,s*(.3+sn)],g:.2}));mdCheek(o,s*.3,.42+bob,.33,'#ff9a8a')}
 o.push(MP([0,.34+br+bob,.37],[.07,.015,.02],'#6a2a1a'));return o};
// Fongidor — champignon vert
MD[19]=t=>{const o=[],br=Math.sin(t/700)*.01,bl=blinkK(t+1200),sw=Math.sin(t/1200)*.02;const GN='#3a9a4a',BE='#b09462',BD='#8a7040';
 mdFeet(o,.17,'#6a5230',[.13,.075,.15]);for(const s of[-1,1])o.push(MP([s*.17,.2,.05],[.1,.13,.1],BD));
 o.push(MP([0,.38+br,0],[.31,.28,.27],BD,{g:.1}));o.push(MP([0,.36+br,.15],[.2,.19,.13],'#d8c490'));
 for(const s of[-1,1])o.push(MP([s*.34,.42+br,.09],[.08,.14,.08],BD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.68+br,0],[.36,.28,.31],BE,{g:.2}));
 for(const s of[-1,1]){mdEye(o,s*.14,.7+br,.28,.055,bl);mdCheek(o,s*.25,.6+br,.26)}o.push(MP([0,.58+br,.305],[.055,.016,.025],'#4a2a1a'));
 const cy=1.06+br,cx0=sw;o.push(MP([cx0,cy-.1,0],[.64,.1,.56],'#2a5a30',{ao:1}));
 for(let i=0;i<9;i++){const a=-1.2+i*.3;o.push(MP([cx0+Math.sin(a)*.5,cy-.1,Math.cos(a)*.44],[.06,.07,.05],'#f0e8c8',{g:.2}))}
 o.push(MP([cx0,cy+.02,0],[.6,.34,.52],GN,{g:.35}));
 for(const [dx,dy,dz,r] of[[0,.8,.6,.1],[-.62,.66,.42,.085],[.62,.66,.42,.085],[-.28,.95,-.1,.08],[.34,.9,-.3,.09],[0,.38,.92,.075],[-.8,.4,-.4,.065],[.82,.3,-.1,.06]]){const n=Math.hypot(dx,dy,dz);o.push(MP([cx0+.6*dx/n*.97,cy+.02+.34*dy/n*.97,.52*dz/n*.97],[r,r*.9,r*.7],'#f4f4e0',{g:.2}))}return o};
// Bélier — petit bélier
MD[20]=t=>{const o=[],br=Math.sin(t/640)*.012,bl=blinkK(t+2200),ear=Math.sin(t/1000)*.06;const BR='#a07c54',BD='#7a5a38',LT='#d8bc94',HN='#e0cc9c';
 mdFeet(o,.15,'#4a3220');for(const s of[-1,1])o.push(MP([s*.15,.2,.04],[.1,.13,.1],BD));
 o.push(MP([0,.4+br,0],[.27,.26+br,.23],BR,{g:.15}));o.push(MP([0,.38+br,.14],[.17,.19,.12],LT));
 for(const s of[-1,1])o.push(MP([s*.3,.42+br,.09],[.075,.13,.075],BD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.85+br,.02],[.35,.28,.3],'#b8946a',{g:.2}));o.push(MP([0,.76+br,.25],[.17,.12,.1],LT));o.push(MP([0,.795+br,.34],[.04,.03,.03],'#3a2010',{g:.7}));
 o.push(MP([0,1.12+br,.02],[.22,.12,.18],'#f0e4c8',{g:.1}));
 for(const s of[-1,1]){mdEye(o,s*.14,.89+br,.28,.05,bl);mdCheek(o,s*.24,.78+br,.25);o.push(MP([s*.34,.92+br,.0],[.09,.1,.05],'#d8b888',{rot:[0,0,s*(.2+ear)]}));
  for(let i=0;i<7;i++){const a=-.6+i*.52,r0=.17;o.push(MP([s*(.36+Math.sin(a)*r0*.9),1.03+br+Math.cos(a)*r0,.0+i*.004],[.065-i*.002,.065-i*.002,.06],HN,{g:.25}))}}
 o.push(MP([0,.28,-.24],[.1,.1,.09],'#f0e4c8'));return o};
// Hulotte — chouette
MD[21]=t=>{const o=[],br=Math.sin(t/600)*.012,bl=blinkK(t+900),fl=Math.sin(t/500)*.04;const BR='#9c7c54',LT='#e0c8a0',MN='#a8d4c0';
 for(const s of[-1,1]){o.push(MP([s*.12,.07,.1],[.1,.065,.13],'#4a3220',{ao:1}));o.push(MP([s*.12,.16,.05],[.04,.09,.04],'#6a4a2a'))}
 o.push(MP([0,.56+br,0],[.36,.46+br,.31],BR,{g:.2}));o.push(MP([0,.5+br,.2],[.25,.35,.14],LT));
 for(let k=0;k<4;k++)for(const s of[-1,1])o.push(MP([s*.08,.32+k*.12,.3],[.03,.03,.02],'#b89868'));
 for(const s of[-1,1])o.push(MP([s*.4,.62+br,-.02],[.1,.3,.15],MN,{rot:[0,0,s*(.18+fl)],g:.2}));
 o.push(MP([0,1.03+br,.02],[.39,.3,.3],'#a8885c',{g:.25}));
 for(const s of[-1,1]){o.push(MP([s*.25,1.28+br,0],[.08,.14,.06],BR,{rot:[0,0,-s*.4]}));o.push(MP([s*.16,1.06+br,.27],[.14,.14*bl+.02,.05],MN,{g:.5}));o.push(MP([s*.16,1.06+br,.3],[.1,.1*bl+.01,.04],'#ffffff',{g:.7}));o.push(MP([s*.16,1.06+br,.325],[.05,.055*bl,.025],'#1a1010',{g:.9}))}
 o.push(MP([0,.94+br,.31],[.045,.06,.06],'#f0a020',{g:.5}));return o};
// Magmite — volcan
MD[22]=t=>{const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+3000),lv=Math.sin(t/170)*.02;const RK='#7a4a30',RD='#5a3220';
 for(const s of[-1,1])o.push(MP([s*.22,.07,.12],[.15,.07,.16],RD,{ao:1}));
 o.push(MP([0,.42+br,0],[.5,.36+br,.4],RK,{g:.1}));o.push(MP([0,.8+br,0],[.38,.42,.32],'#8a5a3a',{g:.1}));o.push(MP([0,1.1+br,0],[.25,.22,.21],'#8a5a3a'));
 o.push(MP([0,1.27+br+lv,0],[.2,.07,.17],'#ff6a1a',{e:1}));o.push(MP([lv*2,1.36+br,0],[.09,.08,.08],'#ffc84a',{e:1}));o.push(MP([-.08,1.3+br+Math.sin(t/230)*.03,.03],[.05,.05,.05],'#ff9a2a',{e:1}));
 o.push(MP([.02,.98+br,.17],[.05,.2,.04],'#ff7a1c',{e:1,rot:[0,0,.15]}));o.push(MP([-.2,.78+br,.2],[.04,.16,.04],'#ff7a1c',{e:1,rot:[0,0,-.3]}));
 for(const [x,y,z,r] of[[.3,.55,.3,.09],[-.34,.62,.28,.08],[.1,.88,.24,.06],[-.1,1.0,.18,.05]])o.push(MP([x,y+br,z],[r,r,r*.8],RD));
 for(const s of[-1,1]){mdEye(o,s*.14,.5+br,.38,.05,bl);mdCheek(o,s*.27,.4+br,.35,'#ff8a6a')}o.push(MP([0,.38+br,.4],[.06,.016,.02],'#2a1208'));return o};
// Coralie — coquillage
MD[23]=t=>{const o=[],bob=Math.sin(t/800)*.012,bl=blinkK(t+1400),sw=Math.sin(t/900)*.03;const PK='#f08aa8',PD='#c8607e',SH='#7cc4ee';
 for(const s of[-1,1]){o.push(MP([s*.2,.075,.1],[.13,.075,.14],PD,{ao:1}));o.push(MP([s*.2,.16,.06],[.1,.09,.1],PK))}
 o.push(MP([0,.4+bob,.02],[.38,.28,.33],PK,{g:.3}));
 for(const s of[-1,1]){mdEye(o,s*.14,.42+bob,.31,.052,bl);mdCheek(o,s*.25,.32+bob,.28,'#ff6a8a')}o.push(MP([0,.3+bob,.34],[.05,.014,.02],'#6a2a3a'));
 o.push(MP([0,.76+bob,-.05],[.45,.34,.4],SH,{g:.9}));o.push(MP([-.14,.9+bob,.1],[.12,.06,.1],'#d6f0ff',{g:1}));o.push(MP([0,.74+bob,.1],[.34,.24,.26],'#9ad4f4',{g:.6}));
 o.push(MP([0,1.07+bob,-.04],[.03,.16,.03],'#e6f4ff',{g:1}));o.push(MP([sw,1.25+bob,-.04],[.06,.06,.06],'#ffffff',{e:1}));
 for(const s of[-1,1])o.push(MP([s*.4,.52+bob,.0],[.09,.11,.08],PD,{rot:[0,0,s*.4]}));return o};
// Pétale — fleur
MD[24]=t=>{const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+1700),wd=Math.sin(t/900);const PK='#f8b8d0',PD='#f090b8',MG='#d8508a';
 for(const s of[-1,1]){o.push(MP([s*.14,.07,.09],[.11,.07,.13],'#a83a64',{ao:1}));o.push(MP([s*.14,.18,.05],[.08,.11,.08],MG))}
 o.push(MP([0,.44+br,-.02],[.2,.3+br,.17],MG,{g:.2}));o.push(MP([0,.4+br,.08],[.13,.2,.09],'#e8789e'));
 for(const s of[-1,1]){o.push(MP([s*.3+wd*.01,.36,-.03],[.24,.07,.05],MG,{rot:[0,0,s*(.5+wd*.06)],g:.2}));o.push(MP([s*.36,.5+br,.03],[.1,.07,.04],MG,{rot:[0,0,s*.6]}))}
 for(let i=0;i<8;i++){const th=i/8*Math.PI*2,sw=Math.sin(t/600+i)*.02,rr=.42;o.push(MP([Math.sin(th)*rr,.98+br+Math.cos(th)*rr*.95,-.05-(i%2)*.02],[.19,.2,.07],i%2?PD:PK,{rot:[0,0,-th+sw],g:.3}))}
 o.push(MP([0,.98+br,-.04],[.36,.36,.1],PD));o.push(MP([0,.98+br,.04],[.3,.3,.12],'#fff0a0',{g:.35}));
 for(const s of[-1,1]){mdEye(o,s*.1,1.0+br,.15,.04,bl);mdCheek(o,s*.19,.9+br,.13)}o.push(MP([0,.9+br,.165],[.05,.016,.02],'#8a4a2a'));return o};
// ---- lot 5 : espèces 25-37 ----
// Tempestor — tornade
MD[25]=t=>{const o=[],bl=blinkK(t+600);const T=[[1.18,.54,'#e8eef6'],[1.0,.46,'#9aa8bc'],[.84,.4,'#f2f6fb'],[.64,.32,'#9aa8bc'],[.46,.22,'#dce4ee'],[.3,.14,'#8896ac'],[.18,.08,'#b8c4d4']];
 T.forEach(([y,r,c],i)=>{const sw=Math.sin(t/400+i*.9)*.04*(i+1)/3;o.push(MP([sw,y+Math.sin(t/700+i)*.01,Math.cos(t/500+i)*.02],[r,.13,r*.85],c,{g:.2,rot:[Math.sin(t/600+i)*.06,t/900*(i%2?1:-1)*0,0]}))});
 const f=Math.sin(t/400+2*.9)*.04*3/3;
 for(const s of[-1,1]){mdEye(o,s*.12+f,.84,.37,.06,bl);mdCheek(o,s*.24+f,.76,.33)}o.push(MP([f,.75,.38],[.04,.014,.02],'#5a6a80'));return o};
// Titanor — golem de pierre
MD[26]=t=>{const o=[],br=Math.sin(t/900)*.008,gl=.8+Math.sin(t/300)*.2;const GY='#8a8a92',GD='#6a6a74',GL='#aaaab4',TL='#3fe0d0';
 for(const s of[-1,1]){o.push(MP([s*.2,.15,0],[.17,.16,.18],GD,{ao:1}));o.push(MP([s*.2,.3,.02],[.15,.12,.15],GY))}
 o.push(MP([0,.62+br,0],[.4,.36+br,.31],GY,{g:.15}));o.push(MP([0,.62+br,.2],[.3,.28,.18],GL));o.push(MP([0,.5+br,.3],[.34,.045,.06],GD));o.push(MP([0,.63+br,.32],[.12,.09,.04],'#2a8a86',{e:1}));
 for(const s of[-1,1]){o.push(MP([s*.5,.86+br,0],[.2,.19,.2],GL,{g:.15}));o.push(MP([s*.54,.52+br,.02],[.14,.3,.14],GY));o.push(MP([s*.54,.28+br,.03],[.16,.12,.15],GD))}
 o.push(MP([0,1.06+br,.02],[.31,.26,.26],GY,{g:.15}));o.push(MP([0,1.2+br,0],[.26,.1,.22],GL));
 for(const s of[-1,1])o.push(MP([s*.12,1.08+br,.24],[.075,.04,.03],TL,{e:1}));o.push(MP([0,.95+br,.26],[.1,.02,.02],GD));return o};
// Braseron — grenouille de feu couronnée
MD[27]=t=>{const o=[],br=Math.sin(t/640)*.012,bl=blinkK(t+700),wag=Math.sin(t/450);const OR='#e8552a',OD='#b8401e',CR='#f8c898',GD='#f0c040';
 for(const s of[-1,1]){o.push(MP([s*.17,.075,.135],[.135,.075,.155],'#8a2a14',{ao:1}));o.push(MP([s*.17,.2,.04],[.1,.13,.1],OD))}
 o.push(MP([0,.4+br,0],[.31,.3+br,.27],OR,{g:.2}));o.push(MP([0,.36+br,.16],[.2,.22,.13],CR));
 for(const s of[-1,1])o.push(MP([s*.32,.43+br,.09],[.08,.13,.08],OD,{rot:[0,0,s*.4]}));
 o.push(MP([0,.83+br,.02],[.37,.28,.31],OR,{g:.25}));
 for(const s of[-1,1]){mdEye(o,s*.135,.87+br,.285,.058,bl);mdBrow(o,s*.14,.96+br,.29,-s*.4,'#4a1a0a');mdCheek(o,s*.235,.77+br,.26)}o.push(MP([0,.74+br,.3],[.06,.022,.03],'#5a1a0a'));
 o.push(MP([0,1.08+br,.02],[.24,.06,.21],GD,{e:1}));for(let i=0;i<5;i++){const a=-.8+i*.4;o.push(MP([Math.sin(a)*.2,1.17+br+Math.cos(a)*.03,Math.cos(a)*.17],[.04,.1+(i==2?.04:0),.035],GD,{e:1,rot:[0,0,-a*.3]}))}
 tailChain(o,6,u=>[.12+u*.4+wag*.04*u,.2+u*.4,-.2-u*.18],'#7a4a22','#9a5e2c',.09,.12);o.push(MP([.55+wag*.05,.62,-.42],[.1,.14,.1],'#ff8a1c',{e:1}));return o};
// Givrelin — cube de glace
MD[28]=t=>{const o=[],br=Math.sin(t/760)*.012,bl=blinkK(t+1000),sh=.5+Math.sin(t/900)*.5;const IC='#8ccbea',ID='#62a8d4';
 o.push(MP([0,.12,0],[.36,.05,.32],'#5a98c0',{ao:1}));
 o.push(MP([0,.55+br,0],[.48,.44+br,.42],IC,{g:.7}));o.push(MP([0,.48+br,.2],[.36,.3,.22],'#a8dcf2',{g:.3}));o.push(MP([0,.93+br,0],[.36,.07,.32],'#f4fbff',{g:.8}));
 o.push(MP([-.26,.82+br,.25],[.12,.07,.05],'#ffffff',{g:1,e:1}));o.push(MP([.3,.2,.28],[.1,.03,.05],'#ffffff',{g:1}));
 for(const [x,y,z,r] of[[-.46,.9,.05,.07],[.48,.35,.1,.06],[.4,.98,-.1,.06]])o.push(MP([x,y+br,z],[r,r*1.8,r],'#d6f2ff',{rot:[0,0,x>0?-.5:.5],g:.8}));
 for(const s of[-1,1]){mdEye(o,s*.15,.6+br,.4,.05,bl);mdCheek(o,s*.3,.5+br,.37,'#ff9ab0')}o.push(MP([0,.5+br,.43],[.06,.016,.02],'#3a5a7a'));return o};
// Cristalor — gemme
MD[29]=t=>{const o=[],br=Math.sin(t/720)*.01,bl=blinkK(t+1800),gl=Math.sin(t/500)*.5+.5;const PU='#8a58d8',PD='#6a3cb4',PL='#b890f0';
 for(const s of[-1,1])o.push(MP([s*.17,.075,.1],[.12,.075,.14],PD,{ao:1}));
 o.push(MP([0,.28,0],[.3,.2,.27],PD,{g:.5}));o.push(MP([0,.6+br,0],[.42,.4+br,.37],PU,{g:.8}));o.push(MP([-.22,.62+br,.2],[.1,.26,.1],PL,{g:1,rot:[0,0,.1]}));
 o.push(MP([0,.98+br,0],[.36,.13,.32],'#ece2ff',{g:1}));o.push(MP([0,1.08+br,0],[.24,.07,.2],'#f8f2ff',{g:1}));o.push(MP([.1,1.15+br,.05],[.06,.04,.05],'#fff',{e:1}));
 for(const s of[-1,1]){mdEye(o,s*.15,.62+br,.34,.05,bl);mdCheek(o,s*.28,.5+br,.31)}o.push(MP([0,.5+br,.365],[.05,.015,.02],'#3a1a6a'));
 o.push(MP([-.3+gl*.02,.9+br,.2],[.03,.03,.02],'#fff',{e:1}));return o};
// Foudrion — éclair
MD[30]=t=>{const o=[],bl=blinkK(t+500),fl=Math.sin(t/180)*.02,bob=Math.sin(t/600)*.03;const YE='#ffd83a',YD='#e8b020';
 o.push(MP([.12+fl,1.18+bob,-.02],[.15,.3,.07],YE,{rot:[0,0,-.55],e:1}));o.push(MP([-.02+fl,.92+bob,-.02],[.3,.17,.075],YE,{rot:[0,0,.2],e:1}));o.push(MP([.2,.76+bob,-.02],[.15,.3,.07],YE,{rot:[0,0,-.45],e:1}));o.push(MP([.28,.42+bob,-.02],[.1,.26,.06],YD,{rot:[0,0,-.55],e:1}));o.push(MP([.04,.5+bob,-.02],[.09,.3,.06],YE,{rot:[0,0,.25],e:1}));
 o.push(MP([-.1,.68+bob,.12],[.3,.27,.22],'#fffdf4',{g:.5}));
 for(const s of[-1,1]){mdEye(o,-.1+s*.1,.72+bob,.3,.04,bl);mdCheek(o,-.1+s*.2,.63+bob,.27)}o.push(MP([-.1,.62+bob,.33],[.05,.014,.02],'#6a5a2a'));
 o.push(MP([-.5,1.06+Math.sin(t/500)*.04,0],[.12,.035,.04],'#ffffff',{e:1}));o.push(MP([.46,.38+Math.sin(t/430)*.04,0],[.12,.035,.04],'#ffffff',{e:1}));
 o.push(MP([0,.06,0],[.24,.03,.2],'#7a6a30',{ao:1}));return o};
// Ombrelin — chauve-souris
MD[31]=t=>{const o=[],br=Math.sin(t/560)*.012,bl=blinkK(t+2700),fl=Math.sin(t/260)*.08;const PU='#6a4a98',PD='#4a3270',LT='#8a6ab8',MB='#b890d8',PK='#ff9ac0';
 for(const s of[-1,1])o.push(MP([s*.1,.09,.06],[.08,.07,.1],PD,{ao:1}));
 o.push(MP([0,.56+br,0],[.3,.38+br,.26],PU,{g:.2}));o.push(MP([0,.5+br,.17],[.19,.27,.12],LT));
 for(const s of[-1,1]){o.push(MP([s*.46,.9+br,-.06],[.3,.045,.04],PD,{rot:[0,0,s*(.55+fl)]}));o.push(MP([s*.56,.62+br,-.06],[.3,.3,.03],MB,{rot:[0,0,s*(.15+fl*.6)],g:.2}));o.push(MP([s*.34,.42+br,-.06],[.14,.2,.03],MB,{rot:[0,0,s*(.1+fl*.3)]}));o.push(MP([s*.62,.46+br,-.06],[.08,.16,.03],'#a078c8',{rot:[0,0,s*(.1+fl*.5)]}))}
 o.push(MP([0,1.0+br,.02],[.31,.26,.26],PU,{g:.25}));o.push(MP([0,.93+br,.21],[.16,.12,.1],LT));o.push(MP([0,.96+br,.3],[.04,.03,.03],'#2a1a40'));
 for(const s of[-1,1]){o.push(MP([s*.17,1.3+br,0],[.1,.2,.05],PU,{rot:[0,0,-s*.3],g:.15}));o.push(MP([s*.17,1.28+br,.03],[.06,.13,.03],PK,{rot:[0,0,-s*.3]}));
  o.push(MP([s*.13,1.03+br,.26],[.075,.085*bl,.04],'#ffffff',{g:.6}));o.push(MP([s*.13,1.03+br,.295],[.04,.05*bl,.025],'#1a1030',{g:.9}));mdBrow(o,s*.14,1.12+br,.26,-s*.3,'#2a1a40');o.push(MP([s*.05,.88+br,.31],[.015,.03,.012],'#ffffff'))}return o};
// Sylvanide — sapin
MD[32]=t=>{const o=[],br=Math.sin(t/700)*.01,bl=blinkK(t+2300);const T=[[.34,.54,'#2f8a4a'],[.62,.47,'#3a9a54'],[.9,.37,'#2f8a4a'],[1.14,.27,'#3a9a54'],[1.32,.14,'#4aaa60']];
 for(const s of[-1,1])o.push(MP([s*.12,.07,.08],[.1,.07,.12],'#4a3220',{ao:1}));o.push(MP([0,.18,0],[.12,.14,.1],'#6a4a2a'));
 T.forEach(([y,r,c],i)=>{const sw=Math.sin(t/800+i)*.012;o.push(MP([sw*i,y+br,0],[r,.14,r*.9],c,{g:.2}))});
 for(const s of[-1,1]){mdEye(o,s*.14,.62+br,.43,.05,bl);mdCheek(o,s*.28,.54+br,.4)}o.push(MP([0,.53+br,.45],[.045,.014,.02],'#1a4a24'));
 o.push(MP([0,1.4+br,0],[.065,.065,.065],'#ffe27a',{e:1}));return o};
// Éclipsor — éclipse
MD[33]=t=>{const o=[],bob=Math.sin(t/800)*.03,bl=blinkK(t+1100);
 o.push(MP([0,.72+bob,-.12],[.6,.6,.08],'#d8c8f0',{e:1}));
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2,L=.09+Math.sin(t/200+i*2)*.02;o.push(MP([Math.sin(a)*.6,.72+bob+Math.cos(a)*.6,-.1],[.05,L,.04],'#f2e8ff',{e:1,rot:[0,0,-a]}))}
 o.push(MP([0,.72+bob,0],[.46,.46,.42],'#3a2a6a',{g:.5}));o.push(MP([-.14,.86+bob,.3],[.14,.12,.06],'#6a56a8',{g:.8}));
 for(const s of[-1,1]){o.push(MP([s*.15,.74+bob,.36],[.075,.07*bl,.04],'#ffffff',{g:.6}));o.push(MP([s*.15,.73+bob,.395],[.036,.04*bl,.02],'#1a1030',{g:.9}));mdBrow(o,s*.15,.84+bob,.38,-s*.4,'#e8d8ff')}o.push(MP([0,.6+bob,.42],[.07,.014,.02],'#e8d8ff'));return o};
// Volcanor — grand volcan
MD[34]=t=>{const o=[],br=Math.sin(t/720)*.012,bl=blinkK(t+800),lv=Math.sin(t/160)*.025;const RK='#5a3828',RD='#3a2018';
 for(const s of[-1,1])o.push(MP([s*.24,.07,.12],[.15,.07,.16],RD,{ao:1}));
 o.push(MP([0,.4+br,0],[.54,.36+br,.43],RK,{g:.1}));o.push(MP([0,.78+br,0],[.4,.46,.33],'#6a4430',{g:.1}));o.push(MP([0,1.08+br,0],[.26,.24,.21],'#6a4430'));
 o.push(MP([0,1.25+br+lv,0],[.24,.08,.19],'#ff5a1a',{e:1}));o.push(MP([lv,1.36+br,0],[.13,.12,.1],'#ff9a2a',{e:1}));o.push(MP([lv*1.5,1.42+br,0],[.06,.06,.06],'#ffe27a',{e:1}));
 o.push(MP([.03,.98+br,.2],[.07,.25,.05],'#ff7a1c',{e:1,rot:[0,0,.2]}));o.push(MP([-.2,.74+br,.26],[.05,.2,.04],'#ff7a1c',{e:1,rot:[0,0,-.35]}));
 for(const [x,y,z,r] of[[.34,.5,.34,.1],[-.38,.58,.3,.09],[.16,.9,.28,.07]])o.push(MP([x,y+br,z],[r,r,r*.8],RD));
 for(const s of[-1,1]){mdEye(o,s*.15,.5+br,.4,.052,bl);mdCheek(o,s*.28,.4+br,.37,'#ff8a6a')}o.push(MP([0,.38+br,.42],[.06,.016,.02],'#2a1208'));return o};
// Récifor — corail
MD[35]=t=>{const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+1600);const PK='#f0a0b8',PL='#f8c8d8',PD='#d87898';
 for(const s of[-1,1])o.push(MP([s*.2,.07,.1],[.13,.07,.14],PD,{ao:1}));
 o.push(MP([0,.4+br,0],[.46,.32+br,.38],PK,{g:.3}));o.push(MP([0,.36+br,.2],[.3,.22,.18],PL));
 for(const [x,y,h,a] of[[-.38,.62,.22,.45],[.38,.62,.22,-.45],[-.2,.74,.28,.2],[.2,.74,.28,-.2],[0,.78,.3,0]]){const sw=Math.sin(t/600+x*5)*.025;o.push(MP([x+Math.sin(-a)*h*.4+sw,y+br+h*.4,-.04],[.08,h*.55,.08],PK,{rot:[0,0,a],g:.2}));o.push(MP([x+Math.sin(-a)*h*1.0+sw*1.6,y+br+h*1.05,-.04],[.1,.1,.1],PL,{g:.5}))}
 for(const s of[-1,1]){mdEye(o,s*.15,.45+br,.34,.05,bl);mdCheek(o,s*.29,.34+br,.31,'#ff7a9a')}o.push(MP([0,.33+br,.375],[.055,.016,.02],'#8a3a5a'));return o};
// Floralune — fleur lunaire (variante de Pétale)
MD[36]=t=>{const o=MD[24](t),cy=.98+Math.sin(t/700)*.012;o.push(MP([-.11,cy+.1,.17],[.09,.09,.03],'#ffd84a',{e:1}));o.push(MP([-.07,cy+.11,.19],[.082,.082,.03],'#fff0a0'));
 for(const s of[-1,1])o.push(MP([s*.34,.5+Math.sin(t/700)*.012,.05],[.1,.06,.04],'#9a58b8',{rot:[0,0,s*.6]}));return o};
// Nocturne — chat nuit
MD[37]=t=>{const o=[],br=Math.sin(t/640)*.012,wag=Math.sin(t/470),ear=Math.sin(t/1000)*.07,bl=blinkK(t+2900);const NV='#2a2f5a',ND='#1a1d3e',LT='#8a90b8',PK='#ff9ac0';
 mdFeet(o,.15,'#14162e');for(const s of[-1,1])o.push(MP([s*.15,.2,.04],[.1,.13,.1],ND));
 o.push(MP([0,.4+br,0],[.27,.26+br,.23],NV,{g:.3}));o.push(MP([0,.38+br,.14],[.17,.19,.12],LT));
 for(const s of[-1,1])o.push(MP([s*.3,.42+br,.09],[.075,.13,.075],ND,{rot:[0,0,s*.4]}));
 o.push(MP([0,.83+br,.02],[.36,.28,.31],'#323868',{g:.4}));o.push(MP([0,.745+br,.25],[.16,.11,.1],'#aab0cc'));o.push(MP([0,.775+br,.345],[.036,.026,.026],'#ff8fb0',{g:.6}));
 for(const s of[-1,1]){mdEye(o,s*.145,.87+br,.285,.065,bl,'#ffe27a');mdCheek(o,s*.235,.765+br,.25);
  o.push(MP([s*.23,1.12+br,0],[.11,.18,.06],NV,{rot:[0,0,-s*(.45+ear)],g:.3}));o.push(MP([s*.225,1.11+br,.04],[.06,.12,.03],PK,{rot:[0,0,-s*(.45+ear)]}))}
 o.push(MP([0,1.0+br,.29],[.075,.075,.03],'#f4f0ff',{e:1}));o.push(MP([.035,1.015+br,.31],[.068,.068,.03],'#323868'));
 tailChain(o,6,u=>[.12+u*.38+wag*.05*u,.3+u*.55-u*u*.05+Math.sin(t/300+u*3)*.01,-.2-u*.14],'#1a1d3e','#2a2f5a',.07,.08);
 o.push(MP([.52+wag*.06,.88,-.34],[.12,.12,.12],'#ffffff',{e:1}));return o};
// ---- lot 6 : usines d'archétypes + espèces 38-69 ----
const mdRc=(o,m)=>{const mm={};for(const k in m)mm[hex3(k).join()]=hex3(m[k]);o.forEach(p=>{const n=mm[p.c.join()];if(n)p.c=n.slice()});return o};
// créature debout générique (tête + corps + oreilles + queue)
function mdCrt(t,c){const ph=c.ph||0,o=[],br=Math.sin(t/(600+ph*40))*.012,bl=blinkK(t+ph*410),wag=Math.sin(t/470+ph),ear=Math.sin(t/1000+ph)*.07;
 const B=c.B,D=c.D||B,L=c.L||'#f4e8d0',H=c.H||B,bs=c.bs||1,hs=c.hs||1,hy=.83+br+(c.hy||0);
 mdFeet(o,.15*bs,c.F||D,[.12*bs,.075,.15*bs]);for(const s of[-1,1])o.push(MP([s*.15*bs,.2,.04],[.1*bs,.13,.1*bs],D));
 o.push(MP([0,.4+br,0],[.27*bs,.26+br,.23*bs],B,{g:.2}));o.push(MP([0,.38+br,.14*bs],[.17*bs,.19,.12],L));
 if(c.arms!==0)for(const s of[-1,1])o.push(MP([s*.3*bs,.42+br,.09],[.075,.13,.075],c.A||D,{rot:[0,0,s*.4]}));
 o.push(MP([0,hy,.02],[.35*hs,.28*hs,.3*hs],H,{g:.25}));
 if(c.sn!==0){o.push(MP([0,hy-.085*hs,.25*hs],[.16*hs,.11*hs,.1*hs],c.sn||L));o.push(MP([0,hy-.05*hs,.345*hs],[.042,.032,.03],c.nc||'#3a1810',{g:.7}))}
 for(const s of[-1,1]){mdEye(o,s*.145*hs,hy+.04*hs,.285*hs,c.er||.055,bl,c.eyeC);mdCheek(o,s*.235*hs,hy-.065*hs,.25*hs,c.ck);if(c.brow)mdBrow(o,s*.15*hs,hy+.13*hs,.29*hs,-s*c.brow,c.brc||'#2a1a10')}
 const ek=c.ears||'pt',EC=c.ec||B,EI=c.ei||'#ff9ac0';
 for(const s of[-1,1]){if(ek=='pt'){o.push(MP([s*.23*hs,hy+.29*hs,0],[.11,.18,.06],EC,{rot:[0,0,-s*(.45+ear)],g:.15}));o.push(MP([s*.225*hs,hy+.28*hs,.04],[.06,.12,.03],EI,{rot:[0,0,-s*(.45+ear)]}))}
  else if(ek=='rd'){o.push(MP([s*.26*hs,hy+.24*hs,0],[.12,.12,.05],EC,{rot:[0,0,-s*ear]}));o.push(MP([s*.26*hs,hy+.24*hs,.03],[.07,.07,.03],EI))}
  else if(ek=='lg'){o.push(MP([s*.13*hs,hy+.45*hs,0],[.075,.27,.045],EC,{rot:[0,0,-s*(.14+ear*.6)],g:.15}));o.push(MP([s*.13*hs,hy+.45*hs,.03],[.04,.2,.025],EI,{rot:[0,0,-s*(.14+ear*.6)]}))}
  else if(ek=='dr'){o.push(MP([s*.38*hs,hy+.12*hs,0],[.16,.07,.04],EC,{rot:[0,0,s*(.45-ear)],g:.15}));o.push(MP([s*.37*hs,hy+.12*hs,.03],[.1,.04,.03],EI,{rot:[0,0,s*(.45-ear)]}))}}
 const tk=c.tail||'none';if(tk=='chain')tailChain(o,6,u=>[.1+u*.4+wag*.05*u,.28+u*.42+Math.sin(t/300+u*3)*.01,-.2-u*.16],c.t1||D,c.t2||B,c.tr0||.08,c.tr1||.1);
 else if(tk=='puff')o.push(MP([0,.28,-.28],[.13,.13,.13],c.t1||'#fff',{g:.1}));
 if(c.extra)c.extra(o,{br,t,bl,hy,hs,bs,wag,ear});return o}
// soleil
function mdSun(t,P){const o=[],bob=Math.sin(t/800)*.03,bl=blinkK(t+P.ph),sp=t/2600*(P.spin||0),cy=.72+bob;
 for(let i=0;i<P.n;i++){const a=i/P.n*Math.PI*2+sp,L=P.len+Math.sin(t/220+i*1.9)*.025;o.push(MP([Math.sin(a)*P.rr,cy+Math.cos(a)*P.rr,-.04],[P.w,L,.07],i%2?P.r1:P.r2,{rot:[0,0,-a],e:1}))}
 o.push(MP([0,cy,-.06],[P.rr*.95,P.rr*.95,.08],P.r2,{e:1}));o.push(MP([0,cy,0],[.43,.43,.3],P.core,{g:.5}));if(P.face)o.push(MP([0,cy-.03,.12],[.34,.3,.2],P.face,{g:.3}));
 for(const s of[-1,1]){mdEye(o,s*.13,cy+.07,.3,.05,bl);mdCheek(o,s*.25,cy-.03,.27,'#ff8a6a')}o.push(MP([0,cy-.1,.325],[.07,.02,.02],'#8a4a2a'));return o}
// orbe avec écusson
function mdOrb(t,P){const o=[],bob=Math.sin(t/900)*.03,cy=.72+bob,bl=blinkK(t+P.ph);
 o.push(MP([0,cy,-.04],[.54,.54,.08],P.rim,{e:1}));o.push(MP([0,cy,0],[.48,.48,.43],P.c,{g:.7}));o.push(MP([-.16,cy+.2,.3],[.15,.1,.06],P.hi||'#8a78d8',{g:1}));
 for(const [x,y,z] of P.sp||[[.3,.25,.3],[-.32,.0,.3],[.2,-.3,.3],[-.1,.4,.25],[.38,-.08,.25]])o.push(MP([x,cy+y,z],[.028,.028,.02],'#fff',{e:1}));
 o.push(MP([0,cy-.02,.38],[.2,.18,.06],P.patch,{g:.3}));
 for(const s of[-1,1])o.push(MP([s*.085,cy+.01,.43],[.032,.042*bl,.02],'#1a1030',{g:.9}));o.push(MP([0,cy-.07,.435],[.03,.012,.012],'#8a4a6a'));return o}
// nuage
function mdCloud(t,P){const o=[],bob=Math.sin(t/900)*.025,bl=blinkK(t+P.ph),w=Math.sin(t/700)*.02;
 o.push(MP([0,.1,0],[.34,.04,.28],'#4a3a70',{ao:1}));
 o.push(MP([0,.52+bob,0],[.46,.34,.34],P.c,{g:.3}));for(const [x,y,z,r] of[[-.32,.6,.04,.2],[.32,.6,.04,.2],[-.16,.8,-.04,.22],[.16,.82,-.04,.2],[0,.88,-.1,.18],[-.38,.4,-.02,.16],[.38,.4,-.02,.16]])o.push(MP([x+w*(x>0?1:-1),y+bob,z],[r,r*.9,r],P.c2||P.c,{g:.3}));
 o.push(MP([0,.45+bob,.28],[.24,.15,.1],P.l,{g:.2}));
 for(const s of[-1,1]){mdEye(o,s*.14,.6+bob,.32,.05,bl);mdCheek(o,s*.3,.5+bob,.28);if(P.arms)o.push(MP([s*.55,.45+bob+Math.sin(t/500+s)*.03,.04],[.2,.07,.06],P.c2||P.c,{rot:[0,0,s*.5]}))}o.push(MP([0,.45+bob,.37],[.05,.016,.02],'#4a2a5a'));return o}
// méduse
function mdJelly(t,P){const o=[],bob=Math.sin(t/760)*.03,bl=blinkK(t+P.ph),pu=Math.sin(t/500)*.02;
 for(let i=0;i<5;i++){const x=(i-2)*.17,ph=t/500+i*1.3;for(let k=0;k<3;k++)o.push(MP([x*(1+k*.1)+Math.sin(ph-k*.7)*.03*(k+1),.34+bob-k*.14,Math.sin(i*2.1)*.1],[.06-k*.012,.1,.06-k*.012],P.t,{g:.2}))}
 o.push(MP([0,.72+bob,0],[.44+pu,.36,.4+pu],P.d,{g:.8}));o.push(MP([0,.55+bob,.18],[.32,.2,.22],P.dl,{g:.3}));if(P.cap)o.push(MP([0,1.02+bob,0],[.1,.1,.1],'#fff',{e:1}));
 if(P.spots)for(const [x,y,z] of[[-.22,.9,.2],[.2,.95,.15],[0,1.05,.0],[-.3,.78,.1]])o.push(MP([x,y+bob,z],[.07,.06,.05],'#f6f0ff',{g:.4}));
 if(!P.spots)o.push(MP([0,.98+bob,.12],[.16,.04,.12],'#d8eeff',{g:.8,rot:[.4,0,0]}));
 for(const s of[-1,1]){mdEye(o,s*.14,.62+bob,.36,.052,bl);mdCheek(o,s*.28,.52+bob,.32)}o.push(MP([0,.52+bob,.395],[.05,.016,.02],'#2a4a7a'));return o}
// tortue
function mdTurtle(t,P){const o=[],br=Math.sin(t/800)*.012,bl=blinkK(t+P.ph),hn=Math.sin(t/1200)*.02;
 for(const s of[-1,1]){o.push(MP([s*.34,.1,.28],[.13,.09,.15],P.g,{ao:1}));o.push(MP([s*.3,.1,-.28],[.14,.09,.15],P.g,{ao:1}))}
 o.push(MP([0,.5+br,-.04],[.52,.14,.46],P.rim,{ao:1}));o.push(MP([0,.65+br,-.04],[.5,.36,.44],P.sh,{g:.2}));
 for(const [x,y,z,r] of[[-.2,.9,.0,.15],[.22,.88,-.1,.14],[0,.95,-.2,.13],[-.34,.7,.1,.12],[.36,.72,.0,.12]])o.push(MP([x,y+br,z],[r,r*.5,r],P.moss,{g:.1}));
 o.push(MP([0,.36+br+hn,.36],[.26,.24,.24],P.g,{g:.25}));o.push(MP([0,.3+br+hn,.52],[.14,.08,.08],P.gl));
 for(const s of[-1,1]){mdEye(o,s*.11,.42+br+hn,.52,.05,bl);mdCheek(o,s*.2,.32+br+hn,.5,'#ff8a8a')}
 if(P.tree){o.push(MP([0,1.02+br,-.04],[.05,.14,.05],'#6a4a2a'));o.push(MP([0,1.24+br,-.04],[.3,.1,.26],'#4aa84a',{g:.2}));o.push(MP([0,1.32+br,-.04],[.2,.1,.18],'#78c860'));o.push(MP([.1,1.4+br,0],[.04,.04,.04],'#ff9ac0'))}return o}
// poisson
function mdFish(t,P){const o=[],bob=Math.sin(t/700)*.025,bl=blinkK(t+P.ph),tl=Math.sin(t/420)*.07;
 o.push(MP([0,.1,0],[.3,.04,.24],'#5a7a9a',{ao:1}));
 for(let i=0;i<5;i++){const u=i/4;o.push(MP([tl*u,.5+bob+u*.1,-.28-u*.22],[.2-u*.08,.26-u*.1,.14-u*.04],P.b,{g:.3}))}
 o.push(MP([tl*1.4,.7+bob,-.78],[.04,.22,.16],P.f,{rot:[0,0,.2+tl],g:.2}));o.push(MP([tl*1.5,.45+bob,-.78],[.04,.2,.14],P.f,{rot:[0,0,-.3+tl]}));
 o.push(MP([0,.6+bob,0],[.34,.44,.38],P.b,{g:.5}));o.push(MP([0,.5+bob,.2],[.22,.28,.18],P.l));o.push(MP([0,1.06+bob,-.06],[.05,.2,.22],P.f,{g:.2,rot:[.3,0,0]}));
 for(const s of[-1,1]){o.push(MP([s*.38,.5+bob,.06],[.07,.15,.12],P.f,{rot:[0,0,s*.4+tl*s],g:.2}));o.push(MP([s*.25,.74+bob,.3],[.09,.09,.05],'#fff',{g:.6}));o.push(MP([s*.25,.74+bob,.34],[.05,.055*bl,.03],'#1a1010',{g:.9}));mdCheek(o,s*.3,.58+bob,.3);
  if(P.moon){o.push(MP([s*.35,.66+bob,.12],[.09,.09,.03],'#ffd84a',{e:1,rot:[0,s*.9,0]}));o.push(MP([s*.37,.68+bob,.14],[.08,.08,.03],P.b,{rot:[0,s*.9,0]}))}}
 o.push(MP([0,.52+bob,.37],[.07,.04,.06],P.f));return o}
// serpent enroulé
function mdCoil(t,P){const o=[],br=Math.sin(t/640)*.012,bl=blinkK(t+P.ph),sw=Math.sin(t/700)*.03;
 for(let r=0;r<3;r++){const R=.4-r*.06,y=.14+r*.17;for(let i=0;i<9;i++){const a=i/9*Math.PI*2+r*.7;o.push(MP([Math.sin(a)*R,y,Math.cos(a)*R*.85],[.15,.12,.15],r%2?P.b2:P.b,{g:.25}));if(Math.cos(a)>.3)o.push(MP([Math.sin(a)*R,y,Math.cos(a)*R*.85+.12],[.055,.055,.04],P.d,{rot:[0,0,.78]}))}}
 for(let i=0;i<4;i++)o.push(MP([Math.sin(t/500+i)*.02,.66+i*.07,0],[.11,.1,.11],P.b,{g:.2}));
 o.push(MP([sw,.98+br,.02],[.3,.24,.26],P.h||P.b,{g:.3}));o.push(MP([sw,.9+br,.2],[.15,.1,.1],P.l));
 for(const s of[-1,1]){mdEye(o,sw+s*.12,1.02+br,.25,.05,bl);mdCheek(o,sw+s*.22,.92+br,.22)}o.push(MP([sw,.88+br,.29],[.045,.014,.02],'#3a2a1a'));
 if(P.crest)for(let i=0;i<5;i++){const a=-.8+i*.4;o.push(MP([sw+Math.sin(a)*.2,1.2+br,Math.cos(a)*.08],[.035,.1+(i==2?.05:0),.03],'#ffd84a',{e:1,rot:[0,0,-a*.4]}))}
 tailChain(o,5,u=>[.38+u*.18,.1,.1-u*.3],P.b2,P.b,.06,.1);return o}
// dragon marin en S
function mdSea(t,P){const o=[],bob=Math.sin(t/700)*.025,bl=blinkK(t+P.ph);
 for(let i=0;i<9;i++){const u=i/8,sw=Math.sin(t/520+u*4)*.04;o.push(MP([Math.sin(u*3.4+.6)*.3*(1-u*.2)+sw,.28+(1-u)*.62+bob*(1-u),Math.cos(u*3.4)*.1-u*.1],[.19-u*.1,.15,.17-u*.09],i%2?P.b:P.b2,{g:.4}));if(i%2==0)o.push(MP([Math.sin(u*3.4+.6)*.3*(1-u*.2)+sw+.12,.3+(1-u)*.62,-u*.1],[.05,.1,.03],P.f,{rot:[0,0,-.5],g:.3}))}
 o.push(MP([0,1.05+bob,.04],[.3,.24,.27],P.b,{g:.5}));o.push(MP([0,.96+bob,.22],[.15,.1,.1],P.l));
 for(const s of[-1,1]){mdEye(o,s*.13,1.09+bob,.27,.05,bl);mdCheek(o,s*.23,.99+bob,.24);o.push(MP([s*.17,1.3+bob,0],[.04,.16,.04],P.f,{rot:[0,0,-s*.5],g:.4}));o.push(MP([s*.36,1.02+bob,.1],[.12,.04,.03],P.f,{rot:[0,0,s*.2],g:.3}));o.push(MP([s*.4+s*.05,.98+bob,.1],[.04,.04,.04],'#fff',{e:1}))}
 o.push(MP([0,.94+bob,.3],[.04,.012,.02],'#1a2a4a'));return o}
// salamandre
function mdSal(t,P){const o=[],br=Math.sin(t/620)*.012,bl=blinkK(t+P.ph),wag=Math.sin(t/430);
 for(const s of[-1,1])for(const z of[.22,-.22]){o.push(MP([s*.27,.1,z],[.11,.1,.13],P.d,{ao:1}));o.push(MP([s*.24,.2,z],[.09,.12,.09],P.b))}
 o.push(MP([0,.34+br,-.02],[.3,.25+br,.46],P.b,{g:.2}));o.push(MP([0,.27+br,.04],[.2,.14,.4],P.l));
 for(const [x,z] of[[-.1,.1],[.12,-.1],[0,-.28],[-.08,-.3]])o.push(MP([x,.55+br,z],[.07,.04,.07],P.sp,{e:1}));
 if(P.spikes)for(let i=0;i<4;i++)o.push(MP([0,.62+br,.2-i*.16],[.05,.1,.06],P.sp,{e:1}));
 o.push(MP([0,.5+br,.38],[.28,.23,.24],P.b,{g:.3}));o.push(MP([0,.44+br,.58],[.15,.1,.1],P.l));
 for(const s of[-1,1]){mdEye(o,s*.13,.56+br,.56,.05,bl);mdCheek(o,s*.24,.46+br,.52)}
 tailChain(o,6,u=>[wag*.07*u,.3+u*.4,-.46-u*.2],P.b,P.d,.1,.12);o.push(MP([wag*.08,.78,-.7],[.12,.15,.1],'#ff8a1c',{e:1}));o.push(MP([wag*.09,.94+Math.sin(t/140)*.03,-.7],[.07,.11,.07],'#ffd24a',{e:1}));return o}
// oiseau générique
function mdBird(t,P){const o=[],br=Math.sin(t/560)*.012,bl=blinkK(t+P.ph*500),fl=Math.sin(t/300+P.ph)*(P.fa||.05);const pg=P.pg;
 for(const s of[-1,1]){o.push(MP([s*.11,.14,.05],[.03,.08,.03],P.fc||'#ffb52e'));o.push(MP([s*.11,.06,.12],[.08,.04,.13],P.fc||'#ffb52e',{ao:1}))}
 if(P.tail)o.push(MP([0,.3,-.24],[.12,.06,.2],P.tail,{rot:[-.5,0,0]}));
 o.push(MP([0,.56+br,0],[.31+(P.bw||0),.42+br,.27],P.b,{g:.3}));o.push(MP([0,.5+br,.17],[.2+(P.bw||0),.3,.14],P.l));
 for(const s of[-1,1]){if(pg){o.push(MP([s*(.36+(P.bw||0)),.52+br,0],[.08,.3,.13],P.w,{rot:[0,0,s*(.15+fl)],g:.2}))}
  else{o.push(MP([s*.5,.7+br,-.04],[.14,.36*(P.ws||1),.05],P.w,{rot:[0,0,s*(.5+fl)],g:.3}));o.push(MP([s*.62,.55+br,-.04],[.1,.28*(P.ws||1),.04],P.w2||P.w,{rot:[0,0,s*(.65+fl)]}))}}
 o.push(MP([0,1.0+br,.02],[.3,.25,.27],P.h||P.b,{g:.3}));o.push(MP([0,.93+br,.2],[.16,.12,.1],P.hl||P.l));o.push(MP([0,.95+br,.3],[.05,.045,.07+(P.bk||0)],P.bc||'#ffb52e',{g:.5}));
 for(const s of[-1,1]){mdEye(o,s*.13,1.03+br,.235,.05,bl);mdCheek(o,s*.22,.92+br,.21);if(P.brow)mdBrow(o,s*.14,1.12+br,.25,-s*.45)}
 if(P.crest)P.crest(o,br,t);return o}
// scarabée
function mdBeetle(t,P){const o=[],br=Math.sin(t/600)*.01,bl=blinkK(t+P.ph*300);
 for(const s of[-1,1])for(let i=0;i<3;i++){const z=-.2+i*.2;o.push(MP([s*.4,.14,z],[.2,.035,.04],P.lg,{rot:[0,0,s*.3],ao:1}));o.push(MP([s*.56,.07,z+.03*(i-1)],[.05,.08,.04],P.lg,{ao:1}))}
 o.push(MP([0,.5+br,-.1],[.45,.34,.5],P.sh,{g:.7}));o.push(MP([0,.62+br,-.12],[.4,.2,.44],P.sh2||P.sh,{g:.9}));o.push(MP([0,.5+br,-.6],[.02,.3,.02],'#1a2a2a'));
 if(P.dots)for(const [x,z] of[[-.2,-.2],[.2,-.2],[-.15,-.4],[.15,-.4],[0,-.05]])o.push(MP([x,.78+br,z],[.06,.03,.06],P.dots,{g:.4}));
 o.push(MP([0,.4+br,.34],[.3,.27,.26],P.hd,{g:.3}));o.push(MP([0,.34+br,.54],[.14,.09,.07],P.hl));
 for(const s of[-1,1]){mdEye(o,s*.12,.47+br,.59,.052,bl);mdCheek(o,s*.22,.36+br,.52);const sw=Math.sin(t/400+s)*.04;o.push(MP([s*.14,.74+br,.38],[.018,.14,.018],P.lg,{rot:[0,0,-s*.4+sw]}));o.push(MP([s*(.24+sw),.88+br,.38],[.05,.05,.05],P.bl||'#bfe8e0',{g:.4}))}
 if(P.horn)o.push(MP([0,.68+br,.45],[.05,.17,.05],P.horn,{rot:[.5,0,0],g:.3}));return o}
// papillon
function mdButter(t,P){const o=[],bob=Math.sin(t/500)*.03,bl=blinkK(t+P.ph*300),fl=.35+Math.sin(t/170)*.18;
 o.push(MP([0,.5+bob,0],[.1,.34,.09],P.b,{g:.3}));
 for(const s of[-1,1]){o.push(MP([s*(.38-fl*.1),.98+bob,-.04],[.3,.32,.045],P.w,{rot:[0,s*fl*.5,s*.3],g:.3}));o.push(MP([s*(.3-fl*.1),.52+bob,-.04],[.2,.24,.04],P.w2,{rot:[0,s*fl*.5,-s*.2],g:.3}));
  o.push(MP([s*(.4-fl*.1),1.0+bob,-.01],[.1,.1,.03],P.sp,{rot:[0,s*fl*.5,0],e:0}));o.push(MP([s*(.3-fl*.1),.5+bob,-.01],[.07,.07,.03],P.sp));
  const sw=Math.sin(t/380+s)*.04;o.push(MP([s*.1,1.32+bob,0],[.016,.14,.016],P.b,{rot:[0,0,-s*.4+sw]}));o.push(MP([s*(.2+sw),1.45+bob,0],[.045,.045,.045],P.sp))}
 o.push(MP([0,.95+bob,.02],[.21,.2,.19],P.b,{g:.4}));
 for(const s of[-1,1]){mdEye(o,s*.08,.98+bob,.17,.04,bl);mdCheek(o,s*.15,.9+bob,.15)}o.push(MP([0,.89+bob,.19],[.03,.01,.015],'#6a2a3a'));return o}
// grenouille large
function mdFrog(t,P){const o=[],br=Math.sin(t/640)*.014,bl=blinkK(t+P.ph*300);
 for(const s of[-1,1]){o.push(MP([s*.3,.07,.2],[.16,.07,.17],P.d,{ao:1}));o.push(MP([s*.38,.2,-.1],[.15,.17,.2],P.b2,{g:.2}))}
 o.push(MP([0,.34+br,0],[.46,.3+br,.38],P.b,{g:.3}));o.push(MP([0,.28+br,.2],[.34,.2,.2],P.l));
 for(const s of[-1,1]){o.push(MP([s*.26,.66+br,.08],[.16,.16*bl+.02,.15],P.rim||'#e8f4ff',{g:.7}));o.push(MP([s*.26,.66+br,.16],[.1,.1*bl+.01,.09],'#fff',{g:.6}));o.push(MP([s*.26,.66+br,.22],[.06,.07*bl,.04],'#1a1010',{g:.9}));mdCheek(o,s*.34,.36+br,.3,'#ff8aa0')}
 o.push(MP([0,.34+br,.38],[.2,.018,.03],'#2a3a5a'));
 if(P.spots)for(const [x,z] of[[-.2,.0],[.2,.0],[0,-.2],[-.3,-.1],[.3,-.1]])o.push(MP([x,.6+br,z],[.07,.04,.07],P.spots,{g:.3}));
 if(P.bub)for(let i=0;i<3;i++){const u=(t/900+i/3)%1;o.push(MP([Math.sin(i*2+t/300)*.1-.3+i*.3,.95+u*.35,.05],[.04,.04,.04],'#e8f6ff',{e:1}))}return o}
// cactus
function mdCactus(t,P){const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+P.ph*300),sw=Math.sin(t/900)*.02;
 for(const s of[-1,1])o.push(MP([s*.15,.07,.08],[.12,.07,.13],'#3a5a2a',{ao:1}));
 o.push(MP([0,.5+br,0],[P.w,P.h+br,.3],'#4aa84a',{g:.2}));
 for(let i=0;i<5;i++)o.push(MP([(i-2)*.08,.48+br,.28],[.012,P.h*.8,.02],'#7ac86a'));for(const [x,y] of[[-.3,.6],[.3,.5],[-.2,.3],[.25,.75]])o.push(MP([x,y+br,.2],[.02,.02,.04],'#fff'));
 for(const s of[-1,1]){mdEye(o,s*.12,.6+br,.3,.05,bl);mdCheek(o,s*.23,.5+br,.27);if(P.brow)mdBrow(o,s*.13,.68+br,.3,-s*.4,'#1a3a1a');
  o.push(MP([s*(P.w+.06),.62+br,0],[.1,.12,.1],'#4aa84a',{g:.2}));if(P.tall){o.push(MP([s*(P.w+.12+sw),.9+br,0],[.09,.2,.09],'#4aa84a'));o.push(MP([s*(P.w+.12+sw),1.12+br,0],[.11,.08,.1],P.fl,{g:.3}))}}
 o.push(MP([0,.43+br,.3],[.05,.016,.02],'#1a3a1a'));
 if(!P.tall){o.push(MP([sw,.5+br+P.h*.95,0],[.12,.07,.11],P.fl,{g:.3}));for(let i=0;i<5;i++){const a=i/5*6.28;o.push(MP([sw+Math.sin(a)*.1,.58+br+P.h*.95,Math.cos(a)*.08],[.06,.05,.06],P.fl,{g:.3}))}}return o}
// ---- espèces ----
MD[38]=t=>mdSun(t,{ph:3,n:12,rr:.52,len:.17,w:.1,r1:'#ffb02e',r2:'#ffd84a',core:'#ffd04a',face:'#ffe888',spin:.3});
MD[43]=t=>mdSun(t,{ph:5,n:14,rr:.54,len:.16,w:.09,r1:'#ff9a2a',r2:'#ffd84a',core:'#ffe27a',face:'#fff4c8',spin:-.4});
MD[39]=t=>{const o=MD[23](t),b=Math.sin(t/800)*.012;o.push(MP([0,.93+b,.02],[.2,.05,.2],'#d6f0ff',{g:1}));o.push(MP([0,.84+b,.2],[.12,.1,.05],'#e6f6ff',{g:1}));return o};
MD[40]=t=>{const o=[],br=Math.sin(t/600)*.012,bl=blinkK(t+800),sw=Math.sin(t/900)*.03;
 for(const s of[-1,1]){o.push(MP([s*.14,.06,.06],[.04,.06,.04],'#8a5a2a'));o.push(MP([s*.15,.2,.04],[.03,.14,.03],'#8a5a2a'))}
 o.push(MP([0,.46+br,0],[.34,.26+br,.3],'#c89850',{g:.25}));o.push(MP([0,.4+br,.2],[.22,.16,.12],'#f0d8a0'));
 for(const s of[-1,1]){mdEye(o,s*.13,.5+br,.28,.055,bl);mdCheek(o,s*.24,.4+br,.25)}o.push(MP([0,.4+br,.31],[.05,.016,.02],'#5a3a1a'));
 for(const [x,h,c] of[[-.2,.5,'#7ac84a'],[0,.62,'#8ad45a'],[.2,.5,'#7ac84a']])o.push(MP([x+sw*(x?1:.5),.88+br+h*.18,0],[.1,h*.5,.1],c,{g:.4}));return o};
MD[41]=t=>mdCloud(t,{ph:2,c:'#7a60a8',c2:'#8a70b8',l:'#b8a4d8'});
MD[82]=t=>mdCloud(t,{ph:6,c:'#8a96aa',c2:'#9aa6ba',l:'#c8d0dc',arms:1});
MD[42]=t=>mdBird(t,{ph:1,b:'#f0ecd8',l:'#fffcf0',w:'#d8a040',w2:'#b8802a',ws:1.1,h:'#f8f4e4',bc:'#f0a020',fa:.05,crest:(o,br)=>{o.push(MP([0,1.22+br,.0],[.12,.14,.1],'#d8a85a',{g:.3}));o.push(MP([0,1.36+br,0],[.06,.1,.06],'#d8a85a'))}});
MD[44]=t=>mdRc(MD[35](t),{'#f0a0b8':'#8fd6d6','#f8c8d8':'#d8f4ff','#d87898':'#5aa8b0'});
MD[45]=t=>{const o=[],bob=Math.sin(t/700)*.03,bl=blinkK(t+1200),sw=Math.sin(t/500)*.03;const cy=.84+bob;
 for(const a of[.6,-.6])o.push(MP([Math.sin(a)*.07,.34+bob,0],[.025,.3,.025],'#8a6a3a',{rot:[0,0,-a*.5]}));
 o.push(MP([0,cy,-.02],[.2,.5,.08],'#ffd84a',{g:.4}));o.push(MP([0,cy,-.02],[.5,.2,.08],'#ffd84a',{g:.4}));o.push(MP([0,cy,0],[.38,.38,.12],'#ffe27a',{rot:[0,0,.785],g:.5}));o.push(MP([0,cy,.04],[.3,.3,.1],'#fff0a0',{rot:[0,0,.785],g:.4}));
 for(const s of[-1,1]){mdEye(o,s*.1,cy+.04,.15,.04,bl);mdCheek(o,s*.19,cy-.04,.13)}o.push(MP([0,cy-.08,.16],[.045,.014,.02],'#8a4a2a'));
 o.push(MP([.04+sw,.32+bob,0],[.03,.12,.02],'#c89a50',{rot:[0,0,.5]}));return o};
MD[46]=t=>{const o=[],br=Math.sin(t/700)*.01,bl=blinkK(t+700),w=Math.sin(t/800)*.03;
 for(const s of[-1,1])o.push(MP([s*.2,.07,.1],[.14,.07,.15],'#4a2a6a',{ao:1}));
 o.push(MP([0,.36+br,0],[.4,.25+br,.34],'#7a4aa8',{g:.3}));
 for(let i=0;i<7;i++){const a=-1.25+i*.42,L=.28+(i==3?.08:0);o.push(MP([Math.sin(a)*.3,.62+br+Math.cos(a)*.2,-.06],[.12,L,.05],i%2?'#e8a8e8':'#d890d8',{rot:[0,0,-a+w*(i-3)*.2],g:.5}))}
 o.push(MP([0,.4+br,.3],[.26,.16,.1],'#b88ad8'));for(const s of[-1,1]){mdEye(o,s*.14,.44+br,.32,.055,bl);mdCheek(o,s*.27,.34+br,.29)}o.push(MP([0,.34+br,.38],[.05,.016,.02],'#3a1a5a'));return o};
MD[47]=t=>{const o=[],br=Math.sin(t/700)*.014,bl=blinkK(t+300),fk=Math.sin(t/200)*.01;
 o.push(MP([0,.14,0],[.3,.07,.26],'#e8902a',{ao:1}));o.push(MP([0,.45+br,0],[.4,.36+br,.34],'#ffc83a',{g:.4}));o.push(MP([0,.42+br,.18],[.28,.27,.18],'#ffe27a'));
 o.push(MP([0,.86+br,0],[.28,.36,.24],'#ffc83a',{g:.4}));o.push(MP([0,1.1+br,0],[.14,.18,.12],'#ffb52e'));o.push(MP([0,1.24+br,0],[.17,.06,.14],'#b8803a',{g:.3}));o.push(MP([0,1.32+br,0],[.1,.07,.09],'#8a5a2a'));o.push(MP([fk,1.4+br,0],[.04,.05,.04],'#ffe27a',{e:1}));
 for(const s of[-1,1]){mdEye(o,s*.14,.5+br,.31,.052,bl);mdCheek(o,s*.25,.4+br,.27)}o.push(MP([0,.37+br,.335],[.05,.014,.02],'#8a3a1a'));return o};
MD[48]=t=>{const o=[],br=Math.sin(t/800)*.01,bl=blinkK(t+1500),op=Math.sin(t/1400)*.05;
 o.push(MP([0,.3,0],[.5,.22,.4],'#3a5a8a',{g:.4}));o.push(MP([0,.2,.02],[.5,.1,.42],'#2a4268',{ao:1}));
 for(const s of[-1,1]){mdEye(o,s*.17,.36,.37,.055,bl);mdCheek(o,s*.3,.27,.33)}o.push(MP([0,.27,.4],[.07,.03,.025],'#1a2a4a'));
 o.push(MP([0,.72+op,-.2],[.5,.34,.16],'#eaeaf4',{rot:[-1.05-op,0,0],g:.5}));for(let i=0;i<5;i++)o.push(MP([(i-2)*.16,.8+op,-.1],[.03,.3,.02],'#c8c8da',{rot:[-1.05-op,0,(i-2)*.12]}));
 o.push(MP([0,.5,.0],[.14,.14,.14],'#fff0f6',{g:1,e:0}));return o};
MD[49]=t=>mdOrb(t,{ph:1,c:'#2e2060',rim:'#c8b8f0',patch:'#ffe8f4',hi:'#8a78d8'});
MD[50]=t=>mdOrb(t,{ph:2,c:'#4a78e8',rim:'#8a98c8',patch:'#fff',hi:'#a8c4ff',sp:[[.3,.25,.3],[-.32,.0,.3],[.2,-.3,.3]]});
MD[51]=t=>mdCrt(t,{ph:4,B:'#a8764a',D:'#7a5030',L:'#e0c098',ears:'rd',ec:'#a8764a',ei:'#e0c098',tail:'chain',t1:'#7a5030',t2:'#a8764a',tr0:.1,tr1:.14,nc:'#2a1a10',extra:(o,e)=>{for(const s of[-1,1])for(const k of[-1,1])o.push(MP([s*(.34+(.08)),e.hy-.1+k*.03,.28],[.1,.012,.012],'#fff',{rot:[0,0,s*k*.2]}))}});
MD[52]=t=>mdCrt(t,{ph:4,B:'#a8764a',D:'#7a5030',L:'#e0c098',ears:'rd',ec:'#a8764a',ei:'#e0c098',tail:'chain',t1:'#7a5030',t2:'#a8764a',tr0:.1,tr1:.14,nc:'#2a1a10',bs:1.08,extra:(o,e)=>{for(const s of[-1,1])for(const k of[-1,1])o.push(MP([s*(.42),e.hy-.1+k*.03,.28],[.1,.012,.012],'#fff',{rot:[0,0,s*k*.2]}));o.push(MP([0,.65+e.br,.1],[.3,.07,.22],'#5ab0e0',{g:.3}));o.push(MP([0,.6+e.br,.3],[.06,.06,.03],'#d8f4ff',{e:1}))}});
MD[53]=t=>mdJelly(t,{ph:3,t:'#a8d4f4',d:'#b8dcf8',dl:'#e0f2ff'});
MD[54]=t=>mdJelly(t,{ph:5,t:'#5aa0e0',d:'#8a70d0',dl:'#a898e8',cap:1,spots:1});
MD[55]=t=>mdTurtle(t,{ph:1,g:'#6ac050',gl:'#8ad870',sh:'#8a6a4a',rim:'#5a4228',moss:'#78b858'});
MD[56]=t=>mdTurtle(t,{ph:2,g:'#5aa848',gl:'#7ac860',sh:'#7a5a3a',rim:'#4a3220',moss:'#6aa84a',tree:1});
MD[57]=t=>mdFish(t,{ph:1,b:'#d8e0ea',l:'#f4f8fc',f:'#f0b84a',moon:1});
MD[58]=t=>mdFish(t,{ph:3,b:'#e8ecf0',l:'#fffcf4',f:'#f0b030',moon:1});
MD[59]=t=>mdSea(t,{ph:2,b:'#2a6ac8',b2:'#3a82e0',l:'#a8d4f4',f:'#6ac8e8'});
MD[60]=t=>mdSal(t,{ph:1,b:'#f0902a',d:'#c8681a',l:'#ffd898',sp:'#ffe27a'});
MD[61]=t=>mdSal(t,{ph:3,b:'#e8682a',d:'#b8481a',l:'#ffc888',sp:'#ffd84a',spikes:1});
MD[62]=t=>mdCrt(t,{ph:2,B:'#e04a2a',D:'#a8301a',L:'#ffc8a0',ears:'none',brow:.45,tail:'chain',t1:'#a8301a',t2:'#d04020',tr0:.1,tr1:.13,bs:1.1,hs:1.08,extra:(o,e)=>{for(const s of[-1,1]){o.push(MP([s*.24,e.hy+.3,0],[.05,.17,.05],'#f8e8c0',{rot:[0,0,-s*.4],g:.3}));o.push(MP([s*.44,.78+e.br,-.12],[.1,.38,.04],'#f0c040',{rot:[0,0,s*(.5+Math.sin(e.t/300)*.05)],g:.3,e:1}));o.push(MP([s*.55,.6+e.br,-.12],[.08,.26,.04],'#d8a030',{rot:[0,0,s*.65]}))}}});
MD[63]=t=>mdBird(t,{ph:2,b:'#9aa0b0',l:'#d8dce6',w:'#8a90a0',ws:.7,h:'#a0a6b6',bc:'#ff9a2a',fa:.04,crest:(o,br,t)=>{for(let i=0;i<5;i++){const a=-.8+i*.4;o.push(MP([Math.sin(a)*.16,1.24+br+Math.sin(t/180+i)*.015,0],[.05,.13+(i==2?.05:0),.04],i%2?'#ff9a4a':'#ffc860',{e:1,rot:[0,0,-a*.4]}))}o.push(MP([0,.55+br,.3],[.08,.08,.03],'#ff8a2a',{e:1}))}});
MD[64]=t=>mdBird(t,{ph:4,b:'#e04a2a',l:'#ffb070',w:'#f0c040',w2:'#d8a030',ws:1.25,h:'#e85a30',bc:'#ffd84a',fa:.07,brow:1,tail:'#f0c040',crest:(o,br,t)=>{o.push(MP([0,1.28+br,0],[.1,.12,.08],'#ffd84a',{e:1}));for(const s of[-1,1])o.push(MP([s*.14,1.24+br,0],[.05,.13,.04],'#f0c040',{e:1,rot:[0,0,-s*.5]}))}});
MD[65]=t=>mdCrt(t,{ph:3,B:'#2a2a30',D:'#1a1a20',L:'#4a4a54',ears:'pt',ec:'#d84a2a',ei:'#ffb070',eyeC:'#ffd84a',tail:'chain',t1:'#1a1a20',t2:'#2a2a30',extra:(o,e)=>{o.push(MP([0,.4+e.br,.26],[.08,.08,.03],'#ff7a1c',{e:1}));o.push(MP([.46,.8+Math.sin(e.t/200)*.02,-.36],[.09,.13,.08],'#ff8a1c',{e:1}))}});
MD[66]=t=>mdCrt(t,{ph:5,B:'#2a2a30',D:'#1a1a20',L:'#4a4a54',ears:'none',eyeC:'#ffd84a',bs:1.12,hs:1.05,brow:.4,brc:'#ff8a1c',tail:'chain',t1:'#1a1a20',t2:'#2a2a30',extra:(o,e)=>{o.push(MP([0,.4+e.br,.26],[.1,.1,.03],'#ff7a1c',{e:1}));for(const s of[-1,1]){o.push(MP([s*.24,e.hy+.31,0],[.06,.2,.05],'#d84a2a',{rot:[0,0,-s*.5],g:.3}));o.push(MP([s*.4,e.hy+.5,0],[.045,.05,.04],'#ffd84a',{e:1}));o.push(MP([s*.34,.42+e.br,.1],[.1,.1,.1],'#3a3a44'))}}});
MD[67]=t=>{const o=[],br=Math.sin(t/650)*.012,bl=blinkK(t+500),lf=Math.sin(t/700)*.06;
 for(const s of[-1,1]){o.push(MP([s*.12,.07,.09],[.1,.07,.13],'#5a3a7a',{ao:1}));o.push(MP([s*.12,.18,.05],[.07,.1,.07],'#7a5a9a'))}
 o.push(MP([0,.4+br,0],[.22,.26+br,.2],'#7aba5a',{g:.2}));o.push(MP([0,.38+br,.12],[.14,.18,.1],'#c8e890'));
 o.push(MP([0,.88+br,0],[.3,.3,.27],'#ffb8d0',{g:.4}));o.push(MP([0,1.14+br,0],[.17,.2,.15],'#ffb8d0',{g:.4}));o.push(MP([0,1.3+br,0],[.08,.12,.07],'#f890b8',{g:.4}));
 for(const s of[-1,1]){mdEye(o,s*.12,.9+br,.25,.05,bl);mdCheek(o,s*.22,.8+br,.22);o.push(MP([s*.38,.92+br,0],[.2,.09,.04],'#6ac850',{rot:[0,0,s*(.5+lf)],g:.3}));o.push(MP([s*.3,.46+br,.06],[.08,.05,.04],'#7aba5a',{rot:[0,0,s*.6]}))}o.push(MP([0,.76+br,.27],[.05,.014,.02],'#8a3a5a'));return o};
MD[68]=t=>{const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+1300);
 for(const s of[-1,1]){o.push(MP([s*.14,.07,.09],[.11,.07,.13],'#5a3a7a',{ao:1}));o.push(MP([s*.14,.18,.05],[.08,.11,.08],'#6ab850'))}
 o.push(MP([0,.42+br,-.02],[.2,.3+br,.17],'#6ab850',{g:.2}));
 for(const s of[-1,1])o.push(MP([s*.38,.5+br+Math.sin(t/600+s)*.02,0],[.24,.07,.05],'#5aa840',{rot:[0,0,s*(.7+Math.sin(t/700)*.05)],g:.3}));
 for(let i=0;i<9;i++){const th=i/9*Math.PI*2,sw=Math.sin(t/600+i)*.02;o.push(MP([Math.sin(th)*.46,.98+br+Math.cos(th)*.46,-.05-(i%2)*.02],[.22,.22,.07],i%2?'#f8b0d0':'#fcc8e0',{rot:[0,0,-th+sw],g:.3}))}
 o.push(MP([0,.98+br,-.04],[.4,.4,.1],'#f090b8'));o.push(MP([0,.98+br,.04],[.32,.32,.12],'#ffe8a8',{g:.35}));
 for(const s of[-1,1]){mdEye(o,s*.1,1.0+br,.15,.04,bl);mdCheek(o,s*.19,.9+br,.13)}o.push(MP([0,.9+br,.165],[.05,.016,.02],'#8a4a2a'));return o};
MD[69]=t=>{const o=[],br=Math.sin(t/700)*.012,bl=blinkK(t+1900),sw=Math.sin(t/900)*.02;
 for(const s of[-1,1])o.push(MP([s*.14,.07,.1],[.11,.07,.14],'#3a6a3a',{ao:1}));
 o.push(MP([0,.4+br,0],[.4,.36+br,.32],'#5aa860',{g:.2}));o.push(MP([0,.24,.1],[.36,.1,.24],'#e8b8d0',{g:.2}));o.push(MP([0,.4+br,.2],[.2,.24,.14],'#f4e8c8'));
 for(const s of[-1,1])o.push(MP([s*.32,.46+br,.04],[.07,.14,.07],'#5aa860',{rot:[0,0,s*.4]}));
 o.push(MP([0,.92+br,0],[.38,.34,.33],'#7cc474',{g:.3}));o.push(MP([0,.88+br,.16],[.27,.24,.18],'#d8f0c0'));
 for(const s of[-1,1]){mdEye(o,s*.12,.9+br,.3,.055,bl);mdCheek(o,s*.22,.8+br,.27)}o.push(MP([0,.78+br,.33],[.05,.016,.02],'#4a2a2a'));
 for(let i=0;i<5;i++){const a=-.9+i*.45;o.push(MP([Math.sin(a)*.26+sw,1.12+br+Math.cos(a)*.1,Math.cos(a)*.1],[.09,.09,.06],'#fcd0e4',{g:.3}))}o.push(MP([sw,1.16+br,.1],[.07,.07,.05],'#ffe8a8'));return o};
// ---- lot 7 : espèces 70-99 ----
MD[70]=t=>mdCrt(t,{ph:1,B:'#f0f0ec',D:'#c8c8c0',L:'#fff',ears:'lg',ec:'#f0f0ec',ei:'#bfe8a0',tail:'puff',t1:'#fff',nc:'#e08aa0',extra:(o,e)=>{for(const s of[-1,1])o.push(MP([s*.13*e.hs,e.hy+.66*e.hs,0],[.05,.07,.04],'#7ac860',{rot:[0,0,-s*.2],g:.2}))}});
MD[71]=t=>mdCrt(t,{ph:3,B:'#d8cdb0',D:'#a89878',L:'#f4ecd4',ears:'lg',ec:'#d8cdb0',ei:'#f0c8a0',tail:'puff',t1:'#fff',nc:'#8a5a3a',extra:(o,e)=>{const x=.18*e.hs,y=e.hy+.52*e.hs;for(let i=0;i<8;i++){const a=i/8*6.28;o.push(MP([x+Math.sin(a)*.09,y+Math.cos(a)*.09,.04],[.045,.05,.03],'#ffd84a',{rot:[0,0,-a],g:.3,e:1}))}o.push(MP([x,y,.05],[.05,.05,.04],'#8a5a2a'))}});
MD[72]=t=>mdCactus(t,{ph:1,w:.38,h:.4,fl:'#ff9ac0'});
MD[73]=t=>mdCactus(t,{ph:2,w:.34,h:.5,fl:'#ffd84a',tall:1,brow:1});
MD[74]=t=>mdCrt(t,{ph:2,B:'#8a82b0',D:'#5a5280',L:'#cfc8e4',ears:'pt',ec:'#8a82b0',ei:'#ffb0d0',tail:'chain',t1:'#5a5280',t2:'#8a82b0',nc:'#ff8fb0',extra:(o,e)=>{o.push(MP([0,e.hy+.17,.29],[.06,.06,.03],'#ffe27a',{e:1}));o.push(MP([.03,e.hy+.18,.31],[.055,.055,.03],'#8a82b0'));for(const s of[-1,1])for(const k of[-1,1])o.push(MP([s*.4,e.hy-.1+k*.03,.26],[.12,.012,.012],'#fff',{rot:[0,0,s*k*.15]}))}});
MD[75]=t=>mdCrt(t,{ph:4,B:'#2e2a50',D:'#1a1838',L:'#4a4670',ears:'pt',ec:'#2e2a50',ei:'#8a70c8',eyeC:'#ffd84a',brow:.35,brc:'#ffd84a',bs:1.08,tail:'chain',t1:'#1a1838',t2:'#2e2a50',nc:'#8a70c8',extra:(o,e)=>{o.push(MP([0,e.hy+.17,.29],[.06,.06,.03],'#ffe27a',{e:1}));o.push(MP([.03,e.hy+.18,.31],[.055,.055,.03],'#2e2a50'));o.push(MP([.5+e.wag*.05,.84,-.36],[.1,.1,.1],'#ffd84a',{e:1}))}});
MD[76]=t=>mdCrt(t,{ph:2,B:'#9a6a3e',D:'#6a4424',L:'#e0c090',ears:'rd',ec:'#9a6a3e',ei:'#e0c090',tail:'puff',t1:'#9a6a3e',nc:'#2a1a10',bs:1.05});
MD[77]=t=>mdCrt(t,{ph:4,B:'#9a6a3e',D:'#6a4424',L:'#e0c090',ears:'rd',ec:'#9a6a3e',ei:'#e0c090',tail:'puff',t1:'#9a6a3e',nc:'#2a1a10',bs:1.15,hs:1.08,brow:.25,extra:(o,e)=>{for(let i=0;i<3;i++)o.push(MP([0,.3+i*.1+e.br,.2],[.28,.03,.1],'#9aa4b4',{g:.5}));for(const s of[-1,1]){o.push(MP([s*.4,.4+e.br,.12],[.13,.13,.12],'#aab4c4',{g:.6}));o.push(MP([s*.36,e.hy+.22,.1],[.04,.1,.03],'#c8d0dc',{rot:[0,0,s*.3]}))}o.push(MP([0,e.hy+.22,.2],[.1,.06,.04],'#aab4c4',{g:.6}))}});
MD[78]=t=>mdCrt(t,{ph:2,B:'#c88a54',D:'#8a5a30',L:'#f0d8b4',ears:'dr',ec:'#c88a54',ei:'#f0c8a8',tail:'puff',t1:'#fff',nc:'#3a2010',extra:(o,e)=>{for(const s of[-1,1]){o.push(MP([s*.14,e.hy+.38,0],[.025,.1,.025],'#d8c090',{rot:[0,0,-s*.2]}));o.push(MP([s*.17,e.hy+.5,0],[.022,.06,.022],'#d8c090',{rot:[0,0,s*.4]}))}for(const [x,y] of[[-.1,.45],[.12,.5],[-.14,.34],[.16,.36]])o.push(MP([x,y+e.br,.18],[.035,.035,.02],'#fff0dc'))}});
MD[79]=t=>mdCrt(t,{ph:4,B:'#b87a44',D:'#7a4a24',L:'#f0d8b4',ears:'dr',ec:'#b87a44',ei:'#f0c8a8',tail:'puff',t1:'#fff',nc:'#3a2010',bs:1.08,extra:(o,e)=>{for(const s of[-1,1]){o.push(MP([s*.16,e.hy+.4,0],[.03,.14,.03],'#f0c040',{rot:[0,0,-s*.25],g:.4,e:1}));o.push(MP([s*.3,e.hy+.6,0],[.025,.1,.025],'#f0c040',{rot:[0,0,s*.45],e:1}));o.push(MP([s*.22,e.hy+.66,0],[.022,.07,.022],'#f0c040',{rot:[0,0,-s*.3],e:1}));o.push(MP([s*.4,e.hy+.68,0],[.022,.07,.022],'#f0c040',{rot:[0,0,s*.3],e:1}))}}});
const mdSpikes=(o,e,col,n,y0)=>{for(let i=0;i<n;i++){const a=-1.5+i*3/(n-1),u=Math.abs(a);o.push(MP([Math.sin(a)*.38,y0+Math.cos(a)*.3,-.12-u*.04],[.04,.17,.04],col,{rot:[0,0,-a*.9],g:.3}));o.push(MP([Math.sin(a)*.3,y0+.14+Math.cos(a)*.35,-.2],[.04,.17,.04],col,{rot:[-.2,0,-a*.7]}))}};
MD[80]=t=>mdCrt(t,{ph:3,B:'#d8c09a',D:'#8a6a4a',L:'#f0e0c0',H:'#d8c09a',ears:'rd',ec:'#8a6a4a',ei:'#d8c09a',nc:'#3a2010',extra:(o,e)=>{mdSpikes(o,e,'#8a7258',9,.68)}});
MD[81]=t=>mdCrt(t,{ph:5,B:'#c8b490',D:'#7a6a5a',L:'#f0e0c0',H:'#c8b490',ears:'rd',ec:'#7a6a5a',ei:'#c8b490',nc:'#3a2010',bs:1.1,extra:(o,e)=>{mdSpikes(o,e,'#9aa6b8',11,.7);o.push(MP([0,e.hy+.17,.1],[.3,.06,.2],'#aab4c4',{g:.6}))}});
MD[83]=t=>mdBird(t,{ph:2,b:'#6ac0f0',l:'#dff2ff',w:'#4aa8e0',w2:'#ffd84a',ws:.8,h:'#74c8f4',fa:.07,crest:(o,br)=>{o.push(MP([0,1.24+br,0],[.06,.12,.05],'#ffe27a',{e:1}));o.push(MP([-.08,1.2+br,0],[.04,.1,.04],'#ffe27a',{rot:[0,0,.5],e:1}));o.push(MP([.08,1.2+br,0],[.04,.1,.04],'#ffe27a',{rot:[0,0,-.5],e:1}))}});
MD[84]=t=>mdBird(t,{ph:3,b:'#5a74a8',l:'#d0d8e8',w:'#3a4e80',w2:'#e8c040',ws:.9,h:'#6a84b8',bc:'#f0c040',brow:1,fa:.04,crest:(o,br)=>{o.push(MP([0,1.26+br,-.02],[.09,.12,.08],'#3a4e80',{rot:[.3,0,0]}))}});
MD[85]=t=>mdBird(t,{ph:4,b:'#5a74b8',l:'#d8e0f0',w:'#e8c040',w2:'#c8a030',ws:1.3,bw:.04,h:'#6a84c8',bc:'#f0c040',brow:1,fa:.06,crest:(o,br)=>{for(const s of[-1,1])o.push(MP([s*.1,1.26+br,0],[.04,.16,.04],'#f4f4ff',{rot:[0,0,-s*.4],e:1}));o.push(MP([0,1.28+br,0],[.05,.18,.04],'#f4f4ff',{e:1}))}});
MD[88]=t=>mdBird(t,{ph:1,b:'#f4f4f8',l:'#fff',w:'#9aa8c0',w2:'#7a88a0',ws:.9,h:'#fafafc',bc:'#ff9a2a',fa:.06});
MD[89]=t=>mdBird(t,{ph:2,b:'#f4f4f8',l:'#fff',w:'#5a88c8',w2:'#3a68a8',ws:1.4,h:'#fafafc',bc:'#ff9a2a',bk:.04,fa:.07});
MD[90]=t=>mdBird(t,{ph:3,pg:1,b:'#5a8ad0',l:'#d8e8f8',w:'#3a6ab0',h:'#6a98dc',bc:'#ffb52e',fc:'#ffb52e',fa:.08,crest:(o,br)=>{o.push(MP([0,1.24+br,.02],[.05,.1,.04],'#ffe27a',{e:1}));o.push(MP([-.06,1.21+br,.02],[.035,.08,.035],'#ffe27a',{rot:[0,0,.5],e:1}))}});
MD[91]=t=>mdBird(t,{ph:4,pg:1,b:'#4a4e68',l:'#c8ccd8',w:'#2a2e48',h:'#5a5e78',bc:'#ffb52e',fc:'#ffb52e',fa:.08,bw:.03,crest:(o,br)=>{o.push(MP([0,.76+br,.14],[.2,.05,.14],'#ffd84a',{g:.4}));o.push(MP([0,.7+br,.22],[.05,.05,.03],'#4af0e0',{e:1}))}});
MD[86]=t=>mdButter(t,{ph:1,b:'#ffb8d0',w:'#ffd84a',w2:'#ffe27a',sp:'#fff6c8'});
MD[87]=t=>mdButter(t,{ph:3,b:'#f8c8e4',w:'#9a78d8',w2:'#b898e8',sp:'#ffe8ff'});
MD[92]=t=>mdBeetle(t,{ph:1,sh:'#3aa890',sh2:'#4abca4',hd:'#4abca4',hl:'#9ae0d0',lg:'#2a4a4a',dots:'#9ae8d8'});
MD[93]=t=>mdBeetle(t,{ph:3,sh:'#e0a830',sh2:'#f0c050',hd:'#f0c050',hl:'#fff0a0',lg:'#6a3a1a',dots:'#a86a2a',horn:'#f0d8a0',bl:'#ffe27a'});
MD[94]=t=>mdFrog(t,{ph:1,b:'#4a94e8',b2:'#3a78c8',d:'#2a5aa0',l:'#a8d4f8',rim:'#e0f0ff'});
MD[95]=t=>mdFrog(t,{ph:3,b:'#d8a838',b2:'#b88828',d:'#8a6a20',l:'#f0d890',rim:'#e8f4ff',spots:'#4a8ad8',bub:1});
MD[96]=t=>mdCoil(t,{ph:1,b:'#6ac850',b2:'#58b040',d:'#3a8a30',l:'#b8e890'});
MD[97]=t=>mdCoil(t,{ph:3,b:'#3a8a58',b2:'#2e7048',d:'#f0c040',l:'#a8d8a0',h:'#4a9a68',crest:1});
MD[98]=t=>mdRc(MD[9](t),{'#e8552a':'#e8b440','#b8401e':'#c08a28','#ffd8a8':'#fff0c8','#c8421e':'#d89a28','#ffb02e':'#ffd84a','#ff7a1c':'#ff9a2a','#8a4a22':'#a86a20','#a85c2c':'#c88428','#6a2a1a':'#8a5a20'});
MD[99]=t=>{const o=[],bob=Math.sin(t/800)*.03,bl=blinkK(t+900),gl=.7+Math.sin(t/250)*.3;const NV='#1c2a48',CY='#4af0e8';
 for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,r=.52;o.push(MP([Math.sin(a)*r,.66+bob+Math.cos(a)*r*.9,-.06],[.045,.17,.04],CY,{rot:[0,0,-a],e:1}))}
 o.push(MP([0,.66+bob,0],[.5,.46,.44],NV,{g:.6}));o.push(MP([-.15,.84+bob,.3],[.14,.08,.06],'#4a6a9a',{g:1}));
 o.push(MP([0,1.02+bob,.1],[.025,.18,.025],'#2a4068',{rot:[.5,0,0]}));o.push(MP([0,1.2+bob,.2],[.07,.07,.07],CY,{e:1}));
 for(const s of[-1,1]){o.push(MP([s*.16,.76+bob,.38],[.08,.07*bl,.04],CY,{e:1}));mdBrow(o,s*.16,.86+bob,.4,-s*.5,CY)}
 o.push(MP([0,.5+bob,.4],[.24,.1,.05],'#0a1020'));for(let i=0;i<6;i++)o.push(MP([(i-2.5)*.08,.55+bob,.43],[.025,.05,.02],'#f4f8ff',{rot:[0,0,(i%2?.2:-.2)]}));
 for(const s of[-1,1])o.push(MP([s*.5,.5+bob,.04],[.12,.1,.1],'#2a4068',{g:.5}));return o};
// pose / animation de rendu pour une espèce
function mdFor(spec,key,t,yaw,pitch,o){const f=MD[spec];if(!f)return null;V3.mdt=V3.mdt||{};const q=V3.mdt[key];if(q&&q.sp===spec&&q.r===((o&&o.R)||88)&&t-q.t<40&&t>=q.t&&V3.mdc[key])return V3.mdc[key];V3.mdt[key]={sp:spec,t,r:(o&&o.R)||88};return mdRender(f(t),key,(o&&o.R)||88,yaw,pitch,Object.assign({t},o||{}))}
