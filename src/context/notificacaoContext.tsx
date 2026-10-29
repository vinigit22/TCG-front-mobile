import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { Notificacao } from "../models/types";
import { notificacaoService } from "../services/notificacaoService";

const INTERVALO_ATUALIZACAO = 15000;

interface NotificacaoContextDados {
  notificacoes: Notificacao[];
  quantidadeNaoLidas: number;
  carregando: boolean;
  marcarComoLida: (id: number) => Promise<void>;
  marcarTodasComoLidas: () => Promise<void>;
  removerNotificacao: (id: number) => Promise<void>;
  recarregar: () => Promise<void>;
}

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
      if (!ativo) return;
      setCarregadas({ usuarioId, notificacoes });
    });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  useEffect(() => {
    if (usuarioId === undefined) return;
    let ativo = true;

    const intervalo = setInterval(() => {
      notificacaoService
        .listar(usuarioId)
        .then((notificacoes) => {
          if (!ativo) return;
          setCarregadas({ usuarioId, notificacoes });
        })
        .catch(() => undefined);
    }, INTERVALO_ATUALIZACAO);

    return () => {
      ativo = false;
      clearInterval(intervalo);
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