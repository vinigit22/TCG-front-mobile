import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { Deck } from "../src/models/types";
import { cores } from "../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

const decksMock: Deck[] = [
  { id: 1, jogadorId: 4, nome: "Charizard ex Control", jogoId: 2, principal: true },
  { id: 2, jogadorId: 4, nome: "Blue-Eyes Ultimate", jogoId: 3, principal: false },
];

export default function DeckJogador() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado, carregando } = useAuth();
  const [decks] = useState<Deck[]>(decksMock);

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [autenticado, carregando]);

  if (carregando || !autenticado) {
    return <View style={estilos.container} />;
  }

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Meus decks</Text>
        <Pressable style={estilos.botaoAdicionar}>
          <Text style={estilos.botaoAdicionarTexto}>+ NOVO</Text>
        </Pressable>
      </View>

      {decks.length === 0 ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>Você ainda não cadastrou nenhum deck.</Text>
        </View>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <View style={estilos.card}>
              <View style={estilos.linhaTitulo}>
                <Text style={estilos.deckNome}>{item.nome}</Text>
                {item.principal ? (
                  <View style={estilos.selo}>
                    <Text style={estilos.seloTexto}>PRINCIPAL</Text>
                  </View>
                ) : null}
              </View>
              <Pressable>
                <Text style={estilos.link}>Editar deck</Text>
              </Pressable>
            </View>
          )}
        />
      )}
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
  },
  botaoAdicionarTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.xs,
  },
  lista: {
    padding: espacamento.md,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.sm,
    ...sombra,
  },
  linhaTitulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: espacamento.sm,
  },
  deckNome: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.md,
    fontWeight: "700",
  },
  selo: {
    backgroundColor: cores.verdeEscuro,
    borderRadius: raio.pill,
    paddingVertical: 2,
    paddingHorizontal: espacamento.sm,
  },
  seloTexto: {
    color: cores.textoClaro,
    fontSize: 10,
    fontWeight: "800",
  },
  link: {
    color: cores.roxo,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
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