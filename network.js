// Sala, lobby e conexão (PeerJS)
// ---------- REDE / SALA ----------
function show(id){['menu','lobby','gv','chars','ctrl'].forEach(s=>$(s).classList.toggle('hide',s!==id))}
function msg(t){$('msg').textContent=t}
// Nome aleatório (até 12 letras) usado quando o jogador não escreve nenhum
// Passivas recebidas pela rede: no máximo 2, sem repetir, dentro da lista
function sanPk(a,n){return [...new Set((Array.isArray(a)?a:[]).map(v=>v|0).filter(v=>v>=0&&v<n))].slice(0,2)}
function randomName(){const a=['Lobo','Corvo','Gato','Urso','Raio','Fogo','Gelo','Coruja','Tigre','Falcão','Pantera','Cobra','Sombra','Trovão','Lince','Raposa','Vulto'];return a[Math.floor(Math.random()*a.length)]+Math.floor(10+Math.random()*90)}
function clean(s){return String(s||'').replace(/[<>]/g,'').trim().slice(0,12)||randomName()}
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
 if(d.t==='join'){if(!lobby[id]){lobby[id]={n:clean(d.n),sv:Math.max(0,Math.min(4,d.sv|0)),ki:Math.max(0,Math.min(4,d.ki|0)),ps:sanPk(d.ps,7),ph:sanPk(d.ph,5)};pushLobby()}return}
 const q=G&&G.pl[id];if(!q)return;
 if(d.t==='i')q.inp={x:cl(d.x),y:cl(d.y),r:!!d.r};
 else if(d.t==='a')q.act=true;
 else if(d.t==='at'&&q.role==='h'&&G.h.hid===id){const i=doorNear();if(i>=0)q.mg=100+i;else doAttack()}
 else if(d.t==='sk')skill(q,id);
 else if(d.t==='it')beginKitUse(q);
 else if(d.t==='dk')dropMedkit(q);
 else if(d.t==='rd'&&G.over)G.rdy[id]=true;
 else if(d.t==='mx')q.mg=null;
 else if(d.t==='mf'&&q.mg!=null&&q.mg<100){const g=G.gens[q.mg];noise(g.x,g.y);const hh=G.h.hid&&G.pl[G.h.hid];let tt=30;if(hasPk(hh,0))tt+=15;if(hasPk(q,2))tt-=10;G.al.push({x:g.x,y:g.y,t:tt})}
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

