// Loop principal e inicialização
let simAcc=0,lastPos=0,lastFull=0;
function loop(t){
 const real=Math.min(.25,(t-lastT)/1000),dt=Math.min(.05,real);lastT=t;
 if(inGame&&G){
  if(isHost){
   if(G.pl.host)G.pl.host.inp=inp();
   // Simulação em passos fixos de 1/60 s: o jogo não fica em câmera lenta se o aparelho do anfitrião cair de FPS
   simAcc+=real;let n=0;
   while(simAcc>=1/60&&n<6&&G){sim(1/60);simAcc-=1/60;n++;if(G&&G.over)chkRdy()}
   if(n>=6)simAcc=0;
   if(G){const now=performance.now();if(now-lastPos>=50){lastPos=now;const full=now-lastFull>=120;if(full)lastFull=now;netTick(full)}}
  }
  if(G){syncMG();mgTick(dt)}
 }
 draw();requestAnimationFrame(loop);
}
setInterval(()=>{if(inGame&&!isHost&&hostConn&&hostConn.open)hostConn.send({t:'i',...inp()})},50);

function lineup(){const c=$('ln').getContext('2d');c.clearRect(0,0,320,76);
 [SVI[2],SVI[0],KII[0],KII[1],KII[2]].forEach((im,i)=>{if(im.naturalWidth)c.drawImage(im,0,0,CW,CHH,i*64-16,0,CW,CHH)})}
[...SVI,...KII].forEach(i=>i.addEventListener('load',lineup));lineup();
document.body.style.backgroundImage='linear-gradient(#000c,#000c),url('+mkTile('noise',TH[0][2]).toDataURL()+')';document.body.style.backgroundSize='auto,64px';
$('nm').value=$('nm').value||randomName();$('rn').onclick=()=>{$('nm').value=randomName()};
requestAnimationFrame(loop);
