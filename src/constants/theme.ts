import { Platform } from "react-native";
import { cores } from "./colors";

export const espacamento = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const raio = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const fontes = {
  titulo: Platform.select({ ios: "System", android: "sans-serif-condensed", default: "System" }),
  corpo: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
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
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
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
