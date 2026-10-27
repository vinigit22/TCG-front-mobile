import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { espacamento, tipografia } from "../../constants/theme";

interface CabecalhoPaginaProps {
  titulo: string;
  subtitulo?: string;
  // Botão à direita do título
  acao?: React.ReactNode;
  estilo?: StyleProp<ViewStyle>;
}

// Título de página em Bungee com subtítulo, como "TORNEIOS" e "JOGOS SUPORTADOS" no site
export function CabecalhoPagina({ titulo, subtitulo, acao, estilo }: CabecalhoPaginaProps) {
  return (
    <View style={[estilos.cabecalho, estilo]}>
      <View style={estilos.linha}>
        <Text accessibilityRole="header" style={estilos.titulo}>
          {titulo.toUpperCase()}
        </Text>
        {acao}
      </View>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    marginBottom: espacamento.ml,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacamento.ms,
  },
  titulo: {
    ...tipografia.tituloPagina,
    flexShrink: 1,
  },
  subtitulo: {
    ...tipografia.subtitulo,
    marginTop: 4,
  },
});
