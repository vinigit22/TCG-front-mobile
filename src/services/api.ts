import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";
import { CHAVE_TOKEN } from "../constants/storage";
import { configuracao } from "../constants/config";

// Cliente HTTP do TCGBackend. Os services só o usam com configuracao.usarMockApi = false.
const api = axios.create({
  baseURL: configuracao.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// O backend identifica a conta só pelo JWT. As rotas públicas também aceitam o token,
// então ele vai sempre que existir (a não ser que a chamada já traga um Authorization próprio).
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

// O AuthProvider registra aqui o que fazer quando o token deixa de valer
// (expirou, logout em outro aparelho ou senha trocada): o backend responde 401.
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

// A API guarda imagens enviadas como caminho relativo ("/uploads/..."); no modo mock a imagem é uma
// URI local (file://...). Devolve o endereço que o <Image> consegue abrir.
export function montarUrlImagem(caminho?: string): string | undefined {
  if (!caminho) return undefined;
  if (caminho.startsWith("/")) return configuracao.apiUrl.replace(/\/$/, "") + caminho;
  return caminho;
}

export default api;
