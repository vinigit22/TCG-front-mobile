export type TipoConta = "LOJA" | "JOGADOR" | "ADMIN";

export interface Endereco {
  id: number;
  cep?: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  latitude?: number;
  longitude?: number;
  referencia?: string;
}

export interface Usuario {
  id: number;
  email: string;
  tipo: TipoConta;
  nome: string;
  nickname?: string;
  imagemPerfil?: string;
  foto?: string;
}

export interface Jogador {
  contaId: number;
  nome: string;
  nickname: string;
  imagemPerfil?: string;
  bio?: string;
  dataNascimento?: string;
  cidade?: string;
  estado?: string;
}

export interface Loja {
  contaId: number;
  nome: string;
  slug: string;
  descricao?: string;
  imagemPerfil?: string;
  imagemBanner?: string;
  telefone?: string;
  endereco?: Endereco;
  verificada: boolean;
}

export interface Jogo {
  id: number;
  nome: string;
  slug: string;
  icone?: string;
}

export interface Formato {
  id: number;
  jogoId: number;
  nome: string;
}

export type StatusTorneio =
  | "RASCUNHO"
  | "INSCRICOES_ABERTAS"
  | "INSCRICOES_ENCERRADAS"
  | "EM_ANDAMENTO"
  | "FINALIZADO"
  | "CANCELADO";

export interface Torneio {
  id: number;
  lojaId: number;
  nomeLoja: string;
  jogoId: number;
  jogo: string;
  formatoId?: number;
  titulo: string;
  descricao?: string;
  imagem?: string;
  vagasMax: number;
  vagasDisponiveis: number;
  taxaInscricao: number;
  premiacao?: string;
  endereco?: Endereco;
  inscricoesAte?: string;
  dataInicio: string;
  totalRodadas?: number;
  status: StatusTorneio;
}

export type StatusInscricao =
  | "INSCRITO"
  | "LISTA_ESPERA"
  | "CONFIRMADO"
  | "CANCELADO"
  | "NO_SHOW";

export type StatusPagamento = "ISENTO" | "PENDENTE" | "PAGO" | "REEMBOLSADO";

export interface Inscricao {
  id: number;
  torneioId: number;
  jogadorId: number;
  status: StatusInscricao;
  statusPagamento: StatusPagamento;
  seed?: number;
  inscritoEm: string;
}

export type StatusRodada = "AGUARDANDO" | "EM_ANDAMENTO" | "ENCERRADA";

export interface Rodada {
  id: number;
  torneioId: number;
  numero: number;
  nome: string;
  status: StatusRodada;
}

export type StatusPartida = "AGUARDANDO" | "PRONTA" | "EM_ANDAMENTO" | "FINALIZADA";

export type ResultadoPartida =
  | "VITORIA_A"
  | "VITORIA_B"
  | "EMPATE"
  | "WO_A"
  | "WO_B"
  | "DUPLO_NO_SHOW";

export interface Partida {
  id: number;
  rodadaId: number;
  mesa: number;
  jogadorA?: string;
  jogadorB?: string;
  gamesA: number;
  gamesB: number;
  gamesEmpate: number;
  status: StatusPartida;
  resultado?: ResultadoPartida;
  vencedor?: string;
  horario?: string;
}

export interface Chaveamento {
  torneioId: number;
  rodada: number;
  nomeRodada: string;
  partidaId: number;
  mesa: number;
  jogadorA?: string;
  jogadorB?: string;
  gamesA: number;
  gamesB: number;
  resultado?: ResultadoPartida;
  vencedor?: string;
  status: StatusPartida;
}

export interface TorneioResultado {
  id: number;
  torneioId: number;
  jogadorId: number;
  colocacao: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  premioRecebido?: string;
}

export type TipoNotificacao =
  | "INSCRICAO_CONFIRMADA"
  | "TORNEIO_INICIADO"
  | "RODADA_INICIADA"
  | "PAREAMENTO"
  | "RESULTADO_REGISTRADO"
  | "TORNEIO_FINALIZADO"
  | "EVENTO_ATUALIZADO"
  | "TORNEIO_CANCELADO"
  | "AVISO_GERAL";

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  torneioId?: number;
  eventoId?: number;
  partidaId?: number;
  lida: boolean;
  criadoEm: string;
}

export interface CartaDeck {
  id: number;
  nome: string;
  quantidade: number;
  imagem?: string;
}

export interface Deck {
  id: number;
  jogadorId: number;
  nome: string;
  jogoId: number;
  principal: boolean;
  cartas?: CartaDeck[];
}

export interface EstatisticasJogador {
  jogadorId: number;
  ouro: number;
  prata: number;
  bronze: number;
  torneiosDisputados: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  nickname: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
