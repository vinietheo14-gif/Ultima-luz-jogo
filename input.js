// Controles: teclado, joystick e botões
function inp(){
 if(mgI||(inGame&&(!$('ctrl').classList.contains('hide')||!$('hed').classList.contains('hide')||!$('settings-menu').classList.contains('hide'))))return{x:0,y:0,r:false};
 let ix=joy.x,iy=joy.y;if(dp.l)ix-=1;if(dp.r)ix+=1;if(dp.u)iy-=1;if(dp.d)iy+=1;
 if(kDown('left'))ix-=1;if(kDown('right'))ix+=1;
 if(kDown('up'))iy-=1;if(kDown('down'))iy+=1;
 const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}return{x:ix,y:iy,r:runH||kDown('run')};
}
function useKit(){if(inGame&&G&&!G.over){const m=G.pl[me];tx({t:m&&m.role==='h'?'md':'it'})}}
function dropKit(){if(inGame&&G&&!G.over)tx({t:'dk'})}
function useSk(){if(inGame&&G&&!G.over&&!mgI)tx({t:'sk'})}
function act(){
 if(!inGame||!G)return;
 if(mgI){mgPress();return}
 const m=G.pl[me];if(m&&m.role==='h'){tx({t:'at'});return}
 tx({t:'a'});
}

// ---------- EVENTOS ----------
$('chb').onclick=()=>{renderChars();show('chars')};$('cok').onclick=()=>show('menu');
$('sk').addEventListener('pointerdown',e=>{e.preventDefault();useSk()});
$('it').addEventListener('pointerdown',e=>{e.preventDefault();useKit()});
$('drop').addEventListener('pointerdown',e=>{e.preventDefault();dropKit()});
$('mk').onclick=mk;$('jn').onclick=join;$('out').onclick=leave;
$('cd').oninput=e=>e.target.value=e.target.value.toUpperCase();
$('st').onclick=startGame;
$('mx').onclick=()=>{tx({t:'mx'});closeMG()};
$('back').onclick=()=>tx({t:'rd'});
$('act').addEventListener('pointerdown',e=>{e.preventDefault();act()});
$('atk').addEventListener('pointerdown',e=>{e.preventDefault();act()});
const rb=$('run');rb.addEventListener('pointerdown',e=>{e.preventDefault();runH=true});
['pointerup','pointercancel','pointerleave'].forEach(n=>rb.addEventListener(n,()=>runH=false));
addEventListener('keydown',e=>{
 if(document.activeElement.tagName==='INPUT'||!$('ctrl').classList.contains('hide')||!$('settings-menu').classList.contains('hide'))return;
 const k=e.key.toLowerCase();
 if(mgI&&inGame){mgKey(k);e.preventDefault();return}
 keys[k]=true;if(!e.repeat){if(kHas('skill',k))useSk();if(kHas('item',k))useKit();if(kHas('drop',k))dropKit();if(kHas('act',k)){act();e.preventDefault()}}
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
const pad=$('pad'),kn=$('knob');let pid=null;
function pm(e){const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width*.35;
 let dx=(e.clientX-cx)/R,dy=(e.clientY-cy)/R;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
 joy={x:dx,y:dy};kn.style.left=(50+dx*26.67)+'%';kn.style.top=(50+dy*26.67)+'%'}
pad.addEventListener('pointerdown',e=>{pid=e.pointerId;pad.setPointerCapture(pid);pm(e)});
pad.addEventListener('pointermove',e=>{if(e.pointerId===pid)pm(e)});
const rel=e=>{if(e.pointerId===pid){pid=null;joy={x:0,y:0};kn.style.left='50%';kn.style.top='50%'}};
pad.addEventListener('pointerup',rel);pad.addEventListener('pointercancel',rel);

// Setas na tela (alternativa ao joystick)
let dp={};const dpd=$('dpad');let dpid=null;
function dpm(e){const r=dpd.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,t=r.width*.12;
 dp={l:dx<-t,r:dx>t,u:dy<-t,d:dy>t};dpd.querySelectorAll('i').forEach(i=>i.classList.toggle('on',!!dp[i.dataset.d]))}
dpd.addEventListener('pointerdown',e=>{e.preventDefault();dpid=e.pointerId;dpd.setPointerCapture(dpid);dpm(e)});
dpd.addEventListener('pointermove',e=>{if(e.pointerId===dpid)dpm(e)});
const dprel=e=>{if(e.pointerId===dpid){dpid=null;dp={};dpd.querySelectorAll('i').forEach(i=>i.classList.remove('on'))}};
dpd.addEventListener('pointerup',dprel);dpd.addEventListener('pointercancel',dprel);

// Ao perder o foco (trocar de aba, abrir o menu do sistema) solta todas as teclas e botões
function releaseAll(){keys={};dp={};joy={x:0,y:0};runH=false;kn.style.left='50%';kn.style.top='50%';dpd.querySelectorAll('i').forEach(i=>i.classList.remove('on'))}
addEventListener('blur',releaseAll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll()});
