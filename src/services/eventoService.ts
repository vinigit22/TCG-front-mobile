import api from "./api";
import { Evento } from "../models/types";

export type StatusParticipacao = "CONFIRMADO" | "CANCELADO";

interface EventoApi {
  id: number;
  loja: { contaId: number; nome: string };
  titulo: string;
  descricao?: string | null;
  imagem?: string | null;
  tipo: Evento["tipo"];
  vagasMax?: number | null;
  dataInicio: string;
  status: Evento["status"];
}

interface ParticipacaoApi {
  id: number;
  evento: { id: number };
  jogador: { contaId: number };
  status: StatusParticipacao;
}

export interface ParticipacaoEvento {
  id: number;
  eventoId: number;
  jogadorId: number;
  status: StatusParticipacao;
}

function mapear(e: EventoApi): Evento {
  return {
    id: e.id,
    lojaId: e.loja.contaId,
    nomeLoja: e.loja.nome,
    titulo: e.titulo,
    descricao: e.descricao ?? undefined,
    imagem: e.imagem ?? undefined,
    tipo: e.tipo,
    vagasMax: e.vagasMax ?? undefined,
    dataInicio: e.dataInicio,
    status: e.status,
  };
}

function mapearParticipacao(p: ParticipacaoApi): ParticipacaoEvento {
  return {
    id: p.id,
    eventoId: p.evento.id,
    jogadorId: p.jogador.contaId,
    status: p.status,
  };
}

export const eventoService = {
  async listar(status?: Evento["status"][]): Promise<Evento[]> {
    const { data } = await api.get<EventoApi[]>("/eventos");
    const eventos = data.map(mapear);
    return status?.length ? eventos.filter((e) => status.includes(e.status)) : eventos;
  },

  async buscar(id: number): Promise<Evento> {
    const { data } = await api.get<EventoApi>(`/eventos/${id}`);
    return mapear(data);
  },

  async listarParticipacoes(eventoId: number): Promise<ParticipacaoEvento[]> {
    const { data } = await api.get<ParticipacaoApi[]>("/evento-participacoes", { params: { eventoId } });
    return data.map(mapearParticipacao);
  },

  async participar(eventoId: number): Promise<ParticipacaoEvento> {
    const { data } = await api.post<ParticipacaoApi>("/evento-participacoes", { eventoId });
    return mapearParticipacao(data);
  },

  async alterarParticipacao(id: number, status: StatusParticipacao): Promise<ParticipacaoEvento> {
    const { data } = await api.put<ParticipacaoApi>(`/evento-participacoes/${id}`, { status });
    return mapearParticipacao(data);
  },
};