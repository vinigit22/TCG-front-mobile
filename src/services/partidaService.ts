import api from "./api";
import { StatusPartida } from "../models/types";

interface PartidaApi {
  id: number;
  status: StatusPartida;
  checkInExpiraEm?: string | null;
  checkInAEm?: string | null;
  checkInBEm?: string | null;
}

export interface PartidaDetalhe {
  id: number;
  status: StatusPartida;
  checkInExpiraEm?: string;
  checkInAEm?: string;
  checkInBEm?: string;
}

export interface ConvocacaoPendente {
  partidaId: number;
  checkInExpiraEm: string;
}

export const partidaService = {
  // Partida em que a loja chamou o jogador e ele ainda não confirmou presença (204 = nenhuma)
  async convocacaoPendente(): Promise<ConvocacaoPendente | null> {
    const { data } = await api.get<PartidaApi | "">("/partidas/convocacao-pendente");
    if (!data) return null;
    return { partidaId: data.id, checkInExpiraEm: data.checkInExpiraEm ?? "" };
  },

  async buscar(id: number): Promise<PartidaDetalhe> {
    const { data } = await api.get<PartidaApi>(`/partidas/${id}`);
    return {
      id: data.id,
      status: data.status,
      checkInExpiraEm: data.checkInExpiraEm ?? undefined,
      checkInAEm: data.checkInAEm ?? undefined,
      checkInBEm: data.checkInBEm ?? undefined,
    };
  },
};