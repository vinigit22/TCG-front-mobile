import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores, paleta } from "../constants/colors";
import { fontes, tamanhoFonte } from "../constants/theme";

interface LojaProps {
  nome: string;
  verificada?: boolean;
  // Sobre o fundo escuro da capa
  claro?: boolean;
}

// Nome da loja com o selo de verificada (o ✓ verde do site)
export function Loja({ nome, verificada, claro = false }: LojaProps) {
  return (
    <View style={estilos.container}>
      <Ionicons name="storefront-outline" size={14} color={claro ? paleta.tinta[300] : cores.texto3} />
      <Text style={[estilos.texto, claro && estilos.textoClaro]} numberOfLines={1}>
        {nome}
      </Text>
      {verificada ? (
        <Ionicons
          name="checkmark-circle"
          size={15}
          color={claro ? paleta.verde[300] : paleta.verde[600]}
          accessibilityLabel="Loja verificada"
        />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  texto: {
    flexShrink: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.md,
    color: cores.texto2,
  },
  textoClaro: {
    color: paleta.tinta[300],
  },
});
