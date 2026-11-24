import api from "./api";
import { mapearNotificacao } from "./mapeadores";
import { NotificacaoApi } from "../models/api";
import { Notificacao } from "../models/types";

export const notificacaoService = {
  async listar(_usuarioId: number): Promise<Notificacao[]> {
    const { data } = await api.get<NotificacaoApi[]>("/notificacoes");
    return data.map(mapearNotificacao);
  },

  async marcarComoLida(_usuarioId: number, id: number): Promise<void> {
    await api.put(`/notificacoes/${id}/lida`);
  },

  async marcarTodasComoLidas(_usuarioId: number): Promise<void> {
    await api.put("/notificacoes/lidas");
  },

  async remover(_usuarioId: number, id: number): Promise<void> {
    await api.delete(`/notificacoes/${id}`);
  },
};