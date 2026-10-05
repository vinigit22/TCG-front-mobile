import api from "./api";
import { mapearTrofeus } from "./mapeadores";
import { configuracao } from "../constants/config";
import { trofeusMock } from "../mocks/trofeus";
import { JogadorApi, JogadorRequestApi, PerfilJogadorApi, TrofeusApi } from "../models/api";
import { EstatisticasJogador, Usuario } from "../models/types";

const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// O backend aceita JPG, PNG ou WEBP. Sem o tipo informado pelo ImagePicker, deduz pela extensão.
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
  // Envia a foto escolhida no aparelho e devolve o que fica em imagemPerfil:
  // na API, o caminho "/uploads/jogadores/..."; no mock, a própria URI local.
  async enviarFoto(usuarioId: number, uriLocal: string, mimeType?: string): Promise<string | undefined> {
    if (configuracao.usarMockApi) {
      return uriLocal;
    }

    const { tipo, extensao } = tipoDaImagem(uriLocal, mimeType);
    const formulario = new FormData();
    // No React Native o arquivo vai como { uri, name, type }
    formulario.append("arquivo", { uri: uriLocal, name: `foto.${extensao}`, type: tipo } as unknown as Blob);

    const { data } = await api.post<JogadorApi>(`/jogadores/${usuarioId}/imagem`, formulario, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.imagemPerfil ?? undefined;
  },

  // Altera nome e nickname. O PUT /jogadores/{id} substitui o perfil inteiro, então o perfil atual
  // é lido antes para não apagar bio, cidade, data de nascimento e foto.
  async atualizarPerfil(usuario: Usuario, dados: { nome: string; nickname: string }): Promise<Usuario> {
    if (configuracao.usarMockApi) {
      return { ...usuario, ...dados };
    }

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
    if (configuracao.usarMockApi) {
      return trofeusMock(jogadorId);
    }

    const { data } = await api.get<TrofeusApi>(`/jogadores/${jogadorId}/trofeus`);
    return mapearTrofeus(data);
  },
};
