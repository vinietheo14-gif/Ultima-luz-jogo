// Minigames dos geradores
// ---------- MINIGAMES ----------
const MGN=['Clique!','Acerte os pontos!','Barriga vazia!'];
function openMG(k,carry=0,door=0){
 const me_=G&&G.pl[me];if(me_&&me_.role==='s'&&hasPk(me_,1))carry=Math.max(carry,.15); // Mãos rápidas: começa com 15% pronto
 const q=G.pl[me],cu=q&&q.cu;
 mgI={k,p:0,d:1,spd:1.2,h:0,f:0,need:cu?2:3,tot:cu?4:6,tg:cu?60:100};if(door)mgI.tg=hasPk(me_,3)?25:36;$('mx').textContent=door?'Desistir':'Sair do gerador';
 const a=$('mga');a.innerHTML='';$('mgt').textContent=door?'Quebre a porta!':MGN[k];$('mg').classList.remove('hide');
 if(k===0){mgI.h=carry*mgI.need;a.innerHTML='<div id="tr"><div id="zn"></div><div id="cu"></div></div><button id="mb">CLIQUE</button><p id="mi"></p>';mgInfo()}
 if(k===1){const n=Math.max(1,mgI.tot-Math.round(carry*mgI.tot));for(let i=0;i<n;i++){const b=document.createElement('button');b.className='dot';const dr=['up','left','down','right'][Math.floor(Math.random()*4)],lb=kLabel(KB[dr][0]||KB[dr][1]);b.dataset.d=dr;b.textContent=lb;if(lb.length>2)b.style.fontSize='11px';
  b.style.left=(5+Math.random()*82)+'%';b.style.top=(5+Math.random()*70)+'%';b.onpointerdown=e=>{e.preventDefault();dotOff(b)};a.append(b)}}
 if(k===2){mgI.f=carry*mgI.tg;a.innerHTML='<div id="tr"><div id="fl"></div></div><button id="mb">'+(door?'QUEBRAR!':'COMER!')+'</button>'}
 const mb=$('mb');if(mb)mb.onpointerdown=e=>{e.preventDefault();mgPress()};
}
function mgInfo(){$('mi').textContent=(Math.floor(mgI.h*10)/10)+'/'+mgI.need}
function dotOff(b){b.remove();if(!$('mga').querySelector('.dot'))mgWin()}
function mgProg(){
 if(mgI.k===0)return Math.min(.99,mgI.h/mgI.need);
 if(mgI.k===1)return(mgI.tot-Math.min(mgI.tot,$('mga').querySelectorAll('.dot').length))/mgI.tot;
 return Math.min(.99,mgI.f/mgI.tg);
}
function mgPress(){
 if(!mgI)return;
 if(mgI.k===0){if(mgI.p>.4&&mgI.p<.6){mgI.h++;mgI.spd*=1.2;mgI.p=0;mgInfo();if(mgI.h>=mgI.need-.001)mgWin()}else mgFail()}
 else if(mgI.k===2){mgI.f=Math.min(mgI.tg,mgI.f+9);if(mgI.f>=mgI.tg)mgWin()}
}
function mgKey(k){
 if(mgI.k===1){const d=[...$('mga').querySelectorAll('.dot')].find(b=>kHas(b.dataset.d,k));if(d)dotOff(d);else if(['up','down','left','right'].some(a=>kHas(a,k)))mgFail()}
 else if(kHas('act',k))mgPress();
}
function mgFail(){const q=G.pl[me],eng=q&&q.role==='s'&&q.ch===1,pr=mgProg(),k=mgI.k;tx({t:'mf'});openMG(k,eng?pr*.25:0)}
function mgWin(){tx({t:'mw'});closeMG()}
function closeMG(){mgI=null;mgOff=performance.now()+800;$('mg').classList.add('hide')}
function mgTick(dt){
 if(!mgI)return;
 if(mgI.k===0){mgI.p+=mgI.d*mgI.spd*dt;if(mgI.p>1){mgI.p=1;mgI.d=-1}if(mgI.p<0){mgI.p=0;mgI.d=1}$('cu').style.left=(mgI.p*98)+'%'}
 if(mgI.k===2){mgI.f=Math.max(0,mgI.f-22*dt);$('fl').style.width=Math.min(100,mgI.f/mgI.tg*100)+'%'}
}
function syncMG(){
 const q=G&&G.pl[me];if(!q||G.over)return;
 if(q.mg!=null&&!mgI&&performance.now()>mgOff)(q.mg>=100?openMG(2,0,1):openMG(G.gens[q.mg].k));
 else if(q.mg==null&&mgI&&performance.now()>mgOff)closeMG();
}

