import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "../../constants/colors";
import { espacamento, fontes, tamanhoFonte } from "../../constants/theme";
import { BlocoIcone } from "./BlocoIcone";

interface EstadoVazioProps {
  titulo: string;
  texto?: string;
  icone?: keyof typeof Ionicons.glyphMap;
  erro?: boolean;
  // Botão de ação (entrar, tentar de novo...)
  children?: React.ReactNode;
}

// Lista vazia ou erro de carregamento: o mesmo app-estado-vazio do web
export function EstadoVazio({ titulo, texto, icone = "albums-outline", erro = false, children }: EstadoVazioProps) {
  return (
    <View style={estilos.vazio}>
      <BlocoIcone nome={erro ? "alert-circle-outline" : icone} tom={erro ? "vermelho" : "roxo"} tamanho={52} />
      <Text style={estilos.titulo}>{titulo}</Text>
      {texto ? <Text style={estilos.texto}>{texto}</Text> : null}
      {children ? <View style={estilos.acoes}>{children}</View> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  vazio: {
    alignItems: "center",
    paddingVertical: espacamento.xl,
    paddingHorizontal: espacamento.lg,
  },
  titulo: {
    marginTop: espacamento.ms,
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
    textAlign: "center",
  },
  texto: {
    marginTop: 6,
    maxWidth: 320,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.md,
    lineHeight: 20,
    color: cores.texto3,
    textAlign: "center",
  },
  acoes: {
    marginTop: espacamento.md,
    alignItems: "center",
  },
});
