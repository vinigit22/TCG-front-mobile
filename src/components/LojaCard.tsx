import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Loja } from "../models/types";
import { cores, paleta } from "../constants/colors";
import { cartao, espacamento, fontes, tamanhoFonte } from "../constants/theme";
import { BlocoIcone } from "./ui/BlocoIcone";

// Cartão de loja da home (rola na horizontal)
export function LojaCard({ loja, aoPressionar }: { loja: Loja; aoPressionar: (loja: Loja) => void }) {
  const local = loja.endereco ? `${loja.endereco.cidade}/${loja.endereco.estado}` : undefined;

  return (
    <Pressable
      style={({ pressed }) => [estilos.card, pressed && estilos.pressionado]}
      onPress={() => aoPressionar(loja)}
      accessibilityRole="button"
      accessibilityLabel={`Loja ${loja.nome}`}
    >
      <View style={estilos.topo}>
        <BlocoIcone nome="storefront-outline" tamanho={42} />
        <Ionicons name="chevron-forward" size={18} color={paleta.tinta[400]} />
      </View>
      <View style={estilos.nomeLinha}>
        <Text style={estilos.nome} numberOfLines={1}>
          {loja.nome}
        </Text>
        {loja.verificada ? (
          <Ionicons name="checkmark-circle" size={16} color={paleta.verde[600]} accessibilityLabel="Loja verificada" />
        ) : null}
      </View>
      <Text style={estilos.descricao} numberOfLines={2}>
        {loja.descricao || "Loja parceira TopDeck"}
      </Text>
      {local ? (
        <View style={estilos.local}>
          <Ionicons name="location-outline" size={13} color={cores.texto3} />
          <Text style={estilos.localTexto} numberOfLines={1}>
            {local}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    ...cartao,
    width: 220,
    padding: espacamento.md,
    marginRight: espacamento.ms,
  },
  pressionado: {
    borderColor: paleta.roxo[200],
    backgroundColor: paleta.roxo[50],
  },
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: espacamento.ms,
  },
  nomeLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  nome: {
    flexShrink: 1,
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
  descricao: {
    minHeight: 36,
    marginTop: 3,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.sm,
    lineHeight: 18,
    color: cores.texto3,
  },
  local: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: espacamento.sm,
  },
  localTexto: {
    flexShrink: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.xs,
    color: cores.texto2,
  },
});
