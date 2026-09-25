import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

interface VagasProps {
  vagasMax: number;
  vagasDisponiveis: number;
}

export function Vagas({ vagasMax, vagasDisponiveis }: VagasProps) {
  const esgotado = vagasDisponiveis <= 0;
  const corFundo = esgotado ? cores.esgotado : cores.disponivel;
  const texto = esgotado ? "Esgotado" : `${vagasDisponiveis} de ${vagasMax} vagas`;

  return (
    <View style={[estilos.container, { backgroundColor: corFundo }]}>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingVertical: espacamento.xs,
    paddingHorizontal: espacamento.sm,
    borderRadius: raio.pill,
    alignSelf: "flex-start",
  },
  texto: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
  },
});
