// Desenho na tela (canvas)
// ---------- DESENHO ----------
let DTV=.016,FT=.017,QL=0; // QL: 0 = qualidade alta, 1 = leve (aparelho lento)
function P(id,px,py){
 if(isHost)return[px,py];
 const d=disp[id]||(disp[id]={x:px,y:py}),k=1-Math.exp(-DTV*20);d.x+=(px-d.x)*k;d.y+=(py-d.y)*k;return[d.x,d.y];
}
function drawGen(g){
 const im=g.done&&GENOK?GENOK:GEN;
 if(GEN.naturalWidth){x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(g.x,g.y+14,16,5,0,0,7);x.fill();
  x.imageSmoothingEnabled=false;x.drawImage(im,g.x-20,g.y-24,40,40);x.imageSmoothingEnabled=true}
 else{x.fillStyle=g.done?'#2ecc71':'#f1c40f';x.fillRect(g.x-12,g.y-12,24,24)}
}
function drawDoors(vis){
 MP.doors.forEach((d,i)=>{const s=G.dd[i],w=d.r;
  if(s<2&&vis(w[0]+w[2]/2,w[1]+w[3]/2,1.1)){x.fillStyle=s?'#1e8f4e':'#8e1c14';x.fillRect(w[0],w[1],w[2],w[3]);x.fillStyle=s?'#2ecc71':'#e74c3c';
   for(let k=0;k<Math.max(w[2],w[3]);k+=8){if(w[2]>w[3])x.fillRect(w[0]+k,w[1],4,w[3]);else x.fillRect(w[0],w[1]+k,w[2],4)}}
  for(const b of d.b)if(vis(b[0],b[1])){x.fillStyle=s===2?'#666':s?'#2ecc71':'#e74c3c';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(b[0],b[1],8,0,7);x.fill();x.stroke()}
 });
}
function drawKits(vis){if(!KIT.complete||!KIT.naturalWidth)return;for(const k of G.kits)if(k.on&&vis(k.x,k.y)){const b=Math.sin(performance.now()/300+k.x)*2;x.save();x.shadowColor='#2ecc71aa';x.shadowBlur=10;x.drawImage(KIT,k.x-15,k.y-17+b,30,30);x.restore()}}
function drawLamps(vis){if(!LAN.complete||!LAN.naturalWidth)return;for(const l of LT)if(vis(l.x,l.y,1.2))x.drawImage(LAN,l.x-9,l.y-26,18,27)}
function drawGlows(cx,cy){const t=performance.now()/1000;x.save();x.globalCompositeOperation='lighter';
 for(const l of LT){const sx=l.x-cx,sy=l.y-cy-10;if(sx<-l.r||sx>VW+l.r||sy<-l.r||sy>VH+l.r)continue;
  let a=l.a*(1+.18*Math.sin(t*(5+l.ph)+l.ph*9)+.1*Math.sin(t*13+l.ph*4));if(l.f&&Math.sin(t*2.3+l.ph*7)>.96)a*=.15;
  const g=x.createRadialGradient(sx,sy,0,sx,sy,l.r);g.addColorStop(0,'rgba('+l.c+','+a+')');g.addColorStop(1,'rgba('+l.c+',0)');x.fillStyle=g;x.fillRect(sx-l.r,sy-l.r,l.r*2,l.r*2)}
 x.restore()}
function drawTraps(vis,isH,vx,vy){
 for(const t of G.traps){if(isH?!vis(t.x,t.y):Math.hypot(t.x-vx,t.y-vy)>70)continue;
  x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(t.x,t.y+2,10,5,0,0,7);x.fill();x.strokeStyle='#9aa0a6';x.lineWidth=2;x.beginPath();x.ellipse(t.x,t.y,9,5,0,0,7);x.stroke();
  x.fillStyle='#c7ccd1';for(let k=0;k<8;k++){const a=k/8*6.28;x.fillRect(t.x+Math.cos(a)*9-1,t.y+Math.sin(a)*5-1,2,2)}
  x.fillStyle='#6b3b2a';x.fillRect(t.x-2,t.y-1,4,2)}
 for(const id in G.pl){const q=G.pl[id];if(q.role==='s'&&q.stuck>0&&vis(q.x,q.y)){x.strokeStyle='#e74c3c';x.lineWidth=2;x.beginPath();x.ellipse(q.x,q.y+8,14,6,0,0,7);x.stroke()}}}
// Área vermelha da preparação do golpe e tentáculo dourado do Anjo
function drawStrike(hx,hy,h,kc){
 const tt=performance.now();
 if(h.wu>0){
  const p=1-h.wu/ATK_WINDUP;x.save();x.fillStyle='rgba(231,60,60,'+(.12+.22*p)+')';x.strokeStyle='rgba(255,70,70,.85)';x.lineWidth=2;
  if(h.wk==='sweep'){x.beginPath();x.arc(hx,hy,SWEEP_R,0,7);x.fill();x.stroke();x.beginPath();x.arc(hx,hy,SWEEP_R*p,0,7);x.fill()}
  else if(h.wk==='tent'){const dx=h.wdx,dy=h.wdy,nx=-dy,ny=dx,L=ANJO_RANGE,w=ANJO_HALF;
   x.beginPath();x.moveTo(hx+nx*w,hy+ny*w);x.lineTo(hx+nx*w+dx*L,hy+ny*w+dy*L);x.lineTo(hx-nx*w+dx*L,hy-ny*w+dy*L);x.lineTo(hx-nx*w,hy-ny*w);x.closePath();x.fill();x.stroke();
   x.beginPath();x.moveTo(hx+nx*w,hy+ny*w);x.lineTo(hx+nx*w+dx*L*p,hy+ny*w+dy*L*p);x.lineTo(hx-nx*w+dx*L*p,hy-ny*w+dy*L*p);x.lineTo(hx-nx*w,hy-ny*w);x.closePath();x.fill()}
  else{x.beginPath();x.arc(hx,hy,43,0,7);x.fill();x.stroke();x.beginPath();x.arc(hx,hy,43*p,0,7);x.fill()}
  x.restore()}
 if(h.sw>0&&(h.wk==='tent'||h.wk==='sweep')){
  const ext=Math.min(1,(.3-h.sw)/.08+.2),dx=h.wdx,dy=h.wdy,nx=-dy,ny=dx;x.save();x.lineCap='round';
  const path=(len,amp)=>{x.beginPath();for(let i=0;i<=24;i++){const t=i/24,d=t*len,o=Math.sin(t*9-tt/45)*amp*t,px=hx+dx*d+nx*o,py=hy-16+dy*d+ny*o;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()};
  if(h.wk==='sweep'){for(let k=0;k<3;k++){const a=tt/90+k*2.1;x.strokeStyle='rgba(255,200,60,.85)';x.lineWidth=7-k;x.beginPath();x.arc(hx,hy-12,SWEEP_R*(.55+.15*k),a,a+2.2);x.stroke()}}
  else{const L=ANJO_RANGE*ext;x.strokeStyle='rgba(200,140,20,.45)';x.lineWidth=16;path(L,7);x.strokeStyle='rgba(255,196,50,.95)';x.lineWidth=8;path(L,7);x.strokeStyle='rgba(255,246,190,.95)';x.lineWidth=2.5;path(L,7)}
  x.restore()}
}
// ---------- Visão em cone (lanterna) com sombra atrás das paredes ----------
const FG=document.createElement('canvas');FG.width=VW/2;FG.height=VH/2;const fgx=FG.getContext('2d');
let FA=0,RT=performance.now();
// Distância até a primeira parede (ou borda do mapa) seguindo um raio
function rayDist(px,py,dx,dy,max){
 let t=max;
 for(const w of MP.wl){
  let t0=0,t1=t;
  if(Math.abs(dx)<1e-9){if(px<w[0]||px>w[0]+w[2])continue}else{const a=(w[0]-px)/dx,b=(w[0]+w[2]-px)/dx;t0=Math.max(t0,Math.min(a,b));t1=Math.min(t1,Math.max(a,b))}
  if(Math.abs(dy)<1e-9){if(py<w[1]||py>w[1]+w[3])continue}else{const a=(w[1]-py)/dy,b=(w[1]+w[3]-py)/dy;t0=Math.max(t0,Math.min(a,b));t1=Math.min(t1,Math.max(a,b))}
  if(t0<=t1&&t0>=0&&t0<t)t=t0;
 }
 if(dx>0)t=Math.min(t,(W-px)/dx);else if(dx<0)t=Math.min(t,-px/dx);
 if(dy>0)t=Math.min(t,(H-py)/dy);else if(dy<0)t=Math.min(t,-py/dy);
 return Math.max(0,t);
}
// Polígono de visão: raios entre ang-half e ang+half (half>=PI é o círculo todo)
function visPoly(px,py,ang,half,rad,step){
 const pts=[[px,py]],n=Math.max(4,Math.ceil(2*half/step));
 for(let i=0;i<=n;i++){const a=ang-half+2*half*i/n,dx=Math.cos(a),dy=Math.sin(a),d=rayDist(px,py,dx,dy,rad);pts.push([px+dx*d,py+dy*d])}
 return pts;
}
// Um ponto está visível se estiver na luz ambiente ou dentro do cone, e sem parede no meio
function inView(vx,vy,ang,cone,tx,ty){
 const dx=tx-vx,dy=ty-vy,d=Math.hypot(dx,dy);if(d>cone.r)return false;
 if(d>cone.amb){let da=Math.atan2(dy,dx)-ang;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>cone.half)return false}
 return los({x:vx,y:vy},{x:tx,y:ty});
}
// A névoa é desenhada em meia resolução e ampliada: as bordas ficam suaves naturalmente.
let LRc=null;
function castRays(px,py,ang,half,rad,step){const out=[],n=Math.max(4,Math.ceil(2*half/step));for(let i=0;i<=n;i++){const a=ang-half+2*half*i/n;out.push([a,rayDist(px,py,Math.cos(a),Math.sin(a),rad)])}return out}
function polyFrom(rays,px,py,ang,h,rad){const p=[[px,py]];for(const q of rays)if(Math.abs(q[0]-ang)<=h+1e-6){const d=Math.min(q[1],rad);p.push([px+Math.cos(q[0])*d,py+Math.sin(q[0])*d])}return p}
function drawFog(sx,sy,ang,cone,cx,cy){
 const f=fgx;f.setTransform(1,0,0,1,0,0);f.globalCompositeOperation='source-over';f.clearRect(0,0,VW/2,VH/2);
 f.setTransform(.5,0,0,.5,0,0);f.fillStyle='rgba(0,0,0,.97)';f.fillRect(0,0,VW,VH);
 f.globalCompositeOperation='destination-out';
 const px=sx+cx,py=sy+cy;
 const fill=(pts,a,r)=>{const g=f.createRadialGradient(sx,sy,r*.1,sx,sy,r);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(.7,'rgba(0,0,0,'+a*.8+')');g.addColorStop(1,'rgba(0,0,0,0)');f.fillStyle=g;f.beginPath();pts.forEach((p,i)=>{i?f.lineTo(p[0]-cx,p[1]-cy):f.moveTo(p[0]-cx,p[1]-cy)});f.closePath();f.fill()};
 const ra=castRays(px,py,0,Math.PI,cone.amb*1.5,.3),rc=castRays(px,py,ang,cone.half+.26,cone.r,.06);LRc=rc;
 fill(polyFrom(ra,px,py,0,Math.PI,cone.amb*1.5),.45,cone.amb*1.5);
 fill(polyFrom(ra,px,py,0,Math.PI,cone.amb),1,cone.amb);
 for(const[dh,a]of(QL?[[.14,.3],[0,.85]]:[[.26,.14],[.18,.2],[.11,.3],[.05,.45],[0,.85]]))fill(polyFrom(rc,px,py,ang,cone.half+dh,cone.r),a,cone.r);
 f.setTransform(1,0,0,1,0,0);f.globalCompositeOperation='source-over';
 x.imageSmoothingEnabled=true;x.drawImage(FG,0,0,VW/2,VH/2,0,0,VW,VH);
}
// Brilho da lanterna: luz quente (vermelha no caçador), ponto de luz, feixes finos e poeira no ar
function drawBeam(sx,sy,ang,cone,cx,cy,isH,tt,k){
 const col=isH?'255,90,60':'255,226,150',fl=(.9+.1*Math.sin(tt/70)+.05*Math.sin(tt/23))*k,px=sx+cx,py=sy+cy;
 x.save();x.globalCompositeOperation='lighter';
 const pts=polyFrom(LRc,px,py,ang,cone.half,cone.r),g=x.createRadialGradient(sx,sy,6,sx,sy,cone.r);
 g.addColorStop(0,'rgba('+col+','+.36*fl+')');g.addColorStop(.4,'rgba('+col+','+.15*fl+')');g.addColorStop(1,'rgba('+col+',0)');
 x.fillStyle=g;x.beginPath();pts.forEach((p,i)=>{i?x.lineTo(p[0]-cx,p[1]-cy):x.moveTo(p[0]-cx,p[1]-cy)});x.closePath();x.fill();
 const g2=x.createRadialGradient(sx,sy,0,sx,sy,30);g2.addColorStop(0,'rgba('+col+','+.6*fl+')');g2.addColorStop(1,'rgba('+col+',0)');x.fillStyle=g2;x.beginPath();x.arc(sx,sy,30,0,7);x.fill();
 x.lineWidth=2;
 for(let i=-3;i<=3;i++){const a=ang+i*cone.half/3.4+Math.sin(tt/600+i)*.02,ca=Math.cos(a),sa=Math.sin(a),d=rayDist(px,py,ca,sa,cone.r*.95),gl=x.createLinearGradient(sx,sy,sx+ca*d,sy+sa*d);
  gl.addColorStop(0,'rgba('+col+','+.2*fl+')');gl.addColorStop(1,'rgba('+col+',0)');x.strokeStyle=gl;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+ca*d,sy+sa*d);x.stroke()}
 for(let i=0;i<18;i++){const h1=Math.sin(i*12.9898)*43758.5453,h2=Math.sin(i*78.233)*12345.6789,r1=h1-Math.floor(h1),r2=h2-Math.floor(h2),
   a=ang+(r1*2-1)*cone.half*.95,dd=((r2+tt/9000*(.5+r1))%1)*cone.r*.95,ca=Math.cos(a),sa=Math.sin(a);
  if(rayDist(px,py,ca,sa,dd)<dd-1)continue;
  x.fillStyle='rgba(255,255,255,'+.4*k*(1-dd/cone.r)+')';x.fillRect(sx+ca*dd+Math.sin(tt/700+i)*4-1,sy+sa*dd+Math.cos(tt/900+i)*4-1,2,2)}
 x.restore();
}
// ---------- Impacto: tremor, flash vermelho e partículas (só visual, no aparelho de cada jogador) ----------
const PT=[],prevFl={},prevDone=[];let SHK=0,FLR=0,prevStun=false;
function burst(x0,y0,n,col,sp,life){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*(.4+Math.random());PT.push({x:x0,y:y0-10,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,t:life*(.6+Math.random()*.6),T:life,c:col})}}
function fxUpdate(dt){
 for(const id in G.pl){const q=G.pl[id];if(q.role!=='s')continue;const f=q.fl>0;if(f&&!prevFl[id]){burst(q.x,q.y,14,'#c0392b',110,.5);if(id===me){SHK=.3;FLR=.4}}prevFl[id]=f}
 G.gens.forEach((g,i)=>{if(g.done&&!prevDone[i])burst(g.x,g.y,18,'#f1c40f',90,.45);prevDone[i]=g.done});
 const st=G.h.stun>0;if(st&&!prevStun){burst(G.h.x,G.h.y,16,'#ffffff',120,.4);SHK=Math.max(SHK,.25)}prevStun=st;
 SHK=Math.max(0,SHK-dt);FLR=Math.max(0,FLR-dt);
 for(const p of PT){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=180*dt;p.t-=dt}
 for(let i=PT.length-1;i>=0;i--)if(PT[i].t<=0)PT.splice(i,1);
}
function draw(){
 x.fillStyle='#17171e';x.fillRect(0,0,VW,VH);
 if(!G||!MP)return;
 const h=G.h,mq=G.pl[me],isH=mq&&mq.role==='h',xp=G.xt!=null,open=xp&&G.xt<=0;
 let[vx,vy]=isH?P('h',h.x,h.y):mq?P(me,mq.x,mq.y):[h.x,h.y];
 const nowT=performance.now(),dtv=Math.min(.05,(nowT-RT)/1000);RT=nowT;DTV=dtv;FT=FT*.95+dtv*.05;if(FT>.032)QL=1;else if(FT<.022)QL=0;fxUpdate(dtv);
 const blk=G.blk>0,R=(isH?150*(xp?.9:1):170*(G.ap>0?.5:1))*(blk?.6:1);
 {const f=isH?h:mq;if(f){let fx=f.fx,fy=f.fy;if(fx==null||(!fx&&!fy))[fx,fy]=[[0,1],[-1,0],[1,0],[0,-1]][f.dr||0];let da=Math.atan2(fy,fx)-FA;da=Math.atan2(Math.sin(da),Math.cos(da));FA+=da*Math.min(1,dtv*12)}}
 const cone={r:R*1.15*((mq&&(isH?hasPk(mq,2):hasPk(mq,2)))?1.1:1),half:isH?.55:.62,amb:(isH?58:52)*(blk?.75:1)};
 const vis=(a,b,m=1)=>m!==1?(Math.hypot(a-vx,b-vy)<R*m&&los({x:vx,y:vy},{x:a,y:b})):inView(vx,vy,FA,cone,a,b);
 let cx=Math.max(0,Math.min(W-VW,vx-VW/2)),cy=Math.max(0,Math.min(H-VH,vy-VH/2));
 if(SHK>0){cx+=(Math.random()-.5)*SHK*22;cy+=(Math.random()-.5)*SHK*22}
 x.save();x.translate(-cx,-cy);
 if(BG)x.drawImage(BG,0,0);
 const ex=MP.ex;x.fillStyle=open?'#2ecc71':'#1f5c3a';x.fillRect(ex[0],ex[1],ex[2],ex[3]);
 x.fillStyle='#fff';x.font='11px system-ui';x.textAlign='center';x.fillText('SAÍDA',ex[0]+32,ex[1]+36);
 for(const g of G.gens)if(vis(g.x,g.y))drawGen(g);
 drawDoors(vis);drawKits(vis);drawLamps(vis);drawTraps(vis,isH,vx,vy);
 for(const n of G.noises)if(vis(n.x,n.y)){x.strokeStyle='rgba(255,200,60,'+(1-n.t)+')';x.lineWidth=2;x.beginPath();x.arc(n.x,n.y,n.t*90,0,7);x.stroke()}
 x.font='bold 11px system-ui';
 const[hx,hy]=P('h',h.x,h.y);
 if(vis(hx,hy)){drawStrike(hx,hy,h,h.hid&&G.pl[h.hid]?G.pl[h.hid].ch:0);const shadowCloak=h.hid&&G.pl[h.hid]&&G.pl[h.hid].ch===1&&!h.shadowBroken&&h.still>=1;x.globalAlpha=h.dead?.35:shadowCloak?(isH?.42:.1):1;x.fillStyle='#e74c3c';
  {const ki=KII[h.hid&&G.pl[h.hid]?G.pl[h.hid].ch:0],fr=h.wu>0?3:h.sw>0?4:(h.mv?1+Math.floor(performance.now()/170)%2:0);
   if(ki&&ki.naturalWidth)x.drawImage(ki,fr*CW,(h.dr||0)*CHH,CW,CHH,hx-CW/2,hy+12-CHH,CW,CHH);else{x.beginPath();x.arc(hx,hy,h.r,0,7);x.fill()}}
  if(h.sw>0){x.strokeStyle='rgba(255,255,255,'+h.sw*2+')';x.lineWidth=3;x.beginPath();x.arc(hx,hy,h.r+22,0,7);x.stroke()}
  x.fillStyle='#fff';x.fillText(h.hid&&G.pl[h.hid]?G.pl[h.hid].n:h.st==='c'?'!':h.st==='i'?'?':'',hx,hy-58);{const hh=h.hid&&G.pl[h.hid]?G.pl[h.hid].hp:h.hp;if(hh<200){x.fillStyle='#600';x.fillRect(hx-14,hy-68,28,4);x.fillStyle='#e74c3c';x.fillRect(hx-14,hy-68,28*Math.max(0,hh)/200,4)}}x.globalAlpha=1}
 for(const id in G.pl){
  const q=G.pl[id];if(q.role!=='s'||q.s===2)continue;
  const[px,py]=P(id,q.x,q.y);if(id!==me&&!vis(px,py))continue;
  if(q.s===1){x.fillStyle='#777';x.fillText('✖ '+q.n,px,py);continue}
  {const wk=q.mv?1+Math.floor(performance.now()/150)%2:0,fr=q.ch===4?(q.gd>0?3:q.sw>0?4:wk):(q.sw>0?3:wk);
   if(q.gd>0){const pl=.5+.5*Math.sin(performance.now()/110);x.fillStyle='rgba(60,140,255,'+(.16+.1*pl)+')';x.beginPath();x.arc(px,py,46,0,7);x.fill();x.strokeStyle='rgba(120,190,255,'+(.7+.3*pl)+')';x.lineWidth=2;x.stroke()}
   x.fillStyle=cols[q.ci%5];x.globalAlpha=.55;x.beginPath();x.ellipse(px,py+9,9,4,0,0,7);x.fill();
   x.globalAlpha=q.fl>0?.45:1;
   const si=SVI[q.ch];
   if(si&&si.naturalWidth)x.drawImage(si,fr*CW,(q.dr||0)*CHH,CW,CHH,px-CW/2,py+9-CHH,CW,CHH);
   else{x.fillStyle=cols[q.ci%5];x.beginPath();x.arc(px,py,q.r,0,7);x.fill()}
   x.globalAlpha=1;
   if(id===me){x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.ellipse(px,py+9,9,4,0,0,7);x.stroke()}}
  x.fillStyle='#fff';x.fillText(q.n,px,py-52);
  if(id!==me&&mq&&mq.role==='s'&&mq.ch===2&&Math.hypot(px-vx,py-vy)<160){x.fillStyle='#600';x.fillRect(px-12,py-62,24,4);x.fillStyle='#2ecc71';x.fillRect(px-12,py-62,24*Math.max(0,q.hp)/q.mh,4)}
 }
 if(isH)for(const a of G.al){const an=Math.atan2(a.y-hy,a.x-hx);x.fillStyle='rgba(255,60,60,'+(.4+.6*Math.min(1,a.t/5))+')';
  x.font='bold 26px system-ui';x.fillText('!',hx+Math.cos(an)*70,hy+Math.sin(an)*70+8)}
 for(const p of PT){x.globalAlpha=Math.max(0,p.t/p.T);x.fillStyle=p.c;x.fillRect(p.x-1.5,p.y-1.5,3,3)}x.globalAlpha=1;
 x.restore();
 {const lx=vx-cx,ly=vy-cy,tt=performance.now(),fl=1+.05*Math.sin(tt/90)+.03*Math.sin(tt/37),g2=x.createRadialGradient(lx,ly,0,lx,ly,R*.9),tn=isH?'255,90,70':'255,205,130';
  g2.addColorStop(0,'rgba('+tn+','+.16*fl+')');g2.addColorStop(1,'rgba('+tn+',0)');x.globalCompositeOperation='lighter';x.fillStyle=g2;x.fillRect(0,0,VW,VH);x.globalCompositeOperation='source-over'}
 const sx=vx-cx,sy=vy-cy;drawFog(sx,sy,FA,cone,cx,cy);if(!QL)drawBeam(sx,sy,FA,cone,cx,cy,isH,nowT,blk?.55:1);
 if(blk){x.fillStyle='rgba(0,0,8,.28)';x.fillRect(0,0,VW,VH)}else drawGlows(cx,cy);
 if(FLR>0){const g=x.createRadialGradient(VW/2,VH/2,VH*.25,VW/2,VH/2,VH*.8);g.addColorStop(0,'rgba(180,0,0,0)');g.addColorStop(1,'rgba(180,0,0,'+Math.min(.55,FLR*1.3)+')');x.fillStyle=g;x.fillRect(0,0,VW,VH)}
 x.save();x.textAlign='right';x.font='10px system-ui';x.fillStyle='rgba(255,255,255,.4)';x.fillText(Math.round(1/Math.max(.001,FT))+' fps'+(QL?' (leve)':''),VW-6,VH-6);x.restore();
 if(blk){x.save();x.textAlign='center';x.font='bold 15px system-ui';x.fillStyle='rgba(255,220,120,.95)';x.fillText(G.blk>17?'⚡ APAGÃO! As luzes caíram':'⚡ Apagão: '+Math.ceil(G.blk)+'s',VW/2,42);x.restore()}
if(isH)for(const t of G.traps){x.fillStyle='rgba(255,140,60,.85)';x.beginPath();x.arc(t.x-cx,t.y-cy,3,0,7);x.fill()}
 for(const b of G.bm){const a=Math.min(1,b.t/.2),c=b.b?'60,140,255':'255,50,50',ln=(col,w)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.moveTo(b.x1-cx,b.y1-cy);x.lineTo(b.x2-cx,b.y2-cy);x.stroke()};
  x.lineCap='round';ln('rgba('+c+','+.25*a+')',40);ln('rgba('+c+','+.6*a+')',20);ln('rgba(255,255,255,'+a+')',6);x.lineCap='butt'}
 if(isH&&mq.ch===2)for(const id in G.pl){const q=G.pl[id];if(q.role==='s'&&q.s===0&&q.hp<q.mh&&vis(q.x,q.y,1.4)&&!vis(q.x,q.y)){x.fillStyle='#e74c3c';x.beginPath();x.arc(q.x-cx,q.y-cy,5,0,7);x.fill()}}
 if(isH&&G.mk&&G.mk.t>0){const q=G.pl[G.mk.id];if(q){const qx=q.x-cx,qy=q.y-cy,p=1+.25*Math.sin(performance.now()/150);x.strokeStyle=x.fillStyle='#ff9f1a';x.lineWidth=3;
  if(qx>14&&qx<VW-14&&qy>14&&qy<VH-14){x.beginPath();x.arc(qx,qy,14*p,0,7);x.stroke();x.beginPath();x.arc(qx,qy,4,0,7);x.fill()}
  else{const dx=qx-VW/2,dy=qy-VH/2,s=Math.min((VW/2-24)/(Math.abs(dx)||1e-6),(VH/2-24)/(Math.abs(dy)||1e-6)),ax=VW/2+dx*s,ay=VH/2+dy*s;
   x.save();x.translate(ax,ay);x.rotate(Math.atan2(dy,dx));x.beginPath();x.moveTo(14,0);x.lineTo(-8,-10);x.lineTo(-8,10);x.closePath();x.fill();x.restore();
   x.fillStyle='#fff';x.font='bold 11px system-ui';x.textAlign='center';x.fillText(q.n,ax,ay+(dy>0?-16:24))}}}
 x.textAlign='left';x.font='bold 13px system-ui';
 if(mq){const mx=mq.mh||(isH?200:100),hpw=Math.max(0,mq.hp)/mx*100,stw=isH?mq.sta*100/60:mq.sta;
  x.fillStyle='#0008';x.fillRect(6,VH-30,112,24);x.fillStyle='#e74c3c';x.fillRect(10,VH-26,hpw,7);x.fillStyle=mq.fatigue>0?'#e67e22':'#3498db';x.fillRect(10,VH-15,stw,7)}
 if(xp){x.textAlign='center';x.fillStyle=open?'#2ecc71':'#e74c3c';x.font='bold 16px system-ui';
  x.fillText(open?'SAÍDA ABERTA!':'SAÍDA ABRE EM '+Math.ceil(G.xt)+'s',VW/2,22)}
 x.textAlign='start';
 audioTick(mq,isH,vx,vy,h);
 $('hg').textContent=TH[G.m][0]+' | Geradores '+G.gens.filter(g=>g.done).length+'/'+G.gens.length;
 const cn=mq?CH[mq.role][mq.ch][0]:'';
 $('hl').textContent=!mq?'':isH?'🔪 '+cn+(mq.ch===3?' 🪤'+G.traps.length+'/3':''):mq.s===2?'✔ Escapou!':mq.s===1?'Pego (assistindo)':cn+' ❤ '+Math.max(0,mq.hp)+' ⚡ '+Math.round(mq.sta)+(mq.cn?' 🎯':'')+(mq.kitUse>0?' ⏳'+Math.ceil(mq.kitUse)+'s':' 🩹'+(mq.kit||0));
 $('atk').classList.toggle('hide',!isH);$('act').classList.toggle('hide',!!isH);
 if(isH)$('atk').style.opacity=h.cd>0?.5:1;
 $('it').classList.toggle('hide',!!isH&&mq.ch!==4);if(isH&&mq.ch===4){const ib=$('it');ib.textContent=mq.md?'🌀':'⚔';ib.style.opacity=1}$('drop').classList.toggle('hide',!!isH);if(mq&&!isH){const ib=$('it'),db=$('drop');ib.textContent=mq.kitUse>0?Math.ceil(mq.kitUse)+'s':'KIT';ib.style.opacity=(mq.kitUse>0||((mq.kit||0)>0&&mq.hp<mq.mh&&mq.s===0))?1:.45;db.style.opacity=(mq.kit||0)>0&&mq.s===0?1:.35;db.disabled=!(mq.kit||0)||mq.s!==0}
 if(mq){const sb=$('sk');sb.textContent=mq.gd>0?'🛡':mq.cd>0?Math.ceil(mq.cd)+'s':'✦';sb.style.opacity=mq.cd>0||mq.s!==0?.45:1;sb.style.background=mq.role==='s'&&(mq.ch===3||mq.ch===4)?'#e67e22':''}
 if(G.over){
  const o=G.over,ids=Object.keys(G.pl).filter(i=>!G.pl[i].gone),n=ids.filter(i=>G.rdy[i]).length;
  if($('ov').classList.contains('hide')){closeMG();$('ov').classList.remove('hide');$('ot').textContent=o.hd?'O caçador morreu!':o.esc>0?'Fim de jogo':'O caçador venceu'}
  $('op').textContent=(o.hd?'Os sobreviventes venceram. ':'')+o.esc+' de '+o.total+' sobrevivente(s) escaparam. Prontos: '+n+'/'+ids.length;
  $('back').disabled=!!G.rdy[me];$('back').textContent=G.rdy[me]?'Aguardando os outros...':'Jogar novamente';
 }
}
