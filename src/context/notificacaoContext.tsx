import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { Notificacao } from "../models/types";
import { notificacaoService } from "../services/notificacaoService";

interface NotificacaoContextDados {
  // Notificações da conta logada (vazio sem login: no backend elas exigem token)
  notificacoes: Notificacao[];
  quantidadeNaoLidas: number;
  carregando: boolean;
  marcarComoLida: (id: number) => Promise<void>;
  marcarTodasComoLidas: () => Promise<void>;
  removerNotificacao: (id: number) => Promise<void>;
  recarregar: () => Promise<void>;
}

// Lista carregada e de qual usuário ela é (ao trocar de conta, a lista antiga deixa de valer)
interface Carregadas {
  usuarioId: number;
  notificacoes: Notificacao[];
}

const NotificacaoContext = createContext<NotificacaoContextDados>(
  {} as NotificacaoContextDados
);

function listarSemFalhar(usuarioId: number) {
  return notificacaoService.listar(usuarioId).catch(() => [] as Notificacao[]);
}

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [carregadas, setCarregadas] = useState<Carregadas | null>(null);

  useEffect(() => {
    if (usuarioId === undefined) return;

    let ativo = true;
    listarSemFalhar(usuarioId).then((notificacoes) => {
      if (ativo) setCarregadas({ usuarioId, notificacoes });
    });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const recarregar = useCallback(async () => {
    if (usuarioId === undefined) return;
    const notificacoes = await listarSemFalhar(usuarioId);
    setCarregadas({ usuarioId, notificacoes });
  }, [usuarioId]);

  const daContaAtual = usuarioId !== undefined && carregadas?.usuarioId === usuarioId;
  const notificacoes = daContaAtual ? carregadas.notificacoes : [];
  const carregando = usuarioId !== undefined && !daContaAtual;

  // Aplica uma mudança na lista já carregada da conta atual
  function alterarLista(alteracao: (lista: Notificacao[]) => Notificacao[]) {
    setCarregadas((atuais) =>
      atuais && atuais.usuarioId === usuarioId
        ? { ...atuais, notificacoes: alteracao(atuais.notificacoes) }
        : atuais
    );
  }

  async function marcarComoLida(id: number) {
    if (usuarioId === undefined) return;
    await notificacaoService.marcarComoLida(usuarioId, id);
    const agora = new Date().toISOString();
    alterarLista((lista) =>
      lista.map((item) => (item.id === id && !item.lida ? { ...item, lida: true, lidaEm: agora } : item))
    );
  }

  async function marcarTodasComoLidas() {
    if (usuarioId === undefined) return;
    await notificacaoService.marcarTodasComoLidas(usuarioId);
    const agora = new Date().toISOString();
    alterarLista((lista) => lista.map((item) => (item.lida ? item : { ...item, lida: true, lidaEm: agora })));
  }

  async function removerNotificacao(id: number) {
    if (usuarioId === undefined) return;
    await notificacaoService.remover(usuarioId, id);
    alterarLista((lista) => lista.filter((item) => item.id !== id));
  }

  const quantidadeNaoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length;

  return (
    <NotificacaoContext.Provider
      value={{
        notificacoes,
        quantidadeNaoLidas,
        carregando,
        marcarComoLida,
        marcarTodasComoLidas,
        removerNotificacao,
        recarregar,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
}

export function useNotificacoes() {
  return useContext(NotificacaoContext);
}
