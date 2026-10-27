import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { paleta, Tom, tons } from "../../constants/colors";

interface BlocoIconeProps {
  nome: keyof typeof Ionicons.glyphMap;
  tom?: Tom;
  // Cores fora dos tons (as medalhas de prata e bronze do perfil)
  cor?: { fundo: string; texto: string };
  tamanho?: number;
}

// Ícone num quadrado de cantos arredondados: o mesmo dos indicadores (.kpi-rotulo) e do estado vazio no web
export function BlocoIcone({ nome, tom = "roxo", cor, tamanho = 36 }: BlocoIconeProps) {
  const roxo = !cor && tom === "roxo";
  const fundo = cor?.fundo ?? (roxo ? paleta.roxo[50] : tons[tom].fundo);
  const frente = cor?.texto ?? (roxo ? paleta.roxo[600] : tons[tom].texto);

  return (
    <View
      style={[
        estilos.bloco,
        { width: tamanho, height: tamanho, borderRadius: Math.round(tamanho * 0.29), backgroundColor: fundo },
        roxo && estilos.contornoRoxo,
      ]}
    >
      <Ionicons name={nome} size={Math.round(tamanho * 0.5)} color={frente} />
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contornoRoxo: {
    borderWidth: 1,
    borderColor: paleta.roxo[100],
  },
});
