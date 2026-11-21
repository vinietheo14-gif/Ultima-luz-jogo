# Última Luz

Jogo 2D multiplayer de sobrevivência no estilo *Dead by Daylight* e *Forsaken*. Um caçador contra até 4 sobreviventes. Ligue os geradores, abra a saída e escape antes de ser pego.

Roda direto no navegador (celular ou PC), sem cadastro e sem instalar nada. Nenhum dado é salvo: quando a página fecha, tudo some.

## Como jogar

1. Abra o link do jogo e digite seu nome.
2. **Criar sala** gera um código de 4 letras. Mande o link e o código pros amigos.
3. Os amigos digitam o nome e o código e tocam em **Entrar**.
4. O anfitrião toca em **Iniciar partida**.

Até 5 jogadores por sala. No fim da partida, todo mundo precisa tocar em **Jogar novamente** pra voltar à sala. Com 1 jogador sozinho, o caçador é controlado por IA.

## Objetivo

**Sobreviventes:** ligue todos os geradores e fuja pela saída (a porta verde no canto).

**Caçador:** derrube todos os sobreviventes antes que escapem.

## Controles

| Ação | Celular | Teclado |
|---|---|---|
| Mover | Joystick | WASD ou setas |
| Correr | Botão CORRER | Shift |
| Interagir com gerador | Botão AÇÃO | Espaço ou E |
| Atacar (só o caçador) | Botão ATACAR | Espaço ou E |
| Habilidade ativa | Botão HABIL. | Q |
| Usar medkit | Botão KIT | F |
| Soltar medkit | Botão ⬇ | G |

## Geradores e minigames

Cada mapa tem de 7 a 12 geradores. Chegue perto de um e aperte AÇÃO. Cada gerador tem um minigame:

- **Clique!** Aperte no momento certo, quando a barra estiver na zona verde. São 3 acertos.
- **Acerte os pontos!** Toque nos botões amarelos até não sobrar nenhum. No teclado, aperte a letra (W, A, S, D) de cada ponto.
- **Barriga vazia!** Clique várias vezes pra encher a barra, que vai esvaziando sozinha.

**Se você errar**, o minigame recomeça do zero e o caçador recebe um **!** apontando pra direção do gerador por 30 segundos.

## Regras

- **Visão limitada:** você só enxerga em um círculo ao redor de você, e paredes bloqueiam a visão.
- **Vida:** sobreviventes têm 100 e o caçador 200. O caçador ataca pelo botão **ATACAR** (alcance curto, recarga de 1,45 s). O dano depende do assassino escolhido; veja o ranking oficial abaixo. Se a vida do caçador chegar a 0 (por exemplo, pelo raio azul do Mago), ele morre e os sobreviventes vencem a partida; a barrinha de vida aparece em cima dele quando está ferido.
- **Stamina:** 100 para os sobreviventes e 60 para o caçador. Correr é um sprint curto e rápido (200 de velocidade, contra 100 dos sobreviventes e 108 do caçador andando) e gasta stamina rápido, que recarrega quando você anda ou para. Veja **Stamina e fadiga** abaixo.
- **Saída:** quando todos os geradores estão ligados, começa uma contagem de 20 segundos. Nesse tempo o caçador fica **2x mais rápido** e perde **10% da visão**. Depois a saída abre.
- **Mapas:** 10 versões, sorteadas a cada partida, cada uma com um tema e texturas pixeladas próprias: Floresta, Hospital, Construção abandonada, Parque, Cemitério, Armazém, Escola, Porão, Pântano e Mansão.
- **Personagens:** cada sobrevivente e cada assassino tem seu sprite pixelado, com animação de andar nas 4 direções. Os assassinos também têm animação de ataque.

## Sorteio do caçador

O caçador é sorteado no começo de cada partida. Quanto mais você joga, maior a chance:

- +1 por partida jogada (ganhando ou perdendo)
- +2 por gerador ligado
- +2 por sobrevivente derrubado, se você for o caçador

Se todos estão com 0, a chance é igual pra todos. A porcentagem aparece na sala de espera. Os números são guardados só enquanto a sala existe.

## Personagens e habilidades

Na tela inicial, toque em **Personagens** para escolher um sobrevivente e um assassino. Você usa o sobrevivente escolhido quando for sobrevivente e o assassino quando for sorteado caçador. Cada personagem tem uma habilidade **ativa** (com recarga, mostrada no botão) e uma **passiva**.

**Sobreviventes**
- **Corredor:** Dash (avança uns 150 px em 0,2 s na direção do movimento, ou para onde está olhando se parado, e fica imune a golpes por 0,35 s; recarga 20 s). Passiva: stamina recupera 20% mais rápido.
- **Engenheiro:** Concentração (próximo minigame 40% menor, recarga 40 s). Passiva: ao errar, guarda 25% do progresso.
- **Médica:** Primeiros socorros (cura 20 de vida de um aliado próximo, recarga 50 s). Passiva: vê a vida dos aliados próximos.

**Assassinos**
- **Açougueiro:** Investida (avança em linha reta, recarga 18 s). Passiva: +15% de velocidade por 2 s depois de acertar.
- **Sombra:** Apagão (reduz a visão dos sobreviventes por 5 s, recarga 35 s). Passiva: fica ainda mais transparente quando parado e recebe +18% de velocidade enquanto estiver no Modo Sombra. Depois de acertar 2 golpes, perde a camuflagem e volta à velocidade normal.
- **Infectado:** Contaminação (marca o sobrevivente mais próximo, em qualquer lugar do mapa, por 8 s, recarga 30 s). Passiva: vê feridos de mais longe.
- **Armadilheiro:** Armadilha (coloca uma armadilha escondida no chão, máx. 3 ativas, recarga 12 s; quem pisa fica preso 2,5 s e o caçador é avisado; sobreviventes desarmam com AÇÃO perto dela ou soltam um aliado preso). Passiva: sempre vê as próprias armadilhas; os sobreviventes só as veem de perto (70 px). O sprite ainda é provisório (Açougueiro recolorido).

Quando o caçador é a IA, ele não usa habilidades. A IA existe **somente em partidas solo**. Em partidas multiplayer, todos os personagens são controlados por jogadores; se o caçador se desconectar, ele não é substituído por um bot. No modo solo, a IA usa o perfil de dano do Açougueiro.

## Ranking oficial de dano dos assassinos

Este é o ranking oficial de dano por golpe:

| Posição | Assassino | Dano por golpe |
|---:|---|---:|
| 1º | Açougueiro | **20** |
| 2º | Armadilheiro | **17** |
| 3º (empate) | Infectado | **15** |
| 3º (empate) | Sombra | **15** |
| 5º | Anjo | **14** (ataque à distância) |

A recarga do ataque continua em 1,45 segundo. No modo solo, o Caçador controlado pela IA usa o perfil do Açougueiro (20 de dano).

## IA do Caçador (somente solo)

A IA calcula rotas pelo mapa para contornar paredes, escolher caminhos alternativos e aproveitar atalhos quando existe uma passagem direta segura. Ela só identifica sobreviventes dentro do alcance de detecção e com linha de visão desobstruída; ao perder o contato visual, procura por um curto período a última posição conhecida, sem prever movimentos nem enxergar através das paredes. Ruídos de ações do jogo também podem indicar uma posição para investigar.

Em partidas multiplayer, **não existe IA**: o Caçador e os sobreviventes são controlados pelos jogadores. Se o jogador que controla o Caçador sair, nenhum bot assume o lugar dele.

## Como o multiplayer funciona

O jogo usa **PeerJS (WebRTC)**. O anfitrião roda a partida no próprio navegador e os outros jogadores se conectam direto nele. Não existe servidor próprio.

Por isso:
- Se o anfitrião fechar a página ou perder a conexão, a sala acaba.
- Em algumas redes (principalmente dados móveis), a conexão direta pode falhar. Se isso acontecer, tente por Wi-Fi.
- O anfitrião joga com menos atraso que os outros.

## Como colocar no ar

O projeto **não usa pastas**: todos os arquivos ficam juntos na raiz, com o `index.html` no meio deles. Isso facilita enviar tudo de uma vez pelo celular. Os arquivos de imagem e som têm prefixo (`sprite-`, `tex-`, `som-`) pra não se misturarem com o código.

**Vercel (pelo GitHub):**
1. Crie um repositório no GitHub e use **Add file → Upload files**. No celular, selecione todos os arquivos de uma vez (ou envie em 2 ou 3 lotes) e confirme com **Commit changes**.
2. Na Vercel, toque em **Add New → Project**, escolha o repositório e faça **Deploy**. Não precisa configurar nada (nenhum comando de build). Se pedir um *Framework Preset*, use **Other**.
3. Use o link gerado. Cada vez que você enviar um arquivo novo pro GitHub, a Vercel atualiza o site sozinha.

**Netlify:** em `app.netlify.com/drop`, arraste os arquivos (ou o `.zip`) e use o link gerado.

**GitHub Pages:** envie todos os arquivos pro repositório e, em *Settings → Pages*, escolha a branch `main`.

Pra atualizar, substitua só os arquivos que mudaram. O nome do arquivo precisa ficar igual.

## Tecnologias

- HTML, CSS e JavaScript puro (Canvas 2D)
- [PeerJS](https://peerjs.com/) para as conexões entre jogadores

## Estrutura

```
index.html            página principal (telas do menu, sala e jogo)
style.css             estilos
manifest.webmanifest  nome e ícones para adicionar à tela inicial
config.js             constantes, sprites e estado global
characters.js         dados dos personagens e tela de escolha
maps.js               geração dos 10 mapas e das portas
themes.js             texturas, detalhes e luzes dos mapas
network.js            sala, lobby e conexão (PeerJS)
sim.js                simulação (roda no anfitrião): movimento, geradores, caçador, IA, habilidades
minigames.js          minigames dos geradores
render.js             desenho na tela
audio.js              som ambiente, música e passos
settings.js           menu, teclas configuráveis, HUD do celular e tela cheia
input.js              controles (teclado, joystick e botões)
main.js               loop principal e inicialização
sprite-*.png          sprite sheets dos 10 personagens (5 sobreviventes e 5 assassinos)
tex-generator.png     textura do gerador
tex-medkit.png        textura do medkit
som-floresta.mp3      som ambiente
som-drama.mp3         música do caçador
som-passos.mp3        passos
lanterna.png          lanterna do menu (lanterna-small.png é a versão pequena dos mapas)
icon-192.png, icon-512.png, favicon-32.png, favicon.ico, apple-touch-icon.png   ícones
```

Os scripts (`.js`) são carregados em ordem pelo `index.html` (a ordem importa).

**Sprites:** cada sheet tem células de 96x76 px, com 4 linhas (baixo, esquerda, direita, cima). As colunas são parado, andando A, andando B e, nos assassinos, preparar golpe e golpe.

## Golpe com preparação (todos os assassinos)

Ao apertar ATACAR, o assassino leva **0,45 s de preparação**: uma **área vermelha** aparece nele, ele anda bem devagar (35%) e só então o golpe acerta quem ainda estiver dentro da área. Dá pra desviar saindo dela a tempo. Depois do golpe, a recarga é de 1,45 s. Vale também para o Caçador IA.

## Bombeiro (sobrevivente)

- **Ativa, Guarda do machado:** cria uma **área azul** em volta dele por 2,5 s e ele fica **muito lento** (12% da velocidade), sem correr nem interagir. Se o assassino atacar dentro da área, o golpe é **bloqueado (parry)** e o Bombeiro contra-ataca: **30 de dano** e o caçador fica **atordoado 1,5 s**; recarga de 25 s. Se ninguém atacar, ele paga o preço: **stamina zera, entra em fadiga e a recarga sobe pra 40 s**.
- **Passiva, Mochila:** carrega até **2 medkits** (os outros carregam 1).
- O botão de habilidade do Bombeiro e do Mago fica **laranja** (habilidades ofensivas).

## Anjo (assassino à distância)

- **Ataque normal:** um **tentáculo dourado** em linha reta, com 150 de alcance e 14 de dano. A área vermelha de preparação mostra o caminho. Paredes bloqueiam.
- **Ativa, Varredura:** depois de 0,45 s, o tentáculo gira em volta (raio 85): 10 de dano e deixa lento por 2,5 s; recarga 30 s.
- **Passiva, Escudo sagrado:** recebe 40% menos dano das habilidades dos sobreviventes (raio do Mago e contra-ataque do Bombeiro).

## Nome do jogador

O nome é obrigatório. Se o campo estiver vazio, o jogo sorteia um nome (por exemplo, `Lobo42`). O botão 🎲 sorteia outro nome.

## Visão em cone (lanterna)

A visão agora é um **cone de lanterna** que gira com o personagem (sobrevivente: cerca de 72°; caçador: cerca de 63°), mais uma pequena luz ao redor dele. As **paredes bloqueiam a luz** e fazem sombra: quem está atrás de uma parede não aparece. O alcance do cone cai no Apagão e com a habilidade Apagão da Sombra, e o caçador perde 10% de alcance na contagem da saída. O caçador controlado pela IA não usa o cone.

## Evento aleatório: Apagão

Uma vez por partida, entre 50 e 120 s depois do começo, as luzes caem por **20 s**: a visão de todos diminui e o mapa escurece. Aparece um aviso no topo com a contagem.

## Impacto visual

Ao levar um golpe a tela treme e pisca em vermelho, com partículas de sangue. O gerador ligado solta faíscas, e o atordoamento do caçador (parry) faz uma explosão branca e um pequeno tremor. Tudo é só visual e acontece no aparelho de cada jogador.

## Builds: passivas extras

Na tela **Personagens**, cada jogador escolhe **até 2 passivas de sobrevivente** e **até 2 de assassino** (sem repetir). Vale a lista do papel que você receber na partida, somada à passiva do personagem.

**Sobrevivente:** Pulmões de aço (stamina recarrega 25% mais rápido), Mãos rápidas (minigames começam com 15% pronto), Sem pressa (aviso de gerador errado dura 10 s a menos), Olho de lince (cone 10% mais longo), Pele grossa (+15 de vida), Adrenalina (abaixo de 30 de vida, +15% de velocidade por 5 s, uma vez por partida) e Mãos de médico (medkit em 7 s).

**Assassino:** Faro (aviso de gerador errado dura 15 s a mais), Passo firme (anda a 55% na preparação do golpe), Predador (cone 10% mais longo), Arrombador (quebra porta 30% mais rápido) e Sede de sangue (cada golpe que acerta reduz 2 s da recarga da habilidade).

Exemplos: **Fugitivo** (Pulmões de aço + Olho de lince), **Mecânico** (Mãos rápidas + Sem pressa), **Tanque** (Pele grossa + Adrenalina), **Perseguidor** (Faro + Predador). Os efeitos são aplicados e conferidos pelo anfitrião. O Caçador IA não usa passivas.

## Ideias futuras

- Habilidades especiais para sobreviventes e caçadores
- Sobreviventes controlados por IA
- Mais mapas e minigames

## Controles personalizados

No menu, toque em **Controles**.

- **Teclado (PC):** troque qualquer tecla (mover, correr, ação/atacar, habilidade, usar ou soltar medkit). Cada ação aceita 2 teclas; Backspace limpa e Esc cancela. Os pontos do minigame mostram as suas teclas de movimento.
- **Celular (HUD):** em **Editar HUD**, arraste o joystick e os botões, inclusive **KIT** e **SOLTAR**, ajuste tamanho e opacidade. O layout é salvo separado para vertical e horizontal. O ícone de menu fica disponível na tela inicial e durante a partida; nele há controles, tela cheia, som e saída do jogo.

Tudo fica salvo no aparelho (localStorage).

## Portas (listras)

Cada mapa tem 4 portas de listras **vermelhas**, com um botão de cada lado (posições aleatórias, mas fixas por mapa). O sobrevivente aperta **AÇÃO** perto de um botão: a listra fica **verde** e bloqueia o caçador (sobreviventes passam). O caçador aperta **ATACAR** colado na porta e faz um minigame rápido (o da "Barriga vazia!") para quebrá-la. A IA quebra sozinha depois de uns 2,5 s.

No celular, em **Controles**, dá para trocar o joystick por **setas**.

## Mago (sobrevivente)

*Atualização:* o raio ficou **mais largo** (acerta o caçador com folga maior) e mais grosso e visível, pra parecer um ataque à distância.

Habilidade **Raio** (recarga 20 s): dispara um raio reto para onde o Mago está olhando (4 direções, para nas paredes). **Azul** = acertou o caçador: 25 de dano e caçador 45% mais lento por 3 s. **Vermelho** = errou: o Mago perde 10 de vida (nunca morre pelo próprio raio) e fica 40% mais lento por 3 s. Sem passiva por enquanto.

## Medkit

Cada partida espalha 7 medkits pelo mapa, bem afastados entre si (visíveis só na luz). O sobrevivente pega ao passar por cima e só pode carregar **1 medkit**. Para usar, aperte **F** (configurável em Controles) ou o botão **KIT** e permaneça completamente parado por **10 segundos**; mover, correr, sofrer um golpe ou ser interrompido cancela a preparação sem consumir o kit. Ao terminar, cura 40 de vida. O botão **⬇** (tecla **G**) solta o medkit no chão para outro sobrevivente pegar; o botão também pode ser reposicionado no editor de HUD. A textura é `tex-medkit.png`.

## Som

- `som-floresta.mp3`: som ambiente de floresta, em loop durante a partida.
- `som-drama.mp3`: música dramática que começa quando o caçador chega perto (a 450 px) e fica mais alta quanto mais perto ele estiver.
- `som-passos.mp3`: passos seus (mais rápidos ao correr) e de quem está perto de você (a até 230 px, mais alto quanto mais perto).

Em **Controles** dá para ligar/desligar o som. No iPhone o volume não é ajustável pelo navegador, então a música e os passos distantes só ligam ou desligam.

## Detalhes e iluminação dos mapas

Cada mapa ganha detalhes gerados por código (fixos por mapa): pedrinhas e rachaduras no chão, poças, manchas de sangue (com respingos e rastros), plantas (grama, arbustos, samambaias, flores, cogumelos), rachaduras, limo, trepadeiras e escorridos de sangue nas paredes. Mapas de natureza (Floresta, Parque, Pântano) têm bem mais plantas.

Iluminação: 8 lanternas por mapa, cada tema com sua cor de luz (as de Hospital e Escola piscam). O brilho delas aparece mesmo no escuro. O campo de visão do jogador tem uma luz quente que tremula (vermelha para o caçador). Código em `themes.js` (`mkDeco`, `mkLights`) e `render.js` (`drawLamps`, `drawGlows`).

## Ícone do site

A lanterna agora é o ícone da aba (`favicon.ico`, `favicon-32.png`), do atalho na tela inicial do celular (`apple-touch-icon.png`, `manifest.webmanifest`) e fica no topo do menu.

## Stamina e fadiga

Sobreviventes, caçador controlado por jogador e Caçador IA usam a mesma regra:

- Correr gasta stamina até **zerar** (um sprint dura cerca de 1,7 s para o sobrevivente e 1 s para o caçador).
- Ao chegar a zero, o personagem entra em **fadiga por 1,5 segundo**: fica **mais lento** (60% da velocidade) e a stamina **não recupera** nesse tempo. A barra de stamina fica laranja.
- Depois dos 1,5 s, a velocidade volta ao normal e a stamina começa a recarregar.
- Pra voltar a correr, solte e aperte **CORRER** de novo (assim, segurar o botão com a stamina vazia não prende você na lentidão). A IA volta a correr quando tiver 20 de stamina.
- A regra é aplicada na simulação do anfitrião, inclusive à IA no modo solo.
