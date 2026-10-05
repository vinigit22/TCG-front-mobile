# TCG Torneios — app mobile

App (Expo / React Native) para jogadores encontrarem torneios de card game, se inscreverem e acompanharem a chave. Lojas e administradores não usam o app.

## Como rodar

```bash
npm install
npx expo start
```

Na saída do Expo dá para abrir no Expo Go, num emulador Android, no simulador iOS ou no navegador.

## Dados: mock ou API

Por padrão o app usa os dados de `src/mocks` (e o AsyncStorage), sem precisar do backend. Para usar o [TCGBackend](../TCGBackend), copie `.env.example` para `.env`, defina `EXPO_PUBLIC_USE_MOCK_API=false` e o endereço da API em `EXPO_PUBLIC_API_URL`, e reinicie o `npx expo start`.

| Onde o app roda | `EXPO_PUBLIC_API_URL` |
|---|---|
| Navegador ou simulador iOS | `http://localhost:8080` |
| Emulador Android | `http://10.0.2.2:8080` |
| Celular físico | `http://<IP da máquina na rede>:8080` |

As telas não sabem de onde vêm os dados: cada service em `src/services` tem o caminho do mock e o da API, escolhido por `configuracao.usarMockApi` (`src/constants/config.ts`).

## Estrutura

```
app/                 telas (expo-router)
src/
├── services/        chamadas à API (ou aos mocks): auth, torneios, inscrições, notificações, jogador
│   ├── api.ts         cliente HTTP, token JWT e montarUrlImagem()
│   ├── mapeadores.ts  JSON do backend -> tipos das telas
│   └── erros.ts       mensagem de erro para o usuário (campo "detail" do backend)
├── models/
│   ├── types.ts       tipos usados pelas telas
│   └── api.ts         formato exato do JSON do backend
├── context/         sessão, inscrições e notificações
├── hooks/           carregamento de torneios e chaveamento
└── mocks/           dados do modo mock
```

Conta do modo mock: `teste@meruem.com` / `123456`.

## Verificações

```bash
npx tsc --noEmit
npm run lint
```
