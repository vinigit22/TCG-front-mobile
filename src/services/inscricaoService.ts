import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { mapearInscricao } from "./mapeadores";
import { configuracao } from "../constants/config";
import { PREFIXO_INSCRICOES_MOCK } from "../constants/storage";
import { inscricoesMock } from "../mocks/inscricoes";
import { buscarTorneioMock } from "../mocks/torneios";
import { InscricaoApi } from "../models/api";
import { Inscricao, Torneio } from "../models/types";

// No modo mock a inscrição é guardada sem o torneio, que é buscado nos mocks ao ler
type InscricaoMock = Omit<Inscricao, "torneio">;

async function lerMock(usuarioId: number): Promise<InscricaoMock[]> {
  const salvo = await AsyncStorage.getItem(PREFIXO_INSCRICOES_MOCK + usuarioId);
  if (!salvo) {
    return inscricoesMock.filter((inscricao) => inscricao.jogadorId === usuarioId);
  }

  // Versões antigas do app guardavam só a lista de ids dos torneios
  const lista = JSON.parse(salvo) as (InscricaoMock | number)[];
  return lista.map((item, indice) =>
    typeof item === "number"
      ? {
          id: indice + 1,
          torneioId: item,
          jogadorId: usuarioId,
          status: "INSCRITO",
          pagamentoStatus: "PENDENTE",
          inscritoEm: new Date().toISOString(),
        }
      : item
  );
}

async function salvarMock(usuarioId: number, lista: InscricaoMock[]) {
  await AsyncStorage.setItem(PREFIXO_INSCRICOES_MOCK + usuarioId, JSON.stringify(lista));
}

function comTorneio(inscricao: InscricaoMock): Inscricao {
  return { ...inscricao, torneio: buscarTorneioMock(inscricao.torneioId) };
}

export const inscricaoService = {
  // Todas as inscrições do jogador, inclusive canceladas (quem chama decide o que mostrar)
  async listarMinhas(usuarioId: number): Promise<Inscricao[]> {
    if (configuracao.usarMockApi) {
      return (await lerMock(usuarioId)).map(comTorneio);
    }

    const { data } = await api.get<InscricaoApi[]>("/inscricoes", { params: { jogadorId: usuarioId } });
    return data.map(mapearInscricao);
  },

  // O backend decide entre INSCRITO e LISTA_ESPERA; o mock repete a regra pelas vagas do torneio
  async inscrever(usuarioId: number, torneio: Torneio): Promise<Inscricao> {
    if (configuracao.usarMockApi) {
      if (torneio.status !== "INSCRICOES_ABERTAS") {
        throw new Error("As inscrições deste torneio não estão abertas");
      }

      const lista = await lerMock(usuarioId);
      const existente = lista.find((inscricao) => inscricao.torneioId === torneio.id);
      if (existente && existente.status !== "CANCELADO") {
        throw new Error("Jogador já inscrito neste torneio");
      }

      const nova: InscricaoMock = {
        id: existente?.id ?? Date.now(),
        torneioId: torneio.id,
        jogadorId: usuarioId,
        status: torneio.vagasDisponiveis > 0 ? "INSCRITO" : "LISTA_ESPERA",
        pagamentoStatus: torneio.taxaInscricao > 0 ? "PENDENTE" : "ISENTO",
        inscritoEm: new Date().toISOString(),
      };
      await salvarMock(usuarioId, [...lista.filter((inscricao) => inscricao.torneioId !== torneio.id), nova]);
      return comTorneio(nova);
    }

    const { data } = await api.post<InscricaoApi>("/inscricoes", { torneioId: torneio.id });
    return mapearInscricao(data);
  },

  async cancelar(usuarioId: number, inscricao: Inscricao): Promise<Inscricao> {
    if (configuracao.usarMockApi) {
      const status = inscricao.torneio?.status;
      if (status === "EM_ANDAMENTO" || status === "FINALIZADO") {
        throw new Error("Não é possível cancelar a inscrição depois que o torneio começou");
      }

      const lista = await lerMock(usuarioId);
      const { torneio: _torneio, ...semTorneio } = inscricao;
      const cancelada: InscricaoMock = {
        ...semTorneio,
        status: "CANCELADO",
        canceladoEm: new Date().toISOString(),
      };
      await salvarMock(usuarioId, lista.map((item) => (item.id === inscricao.id ? cancelada : item)));
      return comTorneio(cancelada);
    }

    const { data } = await api.put<InscricaoApi>(`/inscricoes/${inscricao.id}/cancelar`);
    return mapearInscricao(data);
  },
};
