import { isAxiosError } from "axios";
import api from "./api";
import { mensagemDeErro } from "./erros";
import { mapearPerfil, mapearUsuario } from "./mapeadores";
import { LoginResponseApi, PerfilJogadorApi } from "../models/api";
import { AuthResponse, CadastroRequest, LoginRequest, Usuario } from "../models/types";

async function recusarContaNaoJogador(resposta: LoginResponseApi): Promise<never> {
  await api
    .post("/auth/logout", null, { headers: { Authorization: `Bearer ${resposta.token}` } })
    .catch(() => undefined);
  throw new Error("Este app é exclusivo para jogadores. Contas de loja e de administrador não entram por aqui.");
}

export const authService = {
  async login(dados: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<LoginResponseApi>("/auth/login", dados);
    if (data.tipo !== "JOGADOR") {
      return recusarContaNaoJogador(data);
    }
    return { token: data.token, usuario: mapearUsuario(data) };
  },

  async cadastrar(dados: CadastroRequest): Promise<AuthResponse> {
    const { data } = await api.post<LoginResponseApi>("/auth/registro/jogador", dados);
    return { token: data.token, usuario: mapearUsuario(data) };
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout").catch(() => undefined);
  },

  async buscarUsuarioLogado(): Promise<Usuario | null> {
    const { data } = await api.get<PerfilJogadorApi>("/jogadores/me");
    return mapearPerfil(data);
  },
};

export function mensagemErroAuth(error: unknown, acao: "login" | "cadastro") {
  if (acao === "login" && isAxiosError(error) && error.response?.status === 401) {
    return "Email ou senha inválidos";
  }

  return mensagemDeErro(
    error,
    acao === "login" ? "Não foi possível realizar o login" : "Não foi possível concluir o cadastro"
  );
}