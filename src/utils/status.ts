import { Tom } from "../constants/colors";
import { StatusEvento, StatusInscricao, StatusPartida, StatusTorneio, TipoEvento } from "../models/types";

// Textos e cores dos status: os mesmos de TCG-front-web/src/app/core/rotulos.ts e ui/formatar.ts,
// para o mesmo torneio aparecer com o mesmo selo no site, no painel da loja e no app.

export const ROTULOS_STATUS_TORNEIO: Record<StatusTorneio, string> = {
  RASCUNHO: "Rascunho",
  INSCRICOES_ABERTAS: "Inscrições abertas",
  INSCRICOES_ENCERRADAS: "Inscrições encerradas",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const TOM_STATUS_TORNEIO: Record<StatusTorneio, Tom> = {
  RASCUNHO: "neutro",
  INSCRICOES_ABERTAS: "verde",
  INSCRICOES_ENCERRADAS: "ambar",
  EM_ANDAMENTO: "roxo",
  FINALIZADO: "azul",
  CANCELADO: "vermelho",
};

export const ROTULOS_STATUS_INSCRICAO: Record<StatusInscricao, string> = {
  INSCRITO: "Inscrito",
  LISTA_ESPERA: "Lista de espera",
  CONFIRMADO: "Confirmado (check-in)",
  CANCELADO: "Cancelado",
  NO_SHOW: "Não compareceu",
};

export const TOM_STATUS_INSCRICAO: Record<StatusInscricao, Tom> = {
  INSCRITO: "roxo",
  LISTA_ESPERA: "ambar",
  CONFIRMADO: "verde",
  CANCELADO: "vermelho",
  NO_SHOW: "neutro",
};

export const ROTULOS_STATUS_PARTIDA: Record<StatusPartida, string> = {
  AGUARDANDO: "Aguardando jogadores",
  PRONTA: "Pronta",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
};

export const TOM_STATUS_PARTIDA: Record<StatusPartida, Tom> = {
  AGUARDANDO: "neutro",
  PRONTA: "azul",
  EM_ANDAMENTO: "roxo",
  FINALIZADA: "verde",
};

// Para o jogador, um evento publicado está "aberto" (no painel da loja aparece como "Publicado")
export const ROTULOS_STATUS_EVENTO: Record<StatusEvento, string> = {
  RASCUNHO: "Rascunho",
  PUBLICADO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
};

export const TOM_STATUS_EVENTO: Record<StatusEvento, Tom> = {
  RASCUNHO: "neutro",
  PUBLICADO: "verde",
  EM_ANDAMENTO: "roxo",
  ENCERRADO: "azul",
  CANCELADO: "vermelho",
};

export const ROTULOS_TIPO_EVENTO: Record<TipoEvento, string> = {
  TROCA: "Troca de cartas",
  CONFRATERNIZACAO: "Confraternização",
  PROMOCAO: "Promoção",
  LANCAMENTO: "Lançamento",
  CASUAL: "Casual",
  OUTRO: "Evento especial",
};
