import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, paleta, Tom } from "../../constants/colors";
import { fontes, tamanhoFonte } from "../../constants/theme";
import { BlocoIcone } from "./BlocoIcone";

interface ItemListaProps {
  titulo: string;
  detalhe?: string;
  icone?: keyof typeof Ionicons.glyphMap;
  tomIcone?: Tom;
  aoPressionar?: () => void;
  // Substitui a seta da direita (um interruptor, um selo...)
  direita?: React.ReactNode;
  // Linha divisória acima (todos menos o primeiro item do cartão)
  divisor?: boolean;
}

// Linha de lista dentro de um cartão: o .lista-item do web
export function ItemLista({ titulo, detalhe, icone, tomIcone, aoPressionar, direita, divisor }: ItemListaProps) {
  const conteudo = (
    <>
      {icone ? <BlocoIcone nome={icone} tom={tomIcone} tamanho={36} /> : null}
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        {detalhe ? <Text style={estilos.detalhe}>{detalhe}</Text> : null}
      </View>
      {direita ?? (aoPressionar ? <Ionicons name="chevron-forward" size={18} color={paleta.tinta[400]} /> : null)}
    </>
  );

  if (!aoPressionar) return <View style={[estilos.item, divisor && estilos.divisor]}>{conteudo}</View>;

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => [estilos.item, divisor && estilos.divisor, pressed && estilos.pressionado]}
    >
      {conteudo}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divisor: {
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  pressionado: {
    backgroundColor: paleta.tinta[50],
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  titulo: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
  detalhe: {
    marginTop: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.sm,
    color: cores.texto3,
  },
});
