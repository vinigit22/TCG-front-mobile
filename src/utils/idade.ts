export function mascararData(texto: string) {
  const numeros = texto.replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export function dataParaIso(texto: string): string | null {
  if (texto.length !== 10) return null;
  const [dia, mes, ano] = texto.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  const existe = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!existe || ano < 1900 || data.getTime() > Date.now()) return null;
  return `${texto.slice(6, 10)}-${texto.slice(3, 5)}-${texto.slice(0, 2)}`;
}

export function calcularIdade(dataIso: string, hoje: Date = new Date()): number {
  const [ano, mes, dia] = dataIso.slice(0, 10).split("-").map(Number);
  const mesAtual = hoje.getMonth() + 1;
  const fezAniversario = mesAtual > mes || (mesAtual === mes && hoje.getDate() >= dia);
  return hoje.getFullYear() - ano - (fezAniversario ? 0 : 1);
}

export function ehMenorDeIdade(dataIso?: string | null): boolean {
  if (!dataIso) return false;
  return calcularIdade(dataIso) < 18;
}