// Simula o tempo de resposta da API no modo mock, para os estados de carregamento aparecerem
export function simularAtraso(ms = 350): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}
