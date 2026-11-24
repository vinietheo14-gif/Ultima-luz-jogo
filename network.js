// Sala, lobby e conexão (PeerJS)
// ---------- REDE / SALA ----------
function show(id){['menu','lobby','gv','chars','ctrl'].forEach(s=>$(s).classList.toggle('hide',s!==id))}
function msg(t){$('msg').textContent=t}
// Nome aleatório (até 12 letras) usado quando o jogador não escreve nenhum
// Passivas recebidas pela rede: no máximo 2, sem repetir, dentro da lista
function sanPk(a,n){return [...new Set((Array.isArray(a)?a:[]).map(v=>v|0).filter(v=>v>=0&&v<n))].slice(0,2)}
function randomName(){const a=['Lobo','Corvo','Gato','Urso','Raio','Fogo','Gelo','Coruja','Tigre','Falcão','Pantera','Cobra','Sombra','Trovão','Lince','Raposa','Vulto'];return a[Math.floor(Math.random()*a.length)]+Math.floor(10+Math.random()*90)}
function clean(s){return String(s||'').replace(/[<>]/g,'').trim().slice(0,12)||randomName()}
// Estado enxuto: sem entradas dos controles e sem os dados internos da IA
function slimG(){
 const g={};for(const k in G)g[k]=G[k];g.pl={};
 for(const id in G.pl){const q=G.pl[id],o={};for(const k in q)if(k!=='act'&&k!=='inp')o[k]=q[k];o.inp={r:q.inp&&q.inp.r?1:0};g.pl[id]=o}
 const h={},drop={tx:1,ty:1,mem:1,jit:1,ja:1,px:1,py:1,chk:1,path:1,pathI:1,pathGoal:1,pathT:1,hbk:1,gt:1,hold:1};for(const k in G.h)if(!drop[k])h[k]=G.h[k];g.h=h;return g;
}
const r1=v=>Math.round((v||0)*100)/100;
// Anfitrião: mensagem curta de posições a cada 50 ms e estado completo a ~8 por segundo.
// Se a conexão de um jogador estiver cheia, pula (manda só o mais recente em vez de acumular atraso).
function netTick(full){
 const h=G.h,pm={t:'p',p:Object.keys(G.pl).map(id=>{const q=G.pl[id];return [id,Math.round(q.x),Math.round(q.y),q.dr|0,q.mv|0,r1(q.fx),r1(q.fy),r1(q.fl),r1(q.gd),r1(q.sw)]}),
  h:[Math.round(h.x),Math.round(h.y),h.dr|0,h.mv|0,r1(h.fx),r1(h.fy),r1(h.wu),r1(h.sw),r1(h.stun),h.wk||0,r1(h.wdx),r1(h.wdy)]};
 const sm=full?{t:'s',g:slimG()}:null;
 for(const k in conns){const c=conns[k];if(!c.open)continue;const dc=c.dataChannel;if(dc&&dc.bufferedAmount>30000)continue;c.send(pm);if(sm)c.send(sm)}
}
function sendAll(o){for(const k in conns)if(conns[k].open)conns[k].send(o)}
function cl(v){return Math.max(-1,Math.min(1,+v||0))}
function c3(v){return Math.max(0,Math.min(2,v|0))}
function leave(){try{peer&&peer.destroy()}catch(e){}peer=null;conns={};lobby={};wts={};G=null;inGame=false;hostConn=null;isHost=false;closeMG();show('menu')}
function mk(){
 if(peer)return;
 myName=clean($('nm').value);$('nm').value=myName;code='';for(let i=0;i<4;i++)code+='ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*31)];
 msg('Criando sala...');const p=peer=new Peer('ulz-'+code),to=setTimeout(()=>{if(peer===p){msg('Sem resposta do servidor. Tente de novo.');leave()}},10000);
 peer.on('open',()=>{clearTimeout(to);isHost=true;me='host';lobby={host:{n:myName,sv:pick.sv,ki:pick.ki,ps:pick.ps.slice(),ph:pick.ph.slice()}};show('lobby');pushLobby()});
 peer.on('error',e=>{clearTimeout(to);if(peer!==p)return;if(e.type==='unavailable-id'){p.destroy();peer=null;mk()}else{msg('Erro de conexão. Tente de novo.');leave()}});
 peer.on('connection',c=>{
  c.on('open',()=>{if(inGame||Object.keys(lobby).length>=5){c.send({t:'full',g:inGame});setTimeout(()=>c.close(),300);return}conns[c.peer]=c});
  c.on('data',d=>conns[c.peer]&&hostMsg(c.peer,d));
  c.on('close',()=>drop(c.peer));
 });
}
function join(){
 if(peer)return;
 myName=clean($('nm').value);$('nm').value=myName;const cd=$('cd').value.trim().toUpperCase();
 if(cd.length!==4){msg('Digite o código de 4 letras');return}
 msg('Entrando...');peer=new Peer();
 peer.on('open',id=>{
  if(!peer)return;me=id;hostConn=peer.connect('ulz-'+cd,{reliable:true});
  const to=setTimeout(()=>{msg('Não foi possível conectar');leave()},9000);
  hostConn.on('open',()=>{clearTimeout(to);code=cd;hostConn.send({t:'join',n:myName,sv:pick.sv,ki:pick.ki,ps:pick.ps,ph:pick.ph})});
  hostConn.on('data',clientData);
  hostConn.on('close',()=>{if(peer){msg('O anfitrião saiu da sala');leave()}});
 });
 peer.on('error',e=>{msg(e.type==='peer-unavailable'?'Sala não encontrada':'Erro de conexão');leave()});
}
function tx(o){if(isHost)hostMsg('host',o);else if(hostConn&&hostConn.open)hostConn.send(o)}
function hostMsg(id,d){
 if(d.t==='join'){if(!lobby[id]){lobby[id]={n:clean(d.n),sv:Math.max(0,Math.min(4,d.sv|0)),ki:Math.max(0,Math.min(4,d.ki|0)),ps:sanPk(d.ps,6),ph:sanPk(d.ph,5)};pushLobby()}return}
 const q=G&&G.pl[id];if(!q)return;
 if(d.t==='i')q.inp={x:cl(d.x),y:cl(d.y),r:!!d.r};
 else if(d.t==='a')q.act=true;
 else if(d.t==='md'&&q.role==='h'&&q.ch===4&&G.h.hid===id)q.md=q.md?0:1; // Anjo: alterna perto / tentáculo
 else if(d.t==='at'&&q.role==='h'&&G.h.hid===id){const i=doorNear();if(i>=0)q.mg=100+i;else doAttack()}
 else if(d.t==='sk')skill(q,id);
 else if(d.t==='it')beginKitUse(q);
 else if(d.t==='dk')dropMedkit(q);
 else if(d.t==='rd'&&G.over)G.rdy[id]=true;
 else if(d.t==='mx')q.mg=null;
 else if(d.t==='mf'&&q.mg!=null&&q.mg<100){const g=G.gens[q.mg];noise(g.x,g.y);const hh=G.h.hid&&G.pl[G.h.hid];let tt=30;if(hasPk(hh,0))tt+=15;if(hasPk(q,1))tt-=10;G.al.push({x:g.x,y:g.y,t:tt})}
 else if(d.t==='mw'&&q.mg>=100){G.dd[q.mg-100]=2;q.mg=null}
 else if(d.t==='mw'&&q.mg!=null){const g=G.gens[q.mg];g.done=true;q.gc=(q.gc||0)+1;q.mg=null;if(G.gens.every(a=>a.done)&&G.xt==null)G.xt=20}
}
function drop(id){
 delete conns[id];delete lobby[id];
 if(G&&G.pl[id]){G.pl[id].gone=1;G.pl[id].s=G.pl[id].s||1;if(G.h.hid===id){G.h.hid=null;G.h.st='idle';G.h.mv=0}}
 if(!inGame)pushLobby();
}
function clientData(d){
 if(d.t==='l'){code=d.c;inGame=false;G=null;closeMG();renderLobby(d.l);show('lobby')}
 else if(d.t==='full'){msg(d.g?'Partida em andamento':'Sala cheia');leave()}
 else if(d.t==='go'){MP=build(d.m);BG=themeBg(d.m);inGame=true;disp={};$('ov').classList.add('hide');show('gv')}
 else if(d.t==='s'){G=d.g}
 else if(d.t==='p'&&G){ // posições (20 por segundo): só o que muda sempre
  for(const a of d.p){const q=G.pl[a[0]];if(!q)continue;q.x=a[1];q.y=a[2];q.dr=a[3];q.mv=a[4];q.fx=a[5];q.fy=a[6];q.fl=a[7];q.gd=a[8];q.sw=a[9]}
  const h=G.h,b=d.h;h.x=b[0];h.y=b[1];h.dr=b[2];h.mv=b[3];h.fx=b[4];h.fy=b[5];h.wu=b[6];h.sw=b[7];h.stun=b[8];h.wk=b[9];h.wdx=b[10];h.wdy=b[11]}
}
function chances(){
 const ids=Object.keys(lobby),tot=ids.reduce((a,i)=>a+(wts[i]||0),0),o={};
 ids.forEach(i=>o[i]=Math.round((tot?(wts[i]||0)/tot:1/ids.length)*100));return o;
}
function pushLobby(){
 const c=chances(),l=Object.keys(lobby).map(k=>[k,lobby[k].n,c[k]]);
 sendAll({t:'l',l,c:code});renderLobby(l);
}
function renderLobby(l){
 $('code').textContent=code;const ul=$('pl');ul.innerHTML='';
 for(const p of l){const li=document.createElement('li'),a=document.createElement('span'),b=document.createElement('span');
  a.textContent=p[1]+(p[0]===me?' (você)':'');b.textContent='🔪 '+p[2]+'%';li.append(a,b);ul.append(li)}
 $('st').classList.toggle('hide',!isHost);$('lm').textContent=isHost?'':'Aguardando o anfitrião iniciar...';
}

