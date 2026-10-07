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

## Verificações

```bash
npx tsc --noEmit
npm run lint
```