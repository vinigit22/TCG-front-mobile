import api from "./api";
import { mapearTrofeus } from "./mapeadores";
import { JogadorApi, JogadorRequestApi, PerfilJogadorApi, TrofeusApi } from "../models/api";
import { EstatisticasJogador, Usuario } from "../models/types";

const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function tipoDaImagem(uri: string, mimeType?: string): { tipo: string; extensao: string } {
  if (mimeType && EXTENSOES[mimeType]) {
    return { tipo: mimeType, extensao: EXTENSOES[mimeType] };
  }
  const extensao = uri.split("?")[0].split(".").pop()?.toLowerCase();
  if (extensao === "png") return { tipo: "image/png", extensao: "png" };
  if (extensao === "webp") return { tipo: "image/webp", extensao: "webp" };
  return { tipo: "image/jpeg", extensao: "jpg" };
}

export const jogadorService = {
  async enviarFoto(usuarioId: number, uriLocal: string, mimeType?: string): Promise<string | undefined> {
    const { tipo, extensao } = tipoDaImagem(uriLocal, mimeType);
    const formulario = new FormData();
    formulario.append("arquivo", { uri: uriLocal, name: `foto.${extensao}`, type: tipo } as unknown as Blob);

    const { data } = await api.post<JogadorApi>(`/jogadores/${usuarioId}/imagem`, formulario, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.imagemPerfil ?? undefined;
  },

  async atualizarPerfil(usuario: Usuario, dados: { nome: string; nickname: string }): Promise<Usuario> {
    const { data: atual } = await api.get<PerfilJogadorApi>("/jogadores/me");
    const corpo: JogadorRequestApi = {
      nome: dados.nome,
      nickname: dados.nickname,
      imagemPerfil: atual.imagemPerfil,
      bio: atual.bio,
      dataNascimento: atual.dataNascimento,
      cidade: atual.cidade,
      estado: atual.estado,
    };
    const { data } = await api.put<JogadorApi>(`/jogadores/${usuario.id}`, corpo);

    return {
      ...usuario,
      nome: data.nome,
      nickname: data.nickname,
      imagemPerfil: data.imagemPerfil ?? undefined,
    };
  },

  async buscarTrofeus(jogadorId: number): Promise<EstatisticasJogador> {
    const { data } = await api.get<TrofeusApi>(`/jogadores/${jogadorId}/trofeus`);
    return mapearTrofeus(data);
  },
};