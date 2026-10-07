import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { cores } from "../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

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
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Meus decks</Text>
        <Pressable style={estilos.botaoAdicionar} disabled>
          <Text style={estilos.botaoAdicionarTexto}>+ NOVO</Text>
        </Pressable>
      </View>
      <View style={estilos.centralizado}>
        <Text style={estilos.mensagem}>Você ainda não cadastrou nenhum deck.</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.sm,
  },
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
  },
  botaoAdicionar: {
    backgroundColor: cores.magenta,
    borderRadius: raio.pill,
    paddingVertical: espacamento.xs,
    paddingHorizontal: espacamento.md,
    opacity: 0.5,
  },
  botaoAdicionarTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.xs,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacamento.lg,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
  },
});