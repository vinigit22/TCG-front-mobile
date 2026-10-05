import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import api from "./api";
import { mensagemDeErro } from "./erros";
import { mapearPerfil, mapearUsuario } from "./mapeadores";
import { configuracao } from "../constants/config";
import { CHAVE_USUARIOS_MOCK } from "../constants/storage";
import { LoginResponseApi, PerfilJogadorApi } from "../models/api";
import { AuthResponse, CadastroRequest, LoginRequest, Usuario } from "../models/types";

interface UsuarioMock extends Usuario {
  senha: string;
}

function criarTokenMock(): string {
  // Token usado SOMENTE para o modo local. O backend real retorna um JWT.
  return `mock.jwt.${Date.now()}`;
}

async function obterUsuariosMock(): Promise<UsuarioMock[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_USUARIOS_MOCK);
  if (salvo) {
    return JSON.parse(salvo) as UsuarioMock[];
  }

  const usuarioPadrao: UsuarioMock = {
    id: 1,
    nome: "Vinicius Marques",
    nickname: "vinimarques",
    email: "teste@meruem.com",
    senha: "123456",
    tipo: "JOGADOR",
  };

  await AsyncStorage.setItem(CHAVE_USUARIOS_MOCK, JSON.stringify([usuarioPadrao]));
  return [usuarioPadrao];
}

async function salvarUsuariosMock(usuarios: UsuarioMock[]) {
  await AsyncStorage.setItem(CHAVE_USUARIOS_MOCK, JSON.stringify(usuarios));
}

function respostaMock(usuario: UsuarioMock): AuthResponse {
  const { senha: _senha, ...usuarioSemSenha } = usuario;
  return {
    token: criarTokenMock(),
    usuario: usuarioSemSenha,
  };
}

async function loginMock(dados: LoginRequest): Promise<AuthResponse> {
  const usuarios = await obterUsuariosMock();
  const usuario = usuarios.find(
    (item) => item.email.toLowerCase() === dados.email.trim().toLowerCase()
  );

  if (!usuario || usuario.senha !== dados.senha) {
    throw new Error("Email ou senha inválidos");
  }

  return respostaMock(usuario);
}

async function cadastrarMock(dados: CadastroRequest): Promise<AuthResponse> {
  const usuarios = await obterUsuariosMock();
  const email = dados.email.trim().toLowerCase();
  const nickname = dados.nickname.trim();

  // Mesmas regras de unicidade do backend (mensagens iguais às do 409)
  if (usuarios.some((item) => item.email.toLowerCase() === email)) {
    throw new Error("Email já cadastrado");
  }
  if (usuarios.some((item) => item.nickname === nickname)) {
    throw new Error("Nickname já cadastrado");
  }

  const proximoId = usuarios.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  const novoUsuario: UsuarioMock = {
    id: proximoId,
    nome: dados.nome.trim(),
    nickname,
    email,
    senha: dados.senha,
    tipo: "JOGADOR",
  };

  await salvarUsuariosMock([...usuarios, novoUsuario]);
  return respostaMock(novoUsuario);
}

// O app é só para jogadores: contas de loja/admin recebem o token, mas ele é encerrado na hora
async function recusarContaNaoJogador(resposta: LoginResponseApi): Promise<never> {
  await api
    .post("/auth/logout", null, { headers: { Authorization: `Bearer ${resposta.token}` } })
    .catch(() => undefined);
  throw new Error("Este app é exclusivo para jogadores. Contas de loja e de administrador não entram por aqui.");
}

export const authService = {
  async login(dados: LoginRequest): Promise<AuthResponse> {
    if (configuracao.usarMockApi) {
      return loginMock(dados);
    }

    const { data } = await api.post<LoginResponseApi>("/auth/login", dados);
    if (data.tipo !== "JOGADOR") {
      return recusarContaNaoJogador(data);
    }
    return { token: data.token, usuario: mapearUsuario(data) };
  },

  async cadastrar(dados: CadastroRequest): Promise<AuthResponse> {
    if (configuracao.usarMockApi) {
      return cadastrarMock(dados);
    }

    const { data } = await api.post<LoginResponseApi>("/auth/registro/jogador", dados);
    return { token: data.token, usuario: mapearUsuario(data) };
  },

  // Encerra o token no backend (os outros aparelhos continuam logados). Falha de rede é ignorada:
  // o app apaga a sessão local de qualquer forma.
  async logout(): Promise<void> {
    if (configuracao.usarMockApi) {
      return;
    }

    await api.post("/auth/logout").catch(() => undefined);
  },

  // Confere se o token salvo ainda vale e traz o perfil atualizado. No modo mock devolve null (nada a conferir).
  async buscarUsuarioLogado(): Promise<Usuario | null> {
    if (configuracao.usarMockApi) {
      return null;
    }

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
