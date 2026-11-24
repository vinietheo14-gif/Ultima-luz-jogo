// Personagens e habilidades (dados) e tela de escolha
// ---------- PERSONAGENS ----------
const CH={s:[['Corredor','mobilidade e fuga','Dash: avança rápido na direção em que está indo (ou olhando) e fica imune a golpes por 0,35 s (recarga 20 s)','Resistência: stamina recupera 20% mais rápido'],
['Engenheiro','reparo de geradores','Concentração: o próximo minigame fica 40% menor (recarga 40 s)','Precisão: ao errar, guarda 25% do progresso'],
['Médica','suporte e recuperação','Primeiros socorros: cura 20 de vida de um aliado próximo (recarga 50 s)','Diagnóstico: vê a vida dos aliados próximos'],
['Mago','ataque à distância','Raio: dispara um raio reto para onde olha. Azul (acertou o caçador): 25 de dano e ele fica lento por 3 s. Vermelho (errou): você perde 10 de vida e fica lento por 3 s (recarga 20 s)','Nenhuma por enquanto'],
['Bombeiro','corpo a corpo e defesa','Guarda do machado: cria uma área azul por 2,5 s e você fica muito lento. Se o caçador atacar dentro dela, o golpe é bloqueado e você contra-ataca (30 de dano e ele fica atordoado 1,5 s; recarga 25 s). Se ninguém atacar: stamina zera, fadiga e recarga de 40 s','Mochila: carrega até 2 medkits']],
h:[['Açougueiro','perseguição e velocidade','Investida: avança rápido em linha reta (recarga 18 s)','Fúria: depois de acertar, +15% de velocidade por 2 s'],
['Sombra','furtividade e perseguição','Apagão: reduz a visão dos sobreviventes por 5 s (recarga 35 s)','Modo Sombra: fica quase invisível quando parado e recebe +18% de velocidade. Após acertar 2 golpes, perde a camuflagem e volta à velocidade normal.'],
['Infectado','rastreamento','Contaminação: marca o sobrevivente mais próximo, em qualquer lugar do mapa, e mostra a posição por 8 s (recarga 30 s)','Instinto: vê feridos de mais longe'],
['Armadilheiro','controle de área','Armadilha: coloca uma armadilha escondida no chão (máx. 3; recarga 12 s). Quem pisa fica preso por 2,5 s e você é avisado. Sobreviventes desarmam apertando AÇÃO perto dela, ou soltam um aliado preso','Rastreador: sempre vê as suas armadilhas; os sobreviventes só as veem de perto'],
['Anjo','perto e à distância','Varredura: o tentáculo gira em volta (raio 125) depois de 0,45 s: 14 de dano e deixa lento por 3 s (recarga 30 s)','Escudo sagrado: recebe 40% menos dano das habilidades dos sobreviventes. Dois modos de ataque (botão ⚔/🌀 ou tecla F): golpe de perto (16 de dano) ou tentáculo longo (150 de alcance, 14 de dano)']]};
const PK={s:[['Pulmões de aço','A stamina recarrega 25% mais rápido'],['Sem pressa','O aviso de gerador errado dura 10 s a menos'],['Olho de lince','O cone de lanterna fica 10% mais longo'],['Pele grossa','+15 de vida máxima'],['Adrenalina','Abaixo de 30 de vida: +15% de velocidade por 5 s (uma vez por partida)'],['Mãos de médico','Usar o medkit leva 7 s em vez de 10 s']],
h:[['Faro','O aviso de gerador errado dura 15 s a mais'],['Passo firme','Na preparação do golpe, anda a 55% em vez de 35%'],['Predador','O cone de lanterna fica 10% mais longo'],['Arrombador','Quebra portas 30% mais rápido'],['Sede de sangue','Cada golpe que acerta reduz 2 s da recarga da habilidade']]};
let pick={sv:0,ki:0,ps:[],ph:[]};
function renderChars(){
 for(const[id,k,pk]of[['csv','s','sv'],['cki','h','ki']]){const box=$(id);box.innerHTML='';
  CH[k].forEach((c,i)=>{const b=document.createElement('button');b.className='cc'+(pick[pk]===i?' on':'');
   const im=(k==='s'?SVI:KII)[i],cn=document.createElement('canvas');cn.width=CW;cn.height=CHH;cn.style.cssText='float:left;width:72px;margin-right:8px;image-rendering:pixelated';if(im.naturalWidth)cn.getContext('2d').drawImage(im,0,0,CW,CHH,0,0,CW,CHH);b.append(cn);
   b.insertAdjacentHTML('beforeend','<b>'+c[0]+'</b> ('+c[1]+')<br>Ativa: '+c[2]+'<br>Passiva: '+c[3]);b.onclick=()=>{pick[pk]=i;renderChars()};box.append(b)})}
 for(const[id,k,pk]of[['cps','s','ps'],['cph','h','ph']]){const box=$(id);box.innerHTML='';
  PK[k].forEach((c,i)=>{const b=document.createElement('button');b.className='cc'+(pick[pk].includes(i)?' on':'');b.innerHTML='<b>'+c[0]+'</b><br>'+c[1];
   b.onclick=()=>{const a=pick[pk],j=a.indexOf(i);if(j>=0)a.splice(j,1);else{a.push(i);if(a.length>2)a.shift()}renderChars()};box.append(b)})}
}
