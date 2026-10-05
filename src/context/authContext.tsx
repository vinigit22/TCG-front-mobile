import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import {
  AtualizarPerfilDados,
  AuthResponse,
  CadastroRequest,
  LoginRequest,
  Usuario,
} from "../models/types";
import { CHAVE_TOKEN, CHAVE_USUARIO } from "../constants/storage";
import { definirAoSessaoExpirar } from "../services/api";
import { authService, mensagemErroAuth } from "../services/authService";
import { jogadorService } from "../services/jogadorService";

interface AuthContextDados {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  erro: string | null;
  login: (dados: LoginRequest) => Promise<void>;
  cadastrar: (dados: CadastroRequest) => Promise<void>;
  logout: () => Promise<void>;
  atualizarPerfil: (dados: AtualizarPerfilDados) => Promise<void>;
  limparErro: () => void;
}

const AuthContext = createContext<AuthContextDados>({} as AuthContextDados);

// Sessões salvas por versões antigas do app usavam "foto" no lugar de "imagemPerfil"
function normalizarUsuarioSalvo(salvo: Usuario & { foto?: string }): Usuario {
  const { foto, ...usuario } = salvo;
  return { ...usuario, nickname: usuario.nickname ?? "", imagemPerfil: usuario.imagemPerfil ?? foto };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const encerrarSessaoLocal = useCallback(async () => {
    await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
    setUsuario(null);
  }, []);

  // Token recusado pelo backend (401): a sessão local deixa de valer
  useEffect(() => {
    definirAoSessaoExpirar(() => {
      encerrarSessaoLocal();
    });
    return () => definirAoSessaoExpirar(null);
  }, [encerrarSessaoLocal]);

  useEffect(() => {
    async function recuperarSessao() {
      try {
        const [tokenSalvo, usuarioSalvo] = await Promise.all([
          AsyncStorage.getItem(CHAVE_TOKEN),
          AsyncStorage.getItem(CHAVE_USUARIO),
        ]);

        if (!tokenSalvo || !usuarioSalvo) {
          return;
        }

        setUsuario(normalizarUsuarioSalvo(JSON.parse(usuarioSalvo)));

        // Com a API ligada, confere o token e atualiza o perfil. Sem rede, mantém a sessão salva.
        try {
          const atualizado = await authService.buscarUsuarioLogado();
          if (atualizado) {
            await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(atualizado));
            setUsuario(atualizado);
          }
        } catch (e) {
          const status = isAxiosError(e) ? e.response?.status : undefined;
          if (status === 401 || status === 403) {
            await encerrarSessaoLocal();
          }
        }
      } catch {
        await encerrarSessaoLocal();
      } finally {
        setCarregando(false);
      }
    }

    recuperarSessao();
  }, [encerrarSessaoLocal]);

  async function salvarSessao(resposta: AuthResponse) {
    await AsyncStorage.setItem(CHAVE_TOKEN, resposta.token);
    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
    setUsuario(resposta.usuario);
  }

  async function login(dados: LoginRequest) {
    setErro(null);
    try {
      const resposta = await authService.login(dados);
      await salvarSessao(resposta);
    } catch (e) {
      setErro(mensagemErroAuth(e, "login"));
      throw e;
    }
  }

  async function cadastrar(dados: CadastroRequest) {
    setErro(null);
    try {
      const resposta = await authService.cadastrar(dados);
      await salvarSessao(resposta);
    } catch (e) {
      setErro(mensagemErroAuth(e, "cadastro"));
      throw e;
    }
  }

  async function logout() {
    // Antes de apagar o token: o backend precisa dele para encerrar a sessão
    await authService.logout();
    await encerrarSessaoLocal();
    setErro(null);
  }

  // Foto nova vai por upload; depois nome e nickname. Erros sobem para a tela mostrar.
  async function atualizarPerfil(dados: AtualizarPerfilDados) {
    if (!usuario) return;

    let imagemPerfil = usuario.imagemPerfil;
    if (dados.novaFoto) {
      imagemPerfil = await jogadorService.enviarFoto(usuario.id, dados.novaFoto.uri, dados.novaFoto.mimeType);
    }

    const atualizado = await jogadorService.atualizarPerfil(
      { ...usuario, imagemPerfil },
      { nome: dados.nome, nickname: dados.nickname }
    );
    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(atualizado));
    setUsuario(atualizado);
  }

  const limparErro = useCallback(() => setErro(null), []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        carregando,
        erro,
        login,
        cadastrar,
        logout,
        atualizarPerfil,
        limparErro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
