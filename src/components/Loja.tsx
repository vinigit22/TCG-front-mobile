import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "../constants/colors";
import { espacamento, tamanhoFonte } from "../constants/theme";

interface LojaProps {
  nome: string;
  verificada?: boolean;
}

export function Loja({ nome, verificada }: LojaProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.texto} numberOfLines={1}>
        {nome}
      </Text>
      {verificada ? <Text style={estilos.selo}>✓</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.xs,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    fontWeight: "600",
  },
  selo: {
    color: cores.sucesso,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
  },
});
