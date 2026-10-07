import { isAxiosError } from "axios";
import api from "./api";
import { mapearChaveamento, mapearTorneio } from "./mapeadores";
import { ChaveamentoApi, TorneioApi } from "../models/api";
import { Chaveamento, StatusTorneio, Torneio } from "../models/types";

export const STATUS_VISIVEIS: StatusTorneio[] = [
  "INSCRICOES_ABERTAS",
  "INSCRICOES_ENCERRADAS",
  "EM_ANDAMENTO",
  "FINALIZADO",
];

export const torneioService = {
  async listar(): Promise<Torneio[]> {
    const { data } = await api.get<TorneioApi[]>("/torneios", {
      params: { status: STATUS_VISIVEIS.join(",") },
    });
    return data.map(mapearTorneio);
  },

  async buscar(id: number): Promise<Torneio | null> {
    try {
      const { data } = await api.get<TorneioApi>(`/torneios/${id}`);
      return mapearTorneio(data);
    } catch (erro) {
      if (isAxiosError(erro) && erro.response?.status === 404) return null;
      throw erro;
    }
  },

  async listarChaveamento(torneioId: number): Promise<Chaveamento[]> {
    const { data } = await api.get<ChaveamentoApi[]>(`/torneios/${torneioId}/chaveamento`);
    return data.map(mapearChaveamento);
  },
};