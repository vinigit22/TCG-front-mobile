# TCG Torneios — app mobile

Aplicativo Expo/React Native para jogadores encontrarem torneios de card game, se inscreverem e acompanharem a chave.

## Como rodar

```bash
npm install
npx expo start
```

Defina a URL da API em `.env` antes de iniciar:

```env
EXPO_PUBLIC_API_URL=http://192.168.3.3:8080
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
| Check-in de partida | `/check-in/[id]` | Cronômetro de 5 minutos + confirmação de presença |

## Check-in de partida

Quando a loja aciona **Convocar** no painel web, o backend define uma janela de 5 minutos e envia a notificação `CHECK_IN_SOLICITADO` para os dois jogadores.

1. O jogador recebe o aviso na aba **Avisos** e toca nele.
2. O app abre `/check-in/[id]` com um cronômetro regressivo.
3. A tela faz polling a cada 5 s em `GET /partidas/{id}` para atualizar o status dos dois jogadores em tempo real.
4. O jogador toca em **CONFIRMAR PRESENÇA** (`POST /partidas/{id}/check-in`).
5. Quando ambos confirmam, a loja pode iniciar a partida normalmente.
6. Se o prazo expirar antes da confirmação, a tela exibe "Prazo expirado" e orienta o jogador a contatar a loja.

## Premiação nos cartões de torneio

O componente `TorneioCard` exibe o campo `premiacao` quando preenchido. Se estiver vazio, mostra **"Sem premiação"**. O valor só é definido pela loja ao final do torneio na aba Resultados do painel web.

## Verificações

```bash
npx tsc --noEmit
npm run lint
```
