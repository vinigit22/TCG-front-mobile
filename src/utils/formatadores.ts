const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Valor em reais no formato brasileiro: 20 -> "R$ 20,00"
export function formatarMoeda(valor: number): string {
  const [inteiro, centavos] = valor.toFixed(2).split(".");
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${comMilhar},${centavos}`;
}

// Taxa de inscrição como no site: 25 -> "R$ 25"; 12.5 -> "R$ 12,50"; 0 -> "Grátis"
export function formatarTaxa(valor: number): string {
  if (!valor) return "Grátis";
  return Number.isInteger(valor) ? formatarMoeda(valor).replace(/,00$/, "") : formatarMoeda(valor);
}

// "19h" ou "19h30"
export function formatarHora(dataIso: string): string {
  const data = new Date(dataIso);
  const minutos = data.getMinutes() ? String(data.getMinutes()).padStart(2, "0") : "";
  return `${data.getHours()}h${minutos}`;
}

// Como no site: "2026-09-05T19:00:00" -> "05 Set 2026 · 19h"
export function formatarDataCurta(dataIso: string): string {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  return `${dia} ${MESES[data.getMonth()]} ${data.getFullYear()} · ${formatarHora(dataIso)}`;
}

// "05/09/2026"
export function formatarData(dataIso: string): string {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}

// Notificações: "05/09 às 19:00"
export function formatarQuando(dataIso: string): string {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${hora}:${minuto}`;
}

// Bloco de data (dia grande + mês), como .data-bloco no web
export function partesDaData(dataIso: string): { dia: string; mes: string } {
  const data = new Date(dataIso);
  return { dia: String(data.getDate()).padStart(2, "0"), mes: MESES[data.getMonth()] };
}
