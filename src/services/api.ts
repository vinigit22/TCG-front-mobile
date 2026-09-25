import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CHAVE_TOKEN, CHAVE_USUARIO } from "../constants/storage";
import { configuracao } from "../constants/config";

const ROTAS_PUBLICAS = ["/jogos", "/auth/login", "/auth/register"];

const api = axios.create({
  baseURL: configuracao.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const url = config.url || "";
  const ehRotaPublica = ROTAS_PUBLICAS.some((rota) => url.startsWith(rota));

  if (!ehRotaPublica) {
    const token = await AsyncStorage.getItem(CHAVE_TOKEN);
    const usuario = await AsyncStorage.getItem(CHAVE_USUARIO);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (usuario) {
      try {
        const usuarioParseado = JSON.parse(usuario) as { id: number };
        config.headers["X-Usuario-Id"] = String(usuarioParseado.id);
      } catch {
        // Ignora uma sessão local inválida; o backend poderá responder 401.
      }
    }
  }

  return config;
});

export default api;
