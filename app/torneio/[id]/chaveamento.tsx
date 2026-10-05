import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chaveamento } from "../../../src/components/Chaveamento";
import { useChaveamento } from "../../../src/hooks/useChaveamento";
import { cores } from "../../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../../src/constants/theme";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";

export default function ChaveamentoTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { partidas, carregando, erro } = useChaveamento(Number(id));

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom + espacamento.md }]}>
      <BotaoVoltar />
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Chaveamento</Text>
        {carregando ? (
          <ActivityIndicator color={cores.verdeEscuro} size="large" />
        ) : erro ? (
          <Text style={estilos.mensagem}>Não foi possível carregar o chaveamento.</Text>
        ) : (
          <Chaveamento partidas={partidas} />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: espacamento.lg,
  },
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.lg,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
  },
});
