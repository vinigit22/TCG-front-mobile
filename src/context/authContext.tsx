import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, CadastroRequest, LoginRequest, Usuario } from "../models/types";
import { CHAVE_TOKEN, CHAVE_USUARIO } from "../constants/storage";
import { authService, mensagemErroAuth } from "../services/authService";

interface AuthContextDados {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  erro: string | null;
  login: (dados: LoginRequest) => Promise<void>;
  cadastrar: (dados: CadastroRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextDados>({} as AuthContextDados);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    recuperarSessao();
  }, []);

  async function recuperarSessao() {
    try {
      const [tokenSalvo, usuarioSalvo] = await Promise.all([
        AsyncStorage.getItem(CHAVE_TOKEN),
        AsyncStorage.getItem(CHAVE_USUARIO),
      ]);

      if (tokenSalvo && usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    } catch {
      await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }

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
      const mensagem = mensagemErroAuth(e, "login");
      setErro(mensagem);
      throw e;
    }
  }

  async function cadastrar(dados: CadastroRequest) {
    setErro(null);
    try {
      const resposta = await authService.cadastrar(dados);
      await salvarSessao(resposta);
    } catch (e) {
      const mensagem = mensagemErroAuth(e, "cadastro");
      setErro(mensagem);
      throw e;
    }
  }

  async function logout() {
    await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
    setUsuario(null);
    setErro(null);
  }

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
