export const configuracao = {
  usarMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API !== "false",
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
};
