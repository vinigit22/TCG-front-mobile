import {
  ResultadoPartida,
  StatusInscricao,
  StatusPagamento,
  StatusPartida,
  StatusTorneio,
  TipoConta,
  TipoNotificacao,
} from "./types";

// Formato exato do JSON do TCGBackend. As telas não usam estes tipos: services/mapeadores.ts
// converte para os tipos de models/types.ts. Datas vêm como "2026-12-20T19:00:00" (sem fuso)
// e campos sem valor vêm como null.

// Corpo de erro de todas as respostas 4xx/5xx (RFC 9457). A mensagem para o usuário está em "detail".
export interface ProblemDetailApi {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  // Só nos 400 de validação: campo -> mensagem
  erros?: Record<string, string>;
}

// POST /auth/login, POST /auth/registro/jogador e PUT /contas/{id}/senha
export interface LoginResponseApi {
  token: string;
  contaId: number;
  email: string;
  tipo: TipoConta;
  nome: string | null;
  nickname: string | null;
  imagemPerfil: string | null;
}

export interface EnderecoApi {
  id: number;
  cep: string | null;
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  referencia: string | null;
}

export interface JogoApi {
  id: number;
  nome: string;
  slug: string;
  icone: string | null;
  ativo: boolean;
}

export interface FormatoApi {
  id: number;
  jogo: JogoApi;
  nome: string;
  ativo: boolean;
}

export interface LojaApi {
  contaId: number;
  nome: string;
  slug: string;
  descricao: string | null;
  imagemPerfil: string | null;
  imagemBanner: string | null;
  telefone: string | null;
  endereco: EnderecoApi | null;
  verificada: boolean;
}

// Perfil público (GET /jogadores/{id}, e dentro de inscrições e resultados)
export interface JogadorApi {
  contaId: number;
  nome: string;
  nickname: string;
  imagemPerfil: string | null;
  bio: string | null;
  cidade: string | null;
  estado: string | null;
}

// GET /jogadores/me: perfil completo do jogador logado
export interface PerfilJogadorApi {
  contaId: number;
  email: string;
  nome: string;
  nickname: string;
  imagemPerfil: string | null;
  bio: string | null;
  dataNascimento: string | null;
  cidade: string | null;
  estado: string | null;
}

// Corpo de PUT /jogadores/{id}. Substitui o perfil inteiro: campo omitido vira null no banco.
export interface JogadorRequestApi {
  nome: string;
  nickname: string;
  imagemPerfil: string | null;
  bio: string | null;
  dataNascimento: string | null;
  cidade: string | null;
  estado: string | null;
}

export interface TorneioApi {
  id: number;
  loja: LojaApi;
  jogo: JogoApi;
  formato: FormatoApi | null;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  vagasMax: number;
  vagasOcupadas: number | null;
  vagasDisponiveis: number;
  taxaInscricao: number;
  premiacao: string | null;
  endereco: EnderecoApi | null;
  inscricoesAte: string | null;
  dataInicio: string;
  totalRodadas: number | null;
  status: StatusTorneio;
  finalizadoEm: string | null;
}

// GET /inscricoes?jogadorId=... (exige token) e POST /inscricoes
export interface InscricaoApi {
  id: number;
  torneio: TorneioApi;
  jogador: JogadorApi;
  status: StatusInscricao;
  pagamentoStatus: StatusPagamento;
  seed: number | null;
  inscritoEm: string;
  checkInEm: string | null;
  canceladoEm: string | null;
}

export interface NotificacaoApi {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  torneioId: number | null;
  eventoId: number | null;
  partidaId: number | null;
  lida: boolean;
  lidaEm: string | null;
  criadoEm: string;
}

// GET /torneios/{id}/chaveamento
export interface ChaveamentoApi {
  torneioId: number;
  rodada: number;
  nomeRodada: string;
  partidaId: number;
  mesa: number;
  jogadorA: string | null;
  jogadorB: string | null;
  gamesA: number;
  gamesB: number;
  resultado: ResultadoPartida | null;
  vencedor: string | null;
  status: StatusPartida;
}

// GET /jogadores/{id}/trofeus
export interface TrofeusApi {
  jogadorId: number;
  nickname: string;
  nome: string;
  ouro: number;
  prata: number;
  bronze: number;
  torneiosDisputados: number;
}
