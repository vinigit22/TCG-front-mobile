import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { cores } from "../src/constants/colors";
import { espacamento } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { Botao } from "../src/components/ui/Botao";
import { CabecalhoPagina } from "../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../src/components/ui/EstadoVazio";

export default function DeckJogador() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [autenticado, carregando, router]);

  if (carregando || !autenticado) {
    return <View style={estilos.container} />;
  }

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <View style={estilos.conteudo}>
        <CabecalhoPagina
          titulo="Meus decks"
          acao={<Botao titulo="Novo" variante="acento" tamanho="sm" icone="add" desabilitado />}
        />
        <EstadoVazio
          icone="layers-outline"
          titulo="Você ainda não cadastrou nenhum deck"
          texto="Em breve você vai poder guardar suas listas e levar para os torneios."
        />
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
