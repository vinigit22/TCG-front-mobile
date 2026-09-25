import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chaveamento } from "../../../src/components/Chaveamento";
import { chaveamentoMock } from "../../../src/mocks/notificacoesEChaveamento";
import { cores } from "../../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../../src/constants/theme";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";

export default function ChaveamentoTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const partidas = chaveamentoMock.filter((partida) => partida.torneioId === Number(id));

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom + espacamento.md }]}>
      <BotaoVoltar />
      <Text style={estilos.titulo}>Chaveamento</Text>
      <Chaveamento partidas={partidas} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espacamento.lg,
  },
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.lg,
  },
});