import api from "./api";
import { Evento } from "../models/types";

interface EventoApi {
  id: number;
  loja: { conta: { id: number }; nome: string };
  titulo: string;
  descricao?: string | null;
  imagem?: string | null;
  tipo: Evento["tipo"];
  vagasMax?: number | null;
  dataInicio: string;
  status: Evento["status"];
}

function mapear(e: EventoApi): Evento {
  return {
    id: e.id,
    lojaId: e.loja.conta.id,
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

export const eventoService = {
  async listar(status?: Evento["status"][]): Promise<Evento[]> {
    const params: Record<string, string> = {};
    if (status?.length) params["status"] = status.join(",");
    const { data } = await api.get<EventoApi[]>("/eventos", { params });
    return data.map(mapear);
  },

  async buscar(id: number): Promise<Evento> {
    const { data } = await api.get<EventoApi>(`/eventos/${id}`);
    return mapear(data);
  },
};
