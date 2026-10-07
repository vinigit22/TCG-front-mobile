import api from "./api";
import { mapearInscricao } from "./mapeadores";
import { InscricaoApi } from "../models/api";
import { Inscricao, Torneio } from "../models/types";

export const inscricaoService = {
  async listarMinhas(usuarioId: number): Promise<Inscricao[]> {
    const { data } = await api.get<InscricaoApi[]>("/inscricoes", { params: { jogadorId: usuarioId } });
    return data.map(mapearInscricao);
  },

  async inscrever(_usuarioId: number, torneio: Torneio): Promise<Inscricao> {
    const { data } = await api.post<InscricaoApi>("/inscricoes", { torneioId: torneio.id });
    return mapearInscricao(data);
  },

  async cancelar(_usuarioId: number, inscricao: Inscricao): Promise<Inscricao> {
    const { data } = await api.put<InscricaoApi>(`/inscricoes/${inscricao.id}/cancelar`);
    return mapearInscricao(data);
  },
};