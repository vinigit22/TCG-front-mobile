import { isAxiosError } from "axios";
import api from "./api";
import { mapearChaveamento, mapearTorneio } from "./mapeadores";
import { configuracao } from "../constants/config";
import { simularAtraso } from "../mocks/atraso";
import { chaveamentoMock } from "../mocks/notificacoesEChaveamento";
import { buscarTorneioMock, torneiosMock } from "../mocks/torneios";
import { ChaveamentoApi, TorneioApi } from "../models/api";
import { Chaveamento, StatusTorneio, Torneio } from "../models/types";

// Status que aparecem na vitrine do app: rascunhos e cancelados ficam de fora
export const STATUS_VISIVEIS: StatusTorneio[] = [
  "INSCRICOES_ABERTAS",
  "INSCRICOES_ENCERRADAS",
  "EM_ANDAMENTO",
  "FINALIZADO",
];

export const torneioService = {
  async listar(): Promise<Torneio[]> {
    if (configuracao.usarMockApi) {
      await simularAtraso();
      return torneiosMock.filter((torneio) => STATUS_VISIVEIS.includes(torneio.status));
    }

    // O backend aceita vários status separados por vírgula
    const { data } = await api.get<TorneioApi[]>("/torneios", {
      params: { status: STATUS_VISIVEIS.join(",") },
    });
    return data.map(mapearTorneio);
  },

  // null = torneio não existe (ou foi excluído)
  async buscar(id: number): Promise<Torneio | null> {
    if (configuracao.usarMockApi) {
      await simularAtraso(150);
      return buscarTorneioMock(id) ?? null;
    }

    try {
      const { data } = await api.get<TorneioApi>(`/torneios/${id}`);
      return mapearTorneio(data);
    } catch (erro) {
      if (isAxiosError(erro) && erro.response?.status === 404) return null;
      throw erro;
    }
  },

  // Ordenado por rodada e mesa. Lista vazia = a chave ainda não foi gerada.
  async listarChaveamento(torneioId: number): Promise<Chaveamento[]> {
    if (configuracao.usarMockApi) {
      await simularAtraso(150);
      return chaveamentoMock.filter((partida) => partida.torneioId === torneioId);
    }

    const { data } = await api.get<ChaveamentoApi[]>(`/torneios/${torneioId}/chaveamento`);
    return data.map(mapearChaveamento);
  },
};
