// Boîtes de dialogue et choix
// ---------- Dialogues ----------
const dlg=$('dlg'),ch=$('ch');
const noji=t=>t.replace(/💰/g,'¥').replace(/✅/g,'✔').replace(/▫️?/g,'·').replace(/🔸/g,'◆').replace(/👁️?/g,'◉').replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,'').replace(/ {2,}/g,' ');
const tr=t=>noji(String(t).replace(/Noa/g,G.rv||'Noa').replace(/\{J\}/g,G.pn||'toi'));
let typT=null,typFull='';
function say(l,cb){if(typT){clearInterval(typT);typT=null}dq=[...l];dcb=cb||null;showD()}
function showD(){if(typT){clearInterval(typT);typT=null;dlg.textContent=typFull;return}
 if(!dq.length){dlg.style.display='none';busy=false;const c=dcb;dcb=null;c&&c();return}busy=true;dlg.style.display='block';const t=tr(dq.shift());
 if(SPD<=100){dlg.textContent=t;return}typFull=t;dlg.textContent='';let i=0;const sp=[38,26,14][S.spd|0]||26;typT=setInterval(()=>{i++;dlg.textContent=t.slice(0,i);if(i>=t.length){clearInterval(typT);typT=null}},sp)}
dlg.onclick=showD;
function choose(o,cb){busy=true;ch.innerHTML='';ch.style.display='flex';o.forEach((t,i)=>{const b=document.createElement('button');b.textContent=tr(t);b.onclick=()=>{ch.style.display='none';busy=false;cb(i)};ch.append(b)})}
