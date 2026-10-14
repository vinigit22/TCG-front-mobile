import { isAxiosError } from "axios";
import api from "./api";
import { mapearLoja } from "./mapeadores";
import { LojaApi } from "../models/api";
import { Loja } from "../models/types";

export const lojaService = {
  async listar(): Promise<Loja[]> {
    const { data } = await api.get<LojaApi[]>("/lojas");
    return data.map(mapearLoja);
  },
  async buscar(id: number): Promise<Loja | null> {
    try {
      const { data } = await api.get<LojaApi>(`/lojas/${id}`);
      return mapearLoja(data);
    } catch (erro) {
      if (isAxiosError(erro) && erro.response?.status === 404) return null;
      throw erro;
    }
  },
};