import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { paleta } from "../../constants/colors";
import { fontes, raio, tamanhoFonte } from "../../constants/theme";

type TomFaixa = "roxo" | "verde" | "ambar" | "vermelho";

// Mesmas cores de .faixa, .faixa-verde, .faixa-ambar e .faixa-vermelha do web
const tonsFaixa: Record<TomFaixa, { fundo: string; borda: string; texto: string; icone: keyof typeof Ionicons.glyphMap }> = {
  roxo: { fundo: paleta.roxo[50], borda: paleta.roxo[200], texto: paleta.roxo[800], icone: "information-circle" },
  verde: { fundo: paleta.verde[50], borda: paleta.verde[200], texto: paleta.verde[800], icone: "checkmark-circle" },
  ambar: { fundo: paleta.ambar[100], borda: "#f7d9a0", texto: paleta.ambar[700], icone: "alert-circle" },
  vermelho: { fundo: paleta.vermelho[100], borda: "#f6c3c7", texto: paleta.vermelho[700], icone: "alert-circle" },
};

interface FaixaProps {
  texto: string;
  titulo?: string;
  tom?: TomFaixa;
  estilo?: StyleProp<ViewStyle>;
}

// Aviso em faixa (erro de formulário, sucesso, prazo expirado...)
export function Faixa({ texto, titulo, tom = "roxo", estilo }: FaixaProps) {
  const cor = tonsFaixa[tom];
  return (
    <View
      accessibilityRole={tom === "vermelho" ? "alert" : undefined}
      style={[estilos.faixa, { backgroundColor: cor.fundo, borderColor: cor.borda }, estilo]}
    >
      <Ionicons name={cor.icone} size={18} color={cor.texto} style={estilos.icone} />
      <Text style={[estilos.texto, { color: cor.texto }]}>
        {titulo ? <Text style={estilos.titulo}>{titulo} </Text> : null}
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: raio.md,
    borderWidth: 1,
  },
  icone: {
    marginTop: 1,
  },
  texto: {
    flex: 1,
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.md,
    lineHeight: 20,
  },
  titulo: {
    fontFamily: fontes.bold,
  },
});
