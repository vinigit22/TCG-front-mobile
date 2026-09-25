import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";
import { configuracao } from "../constants/config";
import { CHAVE_USUARIOS_MOCK } from "../constants/storage";
import { AuthResponse, CadastroRequest, LoginRequest, Usuario } from "../models/types";

interface UsuarioMock extends Usuario {
  senha: string;
}

function criarTokenMock(): string {
  // Token usado SOMENTE para o modo local. O backend real deverá retornar um JWT real.
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
    const erro = new Error("Email ou senha inválidos");
    Object.assign(erro, { response: { status: 401 } });
    throw erro;
  }

  return respostaMock(usuario);
}

async function cadastrarMock(dados: CadastroRequest): Promise<AuthResponse> {
  const usuarios = await obterUsuariosMock();
  const email = dados.email.trim().toLowerCase();

  if (usuarios.some((item) => item.email.toLowerCase() === email)) {
    const erro = new Error("Este email já está cadastrado");
    Object.assign(erro, { response: { status: 409 } });
    throw erro;
  }

  const proximoId = usuarios.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  const novoUsuario: UsuarioMock = {
    id: proximoId,
    nome: dados.nome.trim(),
    nickname: dados.nickname.trim(),
    email,
    senha: dados.senha,
    tipo: "JOGADOR",
  };

  await salvarUsuariosMock([...usuarios, novoUsuario]);
  return respostaMock(novoUsuario);
}

export const authService = {
  async login(dados: LoginRequest): Promise<AuthResponse> {
    if (configuracao.usarMockApi) {
      return loginMock(dados);
    }

    const { data } = await api.post<AuthResponse>("/auth/login", dados);
    return data;
  },

  async cadastrar(dados: CadastroRequest): Promise<AuthResponse> {
    if (configuracao.usarMockApi) {
      return cadastrarMock(dados);
    }

    const { data } = await api.post<AuthResponse>("/auth/register", dados);
    return data;
  },
};

export function mensagemErroAuth(error: unknown, acao: "login" | "cadastro") {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "Email ou senha inválidos";
    if (error.response?.status === 409) return "Este email já está cadastrado";
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique se o backend está ativo.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return acao === "login"
    ? "Não foi possível realizar o login"
    : "Não foi possível concluir o cadastro";
}
