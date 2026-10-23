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

export const partidaService = {
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