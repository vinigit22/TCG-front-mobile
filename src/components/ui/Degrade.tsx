import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { paleta } from "../../constants/colors";

interface DegradeProps {
  de?: string;
  para?: string;
  horizontal?: boolean;
  faixas?: number;
  estilo?: StyleProp<ViewStyle>;
}

function canal(hex: string, posicao: number) {
  return parseInt(hex.slice(1 + posicao * 2, 3 + posicao * 2), 16);
}

function misturar(de: string, para: string, t: number) {
  const valores = [0, 1, 2].map((i) => Math.round(canal(de, i) + (canal(para, i) - canal(de, i)) * t));
  return `rgb(${valores.join(", ")})`;
}

// Degradê roxo -> verde das barrinhas do site (cartão de torneio, topo do cadastro).
// Sem biblioteca de gradiente: faixas de cor interpolada, que numa barra fina parecem contínuas.
export function Degrade({ de = paleta.roxo[500], para = paleta.verde[400], horizontal = false, faixas = 14, estilo }: DegradeProps) {
  return (
    <View style={[{ flexDirection: horizontal ? "row" : "column", overflow: "hidden" }, estilo]} pointerEvents="none">
      {Array.from({ length: faixas }, (_, indice) => (
        <View key={indice} style={{ flex: 1, backgroundColor: misturar(de, para, indice / (faixas - 1)) }} />
      ))}
    </View>
  );
}
