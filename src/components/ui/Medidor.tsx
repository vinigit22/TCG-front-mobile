import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, paleta } from "../../constants/colors";
import { fontes, raio, tamanhoFonte } from "../../constants/theme";

interface MedidorProps {
  ocupadas: number;
  total: number;
  sufixo?: string;
}

// Vagas ocupadas / total: o .medidor do web (trilho verde claro, preenchimento verde; âmbar quando lota)
export function Medidor({ ocupadas, total, sufixo = "vagas" }: MedidorProps) {
  const cheio = total > 0 && ocupadas >= total;
  const porcentagem = total > 0 ? Math.min(100, Math.round((ocupadas / total) * 100)) : 0;

  return (
    <View
      style={estilos.medidor}
      accessibilityRole="progressbar"
      accessibilityLabel="Vagas ocupadas"
      accessibilityValue={{ min: 0, max: total, now: ocupadas }}
    >
      <View style={[estilos.trilho, cheio && estilos.trilhoCheio]}>
        <View style={[estilos.preenchimento, cheio && estilos.preenchimentoCheio, { width: `${porcentagem}%` }]} />
      </View>
      <Text style={[estilos.texto, cheio && estilos.textoCheio]}>
        {ocupadas}/{total} {sufixo}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  medidor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 120,
  },
  trilho: {
    flex: 1,
    height: 6,
    borderRadius: raio.pill,
    backgroundColor: paleta.verde[100],
    overflow: "hidden",
  },
  trilhoCheio: {
    backgroundColor: paleta.ambar[100],
  },
  preenchimento: {
    height: "100%",
    borderRadius: raio.pill,
    backgroundColor: paleta.verde[500],
  },
  preenchimentoCheio: {
    backgroundColor: paleta.ambar[500],
  },
  texto: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.xs,
    fontVariant: ["tabular-nums"],
    color: cores.texto2,
  },
  textoCheio: {
    color: paleta.ambar[700],
  },
});
