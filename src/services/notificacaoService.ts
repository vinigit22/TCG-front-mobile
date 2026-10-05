import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { mapearNotificacao } from "./mapeadores";
import { configuracao } from "../constants/config";
import { PREFIXO_NOTIFICACOES_MOCK } from "../constants/storage";
import { notificacoesMock } from "../mocks/notificacoesEChaveamento";
import { NotificacaoApi } from "../models/api";
import { Notificacao } from "../models/types";

// No backend as notificações são sempre da conta do token; no mock, uma lista por usuário

async function lerMock(usuarioId: number): Promise<Notificacao[]> {
  const salvo = await AsyncStorage.getItem(PREFIXO_NOTIFICACOES_MOCK + usuarioId);
  if (salvo) {
    return JSON.parse(salvo) as Notificacao[];
  }

  await salvarMock(usuarioId, notificacoesMock);
  return notificacoesMock;
}

async function salvarMock(usuarioId: number, lista: Notificacao[]) {
  await AsyncStorage.setItem(PREFIXO_NOTIFICACOES_MOCK + usuarioId, JSON.stringify(lista));
}

export const notificacaoService = {
  // Mais recentes primeiro
  async listar(usuarioId: number): Promise<Notificacao[]> {
    if (configuracao.usarMockApi) {
      return lerMock(usuarioId);
    }

    const { data } = await api.get<NotificacaoApi[]>("/notificacoes");
    return data.map(mapearNotificacao);
  },

  async marcarComoLida(usuarioId: number, id: number): Promise<void> {
    if (configuracao.usarMockApi) {
      const agora = new Date().toISOString();
      const lista = await lerMock(usuarioId);
      await salvarMock(
        usuarioId,
        lista.map((item) => (item.id === id && !item.lida ? { ...item, lida: true, lidaEm: agora } : item))
      );
      return;
    }

    await api.put(`/notificacoes/${id}/lida`);
  },

  async marcarTodasComoLidas(usuarioId: number): Promise<void> {
    if (configuracao.usarMockApi) {
      const agora = new Date().toISOString();
      const lista = await lerMock(usuarioId);
      await salvarMock(usuarioId, lista.map((item) => (item.lida ? item : { ...item, lida: true, lidaEm: agora })));
      return;
    }

    await api.put("/notificacoes/lidas");
  },

  async remover(usuarioId: number, id: number): Promise<void> {
    if (configuracao.usarMockApi) {
      const lista = await lerMock(usuarioId);
      await salvarMock(usuarioId, lista.filter((item) => item.id !== id));
      return;
    }

    await api.delete(`/notificacoes/${id}`);
  },
};
