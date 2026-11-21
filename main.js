// Loop principal e inicialização
function loop(t){
 const dt=Math.min(.05,(t-lastT)/1000);lastT=t;
 if(inGame&&G){
  if(isHost){if(G.pl.host)G.pl.host.inp=inp();sim(dt);if(G.over)chkRdy();if(G){acc+=dt;if(acc>=.05){acc=0;sendAll({t:'s',g:G})}}}
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
