// Cinématiques, interruptions, intro en 3D, boucle d'affichage
// ---------- CINÉMATIQUES : moteur (caméra + acteurs + bandes noires + titre) ----------
const csNrm=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a},csTurn=(a,b,k)=>a+csNrm(b-a)*k,csEase=k=>{k=Math.max(0,Math.min(1,k));return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2},csLerp=(a,b,k)=>a+(b-a)*k;
function csPath(pts,e){if(e<=pts[0][0])return{x:pts[0][1],y:pts[0][2],mv:0};for(let i=1;i<pts.length;i++){if(e<=pts[i][0]){const k=(e-pts[i-1][0])/Math.max(1,pts[i][0]-pts[i-1][0]),a=pts[i-1],b=pts[i];return{x:csLerp(a[1],b[1],k),y:csLerp(a[2],b[2],k),mv:(Math.abs(b[1]-a[1])+Math.abs(b[2]-a[2]))>.01?1:0}}}const q=pts[pts.length-1];return{x:q[1],y:q[2],mv:0}}
function csBars(on){const w=$('w');if(!w)return;let b=w.querySelector('#csb');
 if(on&&!b){b=document.createElement('div');b.id='csb';b.style.cssText='position:absolute;inset:0;z-index:68;pointer-events:none';
  for(const p of['top','bottom']){const d=document.createElement('div');d.style.cssText=`position:absolute;left:0;right:0;${p}:0;height:0;background:#000;transition:height .45s ease`;b.append(d)}w.append(b);void b.offsetWidth;b.children[0].style.height='10%';b.children[1].style.height='10%'}
 else if(!on&&b){b.children[0].style.height='0';b.children[1].style.height='0';setTimeout(()=>b.remove(),520)}}
function csTitle(l1,l2,col){const w=$('w');if(!w)return;const d=document.createElement('div');d.style.cssText='position:absolute;left:0;right:0;bottom:15%;z-index:69;pointer-events:none;overflow:hidden';
 const i=document.createElement('div');i.style.cssText=`margin:0 6%;padding:8px 14px 9px;background:linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.55) 80%,rgba(0,0,0,0));border-left:5px solid ${col||'#e63946'};color:#fff;font-family:'Press Start 2P',monospace`;
 const a=document.createElement('div');a.textContent=l1;a.style.cssText='font-size:15px;text-shadow:2px 2px 0 #000;letter-spacing:1px';const b=document.createElement('div');b.textContent=l2||'';b.style.cssText=`font-size:8px;margin-top:6px;color:${col||'#ffb0b0'};letter-spacing:2px`;i.append(a,b);d.append(i);w.append(d);
 try{i.animate([{transform:'translateX(-110%)',opacity:0},{transform:'none',opacity:1,offset:.2},{transform:'none',opacity:1,offset:.85},{transform:'translateX(30%)',opacity:0}],{duration:2300,easing:'cubic-bezier(.2,.8,.2,1)'})}catch(e){}setTimeout(()=>d.remove(),2400)}
function csPlay(o){return new Promise(res=>{if(!S.v3||!document.body.animate||!$('w')){res();return}busy=true;csBars(o.bars!==false);const w=$('w'),sk=()=>{if(V3.cs&&V3.cs.s!=null&&performance.now()-V3.cs.s>600)V3.cs.skip=1};w.addEventListener('pointerdown',sk);
  V3.cs=Object.assign({s:null,res},o,{rm:()=>w.removeEventListener('pointerdown',sk)});setTimeout(()=>{if(V3.cs&&V3.cs.res===res){V3.cs.skip=1}},(o.dur||4000)+3000)})}
function csStep(t){const c=V3.cs;if(!c)return null;if(c.s==null){c.s=t;try{c.start&&c.start()}catch(e){}}const e=t-c.s;
 if(e>=c.dur||c.skip){V3.cs=null;c.rm&&c.rm();csBars(0);try{c.end&&c.end()}catch(er){}busy=false;setTimeout(c.res,60);return null}
 try{return c.cam?c.cam(e):null}catch(er){return null}}
function csSprites(L,px,py,t){const c=V3.cs;if(!c||!c.actors||c.s==null)return;const e=t-c.s;for(const a of c.actors){const r=a.f(e);if(!r||r.hide)continue;addHum(L,a.lk,'cs'+a.id,t,px,py,r.x,r.y,r.q||'',r.A||{},{x:r.x,y:r.y,c:lookC('rival',0),h:1.2,lift:0,nz:0})}}
// ---------- scène du labo : Noa débarque et prend son partenaire sous nos yeux ----------
function labNoa(i,cb){if(!S.v3||!maps[G.map]||maps[G.map].k!='lab'||!document.body.animate){cb();return}
 const ns=(i+1)%3,SH={0:[6.5,3.5],2:[8.5,3.5],1:[5.3,3.75]}[ns],tx=SH[0],ty=4.78,a0=V3.a,S0=Math.PI/2,N0=-Math.PI/2,px0=rx+.5,py0=ry+.74;
 const lk=LK3.rival,np=e=>csPath([[0,7.5,9.9],[350,7.5,9.9],[1000,8.7,8.3],[1750,tx,5.9],[2050,tx,ty]],e);
 const lab={mine:i,noa:ns,f:e=>{if(e<2250)return{x:SH[0],y:SH[1],lf:0,sc:1};const k=Math.min(1,(e-2250)/800),q=csEase(k);if(e>3100)return null;return{x:SH[0],y:csLerp(SH[1],ty-.55,q),lf:q*.5,sc:1-Math.max(0,(e-2900)/200)*.9}}};
 return csPlay({dur:4800,lab,cam:e=>{let a,k=0;const bx=4.3,by=8.0,aim=ee=>{const q=np(Math.max(400,ee));return Math.atan2(q.y-by,q.x-bx)},aT=Math.atan2(4.3-by,tx-bx);if(e<500)a=csTurn(a0,aim(500),csEase(e/500));else if(e<2300)a=aim(e);else if(e<2700)a=csTurn(aim(2300),aT,csEase((e-2300)/400));else if(e<3800)a=aT;else a=csTurn(aT,a0,csEase((e-3800)/900));if(e<600)k=csEase(e/600);else if(e<3800)k=1;else k=1-csEase((e-3800)/900);return{a,x:csLerp(px0,4.3,k),y:csLerp(py0,8.0,k)}},
  actors:[{id:'noa',lk,f:e=>{if(e<350)return{hide:1};const p=np(e);let A={},q='';
    if(e<2050){A={w:1.25,ph:e/78,lift:Math.abs(Math.sin(e/78))*.035,yaw:.2}}
    else if(e<3300){A={pt:e>2150&&e<3000?1:0,yaw:Math.PI*.93+Math.sin(e/300)*.03,sd:4};if(e>2060&&e<2400)q='!!'}
    else if(e<4100){const k=csEase((e-3300)/500);A={yaw:Math.PI*.93*(1-k),jump:e>3700?Math.abs(Math.sin((e-3700)/220*Math.PI))*.06:0,wave:e>3750?1:0,sd:4}}
    else A={wave:1,yaw:Math.sin(e/500)*.1,sd:4};return{x:p.x,y:p.y,A,q}}}],
  start:()=>{try{sfx(300,.12);setTimeout(()=>sfx(260,.12),160)}catch(e){}},end:()=>{V3.a=a0}}).then(cb)}
// ---------- cinématique de boss ----------
const BOSS_SUB={'Lieutenant Corbin':['Team Vesper','#e0b030'],'Commandant Vesper':['Chef de la Team Vesper','#e63946'],'Maître Éclipse':["Maître de l'Ombre",'#b070ff'],'Aurion':["Gardien de l'aube",'#ffd23f'],'Orion':['Maître des étoiles','#6cc4ff'],'Solène':["Grande Maîtresse des Terres d'Aube",'#ff9a3a']};
function bossCin(name,cb){if(!S.v3||!document.body.animate||!$('w')||!maps[G.map]){intrude(null,cb);return}
 const m=maps[G.map],g=m.g,px0=rx+.5,py0=ry+.74,a0=V3.a;let bx=null,by=null,bd=99;
 for(let y=Math.floor(ry)-6;y<=Math.floor(ry)+6;y++)for(let x=Math.floor(rx)-6;x<=Math.floor(rx)+6;x++){const c=g[y]&&g[y][x];if(c=='V'||c=='W'||c=='Y'){const d=Math.hypot(x+.5-px0,y+.5-py0);if(d<bd){bd=d;bx=x+.5;by=y+.5}}}
 if(bx==null){csTitleOnly(name);intrude(null,cb);return}
 const dx=px0-bx,dy=py0-by,dl=Math.hypot(dx,dy)||1,ux=dx/dl,uy=dy/dl;let D=2.4;const free=(x,y)=>{const c=g[Math.floor(y)]&&g[Math.floor(y)][Math.floor(x)];return c!==undefined&&!SOLID.includes(c)};
 while(D>1.1&&!(free(bx+ux*D,by+uy*D)&&free(bx+ux*D*.5,by+uy*D*.5)))D-=.3;
 const ex=D>1.1?bx+ux*D:px0,ey=D>1.1?by+uy*D:py0,aB=Math.atan2(by-ey,bx-ex),sub=BOSS_SUB[name]||['',''];let titled=false;
 return csPlay({dur:3300,boss:{x:bx,y:by,A:e=>({pt:e>800&&e<2400?1:0,jump:e>900&&e<1250?Math.sin((e-900)/350*Math.PI)*.075:0,yaw:Math.sin(e/500)*.08,sd:2})},
  cam:e=>{let k,x,y,a,eye,hz;if(e<750){k=csEase(e/750);x=csLerp(px0,ex,k);y=csLerp(py0,ey,k);a=csTurn(a0,aB,k);eye=csLerp(.5,.34,k);hz=csLerp(.5,.54,k)}
   else if(e<2600){k=(e-750)/1850;const pk=csEase(k)*.3;x=ex+(bx-ex)*pk/Math.max(.6,D);y=ey+(by-ey)*pk/Math.max(.6,D);a=aB+Math.sin(e/700)*.025;eye=.34-.05*k;hz=.54+.02*k}
   else{k=csEase((e-2600)/700);x=csLerp(ex,px0,k);y=csLerp(ey,py0,k);a=csTurn(aB,a0,k);eye=csLerp(.3,.5,k);hz=csLerp(.56,.5,k)}return{x,y,a,eye,hz}},
  start:()=>{try{sfx(196,.2);setTimeout(()=>sfx(247,.2),180);setTimeout(()=>sfx(330,.35),360)}catch(e){}},
  actors:[],tick:e=>{if(!titled&&e>900){titled=true;V3.flash=.6;csTitle(name,sub[0],sub[1]);try{sfx(660,.25)}catch(er){}}},end:()=>{V3.a=a0}}).then(cb)}
function csTitleOnly(name){const s=BOSS_SUB[name]||['',''];csTitle(name,s[0],s[1])}
const sayB=(l,cb)=>{const m=/^([^:]+) :/.exec(l[0]||'');if(m&&S.v3)bossCin(m[1].trim(),()=>say(l,cb));else say(l,cb)};

function battleFx(title,foes,dbl,gold){V3.act=null;return new Promise(res=>{
 let host=$('bt');if(!host||!S.anim&&S.anim!==undefined&&0){res();return}
 try{const rc=host.getBoundingClientRect(),W=170,H=Math.max(120,Math.round(W*rc.height/Math.max(1,rc.width)));
  const ov=document.createElement('div');ov.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;z-index:80;background:#000;touch-action:manipulation';
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='width:100%;height:100%;image-rendering:pixelated;display:block';ov.append(cv);
  if(getComputedStyle(host).position=='static')host.style.position='relative';host.append(ov);const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  const tr=!!title,T=tr?2700:1700,t0=performance.now(),sp=foes[0].s,fl=trainerLook(title);let done=0;
  const tmp=document.createElement('canvas');tmp.width=tmp.height=128;const tg=tmp.getContext('2d');
  const finish=()=>{if(done)return;done=1;ov.remove();try{if(typeof heroBattle=='function'&&!B.dbl&&S.anim!==false){heroBattle(title,fl).then(()=>res());return}}catch(e){}try{const pop=(el,d)=>el&&el.animate&&el.animate([{transform:'scale(.15) translateY(30px)',opacity:0,filter:'brightness(3)'},{transform:'scale(1.18)',opacity:1,filter:'brightness(1.4)',offset:.6},{transform:'scale(1)',opacity:1,filter:'brightness(1)'}],{duration:520,delay:d,easing:'ease-out',fill:'backwards'});pop(document.querySelector('#sp .fs'),0);pop(document.querySelector('#sp .ms'),260)}catch(e){}res()};
  ov.addEventListener('pointerdown',()=>{if(performance.now()-t0>500)finish()});
  const ease=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),3),over=k=>{k=Math.max(0,Math.min(1,k));const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
  const accent=tr?(gold?'#ffd23f':'#e63946'):'#4fc36a';
  const lines=(cxm,cym,t,col,n,al)=>{g.save();g.globalAlpha=al;g.fillStyle=col;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.sin(i*7.3)*.1,w=.05+.04*Math.sin(i*3.1+t/90);const r1=14+((i*37)%22),r2=Math.hypot(W,H);g.beginPath();g.moveTo(cxm+Math.cos(a-w)*r2,cym+Math.sin(a-w)*r2);g.lineTo(cxm+Math.cos(a)*r1,cym+Math.sin(a)*r1);g.lineTo(cxm+Math.cos(a+w)*r2,cym+Math.sin(a+w)*r2);g.fill()}g.restore()};
  const txt=(s,x,y,sz,col,sh)=>{g.font=`${sz}px 'Press Start 2P',monospace`;g.textAlign='center';if(sh){g.fillStyle='#000';g.fillText(s,x+1.5,y+1.5)}g.fillStyle=col;g.fillText(s,x,y)};
  const frame=now=>{if(done)return;const t=now-t0;if(t>=T){finish();return}const k=t/T;
   g.clearRect(0,0,W,H);g.fillStyle=tr?'#0b0b18':'#06140a';g.fillRect(0,0,W,H);
   const shake=tr&&t>1000&&t<1350?(Math.random()-.5)*5*(1-(t-1000)/350):0;g.save();g.translate(shake,shake*.6);
   const tp=t/1000;
   if(tp>.4){const sk=ease((tp-.4)/.3);
    // fond : rayons + bandes diagonales
    lines(W/2,H/2,t,tr?'#232857':'#1b4a2a',18,.8*sk);
    g.save();g.globalAlpha=.12*sk;g.fillStyle=accent;for(let i=-4;i<10;i+=2){const x=((i*46+t*.05)%(W+120))-60;g.beginPath();g.moveTo(x,0);g.lineTo(x+16,0);g.lineTo(x-60+16,H);g.lineTo(x-60,H);g.fill()}g.restore()}
   if(tr){
    // deux camps séparés par une diagonale : dresseur en haut à droite, toi en bas à gauche
    const a1=ease((tp-.5)/.5),a2=ease((tp-.65)/.5);
    if(tp>.45){
     g.save();g.beginPath();g.moveTo(0,0);g.lineTo(W,0);g.lineTo(W,H*.4);g.lineTo(0,H*.62);g.closePath();g.clip();g.translate((1-a2)*W,0);
     const g2=g.createLinearGradient(0,0,0,H*.5);g2.addColorStop(0,'rgba(210,50,70,.0)');g2.addColorStop(1,'rgba(210,50,70,.42)');g.fillStyle=g2;g.fillRect(-W,0,W*3,H);g.restore();
     g.save();g.beginPath();g.moveTo(0,H*.62);g.lineTo(W,H*.4);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.clip();g.translate(-(1-a1)*W,0);
     const g1=g.createLinearGradient(0,H*.4,0,H);g1.addColorStop(0,'rgba(60,110,230,.0)');g1.addColorStop(1,'rgba(60,110,230,.42)');g.fillStyle=g1;g.fillRect(-W,0,W*3,H);g.restore();
     const fc=fxHum(fl,'fxf',t,-.5+Math.sin(t/450)*.08,{pt:tp>1.1?1:0,sd:5},128);if(fc)g.drawImage(fc,W*.7-H*.31+(1-a2)*W,H*.0,H*.62,H*.62);
     const hc=fxHum(heroLook(),'fxh',t,.5+Math.sin(t/500)*.08,{pt:0,sd:2},128);if(hc)g.drawImage(hc,W*.32-H*.35-(1-a1)*W,H*.17,H*.7,H*.7);
     g.save();g.globalAlpha=ease((tp-.6)/.3);g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.moveTo(0,H*.62);g.lineTo(W,H*.4);g.stroke();g.restore()}
    if(tp>1.0){const s=over((tp-1.0)/.3)*(1+.03*Math.sin(t/120));g.save();g.translate(W*.5,H*.47);g.rotate(-.12);g.scale(s,s);txt('VS',0,10,26,'#fff',1);g.strokeStyle=accent;g.lineWidth=1.5;g.strokeText('VS',0,10);g.restore()}
    if(tp>1.45){const n=Math.min(title.length,((tp-1.45)*30)|0),fs=Math.max(5,Math.min(9,Math.floor(150/title.length)));g.fillStyle='rgba(0,0,0,.7)';g.fillRect(0,H*.86,W,20);g.fillStyle=accent;g.fillRect(0,H*.86,W,2);g.fillRect(0,H*.86+20,W,2);txt(title.slice(0,n),W/2,H*.86+14,fs,'#fff',1)}
   }else if(tp>.45){
    // créature sauvage : silhouette qui se révèle
    const z=ease((tp-.45)/.55),rev=Math.max(0,Math.min(1,(tp-.85)/.3)),R=W*(.55+.25*z);let c=null;try{if(typeof MD!='undefined'&&MD[sp]){V3.hb=0;c=mdFor(sp,'bfx',t,-.3+Math.sin(t/400)*.3,.1,{R:128})}}catch(e){}
    if(c){tg.clearRect(0,0,128,128);tg.globalCompositeOperation='source-over';tg.drawImage(c,0,0,128,128);tg.globalCompositeOperation='source-atop';tg.fillStyle=`rgba(0,0,0,${1-rev})`;tg.fillRect(0,0,128,128);tg.globalCompositeOperation='source-over';g.drawImage(tmp,W/2-R/2,H*.48-R/2,R,R)}
    if(tp>.95){txt('Un '+nm(foes[0])+' sauvage !',W/2,H*.8,Math.min(9,Math.floor(150/Math.max(8,nm(foes[0]).length+16)*1.7)),'#fff',1)}
   }
   g.restore();
   // volets d'ouverture / fermeture + flashs
   const cl=ease(tp/.42),op=ease((tp-(T/1000-.4))/.4);const bh=(tp<.42?cl:1-op)*H/2;
   g.fillStyle='#000';if(tp<.42||tp>T/1000-.4){g.fillRect(0,0,W,bh+1);g.fillRect(0,H-bh-1,W,bh+1)}
   if(tp<.45){const fa=Math.abs(Math.sin(tp*Math.PI*3.6))*.9*(1-tp/.45*.4);g.fillStyle=`rgba(255,255,255,${fa})`;g.fillRect(0,0,W,H)}
   if(tp>T/1000-.3){g.fillStyle=`rgba(255,255,255,${Math.max(0,(tp-(T/1000-.3))/.3)*.0})`;g.fillRect(0,0,W,H)}
   requestAnimationFrame(frame)};
  requestAnimationFrame(frame)}catch(e){res()}})}
// ---------- INTERRUPTIONS : « ! », arrivée en courant (Noa…), pose de défi ----------
function intrude(lk,cb,o){o=o||{};const w=$('w');if(!w){cb();return}busy=true;
 try{sfx(988,.09);setTimeout(()=>sfx(1318,.16),110)}catch(e){}
 V3.bang={s:null};const actor=!!(lk&&S.v3);if(actor)V3.act={lk,s:null,dur:1300};
 const d=document.createElement('div');d.textContent='!';d.style.cssText="position:absolute;left:50%;top:15%;z-index:70;transform:translate(-50%,-50%);font:900 30px 'Press Start 2P',monospace;color:#fff;background:#e63946;border:3px solid #fff;border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px #1a1a1a,0 8px 24px rgba(0,0,0,.4);pointer-events:none";
 const fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;z-index:69;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(230,57,70,0) 55%,rgba(230,57,70,.28) 100%)';
 w.append(fl,d);
 try{d.animate([{transform:'translate(-50%,-50%) scale(0)'},{transform:'translate(-50%,-50%) scale(1.4) rotate(-8deg)',offset:.35},{transform:'translate(-50%,-50%) scale(1)'}],{duration:380,easing:'ease-out'});
  fl.animate([{opacity:0},{opacity:1,offset:.15},{opacity:0}],{duration:actor?1100:800,easing:'ease-out',fill:'forwards'});
  w.animate([{transform:'translate(0,0)'},{transform:'translate(-2px,1px)'},{transform:'translate(2px,-1px)'},{transform:'translate(-1px,1px)'},{transform:'translate(0,0)'}],{duration:340})}catch(e){}
 setTimeout(()=>{d.remove();fl.remove();busy=false;cb()},actor?1900:850);
 setTimeout(()=>{if(V3.act&&V3.act.s!=null)V3.act=null},30000)}
// acteur qui court vers le joueur
function actorSpr(L,m,g,px,py,t,aa){const A0=V3.act;if(!A0)return;if(A0.s==null){A0.s=t;let best=0,bs=-1;for(const oa of[.55,-.55,.95,-.95,.2,-.2,1.4,-1.4]){let sc=0;for(let dd=2;dd<=6.5;dd+=1){const xx=Math.floor(px+Math.cos(aa+oa)*dd),yy=Math.floor(py+Math.sin(aa+oa)*dd),c=g[yy]&&g[yy][xx];if(c!==undefined&&!SOLID.includes(c)&&c!='H')sc++;else break}if(sc>bs){bs=sc;best=oa}}A0.oa=best;A0.px=px;A0.py=py;A0.a=aa}
 const k=Math.min(1,(t-A0.s)/A0.dur),e=1-Math.pow(1-k,2),dd=6.5-4.3*e,oa=A0.oa*(1-.65*e),x=A0.px+Math.cos(A0.a+oa)*dd,y=A0.py+Math.sin(A0.a+oa)*dd,run=k<1;
 addHum(L,A0.lk,'act',t,px,py,x,y,k>=1?'!!':'',{w:run?1.2:0,ph:t/80,pt:run?0:1,lift:run?Math.abs(Math.sin(t/80))*.035:0,yaw:run?.15:Math.sin(t/260)*.1,jump:!run&&t-A0.s-A0.dur<260?Math.sin((t-A0.s-A0.dur)/260*Math.PI)*.06:0,sd:4},{x,y,c:lookC('rival',0),h:1.2,lift:0,nz:0})}
// ---------- INTRO EN 3D : on marche vers le Professeur, puis le dialogue (noms) se déroule dans la scène ----------
const LK3={prof:{hair:'#d4d4de',shirt:'#fbfbfb',pants:'#3a4a8a',coat:'#fbfbfb'},rival:{hair:'#7a4a2a',shirt:'#f08a2a',pants:'#4a4a6a'}};
const lookC=(k,wave)=>spC('lk'+k+(wave?'w':''),32,56,()=>{person(0,24,LK3[k],[0,1],0,0);if(wave){cx.clearRect(24,37,4,9);cx.fillStyle=LK3[k].shirt;cx.fillRect(24,25,3,13);cx.fillStyle='#ffd7a8';cx.beginPath();cx.arc(25.5,24,2.6,0,7);cx.fill()}});
function in3Map(){if(V3.ig)return V3.ig;const W=28,H=46,g=[];
 for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++){let c='.';if(x<1||y<1||x>W-2||y>H-2)c='#';r.push(c)}g.push(r)}
 const S=(x,y,c)=>{if(g[y]&&g[y][x]!==undefined&&g[y][x]=='.')g[y][x]=c},F=(x,y,c)=>{if(g[y]&&g[y][x]!==undefined)g[y][x]=c};
 for(let y=8;y<H-1;y++)for(let x=12;x<=15;x++)F(x,y,'=');
 for(let y=4;y<=13;y++)for(let x=8;x<=20;x++)if(Math.hypot(x-14,(y-9)*1.35)<5.4)F(x,y,'=');
 for(let x=19;x<=24;x++){F(x,9,'_');F(x,10,'_')}for(let y=6;y<=10;y++){F(22,y,'_');F(23,y,'_')}
 for(let x=20;x<=25;x++)for(let y=2;y<=4;y++)F(x,y,'H');F(22,4,'L');
 for(let x=3;x<=7;x++)for(let y=3;y<=5;y++)F(x,y,'H');F(5,5,'K');for(let y=6;y<=8;y++)F(5,y,'_');for(let x=6;x<=11;x++)F(x,8,'_');
 for(let y=15;y<H-2;y++){if(y%4)F(11,y,'Z');if(y%4)F(16,y,'Z')}
 for(let y=29;y<=36;y++)for(let x=3;x<=9;x++)if(Math.hypot((x-6)*1.1,(y-32.5)*1.25)<3.4)F(x,y,'w');
 for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(g[y][x]!='.')continue;const r=hs(x*7+3,y*5+1)%100,nearPath=x>=9&&x<=18&&y>=7;
  if(nearPath){if(r<10)g[y][x]='f';else if(r<13&&(x<11||x>16))g[y][x]='b';continue}
  if(r<20)g[y][x]='T';else if(r<26)g[y][x]='f';else if(r<30)g[y][x]='b';else if(r<32)g[y][x]='F';else if(r<34)g[y][x]='q';else if(y>14&&y<28&&x<10&&r<62)g[y][x]='g'}
 for(let y=6;y<=12;y++)for(let x=13;x<=15;x++)if(g[y][x]!='=')F(x,y,'=');
 return V3.ig={g,th:'dawn',n:'Village de départ',tn:1}}
function in3Creat(i){V3.icr=V3.icr||{};let o=V3.icr[i];if(o)return o;o=V3.icr[i]={im:null};try{pxSpr(i,64,0);const u=PXC[i+'f'];if(u){const im=new Image();im.onload=()=>{o.im=im};im.src=u}}catch(e){}return o}
function pushStack(L,im,x,y,h,rot,al,lift,back,base){const S2=stackFor(im,back);if(!S2)return;const bs=base||0,fx=Math.sin(rot+bs),fz=Math.cos(rot+bs),D=.3*h,ws=Math.max(.34,Math.abs(Math.cos(rot)));
 S2.sl.forEach((cv,ix)=>{const zk=-1+2*(ix+.5)/S2.K;L.push({x:x+fx*zk*D,y:y+fz*zk*D,c:cv,h,sh:ix==(S2.K>>1)?1:0,lift,al,nz:0,wsc:ws})})}
function in3Start(cb){const m=in3Map();V3.in={t0:performance.now(),m,ph:'walk',walkDur:6.2,cb,show:'prof',cam:{x:14,y:44,a:-Math.PI/2,eye:.5},tgt:{x:14,y:12.4,a:-Math.PI/2},rvT:0,crT:0,fin:0,fT:0,pt:[]};busy=true;try{cinOff()}catch(e){}
 const k=()=>{if(V3.in&&V3.in.ph=='walk')V3.in.t0-=Math.max(0,V3.in.walkDur*1000-(performance.now()-V3.in.t0)-50)};cv.addEventListener('pointerdown',k,{once:true})}
function in3Show(s){const I=V3.in;if(!I)return;I.show=s;
 if(s=='creature'){I.crT=performance.now();V3.flash=.9;I.tgt={x:14.4,y:13.4,a:-Math.PI/2+.05};try{sfx(880,.12)}catch(e){}}
 else if(s=='hero')I.tgt={x:14.1,y:11.7,a:-Math.PI/2};
 else if(s=='rival'){I.rvT=performance.now();I.tgt={x:13.9,y:13.4,a:-Math.PI/2-.02}}
 else if(s=='end'){I.endT=performance.now();I.tgt={x:14.2,y:12.5,a:-.8}}
 else I.tgt={x:14,y:12.4,a:-Math.PI/2}}
function in3End(done){const I=V3.in;if(!I)return done&&done();I.fin=performance.now();I.done=done;I.tgt={x:16.5,y:9.6,a:-.2}}
function renderIntro(t,dtm){const I=V3.in,m=I.m,g=m.g,W=240,H=192,b=r3buf('i',W,H),c=I.cam,el=(t-I.t0)/1000,TX=V3.tex.dawn||(V3.tex.dawn=texOut('dawn'));
 let bob=0,sway=0;
 if(I.ph=='walk'){const p=Math.min(1,el/I.walkDur),s=p<.5?2*p*p:1-2*(1-p)*(1-p),ss=.25+.75*s,e2=p*p*(3-2*p),yy=44-(44-12.4)*(.32*p+.68*e2),dist=44-yy,ph=dist*.42;
  c.y=yy;c.x=14+Math.sin(dist*.11)*.35*(1-p);c.a=-Math.PI/2+Math.sin(dist*.19)*.06*(1-p)+(p>.82?0:0);bob=Math.abs(Math.sin(ph*Math.PI))*.032*(1-Math.max(0,(p-.85)/.15));sway=Math.sin(ph*Math.PI)*.012;
  const st=Math.floor(ph);if(st!=I.lastSt){I.lastSt=st;try{if(S.sfx)sfx(95+(st%2)*18,.035)}catch(e){}}
  if(p>=1){I.ph='talk';const cb=I.cb;I.cb=null;I.cam.y=12.4+0;I.cam.x=14;cb&&cb()}}
 else{const k=Math.min(1,dtm*.0042);c.x+=(I.tgt.x-c.x)*k;c.y+=(I.tgt.y-c.y)*k;c.a+=(I.tgt.a-c.a)*k;bob=Math.sin(t/1300)*.006}
 if(I.fin){const f=(t-I.fin)/1000;I.fT=f;if(f>2.3&&!I.fired){I.fired=1;const d=I.done;I.done=null;V3.in=null;d&&d();return}}
 const px=c.x,py=c.y,a=c.a;
 const L=[];envSprites(L,m,g,px,py,t,a);
 const pw=Math.floor(t/420)%2&&(I.show=='prof'||I.show=='creature'||I.ph=='walk')&&Math.sin(t/1700)>.2;
 addHum(L,LK3.prof,'ip',t,px,py,14,9.55,'',{wave:pw?1:0,yaw:Math.sin(t/1700)*.12,sd:3},{x:14,y:9.55,c:lookC('prof',pw),h:1.25*(1+Math.sin(t/900)*.012),lift:0,nz:0});
 if(I.show=='creature'||I.show=='hero'||I.show=='rival'||I.show=='end'){const k=Math.min(1,(t-I.crT)/700),bn=Math.abs(Math.sin(t/330))*.14*(I.show=='creature'?1:.35),sc=.35+.65*(1-Math.pow(1-k,3));const ke=I.show=='end'?Math.min(1,(t-I.endT)/2000):0,ee=1-Math.pow(1-ke,3);
  if(I.show=='creature'){const ph=(t-I.crT)/2400,n=Math.floor(ph);I.sp=n%3;I.pop=Math.max(0,1-(ph-n)*6)}
  const sp=I.sp||0,pop=I.pop||0,x=15.0+(19.3-15.0)*ee,y=10.95+(8.7-10.95)*ee,h2=.8*sc*1.1*(1+pop*.18),yw=-.35+(Math.PI*.78+.35)*Math.min(1,ke*5)+Math.sin(t/1250)*.3*(1-Math.min(1,ke*5)),bn2=bn*(I.show=='end'?1.6:1);
  const mc=mdFor(sp,'in',t,I.show=='creature'?Math.sin(t/1100)*.55+(1-Math.min(1,(t-I.crT)/700))*1.2:yw,.1,{R:112,flash:pop*.6});
  if(mc)L.push({x,y,c:mc,h:h2,lift:bn2-.08/1.5*h2,sh:1,nz:0})}
 if(I.show=='rival'||I.show=='end'){const k=Math.min(1,(t-I.rvT)/1500),ease=1-Math.pow(1-k,3),x=3.5+(12.55-3.5)*ease,run=k<1?Math.abs(Math.sin(t/90))*.07:0;addHum(L,LK3.rival,'ir',t,px,py,x,10.8,(k>=1&&t-I.rvT<3300)?'!!':'',{w:k<1?1:0,ph:t/95,lift:k<1?Math.abs(Math.sin(t/95))*.03:0,yaw:k<1?.5:-.35+Math.sin(t/1300)*.1,pt:(k>=1&&t-I.rvT<3900)?1:0,jump:(k>=1&&t-I.rvT<1850)?Math.sin(Math.max(0,t-I.rvT-1500)/350*Math.PI)*.07:0,sd:9},{x,y:10.8,c:lookC('rival',0),h:1.2,lift:run,nz:0})}
 let nn=0;
 r3({b,g,m:{th:'dawn',n:'',tn:1},TX,px,py,a,eye:.5+bob,hzf:.5,t,nn,wx:'clair',spr:L,smooth:1});
 cx.imageSmoothingEnabled=false;cx.drawImage(b.cv,sway*480,0,480,VHH);cx.imageSmoothingEnabled=true;
 // pétales
 if(Q.fx||true){if(V3.pt.length<40&&Math.random()<.4)V3.pt.push({x:Math.random()*480,y:-4,vx:(Math.random()-.5)*30+14,vy:30+Math.random()*34,c:['#ffc4dc','#fff','#ffd0e0'][(Math.random()*3)|0],l:0,s:2+Math.random()*2.4});
  for(let i=V3.pt.length-1;i>=0;i--){const p=V3.pt[i];p.l+=dtm;p.x+=(p.vx+Math.sin(p.l/380+i)*18)*dtm/1000;p.y+=p.vy*dtm/1000;if(p.y>VHH+10||p.l>9000){V3.pt.splice(i,1);continue}cx.fillStyle=p.c;cx.globalAlpha=.85;cx.fillRect(p.x,p.y,p.s,p.s*.7)}cx.globalAlpha=1}
 // vignette douce chaude
 {const lg=cx.createRadialGradient(240,VHH/2,120,240,VHH/2,330);lg.addColorStop(0,'rgba(255,200,140,0)');lg.addColorStop(1,'rgba(90,30,40,.28)');cx.fillStyle=lg;cx.fillRect(0,0,480,VHH)}
 // titre
 {const ta=Math.min(1,Math.max(0,(el-.3)/1.1))*Math.min(1,Math.max(0,(4.6-el)/1.1));if(ta>0&&I.ph=='walk'){cx.save();cx.globalAlpha=ta;cx.textAlign='center';cx.textBaseline='middle';cx.font="30px 'Press Start 2P',monospace";const gr=cx.createLinearGradient(0,VHH*.2,0,VHH*.2+34);gr.addColorStop(0,'#fff6c8');gr.addColorStop(1,'#ffb347');cx.lineWidth=8;cx.strokeStyle='#3a1a2a';cx.strokeText('AÉRÉLIA',240,VHH*.22);cx.fillStyle=gr;cx.fillText('AÉRÉLIA',240,VHH*.22);cx.font="11px 'Press Start 2P',monospace";cx.lineWidth=5;cx.strokeStyle='#3a1a2a';cx.strokeText('La légende des Éclats lunaires',240,VHH*.22+36);cx.fillStyle='#fff';cx.fillText('La légende des Éclats lunaires',240,VHH*.22+36);cx.restore()}}
 const wa=Math.max(0,1-el/1.3);if(wa>0){cx.fillStyle=`rgba(255,248,230,${wa})`;cx.fillRect(0,0,480,VHH)}
 if(I.fin){const f=Math.min(1,Math.max(0,(I.fT-1.2)/1.0));if(f>0){cx.fillStyle=`rgba(255,250,235,${f})`;cx.fillRect(0,0,480,VHH)}}
 if(V3.flash>0){cx.fillStyle=`rgba(255,255,255,${Math.min(1,V3.flash)})`;cx.fillRect(0,0,480,VHH);V3.flash=Math.max(0,V3.flash-dtm/300)}}
const introGo=()=>{const inj=()=>{S.v3=1;try{saveS()}catch(e){}};
 in3Start(()=>{
 say(['Bonjour ! Bienvenue dans le monde des Lunaires !',"Je suis le Professeur Sauge. Ici, tout le monde m'appelle le « Prof des Lunaires » !"],()=>{
  in3Show('creature');
  say(['Ce monde est peuplé de créatures mystérieuses : les LUNAIRES !',"Certains les gardent comme compagnons, d'autres les font combattre. Moi, j'étudie le lien qui les unit aux Éclats lunaires."],()=>{
   in3Show('hero');
   say(["Mais assez parlé de moi ! Parle-moi un peu de toi.",'Comment t\'appelles-tu ?'],()=>pickName(['Lune','Axel','Mira'],'Comment t\'appelles-tu ?',n=>lookPick(()=>{G.pn=n;
    in3Show('rival');
    say([`${n}… Joli nom ! Voici mon petit-fils. Depuis tout petit, c'est ton rival.`,"Comment s'appelle-t-il, déjà ?"],()=>pickName(['Noa','Gaël','Théo'],'Nom de ton rival',r=>{G.rv=r;
     in3Show('end');
     say([`${n} ! Ton aventure va bientôt commencer !`,"Un monde de rêves et de combats avec les Lunaires t'attend… En route !","Retrouve-moi d'abord à mon laboratoire, à l'est du village (la porte violette)."],()=>{busy=true;in3End(()=>{inj();cinOff();busy=false;go(0,20,12);if(!G.tips.includes('guide'))G.tips.push('guide');save();toast('📘 Le guide est dans ☰ Menu (START)')})})}))})))})})})};
{const sp=$('sp');if(sp)new MutationObserver(()=>{if(sp.classList.contains('hit'))V3.hitT=performance.now()}).observe(sp,{attributes:true,attributeFilter:['class']})}
{const vb=document.getElementById('v3b');if(vb)vb.addEventListener('click',e=>{e.preventDefault();toggle3d()})}

function draw(){const t=performance.now();{const vb=$('v3b');if(vb){const hid=$('ti').style.display!='none'||busy||V3.in||$('dlg').style.display=='block'||(typeof showing=='function'&&showing($('bt')));vb.style.display=hid?'none':'block';const tx=S.v3?'2D':'3D';if(vb.textContent!=tx)vb.textContent=tx}}if(t-(draw.last||0)>=Q.ft-2){draw.last=t;const w0=performance.now();try{drawFrame(t)}catch(e){console.error(e)}perf(t,performance.now()-w0)}requestAnimationFrame(draw)}
