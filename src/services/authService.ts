import { isAxiosError } from "axios";
import api from "./api";
import { mensagemDeErro } from "./erros";
import { mapearPerfil, mapearUsuario } from "./mapeadores";
import { JogadorRequestApi, LoginResponseApi, PerfilJogadorApi } from "../models/api";
import { AuthResponse, CadastroRequest, LoginRequest, Usuario } from "../models/types";

function cabecalhoDoToken(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

async function buscarDataNascimento(token: string): Promise<string | undefined> {
  try {
    const { data } = await api.get<PerfilJogadorApi>("/jogadores/me", cabecalhoDoToken(token));
    return data.dataNascimento ?? undefined;
  } catch {
    return undefined;
  }
}

async function gravarDataNascimento(contaId: number, token: string, dataNascimento: string) {
  try {
    const { data: atual } = await api.get<PerfilJogadorApi>("/jogadores/me", cabecalhoDoToken(token));
    if (atual.dataNascimento?.slice(0, 10) === dataNascimento) return;

    const corpo: JogadorRequestApi = {
      nome: atual.nome,
      nickname: atual.nickname,
      imagemPerfil: atual.imagemPerfil,
      bio: atual.bio,
      dataNascimento,
      cidade: atual.cidade,
      estado: atual.estado,
    };
    await api.put(`/jogadores/${contaId}`, corpo, cabecalhoDoToken(token));
  } catch {
    return;
  }
}

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
    const dataNascimento = await buscarDataNascimento(data.token);
    return { token: data.token, usuario: { ...mapearUsuario(data), dataNascimento } };
  },

  async cadastrar(dados: CadastroRequest): Promise<AuthResponse> {
    const { data } = await api.post<LoginResponseApi>("/auth/registro/jogador", dados);
    await gravarDataNascimento(data.contaId, data.token, dados.dataNascimento);
    return { token: data.token, usuario: { ...mapearUsuario(data), dataNascimento: dados.dataNascimento } };
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