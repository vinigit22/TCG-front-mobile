export const configuracao = {
  // Padrão true: o app usa os dados de src/mocks e o AsyncStorage, sem chamar o backend.
  // Com EXPO_PUBLIC_USE_MOCK_API=false os services passam a chamar o TCGBackend (ver .env.example).
  usarMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API !== "false",
  // web / simulador iOS: http://localhost:8080 · emulador Android: http://10.0.2.2:8080
  // celular físico: http://<IP da máquina na rede>:8080
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
};
