// Configurações de controles: teclas (PC) e HUD (celular). Salvo no localStorage.
const KB_DEF={up:['w','arrowup'],down:['s','arrowdown'],left:['a','arrowleft'],right:['d','arrowright'],run:['shift',null],act:[' ','e'],skill:['q',null],item:['f',null],drop:['g',null]};
const KB_NAMES={up:'Mover: cima',down:'Mover: baixo',left:'Mover: esquerda',right:'Mover: direita',run:'Correr',act:'Ação / Atacar',skill:'Habilidade',item:'Usar medkit',drop:'Soltar medkit'};
const HUD_EL=['pad','dpad','run','sk','it','drop','act','atk'],HUD_TXT={run:'▶',sk:'✦',it:'KIT',drop:'SOLTAR',act:'AÇÃO',atk:'ATACAR'};
const HUD_DEF={p:{it:[.46,.76],drop:[.64,.64],pad:[.2,.86],dpad:[.2,.86],run:[.46,.92],sk:[.62,.84],act:[.84,.92],atk:[.84,.76]},l:{it:[.62,.66],drop:[.78,.48],pad:[.12,.74],dpad:[.12,.74],run:[.62,.86],sk:[.76,.7],act:[.9,.84],atk:[.9,.62]}};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
let KB={},HUD={s:1,o:1,c:null,mv:'joy'},listen=null,ed=null;
function ld(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
(function(){
 const kb=ld('ul_kb')||{},hd=ld('ul_hud')||{};
 for(const a in KB_DEF)KB[a]=[0,1].map(i=>Array.isArray(kb[a])&&(typeof kb[a][i]==='string'||kb[a][i]===null)?kb[a][i]:KB_DEF[a][i]);
 HUD.s=clamp(+hd.s||1,.6,1.6);HUD.o=clamp(+hd.o||1,.3,1);HUD.c=hd.c&&typeof hd.c==='object'?hd.c:null;HUD.mv=hd.mv==='dp'?'dp':'joy';
})();
const kHas=(a,k)=>KB[a].includes(k),kDown=a=>KB[a].some(k=>k&&keys[k]);
function kLabel(k){if(!k)return'—';const m={' ':'Espaço',arrowup:'↑',arrowdown:'↓',arrowleft:'←',arrowright:'→',shift:'Shift',control:'Ctrl',alt:'Alt',enter:'Enter',tab:'Tab'};return m[k]||(k.length===1?k.toUpperCase():k[0].toUpperCase()+k.slice(1))}

// ---------- TECLADO ----------
function renderKb(msg){
 const box=$('kbl');box.innerHTML='';$('kbm').textContent=msg||'';
 for(const a in KB_DEF){
  const r=document.createElement('div');r.className='kr';r.innerHTML='<span>'+KB_NAMES[a]+'</span>';
  [0,1].forEach(i=>{const on=listen&&listen.a===a&&listen.i===i,b=document.createElement('button');
   b.className='ks'+(on?' on':'');b.textContent=on?'Aperte...':kLabel(KB[a][i]);
   b.onclick=()=>{listen=on?null:{a,i};renderKb()};r.append(b)});
  box.append(r)}
}
addEventListener('keydown',e=>{
 if(!listen)return;
 e.preventDefault();e.stopImmediatePropagation();
 const k=e.key.toLowerCase();
 if(e.repeat||['dead','process','unidentified'].includes(k))return;
 if(k==='escape'){listen=null;renderKb();return}
 const{a,i}=listen;let msg='';listen=null;
 if(k==='backspace'||k==='delete')KB[a][i]=null;
 else{
  for(const o in KB)KB[o]=KB[o].map((v,j)=>{if(v!==k||(o===a&&j===i))return v;if(o!==a)msg='"'+kLabel(k)+'" saiu de "'+KB_NAMES[o]+'".';return null});
  KB[a][i]=k}
 sv('ul_kb',KB);renderKb(msg);
},true);
$('kbr').onclick=()=>{for(const a in KB_DEF)KB[a]=KB_DEF[a].slice();listen=null;sv('ul_kb',KB);renderKb('Teclas restauradas.')};

// ---------- HUD (celular) ----------
const hudKey=()=>innerWidth>=innerHeight?'l':'p';
function hudPos(o){const c=HUD.c&&HUD.c[o]||{},r={};
 for(const k of HUD_EL){const v=c[k];r[k]=Array.isArray(v)&&isFinite(v[0])&&isFinite(v[1])?[clamp(v[0],0,1),clamp(v[1],0,1)]:HUD_DEF[o][k].slice()}return r}
function applyHud(){
 const s=document.documentElement.style,o=hudKey(),custom=!!(HUD.c&&HUD.c[o]),p=hudPos(o);
 s.setProperty('--hs',HUD.s);s.setProperty('--ho',HUD.o);$('ctl').classList.toggle('custom',custom);$('pad').classList.toggle('hide',HUD.mv==='dp');$('dpad').classList.toggle('hide',HUD.mv!=='dp');
 for(const k of HUD_EL){const e=$(k);e.style.left=custom?p[k][0]*100+'%':'';e.style.top=custom?p[k][1]*100+'%':''}
}
function placeHed(){
 const p=ed.all[ed.k];$('hlb').textContent='Layout: '+(ed.k==='p'?'vertical':'horizontal')+' (gire o aparelho para editar o outro)';
 for(const k of HUD_EL){const e=$('hed').querySelector('[data-k='+k+']');if(!e)continue;e.style.left=p[k][0]*100+'%';e.style.top=p[k][1]*100+'%'}
}
function openHed(){
 ed={k:hudKey(),s:HUD.s,o:HUD.o,all:{p:hudPos('p'),l:hudPos('l')},t:{}};
 const h=$('hed');h.querySelectorAll('.pv').forEach(e=>e.remove());
 HUD_EL.filter(k=>k!==(HUD.mv==='dp'?'pad':'dpad')).forEach(k=>{const e=document.createElement('div');e.className='pv '+(k==='pad'?'pad':k==='dpad'?'dp':'b');e.dataset.k=k;
  e.innerHTML=k==='pad'?'<i></i>':k==='dpad'?'<i data-d="u">▲</i><i data-d="l">◀</i><i data-d="r">▶</i><i data-d="d">▼</i>':HUD_TXT[k];let d=null;
  e.onpointerdown=ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);const r=e.getBoundingClientRect();d=[ev.clientX-r.left-r.width/2,ev.clientY-r.top-r.height/2]};
  e.onpointermove=ev=>{if(!d)return;ed.all[ed.k][k]=[clamp((ev.clientX-d[0])/innerWidth,.04,.96),clamp((ev.clientY-d[1])/innerHeight,.04,.96)];ed.t[ed.k]=true;placeHed()};
  e.onpointerup=e.onpointercancel=()=>d=null;h.append(e)});
 $('hsz').value=ed.s*100;$('hop').value=ed.o*100;edVars();placeHed();h.classList.remove('hide');
}
function edVars(){const h=$('hed').style;h.setProperty('--hs',ed.s);h.setProperty('--ho',ed.o)}
$('hsz').oninput=e=>{ed.s=e.target.value/100;edVars()};
$('hop').oninput=e=>{ed.o=e.target.value/100;edVars()};
$('hsv').onclick=()=>{
 HUD.s=ed.s;HUD.o=ed.o;const c=HUD.c||{};for(const k in ed.t)c[k]=ed.all[k];
 HUD.c=Object.keys(c).length?c:null;sv('ul_hud',HUD);applyHud();$('hed').classList.add('hide');
};
$('hcn').onclick=()=>$('hed').classList.add('hide');
$('hdo').onclick=openHed;
$('hdr').onclick=()=>{HUD={s:1,o:1,c:null,mv:'joy'};sv('ul_hud',HUD);applyHud();mvLbl();$('hdm').textContent='HUD restaurado.'};
addEventListener('resize',()=>{applyHud();if(ed&&!$('hed').classList.contains('hide')&&ed.k!==hudKey()){ed.k=hudKey();placeHed()}});

// ---------- MENU GLOBAL, SOM E NAVEGAÇÃO ----------
let SND=ld('ul_snd')!==false,ctrlReturn='menu';
function refreshSoundUI(){
 const icon=SND?'🔊':'🔇',label='Som '+(SND?'ligado':'desligado');
 for(const id of ['home-sound','game-sound']){const e=$(id);if(e){e.textContent=SND?'♫':'♪';e.title=label;e.setAttribute('aria-label',label)}}
 $('settings-sound-icon').textContent=icon;$('settings-sound-label').textContent=label;
}
function toggleSound(){SND=!SND;sv('ul_snd',SND);refreshSoundUI()}
function openSettingsMenu(){refreshSoundUI();updateFullscreenUI();$('settings-menu').classList.remove('hide')}
function closeSettingsMenu(){$('settings-menu').classList.add('hide')}
function openControls(){
 ctrlReturn=inGame?'gv':(!$('lobby').classList.contains('hide')?'lobby':'menu');
 closeSettingsMenu();mvLbl();renderKb();$('hdm').textContent='';show('ctrl');
}
function returnFromControls(){listen=null;show(ctrlReturn||'menu')}
function updateFullscreenUI(){
 const active=!!(document.fullscreenElement||document.webkitFullscreenElement);
 $('settings-fullscreen').innerHTML='<span>⛶</span> '+(active?'Sair da tela cheia':'Tela cheia');
}
function toggleFullscreen(){
 const active=!!(document.fullscreenElement||document.webkitFullscreenElement);
 if(active){const fn=document.exitFullscreen||document.webkitExitFullscreen;if(fn){const r=fn.call(document);if(r&&r.catch)r.catch(()=>{})}}
 else{const el=document.documentElement,fn=el.requestFullscreen||el.webkitRequestFullscreen;if(fn){const r=fn.call(el);if(r&&r.catch)r.catch(()=>{if(!$('msg').classList.contains('hide'))$('msg').textContent='Não foi possível ativar a tela cheia neste navegador.'})}else $('msg').textContent='Tela cheia não é compatível com este navegador.'}
 updateFullscreenUI();
}
function exitFromMenu(){
 closeSettingsMenu();
 if(inGame||peer){leave();return}
 try{window.close()}catch(e){}
 $('msg').textContent='Para sair do jogo, feche esta aba do navegador.';
}
const mvLbl=()=>$('mvb').textContent='Movimento no celular: '+(HUD.mv==='dp'?'Setas':'Joystick');
$('mvb').onclick=()=>{HUD.mv=HUD.mv==='dp'?'joy':'dp';sv('ul_hud',HUD);applyHud();mvLbl()};
$('cob').onclick=returnFromControls;
$('home-menu').onclick=openSettingsMenu;$('game-menu').onclick=openSettingsMenu;
$('home-sound').onclick=toggleSound;$('game-sound').onclick=toggleSound;$('settings-sound').onclick=toggleSound;
$('settings-close').onclick=closeSettingsMenu;$('settings-controls').onclick=openControls;
$('settings-fullscreen').onclick=toggleFullscreen;$('settings-exit').onclick=exitFromMenu;
$('settings-menu').addEventListener('pointerdown',e=>{if(e.target===$('settings-menu'))closeSettingsMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('settings-menu').classList.contains('hide'))closeSettingsMenu()});
document.addEventListener('fullscreenchange',updateFullscreenUI);document.addEventListener('webkitfullscreenchange',updateFullscreenUI);
refreshSoundUI();updateFullscreenUI();applyHud();
