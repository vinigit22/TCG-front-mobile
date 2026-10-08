import { cores } from "./colors";

export const espacamento = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Alinhado ao design system web: sm=8, md=12, lg=16
export const raio = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

// Fontes carregadas via @expo-google-fonts no _layout
export const fontes = {
  marca: "Bungee_400Regular",
  corpo: "PlusJakartaSans_400Regular",
  corpoMedio: "PlusJakartaSans_600SemiBold",
  corpoBold: "PlusJakartaSans_700Bold",
  corpoExtraBold: "PlusJakartaSans_800ExtraBold",
};

export const tamanhoFonte = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
};

export const sombra = {
  shadowColor: "#1b1830",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export const tema = {
  cores,
  espacamento,
  raio,
  fontes,
  tamanhoFonte,
  sombra,
};

export type Tema = typeof tema;
