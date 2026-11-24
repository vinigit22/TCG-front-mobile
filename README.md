# TCG Torneios — app mobile

Aplicativo Expo/React Native para jogadores encontrarem torneios de card game, se inscreverem e acompanharem a chave.

## Como rodar

```bash
npm install
npx expo start
```

Defina a URL da API em `.env` antes de iniciar:

```env
EXPO_PUBLIC_API_URL=http://192.xxx.x.x:8080(Ip local da sua máquina)
```

| Onde o app roda | `EXPO_PUBLIC_API_URL` |
|---|---|
| Navegador ou simulador iOS | `http://localhost:8080` |
| Emulador Android | `http://10.0.2.2:8080` |
| Celular físico | `http://<IP-da-maquina-na-rede>:8080` |

O aplicativo consome exclusivamente a API: autenticação, torneios, chaveamento, inscrições, notificações, perfil, fotos e troféus.

## Design system

Identidade visual alinhada ao front-web (TopDeck):

- **Paleta:** roxo (`#5034b4`) como cor primária, verde-menta (`#34cf96`) como acento de ação, neutros tinta sobre fundo claro (`#f8f7fb`). Definida em `src/constants/colors.ts`.
- **Tipografia:** Plus Jakarta Sans (corpo) e Bungee (marca/logo), carregadas via `@expo-google-fonts`. Referências em `src/constants/theme.ts` (objeto `fontes`).
- **Bordas:** raios suaves alinhados ao web — sm 8 / md 12 / lg 16. Bordas de cartão em `1px` com cor `#e1dfeb` (tinta-200), sem borda grossa escura.
- **Sombras:** sutis, com `shadowColor: #1b1830` e opacidade 8%.

## Estrutura

```text
app/                 telas (expo-router)
src/
├── services/        chamadas à API
├── models/          tipos do aplicativo e respostas da API
├── context/         sessão, inscrições e notificações
├── hooks/           carregamento de torneios e chaveamento
└── components/      componentes visuais reutilizáveis
```

## Telas e navegação

### Abas principais

| Aba | Arquivo | Descrição |
|---|---|---|
| Descobrir | `app/(tabs)/index.tsx` | Vitrine pública de torneios abertos e em andamento |
| Meus Torneios | `app/(tabs)/torneios.tsx` | Torneios em que o jogador está inscrito |
| Eventos | `app/(tabs)/eventos.tsx` | Eventos publicados ou em andamento (troca, promoção, etc.) |
| Avisos | `app/(tabs)/notificacoes.tsx` | Notificações do jogador; toque em `CHECK_IN_SOLICITADO` abre o cronômetro |
| Perfil | `app/(tabs)/perfil.tsx` | Foto, nickname, bio, edição de dados e troféus ganhos |

### Telas extras

| Tela | Rota | Descrição |
|---|---|---|
| Detalhe de torneio | `/torneio/[id]` | Inscrição, chave, placar |
| Login / Cadastro | `/login`, `/cadastro` | Autenticação JWT |
| Check-in de partida | `/check-in/[id]` | Tela verde com botão gigante, cronômetro de 5 minutos e confirmação de presença |

## Check-in de partida

Quando a loja aciona **Chamar jogadores** no painel web, o backend define uma janela de 5 minutos e envia a notificação `CHECK_IN_SOLICITADO` para os dois jogadores.

1. O app consulta `GET /partidas/convocacao-pendente` a cada 4 s (`ConvocacaoAutomatica`, no layout raiz) e, quando o jogador é chamado, **abre sozinho a tela verde** `/check-in/[id]`, em qualquer lugar do app. Cada convocação abre a tela uma vez; pela notificação ou pelo botão da partida o jogador também chega nela.
2. A tela mostra o cronômetro de 5 minutos e um **botão gigante CONFIRMAR PRESENÇA** (`POST /partidas/{id}/check-in`).
3. Depois de confirmar, ela mostra quem já confirmou (polling de 3 s em `GET /partidas/{id}`).
4. Quando **os dois** confirmam, a partida **começa sozinha** (`EM_ANDAMENTO`) e a tela avisa o número da mesa. Só então a loja lança o resultado.
5. Se o prazo acabar: quem confirmou vence por **W.O.** (tela verde) e quem não confirmou perde (tela vermelha). Se ninguém confirmou, a mesa termina sem vencedor e ninguém avança.

## Atualização automática
O quê	                                   Intervalo
Convocação pendente (ConvocacaoAutomatica)	4 s
Tela de check-in	                        3 s
Chaveamento e Minha partida	                10 s
Eventos	                                    15 s
Notificações	                            15 s

## Premiação nos cartões de torneio

O componente `TorneioCard` exibe o campo `premiacao` quando preenchido. Se estiver vazio, mostra **"Sem premiação"**. O valor só é definido pela loja ao final do torneio na aba Resultados do painel web.

## Verificações

```bash
npx tsc --noEmit
npm run lint
```
