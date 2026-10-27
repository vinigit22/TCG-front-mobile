import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chaveamento } from "../../../src/components/Chaveamento";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";
import { CabecalhoPagina } from "../../../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../../../src/components/ui/EstadoVazio";
import { useChaveamento } from "../../../src/hooks/useChaveamento";
import { cores } from "../../../src/constants/colors";
import { espacamento } from "../../../src/constants/theme";

export default function ChaveamentoTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { partidas, carregando, erro } = useChaveamento(Number(id), 10000);

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom + espacamento.md }]}>
      <BotaoVoltar />
      <View style={estilos.conteudo}>
        <CabecalhoPagina titulo="Chaveamento" subtitulo="Atualiza sozinho a cada resultado" />
        {carregando ? (
          <ActivityIndicator color={cores.primaria} size="large" />
        ) : erro ? (
          <EstadoVazio erro titulo="Não foi possível carregar o chaveamento" texto="Confira sua conexão e tente de novo." />
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
    backgroundColor: cores.pagina,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: espacamento.md,
  },
});
