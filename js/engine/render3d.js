// Vue 3D à la première personne (raycasting) : textures, sol, murs, sprites
// ---------- MODE 3D première personne (raycasting) ----------
const V3={a:Math.PI/2,on:0,tex:{},sp:{},B:{},fade:0,enc:null,pt:[],flash:0};
const hex3=h=>{h=String(h).replace('#','');if(h.length==3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const jt=(c,k)=>[c[0]+k,c[1]+k,c[2]+k];
const n3=(x,y,s)=>((hs(x+s*31,y*7+s)>>>4)&255)/255;
const TS=64;
function avgT(T){let r=0,g=0,b=0,n=0;for(let i=0;i<T.length;i+=4){if(T[i+3]<2)continue;r+=T[i];g+=T[i+1];b+=T[i+2];n++}n=n||1;return[r/n,g/n,b/n]}
function mkT(fn,nat){const d=new Uint8ClampedArray(TS*TS*4);
 if(nat){for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const c=fn(x,y),i=(y*TS+x)*4;if(!c){d[i+3]=0;continue}d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=c[3]==null?255:c[3]}return d}
 const Hh=new Array(1024);for(let y=0;y<32;y++)for(let x=0;x<32;x++)Hh[y*32+x]=fn(x,y);
 const df=(a,b)=>!a||!b||a[3]!=b[3]||Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])>34;
 for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const cx0=x>>1,cy0=y>>1,c=Hh[cy0*32+cx0],i=(y*TS+x)*4;if(!c){d[i+3]=0;continue}
  const al=c[3]==null?255:c[3];let k=(n3(x,y,40)-.5)*9;
  if(al!=2){const Lc=cx0>0?Hh[cy0*32+cx0-1]:c,Rc=cx0<31?Hh[cy0*32+cx0+1]:c,Uc=cy0>0?Hh[(cy0-1)*32+cx0]:c,Dc=cy0<31?Hh[(cy0+1)*32+cx0]:c;
   if(!(x&1)&&df(c,Lc))k+=11;if((x&1)&&df(c,Rc))k-=13;if(!(y&1)&&df(c,Uc))k+=9;if((y&1)&&df(c,Dc))k-=12}
  if(al==2){d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=2;continue}
  if(al==1){d[i]=Math.max(10,Math.min(255,c[0]+k*1.6));d[i+3]=1;continue}
  d[i]=c[0]+k;d[i+1]=c[1]+k;d[i+2]=c[2]+k;d[i+3]=al}
 return d}
// alpha : 0 vide · 1 toit (R = ombrage) · 2 vitre / lanterne (s'allume la nuit) · 255 normal
// 4 styles de maisons : colombage crème · bardage bleu · brique + enduit · stuc menthe
const HV=[{w:[238,226,200],tr:[98,64,42],sh:[78,122,92],fl:[232,70,90],st:0},{w:[188,208,228],tr:[240,236,226],sh:[60,92,150],fl:[250,220,70],st:1},{w:[240,214,184],tr:[110,70,48],sh:[150,62,52],fl:[250,250,250],st:2},{w:[196,226,204],tr:[70,104,76],sh:[214,160,70],fl:[200,110,230],st:3}];
const wallPx=(x,y,v)=>{const V=HV[v],st=V.st,nz=(n3(x,y,5)-.5)*8;let c=V.w;
 if(st==0){if(x<=2||x>=29||y==26)return jt(V.tr,nz);if(y>=13&&y<=26&&(x==4||x==27))return jt(V.tr,nz);const dg=y>=20&&y<=26&&(x==3||x==28);if(dg)return jt(V.tr,nz);return jt(c,((y%4==0)?-14:((y%4)==1?6:0))+nz)}
 if(st==1){return jt(c,((y%3==0)?-26:((y%3)==1?10:0))+((x+((y/3|0)%2)*6)%12==0&&y%3==0?-12:0)+nz)}
 if(st==2){if(y>=19){const r=(y-19)%3,off=(((y-19)/3|0)%2)*4,e=(x+off)%8;return jt([186,92,70],(r==0?-40:r==2?10:0)+(e==0?-30:0)+(n3(x,y,8)-.5)*22)}return jt(c,(y%4==0?-14:6*(y%4==1))+nz)}
 if(x<=2||x>=29||y==12||y==26)return jt(V.tr,nz);return jt(c,(n3(x>>1,y>>1,9)-.5)*14+nz)};
const house3=(x,y,v,ms)=>{v=v||0;const V=HV[v];
 if(y<10){const r=y%3,row=(y/3)|0,off=(row%2)*4,e=(x+off)%8;let s=150+(r==0?60:r==2?-50:0)+(e==0?-34:0)+(n3(x,y,2)-.5)*14;if(y==9)s=62;if(y==0)s=235;if(y==1&&x%5==0)s=250;return[Math.max(20,Math.min(255,s)),0,0,1]}
 if(y>=28)return jt([146,142,136],(n3(x,y,4)-.5)*16+((x+(y>29?4:0))%8==0?-22:0));
 if(y==27)return jt([176,170,156],0);
 if(y==10)return jt(V.tr,-30);if(y==11)return jt(wallPx(x,y,v),-52);if(y==12&&!(x>=8&&x<=23))return jt(wallPx(x,y,v),-22);
 if(x>=8&&x<=23){
  if(y==12)return[188,184,172,255];
  if(y>=13&&y<=22){const fr=x==8||x==23||y==13||y==22||x==15||x==16||y==18;if(fr)return[...(V.st==1?[246,242,232]:[96,66,44]),255];return[(y<18?170:140)+(x%3==0?10:0),(y<18?214:196),248,2]}
  if(y==23)return[214,208,194,255];
  if(!ms&&y==24){return(x%4<2)?[...jt(V.fl,(n3(x,y,3)-.5)*20),255]:[...jt([68,140,60],(x%2?-10:6)),255]}
  if(!ms&&y>=25&&y<=26)return[...jt([126,82,48],(y==25?14:-10)+(x==8||x==23?-20:0)),255]}
 if(y>=13&&y<=22&&((x>=4&&x<=7)||(x>=24&&x<=27))){const sx=(x>=24?x-24:x-4);if(sx==0||sx==3)return[...jt(V.sh,-34),255];return[...jt(V.sh,(y%2==0?-22:10)),255]}
 return wallPx(x,y,v)};
const door3=(sg,mk,v,ms)=>mkT((x,y)=>{v=v||0;const V=HV[v];
 if(x>=10&&x<=21&&y>=14){const ar=y<17&&(Math.abs(x-15.5)>5.5-(y-14)*1.8);if(!ar){if(x==10||x==21||y==14||(y==15&&x>11&&x<20))return[78,46,22];if(x==18&&(y==24||y==25))return[248,208,80];if(y>=29)return[170,164,150];return jt([156,100,58],(x%3==0?-14:0)+(n3(x,y,6)-.5)*8+(x==15||x==16?-26:0))}}
 if(x>=8&&x<=23&&y>=10&&y<=13){const e=x==8||x==23||y==10||y==13;if(e)return[58,38,28];if(mk=='C'&&((x>=14&&x<=17)||(y>=11&&y<=12))&&(x>=12&&x<=19))return[255,255,255];if(mk=='B'&&(Math.abs(x-15.5)+Math.abs(y-11.5)*1.6)<3.2)return[255,235,120];if(mk=='K'&&y>=11&&x>=11&&x<=20)return[255,235,200];return sg}
 // lanternes de chaque côté de la porte
 for(const lx of[6,25]){if(x>=lx&&x<=lx+1&&y>=16&&y<=19)return[255,214,110,2];if(x>=lx&&x<=lx+1&&(y==15||y==20))return[44,36,32,255];}
 // jardinières : pot + fleurs
 for(const[bx,fc]of[[3,V.fl],[27,[250,220,70]]]){if(x>=bx-1&&x<=bx+3&&y>=23&&y<=26){if(y<=24)return(x+y)%2?[...jt([68,140,60],0),255]:[...jt(fc,(n3(x,y,4)-.5)*16),255];return[...jt([172,98,64],y==25?10:-14),255]}}
 return house3(x,y,v,ms)});
function texOut(th){const P=TH[th]||TH0,t={},g=P.g.map(hex3),pa=P.pa.map(hex3),tg=P.tg.map(hex3),w=P.w.map(hex3),bu=P.bu.map(hex3),rk=P.rk.map(hex3),tk=hex3(P.tk);
t.grass=mkT((x,y)=>{const p=n3(x>>3,y>>3,1),q=n3(x>>1,y>>1,2);let c=p<.28?g[2]:p>.72?g[1]:g[0];c=jt(c,(q-.5)*12);const bl=(x*11+(y>>2)*17)%23,yy=y&3;
  if(bl==0&&yy<3)c=jt(g[1],22-yy*8);else if(bl==1&&yy<3)c=jt(g[2],-6);else if(bl==2&&yy==0&&n3(x,y,5)>.5)c=jt(g[1],10);
  if(n3(x,y,6)>.985)c=jt(pa[1],0);return jt(c,(n3(x,y,3)-.5)*9)},1);
 t.flower=mkT((x,y)=>{if([[6,9],[20,22],[13,26],[25,6],[9,19]].some(([a,b])=>(x>>1)==(a>>1)&&(y>>1)==(b>>1)))return hex3(P.fc[(x*3+y)%P.fc.length]);const n=n3(x,y,1);return jt(n<.15?g[2]:n>.85?g[1]:g[0],(n3(x,y,2)-.5)*8)});
 t.sand=mkT((x,y)=>{const n=n3(x,y,7);return jt(n<.15?pa[2]:n>.85?pa[1]:pa[0],(n3(x,y,8)-.5)*8)});
t.stone=mkT((x,y)=>{const r=y>>4,xx=(x+(r&1?16:0))%64,bx=xx>>5,ly=y&15,lx=xx&31;if(ly==0||lx==0)return[112,107,98];
  if((ly==1||ly==15)&&(lx<3||lx>28))return[150,145,134];let k=(n3(bx+r*2,r,9)-.5)*28+(n3(x,y,10)-.5)*14;if(ly==1||lx==1)k+=18;if(ly>=14||lx==31)k-=20;if(n3(x,y,11)>.96)k-=26;return jt([204,199,184],k)},1);
t.tall=mkT((x,y)=>{const p=n3(x>>3,y>>3,12);let c=p<.4?tg[1]:tg[0];const bl=(x*9+(y>>3)*13)%17,yy=y&7;if(bl<2&&yy<6)c=jt(tg[3],10-yy*2);else if(bl==5&&yy<5)c=jt(tg[0],16);else if(bl==9&&yy<4)c=tg[1];if(n3(x,y,13)>.96)c=jt(tg[3],22);return jt(c,(n3(x,y,11)-.5)*10)},1);
t.tallw=mkT((x,y)=>{const g1=(x/6)|0,a1=3-Math.abs((x%6)-2.5),H1=Math.min(60,20+((g1*17)%23)+a1*6),g2=((x+3)/6)|0,a2=3-Math.abs(((x+3)%6)-2.5),H2=Math.min(52,12+((g2*11)%19)+a2*6),y1=64-H1,y2=64-H2;
 if(y>=y1){const k=(1-(y-y1)/H1);return jt((x%6)<3?tg[0]:tg[1],k*34-8+(n3(x,y,25)-.5)*10)}
 if(y>=y2)return jt(tg[3],(1-(y-y2)/H2)*18-14+(n3(x,y,26)-.5)*8);return null},1);
 t.water=mkT((x,y)=>{if(((x+y*2)%13)<2)return jt(w[2],24);if((y%8)==3&&(x%14)<7)return[196,228,255];return jt(((x>>2)+(y>>2))%2?w[0]:w[1],(n3(x,y,12)-.5)*6)});
 t.bridge=mkT((x,y)=>{if(x%8==0)return[96,62,30];return jt([182,132,76],(n3(x,y,13)-.5)*16+(y%16==0?-18:0))});
 const tree=s=>mkT((x,y)=>{const C=[[32,26,21],[17,34,14],[47,34,14],[24,15,12],[40,15,12],[32,10,9]];let mg=-9;for(const q of C){const m=q[2]-Math.hypot(x-q[0],(y-q[1])*1.05)+(n3(x>>1,y>>1,8)-.5)*4.5;if(m>mg)mg=m}
  if(mg<0){if(y>=44&&x>=26&&x<=37)return jt(tk,(x<29?-20:x>33?14:0)+(((y*3+s+(x>>1))%6)==0?-14:0)+(y>58?-10:0));return null}
  const n=n3((x>>2)+s,(y>>2),3),n2=n3(x+s,y,4);let c=n<.25?bu[0]:n>.7?bu[3]:n>.45?bu[1]:bu[2];if(y<30&&n>.35&&(x+y)%3<2)c=bu[4]||bu[3];
  if(mg<2.2||y>40||((x*3+y*5+s)%11)==0)c=bu[0];else if(mg<4&&y<30)c=bu[2];return jt(c,(n2-.5)*10)},1);
 t.tree=tree(0);t.tree2=tree(5);
 t.hedge=mkT((x,y)=>{const n=n3(x>>2,y>>2,3),n2=n3(x,y,4),k=n<.3?0:n<.6?1:n<.85?2:3;let c=bu[k];if((x*3+y*5)%11==0)c=bu[Math.min(5,k+2)];if(y<16)c=jt(c,(16-y)*.8);return jt(c,(n2-.5)*12)},1);
 t.pine=mkT((x,y)=>{if(y>=54){return(x>=29&&x<=34)?jt(tk,(x<31?-18:10)+(((y*3+x)%5)==0?-12:0)):null}
  const snow=P==TH.snow;let best=null;for(let i=0;i<4;i++){const yt=3+i*13,hh=19,hw=9+i*4.2;if(y<yt||y>yt+hh)continue;const rel=(y-yt)/hh,w=hw*(.08+rel*.92)+((n3(x,y,30)-.5)*2.2)-(((y-yt)%3)==2?.8:0);if(Math.abs(x-32)<=w){const side=(x-32)/Math.max(1,w);let c=side<-.2?bu[3]:side>.45?bu[0]:bu[1];if(rel<.18&&snow)c=[238,244,252];else if(rel>.82)c=bu[0];else if((x*5+y*3)%7==0)c=bu[2];best=jt(c,(n3(x,y,31)-.5)*12)}}
  return best},1);
 t.bush=mkT((x,y)=>{const d=Math.hypot(x-16,(y-19)*1.1);if(d>13)return null;const n=n3(x,y,15);let c=d>10.5?bu[0]:d>9?bu[1]:n>.7?bu[4]:n>.4?bu[3]:bu[2];if(((x*5+y*3)%23)==0&&d<10)c=[230,57,70];return jt(c,(n3(x,y,16)-.5)*8)});
 t.rock=mkT((x,y)=>{const d=Math.hypot((x-16)/13,(y-20)/10.5);if(d>1)return null;let c=d>.82?rk[0]:(x<14&&y<18)?rk[2]:rk[1];return jt(c,(n3(x,y,17)-.5)*10)});
 t.fence=mkT((x,y)=>{if((x>=2&&x<=5||x>=26&&x<=29)&&y>=4)return[110,70,35];if((y>=8&&y<=12)||(y>=17&&y<=21))return jt([150,100,55],(y==8||y==17)?20:0);return null});
 t.chest=mkT((x,y)=>{if(x<5||x>26||y<10)return null;if(y<17)return(y==10||x==5||x==26)?[240,200,70]:[140,90,45];if(x==15||x==16)return[240,200,70];return(x==5||x==26||y==31)?[90,55,25]:[150,98,52]});
 for(let v=0;v<4;v++){const q=v?String(v):'';t['house'+q]=mkT((x,y)=>house3(x,y,v));t['doorC'+q]=door3([210,50,60],'C',v);t['doorB'+q]=door3([230,190,40],'B',v);t['doorL'+q]=door3([140,80,200],'L',v);t['doorK'+q]=door3([70,150,80],'K',v);t['hm'+v]=mkT((x,y)=>house3(x,y,v,1));for(const[k,c]of[['C',[210,50,60]],['B',[230,190,40]],['L',[140,80,200]],['K',[70,150,80]]])t['dm'+k+v]=door3(c,k,v,1)}
 t.roofS=mkT((x,y)=>{const row=y>>3,off=(row%2)*8,e=(x+off)%16,yy=y%8;let sv=150+(yy==0?-46:yy==7?24:0)+(e==0?-34:0)+(yy>5&&(e<2||e>14)?-18:0)+(n3(x,y,2)-.5)*16;return[Math.max(20,Math.min(255,sv)),0,0,255]},1);
 t.brick=mkT((x,y)=>{const row=y>>3,e=(x+(row&1)*8)%16;if(y%8==0||e==0)return[126,100,88];return jt([180,92,68],(n3(x,y,3)-.5)*26-(y%8>5?10:0))},1);
 t.vine=mkT((x,y)=>{const sx=Math.abs(Math.sin(x*.45+n3(x>>3,0,5)*6)),dens=.78-(y/64)*.55+sx*.18+(n3(x>>1,y>>1,11)-.5)*.5;if(n3(x,y,12)>dens+.18)return null;if(n3(x>>2,y>>2,15)>.93)return[250,170,200];const k=n3(x,y,13);return jt(k>.6?[84,168,70]:k>.3?[56,134,52]:[40,108,44],(n3(x,y,14)-.5)*14)},1);
 t.fbox=mkT((x,y)=>{const n=n3(x>>1,y>>1,7);if(n>.62)return[[236,70,90],[250,220,70],[250,250,250],[200,110,230]][(x*3+y)%4];return jt(n>.3?[70,148,60]:[50,120,48],(n3(x,y,8)-.5)*16)},1);
 return t}
function texIn(k){const p=(IP[k]||IP.home).map(hex3),t={},cave=k=='cave';
 const fl=(c,lines)=>mkT((x,y)=>{if(lines&&(y==15||(x==(y<15?9:21)&&y<31)))return jt(c,-14);return jt(c,(n3(x,y,18)-.5)*8)});
 t.f0=fl(p[0],k=='home'||k=='gym');t.f1=fl(p[1],k=='home'||k=='gym');
 t.wall=mkT((x,y)=>{if(cave)return jt([84,80,92],(n3(x,y,19)-.5)*34+(y%10==0?-18:0));const b=p[2];return jt(b,(x%8==0?-12:0)+(y>26?-26:0)+(n3(x,y,20)-.5)*6)});
 t.win=mkT((x,y)=>{const b=p[2];if(x>=6&&x<=25&&y>=5&&y<=19){if(x==6||x==25||y==5||y==19||x==15||x==16)return[110,75,45];return[170,220,255,2]}return jt(b,(y>26?-26:0))});
 t.door=mkT((x,y)=>{if(x>=6&&x<=25&&y>=6){if(x==6||x==25||y==6)return[240,210,120];return[179,48,47]}return jt(p[2],(y>26?-26:0))});
 t.shelf=mkT((x,y)=>{if(x<2||x>29||y%14<2)return[74,47,24];const b=[[230,57,70],[74,155,240],[242,201,76],[95,191,90]][(x>>2)%4];return x%4==3?[40,25,12]:jt(b,((x*7+y)%5-2)*4)});
 t.counter=mkT((x,y)=>{if(y<10)return[236,214,170];return jt(k=='center'?[250,250,250]:[168,112,58],(y<14?20:0)+(n3(x,y,21)-.5)*8)});
 t.plant=mkT((x,y)=>{if(y>=20&&x>=10&&x<=21)return jt([181,101,29],y==20?20:0);const d=Math.min(Math.hypot(x-16,y-12),Math.hypot(x-10,y-16)+2,Math.hypot(x-22,y-16)+2);if(d<8)return jt([58,154,58],(n3(x,y,22)-.5)*30);return null});
 t.mach=mkT((x,y)=>{if(x<3||x>28||y<3)return null;if(x>=7&&x<=24&&y>=7&&y<=17)return[16,34,58];if(y>=21&&y<=26&&x>=8&&x<=12)return[95,224,122];if(y>=21&&y<=26&&x>=17&&x<=21)return[230,57,70];return[138,148,166]});
 t.bed=mkT((x,y)=>{if(y<6)return null;if(y<14)return[244,214,192];return jt(y<18?[255,255,255]:[74,155,240],(n3(x,y,23)-.5)*8)});
 t.rock=mkT((x,y)=>{const d=Math.hypot((x-16)/13,(y-18)/13);if(d>1)return null;return jt(x<14&&y<16?[150,150,165]:[106,106,120],(n3(x,y,24)-.5)*12)});
 t.chest=mkT((x,y)=>{if(x<5||x>26||y<10)return null;if(y<17)return(y==10)?[240,200,70]:[140,90,45];return[150,98,52]});
 return t}
const FLOORKEY={'.':'grass',f:'flower',g:'tall',w:'water',j:'bridge','=':'stone',_:'sand'};
const SKYT={snow:[[190,210,235],[235,242,250],[210,225,245]],desert:[[225,160,100],[250,222,165],[200,120,70]],volcano:[[110,45,38],[235,125,70],[70,30,28]],swamp:[[110,140,100],[190,212,170],[80,110,80]],mist:[[140,152,170],[205,212,222],[120,130,150]],dawn:[[235,160,125],[255,228,175],[170,110,100]],star:[[18,20,60],[90,70,150],[40,30,90]],autumn:[[240,175,110],[255,226,175],[150,100,60]],coast:[[100,175,240],[205,238,255],[80,130,170]],lake:[[90,160,235],[190,228,255],[80,120,160]],ruins:[[120,130,150],[200,208,215],[90,100,115]],mountain:[[96,150,225],[190,220,250],[100,115,140]]};
const skyCols=m=>(SKYT[m.th||'plain']||[[80,146,230],[172,216,255],[96,128,172]]);
function nightA(){const d=new Date(),hr=d.getHours()+d.getMinutes()/60;return hr>=21||hr<5?.32:hr>=19?.14+.18*(hr-19)/2:hr<7?.14+.18*(7-hr)/2:hr<8?.14*(8-hr):hr>=18?.14*(hr-18):0}
const hourNow=()=>{const d=new Date();return d.getHours()+d.getMinutes()/60};
const MT3=(()=>{const a=new Float32Array(256);for(let i=0;i<256;i++){const x=i/256*Math.PI*2;a[i]=.5+.28*Math.sin(x*3+1)+.17*Math.sin(x*7+2)+.1*Math.sin(x*13)}return a})();
const CL3=(()=>{const W=256,H=32,a=new Float32Array(W*H);const v=(x,y,s)=>((hs((x|0)+s*17,(y|0)*5+s)>>>5)&255)/255;for(let y=0;y<H;y++)for(let x=0;x<W;x++){let n=0,f=1,am=.55;for(let o=0;o<3;o++){const sc=4*f,fx=x/W*sc,fy=y/H*sc*.5,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,w=sc|0;const A=v(ix%w,iy,o),B=v((ix+1)%w,iy,o),C=v(ix%w,iy+1,o),D=v((ix+1)%w,iy+1,o);n+=am*((A*(1-tx)+B*tx)*(1-ty)+(C*(1-tx)+D*tx)*ty);f*=2;am*=.5}const e=Math.min(y,H-1-y)/H;a[y*W+x]=Math.max(0,(n-.42)*3.2)*Math.min(1,e*5)}return a})();
const WKO={T:null,'#':null,'~':['hedge',1.9],H:['house',1.7],C:['doorC',1.7],B:['doorB',1.7],L:['doorL',1.7],K:['doorK',1.7],b:null,F:null,q:null,u:null,r:null,Z:['fence',.55],y:['fence',.55],z:['chest',.45],o:['chest',.45],k:['rock',.55],s:['rock',.55],p:['rock',.55],m:['rock',.55],g:['tallw',.55],N:null};
const WKI={'#':['wall',1],X:['door',1],s:['shelf',1],k:['counter',.5],p:['plant',.6],m:['mach',.8],b:['bed',.45],r:['rock',.6],o:['chest',.45],N:null};
function v3Face0(){V3.a=fd[0]>0?0:fd[0]<0?Math.PI:fd[1]<0?-Math.PI/2:Math.PI/2}
function v3Face(p,n,y){const A=maps[p],B=maps[n];if(!B)return;if(p!=n)V3.fade=1;V3.a=B.in?-Math.PI/2:(A&&A.in)?Math.PI/2:y<=3?Math.PI/2:y>=B.g.length-4?-Math.PI/2:V3.a}
function toggle3d(){S.v3=S.v3?0:1;saveS();toast(S.v3?'🧊 Vue 3D : haut/bas = avancer, gauche/droite = tourner':'🗺 Vue 2D')}
function tick3(dt){let dx=ph[0]+swv[0],dy=ph[1]+swv[1];for(const k in keys)if(keys[k]){dx+=K[k][0];dy+=K[k][1]}
 const ca=Math.cos(V3.a),sa=Math.sin(V3.a);fd=Math.abs(ca)>=Math.abs(sa)?[Math.sign(ca)||1,0]:[0,Math.sign(sa)||1];
 const tr=Math.max(-1,Math.min(1,dx)),fw=-Math.max(-1,Math.min(1,dy));V3.a+=tr*2.2*dt/1000*(runB?1.2:1);
 if(V3.a>Math.PI)V3.a-=2*Math.PI;if(V3.a<-Math.PI)V3.a+=2*Math.PI;
 if(!fw){mvg=0;return}
 const d=[4.2,6.2][S.walk|0]*dt/1000*(runB?1.5:1)*fw,vx=ca*d,vy=sa*d;let mx=0,my=0;
 if(vx&&!hit(rx+vx,ry)){rx+=vx;mx=1}if(vy&&!hit(rx,ry+vy)){ry+=vy;my=1}
 mvg=mx||my?1:0;const tx=Math.floor(rx+.5),ty=Math.floor(ry+.74);if(tx!=G.x||ty!=G.y)arrive(tx,ty)}
function spC(key,w,h,fn){let c=V3.sp[key];if(c)return c;c=document.createElement('canvas');c.width=w;c.height=h;const keep=cx;cx=c.getContext('2d');try{fn()}catch(e){}cx=keep;V3.sp[key]=c;return c}
const persC=(e,q)=>spC('p'+e+q,32,56,()=>{person(0,24,LOOK(e),[0,1],0,0);if(q){cx.fillStyle=q=='?'?'#2a6fe0':q=='!!'?'#e63946':'#e63946';cx.font="bold 16px 'Press Start 2P',monospace";cx.textAlign='center';cx.fillText(q=='!!'?'!':q,16,20)}});
const trainC=c=>persC(c=='V'?'🦹':c=='W'?'🕴':c=='Y'?'👑':'🧑','');
const ballC=()=>spC('ball',32,32,()=>ballIcon(0,0));
const stallC=()=>spC('stall',32,32,()=>{for(let k=0;k<4;k++){cx.fillStyle=k%2?'#fff':'#e63946';cx.fillRect(k*8,2,8,10)}cx.fillStyle='#6b4423';cx.fillRect(1,12,2,18);cx.fillRect(29,12,2,18);cx.fillStyle='#8a5a2b';cx.fillRect(2,17,28,12);cx.fillStyle='#f8f8f0';cx.fillRect(6,19,6,5);cx.fillStyle='#4a9bf0';cx.fillRect(14,19,5,5);cx.fillStyle='#f2c94c';cx.fillRect(22,19,5,5)});
const caveC=()=>spC('cave',32,32,()=>{cx.fillStyle='#555';cx.beginPath();cx.arc(16,26,14,Math.PI,0);cx.fillRect(2,26,28,6);cx.fill();cx.fillStyle='#111';cx.beginPath();cx.arc(16,28,9,Math.PI,0);cx.fillRect(7,28,18,4);cx.fill()});
const arrC=u=>spC('arr'+u,32,32,()=>{cx.fillStyle='#ffd23f';cx.strokeStyle='#181818';cx.lineWidth=2.5;cx.beginPath();const d=u?-1:1;cx.moveTo(16,16+d*12);cx.lineTo(4,16-d*2);cx.lineTo(11,16-d*2);cx.lineTo(11,16-d*12);cx.lineTo(21,16-d*12);cx.lineTo(21,16-d*2);cx.lineTo(28,16-d*2);cx.closePath();cx.fill();cx.stroke()});
const creatC=i=>{let c=V3.sp['c'+i];if(c)return c;c=document.createElement('canvas');c.width=c.height=48;V3.sp['c'+i]=c;try{pxSpr(i,48,0);const u=PXC[i+'f'];if(u){const im=new Image();im.onload=()=>c.getContext('2d').drawImage(im,0,0,48,48);im.src=u}else{const o=c.getContext('2d');o.font='36px serif';o.textAlign='center';o.fillText(SP[i].e,24,38)}}catch(e){}return c};
function nightSp(c,nn){const q=Math.round(nn*4);if(!q)return c;const k='n'+q;c[k]=c[k]||(()=>{const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const x=o.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=`rgba(12,16,70,${.15*q})`;x.fillRect(0,0,o.width,o.height);return o})();return c[k]}
function r3buf(k,W,H){let b=V3.B[k];if(b&&b.W==W&&b.H==H)return b;b={W,H,cv:document.createElement('canvas')};b.cv.width=W;b.cv.height=H;b.c=b.cv.getContext('2d');b.id=b.c.createImageData(W,H);b.d32=new Uint32Array(b.id.data.buffer);b.zb=new Float32Array(W);return V3.B[k]=b}
const HD3=new Float32Array(64),HK3=new Int16Array(64),HS3=new Uint8Array(64),HU3=new Uint8Array(64),HX3=new Int16Array(64);
function r3(o){const b=o.b,g=o.g,m=o.m,TX=o.TX,W=b.W,H=b.H,hz=(H*o.hzf)|0,inn=!!m.in,d32=b.d32,zb=b.zb,cave=m.k=='cave',t=o.t,eye=o.eye,F=(W/2)/.66,px=o.px,py=o.py,a=o.a,nn=o.nn;
 const dX=Math.cos(a),dY=Math.sin(a),pX=-dY*.66,pY=dX*.66,pk=(r,g2,bb)=>(255<<24)|((bb<0?0:bb>255?255:bb|0)<<16)|((g2<0?0:g2>255?255:g2|0)<<8)|(r<0?0:r>255?255:r|0);
 const nr=1-.62*nn,ng=1-.58*nn,nb=1-.32*nn,sk=skyCols(m),wxs=o.wx;
 const mixc=(c1,c2,k)=>[c1[0]+(c2[0]-c1[0])*k,c1[1]+(c2[1]-c1[1])*k,c1[2]+(c2[2]-c1[2])*k];
 const skT=mixc(sk[0],[8,12,44],nn),skH=mixc(sk[1],[30,36,84],nn);
 let fogC=cave?[10,10,16]:inn?[34,24,18]:skH.slice(),fS=inn?8:cave?2:6,fE=inn?15:cave?9:16;
 if(wxs=='brume'){fE=10;fogC=mixc([205,212,220],[30,36,84],nn)}else if(wxs=='pluie'){fE=13;fogC=[fogC[0]*.7+45*(1-nn),fogC[1]*.7+50*(1-nn),fogC[2]*.7+60*(1-nn)]}
 const ceil=inn?(()=>{const q=hex3((IP[m.k]||IP.home)[2]);return[q[0]*.55+14,q[1]*.55+10,q[2]*.55+8]})():cave?[26,26,36]:null;
 // ciel
 const az=new Float32Array(W);for(let x=0;x<W;x++)az[x]=a+Math.atan(.66*(2*x/W-1));
 const mtc=mixc(sk[2],[10,12,40],nn),cloudc=mixc([255,255,255],[70,80,130],nn);
 const wrap=v=>{v%=Math.PI*2;return v>Math.PI?v-Math.PI*2:v<-Math.PI?v+Math.PI*2:v};
 for(let x=0;x<W;x++){const an=az[x],mh=ceil?0:(MT3[(((an/(Math.PI*2))%1+1)%1*256)|0]*hz*.22)|0,cu=(((((an/(Math.PI*2))%1+1)%1*256)|0)+((t/400)|0))&255;
  for(let y=0;y<hz;y++){const f=y/hz;let r,g2,bb;
   if(ceil){const s=.7+.5*f;r=ceil[0]*s;g2=ceil[1]*s;bb=ceil[2]*s}else{r=skT[0]+(skH[0]-skT[0])*f;g2=skT[1]+(skH[1]-skT[1])*f;bb=skT[2]+(skH[2]-skT[2])*f;
    if(y>hz-mh){const k=.62;r+=(mtc[0]-r)*k;g2+=(mtc[1]-g2)*k;bb+=(mtc[2]-bb)*k;if(y>hz-mh*.5){r+=(skH[0]-r)*.25;g2+=(skH[1]-g2)*.25;bb+=(skH[2]-bb)*.25}}
    else if(y>hz*.1&&y<hz*.8&&wxs!='brume'){const cy=(((y-hz*.1)/(hz*.7))*31)|0,al=CL3[cy*256+cu]*(wxs=='pluie'?1:.8);if(al>0){r+=(cloudc[0]-r)*Math.min(1,al);g2+=(cloudc[1]-g2)*Math.min(1,al);bb+=(cloudc[2]-bb)*Math.min(1,al)}}}
   d32[y*W+x]=pk(r,g2,bb)}}
 if(!inn&&!cave){const hr=hourNow(),draw=(ang,el,rad,col)=>{const d=wrap(ang-a);if(Math.abs(d)>1.2)return;const sx=W/2+Math.tan(d)/.66*W/2,sy=hz-el*hz*.75-hz*.05,R=Math.max(3,W*.028);for(let yy=-R*2.5|0;yy<=R*2.5;yy++)for(let xx=-R*2.5|0;xx<=R*2.5;xx++){const X=(sx+xx)|0,Y=(sy+yy)|0;if(X<0||X>=W||Y<0||Y>=hz)continue;const dd=Math.hypot(xx,yy),k=dd<R?1:Math.max(0,1-(dd-R)/(R*1.5))*.4;if(k<=0)continue;const i=Y*W+X,pc=d32[i],r0=pc&255,g0=(pc>>8)&255,b0=(pc>>16)&255;d32[i]=pk(r0+(col[0]-r0)*k,g0+(col[1]-g0)*k,b0+(col[2]-b0)*k)}};
  if(hr>6.2&&hr<19.8&&nn<.7)draw(sunInfo(nn,wxs).az,Math.sin((hr-6)/13.6*Math.PI),1,[255,246,200]);else if(nn>.1)draw(-.9+Math.PI*.8,Math.max(.25,Math.sin((((hr+6)%24)-0)/12*Math.PI*.5+.3)),1,[235,240,255]);
  if(nn>.1){const off=((a+Math.PI*2)*W*.5)|0;for(let i=0;i<70;i++){const sx=((hs(i,3)%W)+off)%W|0,sy=hs(i,9)%(hz-18);d32[sy*W+sx]=pk(255,255,230)}}}
 const stone=m.tn?TX.stone:TX.sand;
 const SUN=(!inn&&!cave)?sunInfo(nn,wxs):null,SHR=[];let sbx0=1e9,sby0=1e9,sbx1=-1e9,sby1=-1e9;
 if(SUN&&SUN.k>.05&&!o.noShadow&&(V3.fx==null||V3.fx>0)){for(const B of houseBlocks(g)){if(!B.house||Math.hypot(B.cx-px,B.cy-py)>fE+4)continue;const hh=(B.zR||2.6)+.1,vx=SUN.vx*SUN.len*(hh/2.7),vy=SUN.vy*SUN.len*(hh/2.7);SHR.push({x0:B.x0,x1:B.X1,y0:B.y0,y1:B.Y1,vx,vy});sbx0=Math.min(sbx0,B.x0-.4,B.x0+Math.min(0,vx)-.1);sbx1=Math.max(sbx1,B.X1+.4,B.X1+Math.max(0,vx)+.1);sby0=Math.min(sby0,B.y0-.4,B.y0+Math.min(0,vy)-.1);sby1=Math.max(sby1,B.Y1+.4,B.Y1+Math.max(0,vy)+.1)}}
 const shadowAt=(fx,fy)=>{let ao=0;for(let i=0;i<SHR.length;i++){const R=SHR[i];let t0=0,t1=1;
   if(R.vx>1e-6||R.vx<-1e-6){let a=(fx-R.x1)/R.vx,b=(fx-R.x0)/R.vx;if(a>b){const q=a;a=b;b=q}if(a>t0)t0=a;if(b<t1)t1=b}else if(fx<R.x0||fx>R.x1)continue;
   if(t0<=t1){if(R.vy>1e-6||R.vy<-1e-6){let a=(fy-R.y1)/R.vy,b=(fy-R.y0)/R.vy;if(a>b){const q=a;a=b;b=q}if(a>t0)t0=a;if(b<t1)t1=b}else if(fy<R.y0||fy>R.y1)t1=-1;if(t0<=t1)return 1}
   if(!ao&&fx>R.x0-.35&&fx<R.x1+.35&&fy>R.y0-.35&&fy<R.y1+.35)ao=.5}return ao};
 for(let y=hz+1;y<H;y++){const rd=eye*F/(y-hz),mk=Math.max(0,Math.min(.85,(rd-3.2)/5)),ff=Math.max(0,Math.min(1,(rd-fS)/(fE-fS))),cl=cave?Math.max(.22,1.25-rd/7)*1.35:1,x0=px+rd*(dX-pX),y0=py+rd*(dY-pY),sx=rd*2*pX/W,sy=rd*2*pY/W;let fx=x0,fy=y0;
  for(let x=0;x<W;x++,fx+=sx,fy+=sy){const cx0=Math.floor(fx),cy0=Math.floor(fy),c=g[cy0]?.[cx0];let T;
   if(inn)T=(c=='X')?TX.f0:(cx0+cy0)&1?TX.f1:TX.f0;else{const k=FLOORKEY[c];T=k?TX[k]:(c===undefined||SOLID.includes(c))?TX.grass:stone}
   let u=((fx-cx0)*TS)|0,v=((fy-cy0)*TS)|0,add=0;
   if(c=='w'){u=(u+((t/70)|0)+((Math.sin(v*.2+t/260)*3)|0))&63;v=(v+((t/120)|0))&63;if(Math.sin(fx*4+t/350)*Math.sin(fy*3.1+t/290)>.86)add=55}
   const i=(v*TS+u)*4;let r=T[i],g2=T[i+1],bb=T[i+2];if(mk>0){const av=T.avg||(T.avg=avgT(T));r+=(av[0]-r)*mk;g2+=(av[1]-g2)*mk;bb+=(av[2]-bb)*mk}if(SHR.length&&fx>sbx0&&fx<sbx1&&fy>sby0&&fy<sby1){const sh=shadowAt(fx,fy);if(sh){const k=sh==1?SUN.k:SUN.k*.5,f=1-.34*k;r*=f;g2*=1-.3*k;bb*=1-.18*k}}
   r=r*nr+add;g2=g2*ng+add;bb=bb*nb+add;if(c=='w'){const wk=.2+.4*Math.min(1,rd/9);r+=(skH[0]-r)*wk;g2+=(skH[1]-g2)*wk;bb+=(skH[2]-bb)*wk}
   d32[y*W+x]=pk((r+(fogC[0]-r)*ff)*cl,(g2+(fogC[1]-g2)*ff)*cl,(bb+(fogC[2]-bb)*ff)*cl)}}
 const WK=inn?WKI:WKO,maxD=fE,rc=ROOF.map(hex3),sx0=Math.floor(px),sy0=Math.floor(py),KT=[],KH=[],KN={},KS=[];let nk=0;
 const MSH=!inn&&!cave,HMB=MSH?houseBlocks(g):null,gw=g[0].length,gh=g.length;
 const kid=(c,mx,my)=>{let nm;if(HMB&&mx>=0&&my>=0&&mx<gw&&my<gh&&HMB.cov[my*gw+mx])return -1;if(inn){nm=WKI[c];if(c=='#'&&my==0&&mx%4==2&&m.k!='cave')nm=['win',1]}else{nm=WKO[c];if(nm&&(nm[0]=='house'||/^door/.test(nm[0]))){let lx=mx;while(lx>0&&'HCBLK'.includes(g[my][lx-1]))lx--;const vv=(hs(lx,my>>1)>>>3)%4;if(vv)nm=[nm[0]+vv,nm[1]]}if(nm&&nm[0]=='tree'&&((mx*7+my*3)&1))nm=['tree2',1.3];if(nm&&(nm[0]=='tree'||nm[0]=='tree2')&&(m.th=='snow'||m.th=='mountain'||m.th=='mist')&&((mx+my*2)%3))nm=['pine',1.55]}if(nm===undefined&&SOLID.includes(c)&&c!='w')nm=inn?['rock',.6]:['rock',.55];if(!nm)return -1;const kk=nm[0]+nm[1];if(KN[kk]===undefined){KN[kk]=nk;KT[nk]=TX[nm[0]];KH[nk]=nm[1];KS[nk]=nm[0]=='tallw'?1:0;nk++}return KN[kk]};
 const wlit=nn>.12,wz=b.wz||(b.wz=new Float32Array(W*H));wz.fill(0);
 for(let x=0;x<W;x++){const cam=2*x/W-1,rX=dX+pX*cam,rY=dY+pY*cam;let mx=sx0,my=sy0;const ddx=Math.abs(1/(rX||1e-9)),ddy=Math.abs(1/(rY||1e-9));let stx,sty,sdx,sdy;
  if(rX<0){stx=-1;sdx=(px-mx)*ddx}else{stx=1;sdx=(mx+1-px)*ddx}if(rY<0){sty=-1;sdy=(py-my)*ddy}else{sty=1;sdy=(my+1-py)*ddy}
  let n=0,side=0,dist=0,zd=maxD;
  for(let s=0;s<60&&n<60;s++){if(sdx<sdy){dist=sdx;sdx+=ddx;mx+=stx;side=0}else{dist=sdy;sdy+=ddy;my+=sty;side=1}
   if(dist>maxD)break;let c=g[my]?.[mx];if(c===undefined){if(inn||cave)break;c='~'}if(c=='.'||c=='='||c=='_'||c=='f'||c=='w'||c=='j')continue;
   const id=kid(c,mx,my);if(id<0)continue;let wx2=side==0?py+dist*rY:px+dist*rX;wx2-=Math.floor(wx2);let u=(wx2*TS)|0;if((side==0&&rX>0)||(side==1&&rY<0))u=TS-1-u;
   HD3[n]=Math.max(dist,.04);HK3[n]=id;HS3[n]=side;HU3[n]=u;HX3[n]=mx;n++;if(KH[id]>=1){if(zd>dist)zd=dist;if(KH[id]>=1.6||inn)break}}
  zb[x]=zd;
  for(let i=n-1;i>=0;i--){const d=HD3[i],id=HK3[i],hf=KH[id],T=KT[id],lh=F/d,bot=hz+lh*eye,top=bot-lh*hf,y0=Math.max(0,top|0),y1=Math.min(H-1,bot|0);if(y1<y0)continue;
   const ff=Math.max(0,Math.min(1,(d-fS)/(fE-fS))),sd=HS3[i]?.78:1,cl=cave?Math.max(.22,1.25-d/7)*1.35:1,st=TS/(lh*hf),u=HU3[i];let tv=(y0-top)*st;
   for(let y=y0;y<=y1;y++,tv+=st){const vi=tv<0?0:tv>63?63:tv|0,uu=KS[id]?((u+((Math.sin(t/330+HX3[i]*1.7+x*.05)*(63-vi)*.07)|0))&63):u,ti=(vi*TS+uu)*4,al=T[ti+3];if(!al)continue;let r,g2,bb,lit=0;
    if(al==1){const q=rc[(Math.floor(HX3[i]/4)+G.map)%4],s=T[ti]/150;r=q[0]*s;g2=q[1]*s;bb=q[2]*s}else if(al==2&&wlit){r=255;g2=206+(vi%5)*3;bb=112;lit=1}else{r=T[ti];g2=T[ti+1];bb=T[ti+2]}
    r*=sd;g2*=sd;bb*=sd;if(!lit){r*=nr;g2*=ng;bb*=nb}
    d32[y*W+x]=pk((r+(fogC[0]-r)*ff)*cl,(g2+(fogC[1]-g2)*ff)*cl,(bb+(fogC[2]-bb)*ff)*cl);wz[y*W+x]=1/d}}}
 if(MSH){try{drawMesh({d32,wz,zb,W,H,hz,eye,F,px,py,dX,dY,pX,pY,fS,fE,fogC,nr,ng,nb,wlit,TX,pk,g,sun:SUN})}catch(er){if(!V3.meshErr){V3.meshErr=1;console.error(er)}}}
 b.c.putImageData(b.id,0,0);
 const SP3=o.spr;for(const s of SP3)s.d=(s.x-px)*(s.x-px)+(s.y-py)*(s.y-py);SP3.sort((p,q)=>q.d-p.d);const inv=1/(pX*dY-dX*pY),ctx=b.c;ctx.imageSmoothingEnabled=false;
 for(const s of SP3){const sx=s.x-px,sy=s.y-py,tX=inv*(dY*sx-dX*sy),tY=inv*(-pY*sx+pX*sy);if(tY<.2||tY>maxD)continue;
  if(o.smooth)ctx.imageSmoothingEnabled=true;const sc=nn>.05?nightSp(s.c,nn):s.c,scr=(W/2)*(1+tX/tY),hh=Math.abs(F/tY)*s.h,cw=sc.naturalWidth||sc.width,ch=sc.naturalHeight||sc.height,ww=hh*(cw/ch)*(s.wsc||1),bot=hz+(F/tY)*(eye-s.lift),top=bot-hh,xa=scr-ww/2,xb=scr+ww/2;
  const c0=Math.max(0,Math.floor(xa)),c1=Math.min(W-1,Math.ceil(xb)-1),ff=Math.max(0,Math.min(1,(tY-fS)/(fE-fS)));if(s.sh){ctx.globalAlpha=.34*(s.al==null?1:s.al);ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(scr,hz+(F/tY)*eye,ww*.36,Math.max(1,ww*.085),0,0,7);ctx.fill()}ctx.globalAlpha=(1-ff*.85)*(s.al==null?1:s.al);
  let run=-1;for(let c=c0;c<=c1+1;c++){const vis=c<=c1&&(s.nz||tY<zb[c]);if(vis&&run<0)run=c;else if(!vis&&run>=0){const sw=c-run;
   if(s.sk){const full=run==c0&&c==c1+1;ctx.save();if(!full){ctx.beginPath();ctx.rect(run,0,sw,H);ctx.clip()}ctx.transform(1,0,-s.sk,1,s.sk*bot,0);ctx.drawImage(sc,xa,top,ww,hh);ctx.restore()}
   else ctx.drawImage(sc,Math.max(0,(run-xa)/ww*cw),0,Math.min(cw,sw/ww*cw),ch,run,top,sw,hh);run=-1}}}
 ctx.globalAlpha=1}
