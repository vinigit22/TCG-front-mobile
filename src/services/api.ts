import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";
import { CHAVE_TOKEN } from "../constants/storage";
import { configuracao } from "../constants/config";

const api = axios.create({
  baseURL: configuracao.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (!config.headers.Authorization) {
    const token = await AsyncStorage.getItem(CHAVE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let aoSessaoExpirar: (() => void) | null = null;

export function definirAoSessaoExpirar(callback: (() => void) | null) {
  aoSessaoExpirar = callback;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const rotaDeAutenticacao = String(erro?.config?.url ?? "").startsWith("/auth/");
    const enviouToken = Boolean(erro?.config?.headers?.Authorization);
    if (isAxiosError(erro) && erro.response?.status === 401 && enviouToken && !rotaDeAutenticacao) {
      aoSessaoExpirar?.();
    }
    return Promise.reject(erro);
  }
);

export function montarUrlImagem(caminho?: string): string | undefined {
  if (!caminho) return undefined;
  if (caminho.startsWith("/")) return configuracao.apiUrl.replace(/\/$/, "") + caminho;
  return caminho;
}

export default api;