import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { BarraNavegacao } from "../../src/components/barraNavegacao";
import { TorneioCard } from "../../src/components/torneioCard";
import { LojaCard } from "../../src/components/LojaCard";
import { useTorneios } from "../../src/hooks/useTorneios";
import { useLojas } from "../../src/hooks/useLojas";
import { cores } from "../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../src/constants/theme";
import { Loja, Torneio } from "../../src/models/types";

export default function Home() {
  const router = useRouter();
  const torneios = useTorneios();
  const lojas = useLojas();
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [alturaCabecalho, setAlturaCabecalho] = useState(80);
  const [deslocamentoRolagem] = useState(() => new Animated.Value(0));
  useFocusEffect(useCallback(() => { setStatusBarStyle("light"); return () => setStatusBarStyle("dark"); }, []));
  const termo = termoPesquisa.trim().toLocaleLowerCase();
  const lojasFiltradas = useMemo(() => !termo ? lojas.lojas : lojas.lojas.filter(loja => [loja.nome, loja.descricao ?? "", loja.endereco?.cidade ?? ""].some(valor => valor.toLocaleLowerCase().includes(termo))), [lojas.lojas, termo]);
  const torneiosFiltrados = useMemo(() => !termo ? torneios.torneios : torneios.torneios.filter(torneio => [torneio.titulo, torneio.jogo, torneio.nomeLoja, torneio.descricao ?? ""].some(valor => valor.toLocaleLowerCase().includes(termo))), [torneios.torneios, termo]);
  const deslocamentoCabecalho = deslocamentoRolagem.interpolate({ inputRange: [0, alturaCabecalho], outputRange: [0, -alturaCabecalho], extrapolate: "clamp" });
  const opacidadeCabecalho = deslocamentoRolagem.interpolate({ inputRange: [0, alturaCabecalho * .65, alturaCabecalho], outputRange: [1, .65, 0], extrapolate: "clamp" });
  const cabecalho = <BarraNavegacao aoAbrirPesquisa={() => setPesquisaAberta(true)} aoFecharPesquisa={() => { setPesquisaAberta(false); setTermoPesquisa(""); }} pesquisaAberta={pesquisaAberta} termoPesquisa={termoPesquisa} aoMudarPesquisa={setTermoPesquisa} />;
  if (torneios.carregando || lojas.carregando) return <View style={estilos.container}>{cabecalho}<View style={estilos.centro}><ActivityIndicator color={cores.verdeEscuro} size="large" /></View></View>;
  if (torneios.erro || lojas.erro) return <View style={estilos.container}>{cabecalho}<View style={estilos.centro}><Text style={estilos.mensagem}>Não foi possível carregar os dados.</Text></View></View>;
  return <View style={estilos.container}><Animated.View style={[estilos.cabecalho, { opacity: opacidadeCabecalho, transform: [{ translateY: deslocamentoCabecalho }] }]} onLayout={({ nativeEvent }) => setAlturaCabecalho(nativeEvent.layout.height)}>{cabecalho}</Animated.View><Animated.FlatList data={torneiosFiltrados} keyExtractor={(item: Torneio) => String(item.id)} contentContainerStyle={[estilos.lista, { paddingTop: alturaCabecalho + espacamento.sm }]} ListHeaderComponent={<><Text style={estilos.secao}>Lojas</Text>{lojasFiltradas.length ? lojasFiltradas.map((loja: Loja) => <LojaCard key={loja.contaId} loja={loja} aoPressionar={(item) => router.push(`/loja/${item.contaId}` as never)} />) : <Text style={estilos.mensagem}>Nenhuma loja encontrada.</Text>}<Text style={estilos.secao}>Torneios</Text></>} ListEmptyComponent={<Text style={estilos.mensagem}>Nenhum torneio encontrado.</Text>} renderItem={({ item }: { item: Torneio }) => <TorneioCard torneio={item} aoPressionar={(item) => router.push(`/torneio/${item.id}`)} />} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: deslocamentoRolagem } } }], { useNativeDriver: true })} scrollEventThrottle={16} showsVerticalScrollIndicator={false} /></View>;
}
const estilos = StyleSheet.create({ container: { flex: 1, backgroundColor: cores.fundo }, cabecalho: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, elevation: 2 }, lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl }, secao: { color: cores.verdeEscuro, fontSize: tamanhoFonte.lg, fontWeight: "900", marginTop: espacamento.sm, marginBottom: espacamento.sm }, centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg }, mensagem: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center", marginBottom: espacamento.md } });