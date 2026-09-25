import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notificacao } from "../models/types";
import { notificacoesMock } from "../mocks/notificacoesEChaveamento";

const CHAVE_NOTIFICACOES = "@meruem/notificacoes";

interface NotificacaoContextDados {
  notificacoes: Notificacao[];
  quantidadeNaoLidas: number;
  removerNotificacao: (id: number) => Promise<void>;
  limparNotificacoes: () => Promise<void>;
}

const NotificacaoContext = createContext<NotificacaoContextDados>(
  {} as NotificacaoContextDados
);

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    try {
      const salvas = await AsyncStorage.getItem(CHAVE_NOTIFICACOES);

      if (salvas) {
        setNotificacoes(JSON.parse(salvas));
        return;
      }

      await AsyncStorage.setItem(
        CHAVE_NOTIFICACOES,
        JSON.stringify(notificacoesMock)
      );

      setNotificacoes(notificacoesMock);
    } catch {
      setNotificacoes(notificacoesMock);
    }
  }

  async function salvarNotificacoes(lista: Notificacao[]) {
    await AsyncStorage.setItem(
      CHAVE_NOTIFICACOES,
      JSON.stringify(lista)
    );

    setNotificacoes(lista);
  }

  async function removerNotificacao(id: number) {
    const novasNotificacoes = notificacoes.filter(
      (notificacao) => notificacao.id !== id
    );

    await salvarNotificacoes(novasNotificacoes);
  }

  async function limparNotificacoes() {
    await salvarNotificacoes([]);
  }

  const quantidadeNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  return (
    <NotificacaoContext.Provider
      value={{
        notificacoes,
        quantidadeNaoLidas,
        removerNotificacao,
        limparNotificacoes,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
}

export function useNotificacoes() {
  return useContext(NotificacaoContext);
}