import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { BarraNavegacao } from "../../src/components/barraNavegacao";
import { TorneioCard } from "../../src/components/torneioCard";
import { useTorneios } from "../../src/hooks/useTorneios";
import { cores } from "../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../src/constants/theme";
import { Torneio } from "../../src/models/types";
import { useNotificacoes } from "../../src/context/notificacaoContext";

export default function Home() {
  const router = useRouter();
  const { torneios, carregando, erro } = useTorneios();
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [mostrarPesquisa, setMostrarPesquisa] = useState(true);
  const ultimoOffset = useRef(0);

  const { quantidadeNaoLidas } = useNotificacoes();

  const torneiosFiltrados = useMemo(() => {
    const termo = termoPesquisa.trim().toLowerCase();

    if (!termo) {
      return torneios;
    }

    return torneios.filter(
      (torneio) =>
        torneio.titulo.toLowerCase().includes(termo) ||
        torneio.jogo.toLowerCase().includes(termo) ||
        torneio.nomeLoja.toLowerCase().includes(termo)
    );
  }, [torneios, termoPesquisa]);

  function abrirTorneio(torneio: Torneio) {
    router.push(`/torneio/${torneio.id}`);
  }

  function aoRolar(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetAtual = evento.nativeEvent.contentOffset.y;

    if (offsetAtual <= 0) {
      setMostrarPesquisa(true);
      ultimoOffset.current = 0;
      return;
    }

    if (offsetAtual > ultimoOffset.current + 8) {
      setMostrarPesquisa(false);
    } else if (offsetAtual < ultimoOffset.current - 8) {
      setMostrarPesquisa(true);
    }

    ultimoOffset.current = offsetAtual;
  }

  return (
    <View style={estilos.container}>
      <BarraNavegacao
        termoPesquisa={termoPesquisa}
        aoMudarPesquisa={setTermoPesquisa}
        aoAbrirNotificacoes={() => router.push("/notificacoes")}
        aoAbrirPerfil={() => router.push("/perfil")}
        quantidadeNaoLidas={quantidadeNaoLidas}
        mostrarPesquisa={mostrarPesquisa}
      />

      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator color={cores.verdeEscuro} size="large" />
        </View>
      ) : erro ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>
            Não foi possível carregar os torneios.
          </Text>
        </View>
      ) : torneiosFiltrados.length === 0 ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>
            Nenhum torneio encontrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={torneiosFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <TorneioCard
              torneio={item}
              aoPressionar={abrirTorneio}
            />
          )}
          onScroll={aoRolar}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
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
  lista: {
    padding: espacamento.md,
    paddingBottom: espacamento.xl,
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
