import {
  ChaveamentoApi,
  EnderecoApi,
  InscricaoApi,
  LoginResponseApi,
  NotificacaoApi,
  PerfilJogadorApi,
  TorneioApi,
  TrofeusApi,
} from "../models/api";
import {
  Chaveamento,
  Endereco,
  EstatisticasJogador,
  Inscricao,
  Notificacao,
  Torneio,
  Usuario,
} from "../models/types";

// Conversão do JSON do backend (models/api.ts) para os tipos das telas (models/types.ts)

function opcional<T>(valor: T | null | undefined): T | undefined {
  return valor ?? undefined;
}

export function mapearUsuario(api: LoginResponseApi): Usuario {
  return {
    id: api.contaId,
    email: api.email,
    tipo: api.tipo,
    nome: api.nome ?? "",
    nickname: api.nickname ?? "",
    imagemPerfil: opcional(api.imagemPerfil),
  };
}

export function mapearPerfil(api: PerfilJogadorApi): Usuario {
  return {
    id: api.contaId,
    email: api.email,
    tipo: "JOGADOR",
    nome: api.nome,
    nickname: api.nickname,
    imagemPerfil: opcional(api.imagemPerfil),
  };
}

export function mapearEndereco(api: EnderecoApi): Endereco {
  return {
    id: api.id,
    cep: opcional(api.cep),
    logradouro: api.logradouro,
    numero: opcional(api.numero),
    complemento: opcional(api.complemento),
    bairro: opcional(api.bairro),
    cidade: api.cidade,
    estado: api.estado,
    latitude: opcional(api.latitude),
    longitude: opcional(api.longitude),
    referencia: opcional(api.referencia),
  };
}

export function mapearTorneio(api: TorneioApi): Torneio {
  // Sem endereço próprio, o torneio acontece na loja
  const endereco = api.endereco ?? api.loja.endereco;

  return {
    id: api.id,
    lojaId: api.loja.contaId,
    nomeLoja: api.loja.nome,
    lojaVerificada: api.loja.verificada,
    jogoId: api.jogo.id,
    jogo: api.jogo.nome,
    formatoId: api.formato?.id,
    formato: api.formato?.nome,
    titulo: api.titulo,
    descricao: opcional(api.descricao),
    imagem: opcional(api.imagem),
    vagasMax: api.vagasMax,
    vagasDisponiveis: api.vagasDisponiveis,
    taxaInscricao: api.taxaInscricao,
    premiacao: opcional(api.premiacao),
    endereco: endereco ? mapearEndereco(endereco) : undefined,
    inscricoesAte: opcional(api.inscricoesAte),
    dataInicio: api.dataInicio,
    totalRodadas: opcional(api.totalRodadas),
    status: api.status,
  };
}

export function mapearInscricao(api: InscricaoApi): Inscricao {
  return {
    id: api.id,
    torneioId: api.torneio.id,
    jogadorId: api.jogador.contaId,
    status: api.status,
    pagamentoStatus: api.pagamentoStatus,
    seed: opcional(api.seed),
    inscritoEm: api.inscritoEm,
    checkInEm: opcional(api.checkInEm),
    canceladoEm: opcional(api.canceladoEm),
    torneio: mapearTorneio(api.torneio),
  };
}

export function mapearNotificacao(api: NotificacaoApi): Notificacao {
  return {
    id: api.id,
    tipo: api.tipo,
    titulo: api.titulo,
    mensagem: api.mensagem,
    torneioId: opcional(api.torneioId),
    eventoId: opcional(api.eventoId),
    partidaId: opcional(api.partidaId),
    lida: api.lida,
    lidaEm: opcional(api.lidaEm),
    criadoEm: api.criadoEm,
  };
}

export function mapearChaveamento(api: ChaveamentoApi): Chaveamento {
  return {
    torneioId: api.torneioId,
    rodada: api.rodada,
    nomeRodada: api.nomeRodada,
    partidaId: api.partidaId,
    mesa: api.mesa,
    jogadorA: opcional(api.jogadorA),
    jogadorB: opcional(api.jogadorB),
    gamesA: api.gamesA,
    gamesB: api.gamesB,
    resultado: opcional(api.resultado),
    vencedor: opcional(api.vencedor),
    status: api.status,
  };
}

export function mapearTrofeus(api: TrofeusApi): EstatisticasJogador {
  return {
    jogadorId: api.jogadorId,
    nickname: api.nickname,
    nome: api.nome,
    ouro: api.ouro,
    prata: api.prata,
    bronze: api.bronze,
    torneiosDisputados: api.torneiosDisputados,
  };
}
