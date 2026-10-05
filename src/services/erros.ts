import { isAxiosError } from "axios";
import { ProblemDetailApi } from "../models/api";

// Mensagem para o usuário a partir de um erro da API (corpo ProblemDetail do backend, com a mensagem
// em "detail"), de rede, ou dos mocks (Error comum com a mensagem pronta).
export function mensagemDeErro(erro: unknown, padrao: string): string {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão e o endereço da API.";
    }

    const corpo = typeof erro.response.data === "object" ? (erro.response.data as ProblemDetailApi | null) : null;
    const primeiroCampo = corpo?.erros ? Object.entries(corpo.erros)[0] : undefined;
    if (primeiroCampo) return `${corpo?.detail ?? "Dados inválidos"}: ${primeiroCampo[0]} ${primeiroCampo[1]}`;
    if (corpo?.detail) return corpo.detail;

    switch (erro.response.status) {
      case 401:
        return "Sua sessão expirou. Entre novamente.";
      case 403:
        return "Você não tem permissão para fazer isso.";
      case 404:
        return "Não encontrado.";
      case 429:
        return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
      default:
        return padrao;
    }
  }

  if (erro instanceof Error && erro.message) {
    return erro.message;
  }

  return padrao;
}
