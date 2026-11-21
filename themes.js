// Texturas e temas dos mapas (geradas por código)
// ---------- TEXTURAS / TEMAS ----------
const TH=[['Floresta','noise',['#24401f','#2d4f27','#1b3319'],'vplanks',['#4a3322','#5a4029','#33231a']],
['Hospital','tiles',['#b9c7c4','#9fb0ad','#d6e0de'],'tiles',['#6f8f8a','#4f6d68','#8aa8a2']],
['Construção abandonada','noise',['#6b6b66','#5a5a55','#7a7a73'],'bricks',['#8a4a3a','#5a342a','#a35c48']],
['Parque','noise',['#3f7a35','#4a8a3d','#356a2d'],'noise',['#1f5a2a','#2a6e33','#17461f']],
['Cemitério','noise',['#3a3d45','#2f3239','#454955'],'bricks',['#6a6d78','#4a4d57','#7f8390']],
['Armazém','planks',['#7a5a3a','#6a4c30','#8a6844'],'vplanks',['#9a7440','#7a5a30','#b08850']],
['Escola','checker',['#8a8f7a','#767b66','#9a9f8a'],'bricks',['#a0634a','#7a4a38','#b87656']],
['Porão','noise',['#2a2a2e','#222226','#34343a'],'bricks',['#4a4036','#33291f','#5e5244']],
['Pântano','noise',['#2f4a3a','#3a5a40','#243d2f'],'vplanks',['#3a3a28','#2a2a1c','#4a4a34']],
['Mansão','planks',['#5a2f2a','#4a2622','#6b3a33'],'tiles',['#3a2a3f','#2a1d2e','#4b3752']]];
function mkTile(type,c){
 const t=document.createElement('canvas');t.width=t.height=32;const g=t.getContext('2d'),r=rng(type.length*131+c[0].charCodeAt(2)*17+c[1].charCodeAt(4)*7);
 g.fillStyle=c[0];g.fillRect(0,0,32,32);
 const px=(i,j,col)=>{g.fillStyle=col;g.fillRect(i*2,j*2,2,2)};
 for(let i=0;i<16;i++)for(let j=0;j<16;j++){const v=r();if(v<.22)px(i,j,c[1]);else if(v<.32)px(i,j,c[2])}
 g.fillStyle=c[1];
 if(type==='tiles'){g.fillRect(0,0,32,2);g.fillRect(0,0,2,32);g.fillRect(16,0,2,32);g.fillRect(0,16,32,2)}
 if(type==='planks')for(let y=0;y<32;y+=8)g.fillRect(0,y,32,2);
 if(type==='vplanks')for(let xx=0;xx<32;xx+=8)g.fillRect(xx,0,2,32);
 if(type==='bricks'){g.fillStyle=c[2];for(let y=0;y<32;y+=8){g.fillRect(0,y,32,2);const o=(y/8)%2?8:0;g.fillRect(o,y,2,8);g.fillRect(o+16,y,2,8)}}
 if(type==='checker'){g.fillStyle=c[1];g.fillRect(0,0,16,16);g.fillRect(16,16,16,16)}
 return t;
}
function themeBg(m){
 const T=TH[m],cv2=document.createElement('canvas');cv2.width=W;cv2.height=H;const g=cv2.getContext('2d');
 g.fillStyle=g.createPattern(mkTile(T[1],T[2]),'repeat');g.fillRect(0,0,W,H);
 const D=mkDeco(m,g);D.floor();
 g.fillStyle=g.createPattern(mkTile(T[3],T[4]),'repeat');for(const w of MP.wl)g.fillRect(w[0],w[1],w[2],w[3]);
 for(const w of MP.wl){g.fillStyle='rgba(255,255,255,.14)';g.fillRect(w[0],w[1],w[2],3);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(w[0],w[1]+w[3]-4,w[2],4);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(w[0]+w[2]-3,w[1],3,w[3])}
 D.walls();mkLights(m);
 g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,0,W,H);return cv2;
}
let BG=null;


// ---------- DETALHES (chão, paredes, sangue, plantas) E LUZES ----------
let LT=[];
const LTP=[['150,185,255',.16,120,0],['205,235,255',.2,110,1],['255,170,80',.2,115,0],['255,230,150',.18,115,0],['150,200,230',.15,120,0],['255,190,90',.2,115,0],['255,240,190',.18,110,1],['255,150,60',.22,110,0],['150,255,160',.16,120,0],['255,170,100',.2,110,0]];
function mkLights(m){const r=rng(m*911+5),p=LTP[m];LT=shuf(MP.spots.slice(),r).slice(0,8).map(q=>({x:q[0]+(r()-.5)*36,y:q[1]+(r()-.5)*36,c:p[0],a:p[1],r:p[2],f:p[3],ph:r()*6}))}
function mkDeco(m,g){
 const nat=m===0||m===3||m===8,humid=[4,7,8,9].includes(m),wl=MP.wl;
 const rn=(a,b)=>a+r()*(b-a),pick=a=>a[Math.floor(r()*a.length)];
 let r=rng(m*2654435+17);
 const inW=(px,py,p)=>wl.some(w=>px>w[0]-p&&px<w[0]+w[2]+p&&py>w[1]-p&&py<w[1]+w[3]+p);
 const fl=p=>{for(let k=0;k<30;k++){const px=rn(8,W-8),py=rn(8,H-8);if(!inW(px,py,p))return[px,py]}return null};
 const nw=()=>{for(let k=0;k<20;k++){const w=pick(wl),s=Math.floor(r()*4);let px,py;
  if(s===0){px=rn(w[0],w[0]+w[2]);py=w[1]-rn(3,9)}else if(s===1){px=rn(w[0],w[0]+w[2]);py=w[1]+w[3]+rn(3,9)}else if(s===2){px=w[0]-rn(3,9);py=rn(w[1],w[1]+w[3])}else{px=w[0]+w[2]+rn(3,9);py=rn(w[1],w[1]+w[3])}
  if(px>4&&px<W-4&&py>4&&py<H-4&&!inW(px,py,2))return[px,py]}return null};
 const gc=nat?['#1f4a1c','#2e6a27','#4b9a3c','#6bbf52']:['#34402a','#46573a','#5d6e4a'];
 const crack=(px,py,n,col,a)=>{g.fillStyle=col;for(let i=0;i<n;i++){g.fillRect(Math.round(px/2)*2,Math.round(py/2)*2,2,2);a+=rn(-.7,.7);px+=Math.cos(a)*2.4;py+=Math.sin(a)*2.4;if(r()<.1)crack(px,py,Math.floor(n/3),col,a+rn(-1.2,1.2))}};
 const wcrack=w=>{let px=rn(w[0]+3,w[0]+w[2]-3),py=rn(w[1]+3,w[1]+w[3]-3),a=rn(0,6.28);const n=Math.floor(rn(6,16));
  for(let i=0;i<n;i++){const sx=Math.round(px/2)*2,sy=Math.round(py/2)*2;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(sx,sy,2,2);g.fillStyle='rgba(255,255,255,.13)';g.fillRect(sx+2,sy,1,2);
   a+=rn(-.8,.8);px+=Math.cos(a)*2.4;py+=Math.sin(a)*2.4;if(px<w[0]+2||px>w[0]+w[2]-2||py<w[1]+2||py>w[1]+w[3]-2)break}};
 const blood=(px,py,s)=>{
  for(let k=0;k<5;k++){g.fillStyle=pick(['rgba(90,12,14,.55)','rgba(125,20,22,.45)','rgba(60,8,10,.5)']);g.beginPath();g.ellipse(px+rn(-s*.5,s*.5),py+rn(-s*.35,s*.35),rn(s*.3,s),rn(s*.2,s*.7),rn(0,3),0,7);g.fill()}
  const nd=Math.floor(rn(5,12));for(let k=0;k<nd;k++){const a=rn(0,6.28),d=rn(s,s*2.4);g.fillStyle='rgba(110,16,18,.6)';g.beginPath();g.arc(px+Math.cos(a)*d,py+Math.sin(a)*d,rn(.8,2.4),0,7);g.fill()}
  if(r()<.4){const a=rn(0,6.28),L=rn(14,40);for(let k=0;k<L;k+=3){g.fillStyle='rgba(100,14,16,'+(.5-k/L*.35)+')';g.beginPath();g.arc(px+Math.cos(a)*k,py+Math.sin(a)*k,Math.max(1,s*.35*(1-k/L)),0,7);g.fill()}}};
 const tuft=(px,py)=>{const n=Math.floor(rn(4,8));for(let k=0;k<n;k++){g.strokeStyle=pick(gc);g.lineWidth=rn(1,2);g.beginPath();g.moveTo(px+rn(-2,2),py);g.lineTo(px+rn(-5,5),py-rn(4,10));g.stroke()}};
 const bush=(px,py)=>{const s=rn(5,9);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(px,py+s*.7,s*1.6,s*.6,0,0,7);g.fill();
  for(let k=0;k<7;k++){g.fillStyle=pick(gc);g.beginPath();g.arc(px+rn(-s,s),py+rn(-s*.6,s*.5),rn(s*.45,s*.8),0,7);g.fill()}
  g.fillStyle=gc[gc.length-1];for(let k=0;k<4;k++)g.fillRect(px+rn(-s,s),py+rn(-s*.8,0),2,2)};
 const fern=(px,py)=>{g.strokeStyle=pick(gc);g.lineWidth=1.5;for(let k=0;k<8;k++){const a=k/8*6.28+rn(-.2,.2),L=rn(6,11);g.beginPath();g.moveTo(px,py);g.quadraticCurveTo(px+Math.cos(a)*L*.6,py+Math.sin(a)*L*.6-3,px+Math.cos(a)*L,py+Math.sin(a)*L);g.stroke()}};
 const flower=(px,py)=>{tuft(px,py);g.fillStyle=pick(['#f5f5f5','#f7d54a','#e86fa0','#b78cf0','#ff8c42']);for(let k=0;k<3;k++)g.fillRect(Math.round(px+rn(-4,4)),Math.round(py-rn(5,11)),2,2)};
 const shroom=(px,py)=>{g.fillStyle='#e8e0c8';g.fillRect(px-1,py-3,2,4);g.fillStyle=pick(nat?['#c0392b','#a0522d','#d9b36a']:['#c9c3a8','#8c8470']);g.beginPath();g.ellipse(px,py-4,4,2.5,0,Math.PI,0);g.fill();g.fillStyle='#fff';g.fillRect(px-2,py-5,1,1);g.fillRect(px+1,py-6,1,1)};
 const vine=w=>{let px=rn(w[0]+4,w[0]+w[2]-4),py=rn(w[1]+3,w[1]+w[3]*.5),a=rn(.6,2.5);const n=Math.floor(rn(8,20));
  for(let i=0;i<n;i++){g.fillStyle=pick(gc);g.beginPath();g.ellipse(px,py,rn(1.5,3),rn(1,2),a,0,7);g.fill();g.fillStyle='#2a3a22';g.fillRect(Math.round(px),Math.round(py),1,1);
   a+=rn(-.6,.6);px+=Math.cos(a)*3;py+=Math.sin(a)*3+.6;if(px<w[0]+2||px>w[0]+w[2]-2||py<w[1]+2||py>w[1]+w[3]-2)break}};
 return{
  floor(){g.save();r=rng(m*2654435+17);
   for(let k=0;k<650;k++){const p=fl(3);if(p){g.fillStyle=pick(['rgba(0,0,0,.28)','rgba(255,255,255,.1)',nat?'rgba(20,50,15,.35)':'rgba(40,30,20,.3)']);g.fillRect(Math.round(p[0]),Math.round(p[1]),rn(1,3)|0||2,2)}}
   for(let k=0;k<30;k++){const p=fl(6);if(p)crack(p[0],p[1],Math.floor(rn(10,22)),'rgba(0,0,0,.4)',rn(0,6.28))}
   const np=m===8?16:nat?7:6;for(let k=0;k<np;k++){const p=fl(18);if(p){const s=rn(8,18);g.fillStyle=m===8?'rgba(20,45,25,.5)':'rgba(15,25,35,.4)';g.beginPath();g.ellipse(p[0],p[1],s,s*.55,rn(0,3),0,7);g.fill();g.fillStyle='rgba(140,170,200,.13)';g.beginPath();g.ellipse(p[0]-s*.2,p[1]-s*.15,s*.5,s*.22,0,0,7);g.fill()}}
   for(let k=0;k<13;k++){const p=fl(10);if(p)blood(p[0],p[1],rn(5,13))}
   const pl=(n,f,near)=>{for(let k=0;k<n;k++){const p=near||(r()<.5)?nw():fl(5);if(p)f(Math.round(p[0]),Math.round(p[1]))}};
   pl(nat?260:45,tuft);pl(nat?32:4,flower);pl(nat?24:5,fern);pl(nat?14:m===7||m===4?10:3,shroom);pl(nat?42:4,bush,true);
   g.restore()},
  walls(){g.save();r=rng(m*2654435+99);
   for(const w of wl){
    if(r()<.5){g.fillStyle='rgba(0,0,0,'+rn(.12,.22)+')';g.fillRect(Math.round(rn(w[0]+2,w[0]+w[2]-8)),w[1],rn(3,8)|0,Math.floor(rn(14,w[3]*.9)))}
    if(r()<.7){const n=1+Math.floor(r()*3);for(let k=0;k<n;k++)wcrack(w)}
    if(nat||humid){for(let k=0;k<18;k++){g.fillStyle=pick(['rgba(60,110,50,.5)','rgba(40,80,40,.5)','rgba(90,130,60,.4)']);const e=r()<.5;g.fillRect(Math.round(e?rn(w[0],w[0]+w[2]):w[0]+rn(0,3)),Math.round(e?w[1]+w[3]-rn(2,5):rn(w[1]+w[3]*.4,w[1]+w[3])),rn(2,5)|0,rn(2,4)|0)}}
    if(r()<(nat?.55:m===4||m===9?.4:.15)){const n=1+Math.floor(r()*2);for(let k=0;k<n;k++)vine(w)}
   }
   for(let k=0;k<12;k++){const w=pick(wl),px=Math.round(rn(w[0]+4,w[0]+w[2]-4)),L=Math.floor(rn(8,Math.min(30,w[3]-4)));
    g.fillStyle='rgba(115,16,18,.75)';g.fillRect(px,w[1]+1,2,L);g.beginPath();g.arc(px+1,w[1]+L+1,2,0,7);g.fill();
    for(let j=0;j<5;j++){g.fillStyle='rgba(100,14,16,.6)';g.fillRect(px+Math.round(rn(-6,6)),w[1]+Math.round(rn(0,L)),2,2)}}
   g.restore()}
 }
}
