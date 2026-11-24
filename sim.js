// Simulação do jogo (roda só no anfitrião): movimento, geradores, caçador, habilidades
// ---------- SIMULAÇÃO (anfitrião) ----------
// Corrida: gasta stamina mais rápido (sprint curto), mas é mais veloz. Andar normal não mudou.
const STA_DRAIN=60,RUN_SV=200,RUN_KI=200,FATIGUE_TIME=1.5,FATIGUE_SLOW=.6;
// Stamina: correr gasta até zerar. Ao zerar, entra em fadiga por 1,5 s: fica mais lento e a stamina não recupera nesse tempo.
// Depois da fadiga, é preciso soltar e apertar CORRER de novo (a IA só volta a correr com 20 de stamina), pra não entrar em fadiga em loop.
function updateStamina(e,dt,max,regen,isRunning){
 if((e.fatigue||0)>0){e.fatigue=Math.max(0,e.fatigue-dt);return}
 if(isRunning){e.sta=Math.max(0,e.sta-STA_DRAIN*dt);if(e.sta<=0){e.sta=0;e.fatigue=FATIGUE_TIME;e.rl=1}}
 else e.sta=Math.min(max,e.sta+regen*dt);
}
const KILLER_DAMAGE=[20,15,15,17,16]; // Açougueiro, Sombra, Infectado, Armadilheiro, Anjo (golpe de perto)
const TENT_DMG=14; // Anjo: golpe de tentáculo à distância
// Golpe do assassino: 0,45 s de preparação (área vermelha), depois acerta. Guarda do Bombeiro: 2,5 s, quase parado.
const ATK_WINDUP=.45,ATK_CD=1.45,WU_SLOW=.35,GUARD_TIME=2.5,GUARD_SLOW=.12,ANJO_RANGE=150,ANJO_HALF=16,SWEEP_R=125;
const NAV_STEP=16;
let navCache=null;
function hitWall(px,py,r){
 if(px<r||py<r||px>W-r||py>H-r)return true;
 for(const w of MP.wl){const cx=Math.max(w[0],Math.min(px,w[0]+w[2])),cy=Math.max(w[1],Math.min(py,w[1]+w[3]));if((px-cx)**2+(py-cy)**2<r*r)return true}
 return false;
}
function doorDist(px,py,i){const w=MP.doors[i].r;return Math.hypot(px-Math.max(w[0],Math.min(px,w[0]+w[2])),py-Math.max(w[1],Math.min(py,w[1]+w[3])))}
function hitDoor(px,py,r){for(let i=0;i<MP.doors.length;i++)if(G.dd[i]===1&&doorDist(px,py,i)<r)return true;return false}
function doorNear(){const h=G.h;return G.dd.findIndex((s,i)=>s===1&&doorDist(h.x,h.y,i)<h.r+16)}
function pressBtn(q){for(let i=0;i<MP.doors.length;i++)if(G.dd[i]===0&&MP.doors[i].b.some(b=>Math.hypot(q.x-b[0],q.y-b[1])<24)&&doorDist(G.h.x,G.h.y,i)>G.h.r+6){G.dd[i]=1;return true}return false}
function move(e,dx,dy){const hit=(a,b)=>hitWall(a,b,e.r)||(e===G.h&&hitDoor(a,b,e.r));if(!hit(e.x+dx,e.y))e.x+=dx;if(!hit(e.x,e.y+dy))e.y+=dy}
function los(a,b){
 const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/8);
 for(let i=1;i<n;i++){const t=i/n,px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t;
  for(const w of MP.wl)if(px>w[0]&&px<w[0]+w[2]&&py>w[1]&&py<w[1]+w[3])return false}
 return true;
}
// Navegação da IA: grade de colisão + A* e atalhos por linha de visão.
// A grade respeita paredes e margem de colisão. Portas ativas continuam no grafo para a IA conseguir alcançá-las e quebrá-las; a checagem de linha impede atravessá-las antes disso.
function navGrid(){
 const doors=G.dd.join(',');
 if(navCache&&navCache.mp===MP&&navCache.doors===doors)return navCache;
 const cols=Math.ceil(W/NAV_STEP),rows=Math.ceil(H/NAV_STEP),pass=new Uint8Array(cols*rows),r=G.h.r+2;
 for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++){
  const x=gx*NAV_STEP+NAV_STEP/2,y=gy*NAV_STEP+NAV_STEP/2;
  pass[gy*cols+gx]=!hitWall(x,y,r)?1:0;
 }
 navCache={mp:MP,doors,cols,rows,pass};return navCache;
}
function navNearest(g,x,y){
 const gx=Math.max(0,Math.min(g.cols-1,Math.round((x-NAV_STEP/2)/NAV_STEP)));
 const gy=Math.max(0,Math.min(g.rows-1,Math.round((y-NAV_STEP/2)/NAV_STEP)));
 for(let ring=0;ring<=8;ring++){
  let best=-1,bd=Infinity;
  for(let dy=-ring;dy<=ring;dy++)for(let dx=-ring;dx<=ring;dx++){
   if(Math.max(Math.abs(dx),Math.abs(dy))!==ring)continue;
   const xx=gx+dx,yy=gy+dy;if(xx<0||yy<0||xx>=g.cols||yy>=g.rows)continue;
   const id=yy*g.cols+xx;if(!g.pass[id])continue;
   const px=xx*NAV_STEP+NAV_STEP/2,py=yy*NAV_STEP+NAV_STEP/2,d=(px-x)**2+(py-y)**2;
   if(d<bd){bd=d;best=id}
  }
  if(best>=0)return best;
 }
 return -1;
}
function navLineClear(a,b){
 const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/6)),r=G.h.r+2;
 for(let i=0;i<=n;i++){const t=i/n,px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t;if(hitWall(px,py,r)||hitDoor(px,py,r))return false}
 return true;
}
function navFindRoute(sx,sy,tx,ty){
 const g=navGrid(),start=navNearest(g,sx,sy),goal=navNearest(g,tx,ty);
 if(start<0||goal<0)return [];
 const target={x:tx,y:ty},origin={x:sx,y:sy};
 if(navLineClear(origin,target))return [target];
 if(start===goal){const p={x:(start%g.cols)*NAV_STEP+NAV_STEP/2,y:Math.floor(start/g.cols)*NAV_STEP+NAV_STEP/2};return navLineClear(origin,p)?[p]:[]}
 const count=g.pass.length,gs=new Float64Array(count),parent=new Int32Array(count),closed=new Uint8Array(count);
 gs.fill(Infinity);parent.fill(-1);gs[start]=0;
 const heap=[];
 const heuristic=id=>{const dx=Math.abs((id%g.cols)-(goal%g.cols)),dy=Math.abs(Math.floor(id/g.cols)-Math.floor(goal/g.cols));return Math.max(dx,dy)+(Math.SQRT2-1)*Math.min(dx,dy)};
 const push=(id,f)=>{let i=heap.length;heap.push({id,f});while(i>0){const pi=(i-1)>>1;if(heap[pi].f<=f)break;heap[i]=heap[pi];i=pi}heap[i]={id,f}};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=heap.length)break;let c=r<heap.length&&heap[r].f<heap[l].f?r:l;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c}heap[i]=last}return top};
 push(start,heuristic(start));let found=false,guard=0;
 while(heap.length&&guard++<count*2){
  const cur=pop(),id=cur.id;if(closed[id])continue;closed[id]=1;if(id===goal){found=true;break}
  const x=id%g.cols,y=Math.floor(id/g.cols);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=g.cols||ny>=g.rows)continue;
   const ni=ny*g.cols+nx;if(!g.pass[ni]||closed[ni])continue;
   if(dx&&dy&&(!g.pass[y*g.cols+nx]||!g.pass[ny*g.cols+x]))continue;
   const ax=x*NAV_STEP+NAV_STEP/2,ay=y*NAV_STEP+NAV_STEP/2,bx=nx*NAV_STEP+NAV_STEP/2,by=ny*NAV_STEP+NAV_STEP/2;
   const doorCost=hitDoor((ax+bx)/2,(ay+by)/2,5)?5:0;
   const step=(dx&&dy?Math.SQRT2:1)+doorCost,ng=gs[id]+step;if(ng>=gs[ni])continue;
   gs[ni]=ng;parent[ni]=id;push(ni,ng+heuristic(ni));
  }
 }
 if(!found)return [];
 const raw=[];for(let id=goal;id>=0;id=parent[id]){raw.push({x:(id%g.cols)*NAV_STEP+NAV_STEP/2,y:Math.floor(id/g.cols)*NAV_STEP+NAV_STEP/2});if(id===start)break}
 raw.reverse();if(!raw.length)return [];
 // String-pulling: pula pontos intermediários sempre que houver um caminho direto e seguro.
 const route=[];let anchor=origin,i=0;
 while(i<raw.length){let far=i;for(let j=raw.length-1;j>=i;j--)if(navLineClear(anchor,raw[j])){far=j;break}
  const p=raw[far];route.push(p);anchor=p;i=far+1;
 }
 if(navLineClear(anchor,target))route.push(target);
 return route;
}
function chooseAIPatrol(h){
 const spots=MP.spots.filter(p=>Math.hypot(p[0]-h.x,p[1]-h.y)>120),s=spots[Math.floor(Math.random()*Math.max(1,spots.length))]||MP.spots[0];
 h.tx=s[0];h.ty=s[1];h.path=[];h.pathI=0;h.pathGoal=null;h.pathDoorSig=null;h.navTimer=0;
}
function moveAIByRoute(h,dt,sp){
 h.navTimer=Math.max(0,(h.navTimer||0)-dt);
 const moved=!h.pathGoal||Math.hypot(h.tx-h.pathGoal.x,h.ty-h.pathGoal.y)>28,doorSig=G.dd.join(',');
 const noRoute=!h.path||(h.path.length===0&&h.navTimer<=0),doorChanged=h.pathDoorSig!==doorSig;
 if(noRoute||moved||doorChanged){h.path=navFindRoute(h.x,h.y,h.tx,h.ty);h.pathI=0;h.pathGoal={x:h.tx,y:h.ty};h.pathDoorSig=doorSig;h.navTimer=h.path.length?0:.65}
 while(h.path&&h.pathI<h.path.length&&Math.hypot(h.path[h.pathI].x-h.x,h.path[h.pathI].y-h.y)<9)h.pathI++;
 if(!h.path||h.pathI>=h.path.length)return false;
 const p=h.path[h.pathI],dx=p.x-h.x,dy=p.y-h.y,d=Math.hypot(dx,dy);
 // O Caçador não precisa atravessar o sobrevivente para completar a perseguição.
 if(h.st==='c'&&Math.hypot(h.tx-h.x,h.ty-h.y)<40)return false;
 const step=Math.min(d,sp*dt),mx=dx/d*step,my=dy/d*step;
 move(h,mx,my);
 const movedNow=Math.hypot(mx,my)>.01; if(movedNow){h.fx=dx/d;h.fy=dy/d;h.dr=Math.abs(h.fx)>Math.abs(h.fy)?(h.fx<0?1:2):(h.fy<0?3:0)}
 return movedNow;
}
function mkKits(){const c=MP.spots.filter(s=>!MP.gens.some(g=>Math.hypot(g.x-s[0],g.y-s[1])<40)&&!MP.sp.some(p=>Math.hypot(p[0]-s[0],p[1]-s[1])<110)&&Math.hypot(s[0]-MP.hs[0],s[1]-MP.hs[1])>200&&Math.hypot(s[0]-MP.ex[0]-32,s[1]-MP.ex[1]-32)>100).sort(()=>Math.random()-.5),o=[];for(const d of [260,130])for(const s of c){if(o.length>=7)break;if(!o.some(k=>k.x===s[0]&&k.y===s[1])&&o.every(k=>Math.hypot(k.x-s[0],k.y-s[1])>d))o.push({x:s[0],y:s[1],on:1})}return o}
// Cura com medkit: precisa estar parado por 10 segundos; o servidor valida tudo.
function beginKitUse(q){
 if(!q||q.role!=='s'||q.s!==0||!G||G.over)return;
 if((q.kitUse||0)>0){q.kitUse=0;return}
 if((q.kit||0)<1||q.hp>=q.mh||q.mg!=null||q.stuck>0||q.dash>0||q.gd>0)return;
 const m=Math.hypot(q.inp?.x||0,q.inp?.y||0);
 if(m>.05||(q.inp&&q.inp.r))return;
 q.kitUse=hasPk(q,5)?7:10;
}
// Solta o único medkit carregado em um ponto livre atrás/perto do jogador.
function dropMedkit(q){
 if(!q||q.role!=='s'||q.s!==0||!G||G.over)return;
 q.kitUse=0;
 if((q.kit||0)<1)return;
 const facing=[[0,1],[-1,0],[1,0],[0,-1]][q.dr||0]||[0,1];
 const dirs=[[-facing[0],-facing[1]],[0,-1],[1,0],[0,1],[-1,0],[.707,-.707],[.707,.707],[-.707,.707],[-.707,-.707]];
 let spot=null;
 for(const [dx,dy] of dirs){for(const dist of [24,32,40]){const px=q.x+dx*dist,py=q.y+dy*dist;if(!hitWall(px,py,7)&&!G.kits.some(k=>k.on&&Math.hypot(k.x-px,k.y-py)<18)){spot={x:px,y:py};break}}if(spot)break}
 if(!spot)return;
 q.kit=Math.max(0,(q.kit||0)-1);G.kits.push({x:spot.x,y:spot.y,on:1});
}
function startGame(){
 if(inGame&&G&&!G.over)return;
 {let gone=false;for(const id of Object.keys(lobby))if(id!=='host'&&!(conns[id]&&conns[id].open)){delete lobby[id];gone=true}if(gone)pushLobby()}
 const m=Math.floor(Math.random()*10);MP=build(m);BG=themeBg(m);
 const ids=Object.keys(lobby);let hid=null;
 if(ids.length>1){const c=chances();let r=Math.random()*100,a=0;for(const i of ids){a+=c[i];if(r<a){hid=i;break}}if(!hid)hid=ids[0]}
 G={m,ai:ids.length===1,pl:{},h:{x:MP.hs[0],y:MP.hs[1],r:12,st:hid?'h':'p',tx:MP.spots[0][0],ty:MP.spots[0][1],mem:0,stun:0,jit:0,ja:0,px:0,py:0,chk:0,cd:0,sw:0,wu:0,wk:0,wdx:0,wdy:1,sta:60,tired:0,fatigue:0,dr:0,mv:0,dash:0,fu:0,fx:-1,fy:0,still:0,hp:200,slow:0,hid,shadowHits:0,shadowBroken:0,path:[],pathI:0,pathGoal:null,navTimer:0},
  gens:MP.gens.map(g=>({...g})),noises:[],al:[],xt:null,over:null,rdy:{},ap:0,mk:null,bm:[],traps:[],kits:mkKits(),dd:MP.doors.map(()=>0),hbk:0};
 let k=0;
 for(const id of ids){const s=MP.sp[k++];
  G.pl[id]={n:lobby[id].n,role:id===hid?'h':'s',x:s[0],y:s[1],r:9,hp:id===hid?200:100,sta:id===hid?60:100,fatigue:0,inv:0,fl:0,s:0,mg:null,gc:0,kills:0,inp:{x:0,y:0,r:false},act:false,ci:k-1,gd:0,pk:(id===hid?lobby[id].ph:lobby[id].ps)||[],dr:0,mv:0,ch:id===hid?lobby[id].ki:lobby[id].sv,mh:id===hid?200:100,cd:0,bf:0,cn:0,cu:0,sl:0,sw:0,kit:0,kitUse:0,dash:0,dx:0,dy:0,stuck:0}}
 for(const q of Object.values(G.pl))if(q.role==='s'&&hasPk(q,3)){q.mh+=15;q.hp+=15}
 inGame=true;disp={};closeMG();$('ov').classList.add('hide');sendAll({t:'go',m});show('gv');
}
function noise(nx,ny){
 G.noises.push({x:nx,y:ny,t:0});
 if(G.ai&&G.h.st!=='c'){G.h.st='i';G.h.tx=nx;G.h.ty=ny;G.h.path=[];G.h.pathI=0;G.h.pathGoal=null;G.h.navTimer=0}
}
function mageBeam(q){
 if(q.mg!=null)return;
 const h=G.h,dv=[[0,1],[-1,0],[1,0],[0,-1]][q.dr||0];let ex=q.x,ey=q.y,hit=false;
 for(let d=8;d<=600;d+=8){const px=q.x+dv[0]*d,py=q.y+dv[1]*d;if(hitWall(px,py,2))break;ex=px;ey=py;if(Math.hypot(px-h.x,py-h.y)<h.r+16){hit=true;break}}
 G.bm.push({x1:q.x,y1:q.y-12,x2:ex,y2:ey-12,t:.7,b:hit?1:0});q.sw=.35;q.cd=20;
 if(hit){hurtHunter(25);h.slow=3}
 else{q.hp=Math.max(1,q.hp-10);q.fl=.2;q.sl=3}
}
function freeOrDisarm(q){
 const ti=G.traps.findIndex(t=>Math.hypot(q.x-t.x,q.y-t.y)<26);if(ti>=0){G.traps.splice(ti,1);return true}
 for(const k in G.pl){const o=G.pl[k];if(o!==q&&o.role==='s'&&o.stuck>0&&Math.hypot(q.x-o.x,q.y-o.y)<30){o.stuck=0;return true}}
 return false}
function skill(q,id){
 if(q.s!==0||q.cd>0||G.over)return;
 if(q.kitUse>0)q.kitUse=0;
 const h=G.h;
 if(q.role==='s'){
  if(q.stuck>0||q.gd>0)return;
  if(q.ch===0){const m=Math.hypot(q.inp.x,q.inp.y);let dx,dy;if(m>.1){dx=q.inp.x/m;dy=q.inp.y/m}else{[dx,dy]=[[0,1],[-1,0],[1,0],[0,-1]][q.dr||0]}q.dx=dx;q.dy=dy;q.dash=.2;q.inv=.35;q.cd=20}
  else if(q.ch===1){if(!q.cn){q.cn=1;q.cd=40}}
  else if(q.ch===3)mageBeam(q);
  else if(q.ch===4)q.gd=GUARD_TIME;
  else{let t=null,bd=70;for(const k in G.pl){const o=G.pl[k];if(o!==q&&o.role==='s'&&o.s===0&&o.hp<o.mh){const d=Math.hypot(o.x-q.x,o.y-q.y);if(d<bd&&los(q,o)){bd=d;t=o}}}
   if(t){t.hp=Math.min(t.mh,t.hp+20);q.cd=50}}
 }else if(h.hid===id){
  if(q.ch===0){h.dash=.25;q.cd=18}
  else if(q.ch===1){G.ap=5;q.cd=35}
  else if(q.ch===3){G.traps.push({x:h.x,y:h.y});if(G.traps.length>3)G.traps.shift();q.cd=12}
  else if(q.ch===4){if(!(h.wu>0)&&!(h.cd>0)&&!(h.stun>0)){doAttack('sweep');if(h.wu>0)q.cd=30}}
  else{let t=null,bd=1e9;for(const k in G.pl){const o=G.pl[k];if(o.role==='s'&&o.s===0){const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;t=k}}}
   if(t){G.mk={id:t,t:8};q.cd=30}}
 }
}
// Vida do caçador. O Anjo recebe 40% menos dano das habilidades dos sobreviventes.
function hurtHunter(d){
 const h=G.h,hp=h.hid&&G.pl[h.hid];
 if(hp){if(hp.ch===4)d*=.6;hp.hp=Math.max(0,hp.hp-d)}else h.hp=Math.max(0,h.hp-d);
}
// Área do golpe: círculo curto (padrão), tentáculo em linha (Anjo) ou círculo da Varredura.
function atkHit(h,q,kind,kc){
 if(kind==='sweep')return Math.hypot(q.x-h.x,q.y-h.y)<SWEEP_R;
 if(kind==='tent'){const rx=q.x-h.x,ry=q.y-h.y,al=rx*h.wdx+ry*h.wdy,pe=Math.abs(rx*h.wdy-ry*h.wdx);return al>0&&al<ANJO_RANGE&&pe<ANJO_HALF+q.r&&los(h,q)}
 return Math.hypot(q.x-h.x,q.y-h.y)<h.r+q.r+22;
}
// O ataque começa com 0,45 s de preparação (o caçador anda bem devagar e a área vermelha aparece) e só então acerta.
function doAttack(kind){
 const h=G.h;if(h.cd>0||h.wu>0||h.stun>0||G.over)return;
 const killer=h.hid&&G.pl[h.hid];
 if(!(killer||G.ai))return;
 if(!kind&&killer&&killer.ch===4&&killer.md)kind='tent'; // Anjo no modo tentáculo
 h.wu=ATK_WINDUP;h.wk=kind||0;h.wdx=h.fx||0;h.wdy=h.fy||0;
 if(!h.wdx&&!h.wdy)h.wdy=1;
 if(!killer){let bd=1e9;for(const q of Object.values(G.pl))if(q.role==='s'&&q.s===0){const d=Math.hypot(q.x-h.x,q.y-h.y);if(d<bd){bd=d;h.wdx=(q.x-h.x)/(d||1);h.wdy=(q.y-h.y)/(d||1)}}}
}
function resolveAttack(){
 const h=G.h,killer=h.hid&&G.pl[h.hid],kc=killer?killer.ch:0,kind=h.wk,damage=kind==='sweep'?14:(kind==='tent'?TENT_DMG:(killer?(KILLER_DAMAGE[kc]||20):KILLER_DAMAGE[0]));
 h.wu=0;h.cd=ATK_CD;h.sw=.3;let landed=false;
 for(const q of Object.values(G.pl))if(q.role==='s'&&q.s===0&&!(q.inv>0)&&atkHit(h,q,kind,kc)){
  if(q.gd>0){q.gd=0;q.cd=25;q.sw=.4;hurtHunter(30);h.stun=1.5;h.sw=0;continue} // parry do Bombeiro
  landed=true;q.hp=Math.max(0,q.hp-damage);q.fl=.2;q.mg=null;q.kitUse=0;
  if(kind==='sweep')q.sl=3;
  if(killer&&kc===0)h.fu=2;
  if(killer&&hasPk(killer,4))killer.cd=Math.max(0,killer.cd-2);
  if(q.hp<=0){q.s=1;if(killer)killer.kills++}
 }
 // A Sombra perde a camuflagem e o bônus de velocidade após dois golpes.
 if(landed&&killer&&kc===1&&!h.shadowBroken){h.shadowHits=(h.shadowHits||0)+1;if(h.shadowHits>=2)h.shadowBroken=1}
}
function chkRdy(){const ids=Object.keys(lobby);if(ids.length&&ids.every(i=>G.rdy[i])){inGame=false;G=null;$('ov').classList.add('hide');pushLobby();show('lobby')}}
function sim(dt){
 if(G.over)return;
 const h=G.h,S=Object.values(G.pl).filter(q=>q.role==='s'&&q.s===0),xp=G.xt!=null;
 if(xp&&G.xt>0)G.xt=Math.max(0,G.xt-dt);
 // Evento aleatório: Apagão (uma vez por partida). As luzes caem por 20 s e a visão de todos diminui.
 if(G.evT==null){G.evT=50+Math.random()*70;G.blk=0}
 if(G.evT>0){G.evT-=dt;if(G.evT<=0){G.evT=0;G.blk=20}}
 if(G.blk>0)G.blk=Math.max(0,G.blk-dt);
 const open=xp&&G.xt<=0,mul=xp?2:1,ex=MP.ex;
 for(const b of G.bm)b.t-=dt;G.bm=G.bm.filter(b=>b.t>0);
 for(const a of G.al)a.t-=dt;G.al=G.al.filter(a=>a.t>0);
 for(const n of G.noises)n.t+=dt;G.noises=G.noises.filter(n=>n.t<1);
 G.ap=Math.max(0,G.ap-dt);if(G.mk){G.mk.t-=dt;const o=G.pl[G.mk.id];if(G.mk.t<=0||!o||o.s!==0)G.mk=null}
 for(const q of S){
  q.inv=Math.max(0,q.inv-dt);q.cd=Math.max(0,q.cd-dt);q.bf=Math.max(0,q.bf-dt);q.sl=Math.max(0,q.sl-dt);q.sw=Math.max(0,q.sw-dt);q.stuck=Math.max(0,(q.stuck||0)-dt);if(q.adr>0)q.adr-=dt;if(!q.adrUsed&&q.hp>0&&q.hp<30&&hasPk(q,4)){q.adrUsed=1;q.adr=5}if(q.gd>0){q.gd-=dt;if(q.gd<=0){q.gd=0;q.cd=40;q.sta=0;q.fatigue=FATIGUE_TIME;q.rl=1}}if(q.mg==null)q.cu=0;else q.mv=0;
  if(q.mg!=null){const g=G.gens[q.mg];if(g.done||Math.hypot(q.x-g.x,q.y-g.y)>60)q.mg=null}
  if(q.kitUse>0){
   const moving=Math.hypot(q.inp.x,q.inp.y)>.05;
   if(moving||q.inp.r||q.mg!=null||q.stuck>0||q.dash>0||q.act)q.kitUse=0;
   else{
    q.kitUse=Math.max(0,q.kitUse-dt);
    if(q.kitUse===0&&(q.kit||0)>0&&q.hp<q.mh){q.kit--;q.hp=Math.min(q.mh,q.hp+40)}
   }
  }
  if(q.mg==null){
   let ix=q.inp.x,iy=q.inp.y,m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}
   if(q.stuck>0){ix=iy=m=0}
   if(!q.inp.r)q.rl=0;
   const run=q.inp.r&&!q.rl&&!(q.gd>0)&&q.sta>0&&(q.fatigue||0)<=0&&m>.1,v=(run?RUN_SV:100)*(q.bf>0?1.4:1)*(q.adr>0?1.15:1)*(q.sl>0?.6:1)*((q.fatigue||0)>0?FATIGUE_SLOW:1)*(q.gd>0?GUARD_SLOW:1)*dt;
   q.mv=m>.05?1:0;if(m>.05){move(q,ix*v,iy*v);q.fx=ix/m;q.fy=iy/m;q.dr=Math.abs(ix)>Math.abs(iy)?(ix<0?1:2):(iy<0?3:0)}
   updateStamina(q,dt,100,12*(q.ch===0?1.2:1)*(hasPk(q,0)?1.25:1),run);
  }
  {const ti=G.traps.findIndex(t=>Math.hypot(q.x-t.x,q.y-t.y)<14);if(ti>=0&&!(q.inv>0)){const t=G.traps.splice(ti,1)[0];q.stuck=2.5;q.mg=null;q.kitUse=0;noise(t.x,t.y);G.al.push({x:t.x,y:t.y,t:8})}}
  if(q.dash>0){q.dash=Math.max(0,q.dash-dt);const v=750*dt/3;for(let i=0;i<3;i++)move(q,q.dx*v,q.dy*v);q.mv=1}
  for(const k of G.kits)if(k.on&&(q.kit||0)<(q.ch===4?2:1)&&Math.hypot(q.x-k.x,q.y-k.y)<18){k.on=0;q.kit=(q.kit||0)+1}
  if(q.act){q.act=false;if(!(q.gd>0)&&q.mg==null&&!pressBtn(q)&&!freeOrDisarm(q)){const i=G.gens.findIndex(g=>!g.done&&Math.hypot(q.x-g.x,q.y-g.y)<34);if(i>=0){q.mg=i;if(q.cn){q.cu=1;q.cn=0}}}}
  if(open&&q.x>ex[0]&&q.x<ex[0]+ex[2]&&q.y>ex[1]&&q.y<ex[1]+ex[3]){q.s=2;q.mg=null}
 }
 if(h.hid&&G.pl[h.hid]){
  const hp=G.pl[h.hid],inp=hp.inp;let ix=inp.x,iy=inp.y,m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}
  if(hp.mg!=null){const di=hp.mg-100;if(G.dd[di]!==1||doorDist(h.x,h.y,di)>h.r+40)hp.mg=null;else{ix=0;iy=0;m=0}}
  if(!inp.r)hp.rl=0;
  const run=inp.r&&!hp.rl&&hp.sta>0&&(hp.fatigue||0)<=0&&m>.1,shadowMode=hp.ch===1&&!h.shadowBroken;let sp=(run?RUN_KI:108)*mul*(h.fu>0?1.15:1)*(h.slow>0?.55:1)*(shadowMode?1.18:1)*((hp.fatigue||0)>0?FATIGUE_SLOW:1)*(h.wu>0?(hasPk(hp,1)?.55:WU_SLOW):1);
  if(h.stun>0){h.stun-=dt;sp=0}
  const mm=Math.hypot(ix,iy);if(mm>.05){h.fx=ix/mm;h.fy=iy/mm;h.dr=Math.abs(ix)>Math.abs(iy)?(ix<0?1:2):(iy<0?3:0)}h.mv=mm>.05||h.dash>0?1:0;
  hp.cd=Math.max(0,hp.cd-dt);h.fu=Math.max(0,h.fu-dt);h.still=mm<.05&&h.dash<=0?h.still+dt:0;
  if(h.dash>0){h.dash-=dt;move(h,h.fx*420*dt,h.fy*420*dt)}else if(sp&&m>.05)move(h,ix*sp*dt,iy*sp*dt);
  updateStamina(hp,dt,60,12,run);
 }else if(G.ai){
  // A IA só existe no modo solo. O alvo precisa estar visível; paredes escondem sobreviventes.
  {const di=G.dd.findIndex((s,i)=>s===1&&doorDist(h.x,h.y,i)<h.r+16);if(di>=0){G.hbk+=dt;if(G.hbk>2.5){G.dd[di]=2;G.hbk=0;navCache=null}}else G.hbk=0}
  let tgt=null,bd=1e9;
  for(const q of S){const d=Math.hypot(q.x-h.x,q.y-h.y);if(d<bd&&d<200&&los(h,q)){bd=d;tgt=q}}
  if(tgt){
   h.st='c';h.mem=2.5;
   if(Math.hypot(h.tx-tgt.x,h.ty-tgt.y)>28){h.path=null;h.pathI=0;h.pathGoal=null}
   h.tx=tgt.x;h.ty=tgt.y;
  }else if(h.st==='c'){
   h.mem-=dt;
   if(h.mem<=0){h.st='p';h.path=null;h.pathI=0;h.pathGoal=null}
  }
  if(h.rl&&h.sta>=20)h.rl=0;
  // IA: percebe a guarda do Bombeiro com 0,15 s de atraso. Aí desiste do golpe (se já estava preparando) ou espera a guarda acabar.
  const gS=S.filter(q=>q.gd>0&&Math.hypot(q.x-h.x,q.y-h.y)<h.r+q.r+60);
  h.gt=gS.length?(h.gt||0)+dt:0;
  const knows=h.gt>=.15;
  if(knows){h.hold=gS.reduce((a,q)=>Math.max(a,q.gd),0)+.1;if(h.wu>0){h.wu=0;h.cd=Math.max(h.cd,.4)}}
  if(h.hold>0)h.hold-=dt;
  const runAI=h.st==='c'&&!h.rl&&(h.fatigue||0)<=0&&h.sta>0&&h.stun<=0;
  let sp=(h.st==='c'?(runAI?RUN_KI:100):h.st==='i'?85:68)*mul*(h.slow>0?.55:1)*((h.fatigue||0)>0?FATIGUE_SLOW:1)*(h.wu>0?WU_SLOW:1)*(h.hold>0&&gS.length?.2:1);
  updateStamina(h,dt,60,12,runAI);
  h.tired=(h.fatigue||0)>0?1:0;
  if(h.stun>0){h.stun-=dt;sp=0}
  if(h.st!=='c'&&Math.hypot(h.tx-h.x,h.ty-h.y)<32){chooseAIPatrol(h);h.st='p'}
  h.mv=sp>0?1:0;
  if(sp>0&&moveAIByRoute(h,dt,sp))h.mv=1;else h.mv=0;
 }else{
  // Uma sala multiplayer nunca ganha um Caçador controlado por IA, nem após desconexão.
  h.mv=0;h.st='idle';h.path=[];h.pathI=0;
 }
 h.cd=Math.max(0,h.cd-dt);h.sw=Math.max(0,h.sw-dt);h.slow=Math.max(0,h.slow-dt);
 if(h.wu>0){if(h.stun>0)h.wu=0;else{h.wu-=dt;if(h.wu<=0)resolveAttack()}}
 for(const q of S)q.fl=Math.max(0,q.fl-dt);
 if(G.ai&&S.some(q=>Math.hypot(q.x-h.x,q.y-h.y)<h.r+q.r+22&&!(q.gd>0&&(h.gt||0)>=.15)))doAttack();
 // Se a vida do caçador chega a 0, ele morre e os sobreviventes vencem
 const hdead=(h.hid&&G.pl[h.hid]?G.pl[h.hid].hp:h.hp)<=0;
 if(hdead){h.dead=1;h.mv=0}
 if(hdead||!Object.values(G.pl).some(q=>q.role==='s'&&q.s===0)){
  const all=Object.values(G.pl).filter(q=>q.role==='s');
  G.over={esc:all.filter(q=>q.s===2).length,total:all.length,hd:hdead?1:0};
  for(const id in G.pl){const q=G.pl[id];wts[id]=(wts[id]||0)+1+2*(q.gc||0)+2*(q.kills||0)}
 }
}

