// Valor em reais no formato brasileiro: 20 -> "R$ 20,00"
export function formatarMoeda(valor: number): string {
  const [inteiro, centavos] = valor.toFixed(2).split(".");
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${comMilhar},${centavos}`;
}
