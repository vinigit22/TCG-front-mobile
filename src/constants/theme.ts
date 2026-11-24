import { TextStyle, ViewStyle } from "react-native";
import { cores, paleta } from "./colors";

// Medidas do design system web (TCG-front-web/src/styles.css) convertidas para o app.

export const espacamento = {
  xs: 4,
  sm: 8,
  ms: 12,
  md: 16,
  ml: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// --raio-xs, --raio-sm, --raio, --raio-lg, --raio-xl; botões (10), botões grandes do site (14) e cartões do site (20)
export const raio = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  botao: 10,
  cta: 14,
  cartao: 20,
  pill: 999,
};

// Fontes carregadas no app/_layout.tsx. No React Native cada peso é uma fonte: use fontFamily, não fontWeight.
export const fontes = {
  marca: "Bungee_400Regular",
  regular: "PlusJakartaSans_400Regular",
  medio: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};

// base = texto corrido (15px, como o body do site)
export const tamanhoFonte = {
  xxs: 11,
  xs: 12,
  sm: 13,
  md: 14,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 30,
};

// Bungee só na marca, nos títulos de página e nos botões grandes, como no site; o resto em Plus Jakarta Sans.
export const tipografia = {
  display: { fontFamily: fontes.marca, fontSize: tamanhoFonte.display, lineHeight: 36, letterSpacing: 0.6, color: paleta.roxo[900] },
  tituloPagina: { fontFamily: fontes.marca, fontSize: tamanhoFonte.xxl, lineHeight: 30, letterSpacing: 0.8, color: paleta.roxo[900] },
  tituloCartao: { fontFamily: fontes.marca, fontSize: tamanhoFonte.lg, lineHeight: 23, letterSpacing: 0.3, color: paleta.roxo[950] },
  kicker: { fontFamily: fontes.marca, fontSize: tamanhoFonte.xxs, letterSpacing: 1.1, color: paleta.verde[300] },
  titulo: { fontFamily: fontes.extrabold, fontSize: tamanhoFonte.xl, lineHeight: 26, letterSpacing: -0.3, color: cores.texto },
  tituloSecao: { fontFamily: fontes.extrabold, fontSize: tamanhoFonte.lg, lineHeight: 22, letterSpacing: -0.2, color: cores.texto },
  subtitulo: { fontFamily: fontes.regular, fontSize: tamanhoFonte.base, lineHeight: 22, color: cores.texto2 },
  corpo: { fontFamily: fontes.regular, fontSize: tamanhoFonte.base, lineHeight: 23, color: cores.texto },
  corpoForte: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.base, lineHeight: 21, color: cores.texto },
  pequeno: { fontFamily: fontes.regular, fontSize: tamanhoFonte.sm, lineHeight: 19, color: cores.texto2 },
  pequenoForte: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.sm, lineHeight: 18, color: cores.texto },
  // .campo-rotulo
  rotulo: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.sm, lineHeight: 18, color: paleta.tinta[700] },
  legenda: { fontFamily: fontes.medio, fontSize: tamanhoFonte.xs, lineHeight: 16, color: cores.texto3 },
  // .detalhes dt e cabeçalho das tabelas
  sobretitulo: { fontFamily: fontes.bold, fontSize: tamanhoFonte.xxs, lineHeight: 14, letterSpacing: 0.6, textTransform: "uppercase", color: cores.texto3 },
  numero: { fontFamily: fontes.bold, fontVariant: ["tabular-nums"], color: cores.texto },
} satisfies Record<string, TextStyle>;

// --sombra-xs, --sombra-sm, --sombra-md, --sombra-lg
export const sombras = {
  xs: { shadowColor: paleta.tinta[900], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
  sm: { shadowColor: paleta.tinta[900], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: paleta.tinta[900], shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5 },
  lg: { shadowColor: paleta.roxo[900], shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.28, shadowRadius: 28, elevation: 12 },
} satisfies Record<string, ViewStyle>;

// .cartao do web: superfície branca, borda clara, raio 16 e sombra quase imperceptível
export const cartao = {
  backgroundColor: cores.superficie,
  borderRadius: raio.lg,
  borderWidth: 1,
  borderColor: cores.borda,
  ...sombras.xs,
} satisfies ViewStyle;
