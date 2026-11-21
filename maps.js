// Geração dos 10 mapas
// ---------- MAPAS (10 versões) ----------
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// Embaralhamento determinístico (Fisher-Yates). Não usar sort com comparador aleatório: cada navegador ordena de um jeito e o mapa ficaria diferente entre os jogadores.
function shuf(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function build(m){
 const r=rng(m*7919+13),wl=[],fill=.4+(m%5)*.08,ext=.3+(m>>1)*.08,nodes=[];
 for(let i=1;i<15;i+=2)for(let j=1;j<11;j+=2)if(r()<fill){const e=r();wl.push([i*C,j*C,e<ext/2?2*C:C,e>=ext/2&&e<ext?2*C:C])}
 for(let i=0;i<15;i+=2)for(let j=0;j<11;j+=2)nodes.push([i,j]);
 const res=['0,10','2,10','0,8','2,8','4,10','14,0','14,10'],sp=res.slice(0,5).map(k=>k.split(',').map(n=>n*C+32));
 const free=shuf(nodes.filter(n=>!res.includes(n.join(','))),r).slice(0,7+Math.floor(r()*6));
 return{doors:mkDoors(m,wl,res),wl,sp,hs:[14*C+32,32],ex:[14*C,10*C,C,C],spots:nodes.map(n=>[n[0]*C+32,n[1]*C+32]),
  gens:free.map(n=>({x:n[0]*C+32,y:n[1]*C+32,k:Math.floor(r()*3),done:false}))};
}


// Portas (listras vermelhas): 4 por mapa, cada uma com um botão de cada lado. Posições aleatórias, mas fixas por mapa.
function mkDoors(m,wl,res){
 const r=rng(m*104729+7),c=[],c2=[],cw=(a,b)=>a<0||b<0||a>14||b>10||wl.some(w=>w[0]<a*C+32&&w[0]+w[2]>a*C+32&&w[1]<b*C+32&&w[1]+w[3]>b*C+32),
 fr=(a,b)=>!wl.some(w=>w[0]<a*C+C&&w[0]+w[2]>a*C&&w[1]<b*C+C&&w[1]+w[3]>b*C);
 for(let i=0;i<15;i++)for(let j=0;j<11;j++){
  const v=i%2===0&&j%2===1,hz=i%2===1&&j%2===0;if(!v&&!hz)continue;
  const n1=v?[i,j-1]:[i-1,j],n2=v?[i,j+1]:[i+1,j];
  if([n1,n2].some(n=>res.includes(n.join(',')))||!fr(i,j))continue;
  const sd=v?[cw(i-1,j),cw(i+1,j)]:[cw(i,j-1),cw(i,j+1)];
  (sd[0]&&sd[1]?c:c2).push({i,j,v,n1,n2})}
 const pool=shuf(c.length>=4?c:c.concat(c2),r),d=[];
 for(const p of pool){if(d.length>=4)break;if(d.every(q=>Math.abs(q.i-p.i)+Math.abs(q.j-p.j)>=4))d.push(p)}
 return d.map(p=>{const cx=p.i*C+32,cy=p.j*C+32;
  const b=[p.n1,p.n2].map(n=>{const nx=n[0]*C+32,ny=n[1]*C+32,L=Math.hypot(cx-nx,cy-ny);return[Math.round(nx+(cx-nx)/L*28),Math.round(ny+(cy-ny)/L*28)]});
  return{r:p.v?[cx-32,cy-5,C,10]:[cx-5,cy-32,10,C],b}});
}
