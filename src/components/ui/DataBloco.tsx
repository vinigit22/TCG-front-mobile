import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { paleta } from "../../constants/colors";
import { fontes, raio } from "../../constants/theme";
import { partesDaData } from "../../utils/formatadores";

// Dia grande + mês: o .data-bloco das listas do painel web
export function DataBloco({ dataIso }: { dataIso: string }) {
  const { dia, mes } = partesDaData(dataIso);
  return (
    <View style={estilos.bloco}>
      <Text style={estilos.dia}>{dia}</Text>
      <Text style={estilos.mes}>{mes.toUpperCase()}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    width: 50,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: raio.md,
    backgroundColor: paleta.roxo[50],
    borderWidth: 1,
    borderColor: paleta.roxo[100],
    flexShrink: 0,
  },
  dia: {
    fontFamily: fontes.extrabold,
    fontSize: 19,
    lineHeight: 22,
    color: paleta.roxo[700],
  },
  mes: {
    fontFamily: fontes.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: paleta.roxo[700],
  },
});
