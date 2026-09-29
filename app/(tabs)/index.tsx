import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
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
  const { quantidadeNaoLidas } = useNotificacoes();
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [alturaCabecalho, setAlturaCabecalho] = useState(80);
  const deslocamentoRolagem = useRef(new Animated.Value(0)).current;

  const torneiosFiltrados = useMemo(() => {
    const termo = termoPesquisa.trim().toLocaleLowerCase();
    if (!termo) return torneios;
    return torneios.filter((torneio) => [torneio.titulo, torneio.jogo, torneio.nomeLoja, torneio.descricao ?? ""].some((valor) => valor.toLocaleLowerCase().includes(termo)));
  }, [termoPesquisa, torneios]);

  const deslocamentoCabecalho = deslocamentoRolagem.interpolate({ inputRange: [0, alturaCabecalho], outputRange: [0, -alturaCabecalho], extrapolate: "clamp" });
  const opacidadeCabecalho = deslocamentoRolagem.interpolate({ inputRange: [0, alturaCabecalho * 0.65, alturaCabecalho], outputRange: [1, 0.65, 0], extrapolate: "clamp" });

  function abrirTorneio(torneio: Torneio) { router.push(`/torneio/${torneio.id}`); }
  function fecharPesquisa() { setPesquisaAberta(false); setTermoPesquisa(""); }

  const cabecalho = (
    <BarraNavegacao
      aoAbrirNotificacoes={() => router.push("/notificacoes")}
      aoAbrirPerfil={() => router.push("/perfil")}
      aoAbrirPesquisa={() => setPesquisaAberta(true)}
      aoFecharPesquisa={fecharPesquisa}
      pesquisaAberta={pesquisaAberta}
      termoPesquisa={termoPesquisa}
      aoMudarPesquisa={setTermoPesquisa}
      quantidadeNaoLidas={quantidadeNaoLidas}
    />
  );

  if (carregando) return <View style={estilos.container}>{cabecalho}<View style={estilos.centralizado}><ActivityIndicator color={cores.verdeEscuro} size="large" /></View></View>;
  if (erro) return <View style={estilos.container}>{cabecalho}<View style={estilos.centralizado}><Text style={estilos.mensagem}>Nao foi possivel carregar os torneios.</Text></View></View>;

  return (
    <View style={estilos.container}>
      <Animated.View style={[estilos.cabecalhoFlutuante, { opacity: opacidadeCabecalho, transform: [{ translateY: deslocamentoCabecalho }] }]} onLayout={({ nativeEvent }) => setAlturaCabecalho(nativeEvent.layout.height)}>
        {cabecalho}
      </Animated.View>
      <Animated.FlatList
        data={torneiosFiltrados}
        keyExtractor={(item: Torneio) => String(item.id)}
        ListEmptyComponent={<View style={estilos.vazio}><Text style={estilos.mensagem}>Nenhum torneio encontrado.</Text></View>}
        contentContainerStyle={[estilos.lista, { paddingTop: alturaCabecalho + espacamento.sm }]}
        renderItem={({ item }: { item: Torneio }) => <View style={estilos.item}><TorneioCard torneio={item} aoPressionar={abrirTorneio} /></View>}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: deslocamentoRolagem } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  cabecalhoFlutuante: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, elevation: 2 },
  lista: { paddingBottom: espacamento.xl },
  item: { marginHorizontal: espacamento.md },
  centralizado: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg },
  vazio: { padding: espacamento.lg },
  mensagem: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center" },
});
