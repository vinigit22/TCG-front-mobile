import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TorneioCard } from "../../src/components/torneioCard";
import { useTorneios } from "../../src/hooks/useTorneios";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../../src/constants/theme";
import { Torneio } from "../../src/models/types";

export default function Torneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { torneios, carregando, erro } = useTorneios();
  const [jogoSelecionado, setJogoSelecionado] = useState<string | null>(null);

  const jogos = useMemo(() => {
    const conjunto = new Set(torneios.map((torneio) => torneio.jogo));
    return Array.from(conjunto);
  }, [torneios]);

  const torneiosFiltrados = useMemo(() => {
    if (!jogoSelecionado) return torneios;
    return torneios.filter((torneio) => torneio.jogo === jogoSelecionado);
  }, [torneios, jogoSelecionado]);

  function abrirTorneio(torneio: Torneio) {
    router.push(`/torneio/${torneio.id}`);
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm, paddingBottom: insets.bottom }]}>
      <Text style={estilos.titulo}>Torneios</Text>

      {jogos.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={jogos}
          keyExtractor={(item) => item}
          contentContainerStyle={estilos.filtros}
          renderItem={({ item }) => (
            <Pressable
              style={[estilos.chip, jogoSelecionado === item && estilos.chipSelecionado]}
              onPress={() => setJogoSelecionado(jogoSelecionado === item ? null : item)}
            >
              <Text
                style={[
                  estilos.chipTexto,
                  jogoSelecionado === item && estilos.chipTextoSelecionado,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      ) : null}

      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator color={cores.verdeEscuro} size="large" />
        </View>
      ) : erro ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>Não foi possível carregar os torneios.</Text>
        </View>
      ) : torneiosFiltrados.length === 0 ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>Nenhum torneio encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={torneiosFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => <TorneioCard torneio={item} aoPressionar={abrirTorneio} />}
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
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.sm,
  },
  filtros: {
    paddingHorizontal: espacamento.md,
    gap: espacamento.sm,
    paddingBottom: espacamento.sm,
  },
  chip: {
    backgroundColor: cores.branco,
    borderRadius: raio.pill,
    borderWidth: 1,
    borderColor: cores.verdeEscuro,
    paddingVertical: espacamento.xs,
    paddingHorizontal: espacamento.md,
    marginRight: espacamento.sm,
  },
  chipSelecionado: {
    backgroundColor: cores.verdeEscuro,
  },
  chipTexto: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
  },
  chipTextoSelecionado: {
    color: cores.textoClaro,
  },
  lista: {
    padding: espacamento.md,
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
