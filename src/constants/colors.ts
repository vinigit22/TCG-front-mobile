// TopDeck: a mesma paleta do design system web (TCG-front-web/src/styles.css).
// paleta.roxo[600] aqui é a var(--roxo-600) de lá; os papéis em `cores` seguem as variáveis --cor-*.
// Roxo é a marca, verde é ação/sucesso. O verde-menta (verde[400]) só aparece como fundo,
// com texto escuro por cima (verde[950]); como cor de texto ele não tem contraste sobre o branco.

export const paleta = {
  roxo: {
    950: "#130c2a",
    900: "#1c1340",
    800: "#291c5c",
    700: "#3a2783",
    600: "#5034b4",
    500: "#6c4ce0",
    400: "#8c72ee",
    300: "#b3a0f7",
    200: "#d8cdfc",
    100: "#ede8fe",
    50: "#f7f5ff",
  },
  verde: {
    950: "#032a20",
    900: "#0a4636",
    800: "#0b5641",
    700: "#0a6e51",
    600: "#0b8a64",
    500: "#13a679",
    400: "#34cf96",
    300: "#6fe3b6",
    200: "#a9f1d3",
    100: "#d3f9e8",
    50: "#edfdf6",
  },
  tinta: {
    950: "#110f1f",
    900: "#1b1830",
    800: "#2b2745",
    700: "#45405f",
    600: "#5d5878",
    500: "#767191",
    400: "#9b97b2",
    300: "#c4c1d6",
    200: "#e1dfeb",
    150: "#eae8f2",
    100: "#f1f0f6",
    50: "#f8f7fb",
  },
  ambar: { 700: "#8a5300", 500: "#eda100", 100: "#fff1d6" },
  vermelho: { 700: "#b4232c", 500: "#e5484d", 100: "#fdeaec" },
  azul: { 700: "#1d58b8", 100: "#e3edfd" },
  branco: "#ffffff",
} as const;

// Papéis (os mesmos nomes de --cor-pagina, --cor-superficie, --cor-texto-2... do web)
export const cores = {
  pagina: paleta.tinta[50],
  superficie: paleta.branco,
  superficie2: paleta.tinta[100],
  borda: paleta.tinta[200],
  bordaForte: paleta.tinta[300],
  divisor: paleta.tinta[150],
  texto: paleta.tinta[900],
  texto2: paleta.tinta[600],
  texto3: paleta.tinta[500],
  textoInverso: paleta.branco,
  primaria: paleta.roxo[600],
  primariaPressionada: paleta.roxo[700],
  primariaSuave: paleta.roxo[50],
  acento: paleta.verde[400],
  acentoPressionado: paleta.verde[300],
  textoSobreAcento: paleta.verde[950],
  // Fundo escuro da marca: navbar e rodapé do site, cabeçalho, capas e abas do app
  noite: paleta.roxo[950],
  noite2: paleta.roxo[900],
  sucesso: paleta.verde[600],
  erro: paleta.vermelho[500],
} as const;

// Transparências sobre o fundo escuro (as mesmas do header.css e do home.css do web)
export const sobreNoite = {
  borda: "rgba(179, 160, 247, 0.18)",
  contorno: "rgba(179, 160, 247, 0.55)",
  pilula: "rgba(179, 160, 247, 0.14)",
  realce: "rgba(255, 255, 255, 0.06)",
  campo: "rgba(255, 255, 255, 0.08)",
  textoSuave: paleta.tinta[300],
  destaque: paleta.verde[300],
} as const;

// Fundo atrás de modais: o mesmo de dialog.modal::backdrop no web
export const fundoModal = "rgba(19, 12, 42, 0.55)";

// Tons dos selos, faixas e ícones (.selo-roxo, .selo-verde... no web)
export type Tom = "neutro" | "roxo" | "verde" | "ambar" | "vermelho" | "azul";

export const tons: Record<Tom, { fundo: string; texto: string }> = {
  neutro: { fundo: paleta.tinta[100], texto: paleta.tinta[700] },
  roxo: { fundo: paleta.roxo[100], texto: paleta.roxo[700] },
  verde: { fundo: paleta.verde[100], texto: paleta.verde[800] },
  ambar: { fundo: paleta.ambar[100], texto: paleta.ambar[700] },
  vermelho: { fundo: paleta.vermelho[100], texto: paleta.vermelho[700] },
  azul: { fundo: paleta.azul[100], texto: paleta.azul[700] },
};
