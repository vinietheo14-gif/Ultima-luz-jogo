// Áudio: floresta (base), música dramática (mais alta quanto mais perto o caçador) e passos
const volOK=(()=>{const a=new Audio();a.volume=.5;return a.volume===.5})(); // iOS ignora volume: liga/desliga
const mkA=f=>{const a=new Audio('som-'+f);a.loop=true;a.preload='none';a._v=0;return a};
const A_AMB=mkA('floresta.mp3'),A_MUS=mkA('drama.mp3'),A_ME=mkA('passos.mp3'),A_OT=mkA('passos.mp3');
function setV(a,v,snap){
 v=Math.max(0,Math.min(1,v));a._v=snap?v:a._v+(v-a._v)*.15;
 if(volOK)a.volume=a._v;
 const on=volOK?a._v>.01:a._v>.2;
 if(on&&a.paused)a.play().catch(()=>{});else if(!on&&!a.paused)a.pause();
}
function audioStop(){for(const a of [A_AMB,A_MUS,A_ME,A_OT])if(a._v>0||!a.paused){setV(a,0,true);a.pause()}A_MUS.currentTime=0}
setInterval(()=>{if(!inGame||!G)audioStop()},300);
function audioTick(mq,isH,vx,vy,h){
 try{
  const on=typeof SND==='undefined'||SND,live=on&&!G.over;
  setV(A_AMB,on?.4:0);
  // música: some quando o caçador está longe (450 px), sobe quando ele chega perto
  let mus=0;
  if(live&&mq&&mq.role==='s'&&mq.s===0){const d=Math.hypot(h.x-vx,h.y-vy);if(d<450)mus=Math.pow(1-d/450,1.4)*.9}
  setV(A_MUS,mus);
  // meus passos
  const mv=isH?h.mv:mq&&mq.mv,alive=mq&&(isH||mq.s===0);
  A_ME.playbackRate=(mq&&mq.inp&&mq.inp.r&&mq.sta>0&&!(mq.fatigue>0))?1.4:1;
  setV(A_ME,live&&mv&&alive&&!mgI?.5:0);
  // passos de quem está perto (mais alto quanto mais perto)
  let dm=1e9;
  const chk=(px,py,mvg)=>{if(mvg){const d=Math.hypot(px-vx,py-vy);if(d<dm)dm=d}};
  for(const id in G.pl){const o=G.pl[id];if(id!==me&&o.role==='s'&&o.s===0)chk(o.x,o.y,o.mv)}
  if(!isH)chk(h.x,h.y,h.mv);
  setV(A_OT,live&&dm<230?Math.pow(1-dm/230,1.2)*.6:0)
 }catch(e){}
}
