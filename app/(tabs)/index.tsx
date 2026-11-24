import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { BarraNavegacao } from "../../src/components/barraNavegacao";
import { TorneioCard } from "../../src/components/torneioCard";
import { LojaCard } from "../../src/components/LojaCard";
import { FundoNoite } from "../../src/components/ui/Capa";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { LequeCartas } from "../../src/components/ui/Marca";
import { useTorneios } from "../../src/hooks/useTorneios";
import { useLojas } from "../../src/hooks/useLojas";
import { cores, paleta, sobreNoite } from "../../src/constants/colors";
import { espacamento, fontes, raio, sombras, tamanhoFonte, tipografia } from "../../src/constants/theme";
import { Loja, Torneio } from "../../src/models/types";

// O hero da home do site, em tamanho de celular
function Apresentacao() {
  return (
    <View style={estilos.hero}>
      <FundoNoite />
      <View style={estilos.heroTexto}>
        <View style={estilos.heroKicker}>
          <Text style={estilos.heroKickerTexto}>PRA QUEM JOGA</Text>
        </View>
        <Text style={estilos.heroTitulo}>
          TORNEIOS? <Text style={estilos.heroDestaque}>TEMOS</Text>
        </Text>
        <Text style={estilos.heroTitulo}>
          TROCAS? <Text style={estilos.heroDestaque}>TEMOS</Text>
        </Text>
        <Text style={estilos.heroSub}>Inscreva-se, faça check-in na mesa e acompanhe a chave ao vivo.</Text>
      </View>
      <LequeCartas escala={0.8} />
    </View>
  );
}

function TituloSecao({ titulo, quantidade }: { titulo: string; quantidade: number }) {
  return (
    <View style={estilos.secao}>
      <Text accessibilityRole="header" style={estilos.secaoTitulo}>
        {titulo}
      </Text>
      <View style={estilos.contador}>
        <Text style={estilos.contadorTexto}>{quantidade}</Text>
      </View>
    </View>
  );
}

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

  if (torneios.carregando || lojas.carregando) {
    return (
      <View style={estilos.container}>
        {cabecalho}
        <View style={estilos.centro}><ActivityIndicator color={cores.primaria} size="large" /></View>
      </View>
    );
  }

  if (torneios.erro || lojas.erro) {
    return (
      <View style={estilos.container}>
        {cabecalho}
        <View style={estilos.centro}>
          <EstadoVazio erro titulo="Não foi possível carregar os dados" texto="Confira sua conexão e abra a aba de novo." />
        </View>
      </View>
    );
  }

  const listaCabecalho = (
    <>
      {termo ? null : <Apresentacao />}
      <TituloSecao titulo="Lojas" quantidade={lojasFiltradas.length} />
      {lojasFiltradas.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.carrossel} contentContainerStyle={estilos.carrosselConteudo}>
          {lojasFiltradas.map((loja: Loja) => <LojaCard key={loja.contaId} loja={loja} aoPressionar={(item) => router.push(`/loja/${item.contaId}` as never)} />)}
        </ScrollView>
      ) : (
        <Text style={estilos.mensagem}>Nenhuma loja encontrada.</Text>
      )}
      <TituloSecao titulo="Torneios" quantidade={torneiosFiltrados.length} />
    </>
  );

  return (
    <View style={estilos.container}>
      <Animated.View style={[estilos.cabecalho, { opacity: opacidadeCabecalho, transform: [{ translateY: deslocamentoCabecalho }] }]} onLayout={({ nativeEvent }) => setAlturaCabecalho(nativeEvent.layout.height)}>{cabecalho}</Animated.View>
      <Animated.FlatList
        data={torneiosFiltrados}
        keyExtractor={(item: Torneio) => String(item.id)}
        contentContainerStyle={[estilos.lista, { paddingTop: alturaCabecalho + espacamento.md }]}
        ListHeaderComponent={listaCabecalho}
        ListEmptyComponent={<EstadoVazio icone="trophy-outline" titulo="Nenhum torneio encontrado" texto={termo ? "Tente outro nome de jogo, loja ou torneio." : "Quando uma loja abrir inscrições, o torneio aparece aqui."} />}
        renderItem={({ item }: { item: Torneio }) => <TorneioCard torneio={item} aoPressionar={(item) => router.push(`/torneio/${item.id}`)} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: deslocamentoRolagem } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  cabecalho: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, elevation: 2 },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg },
  mensagem: { ...tipografia.pequeno, marginBottom: espacamento.md },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    marginBottom: espacamento.lg,
    paddingVertical: espacamento.ml,
    paddingLeft: espacamento.ml,
    paddingRight: espacamento.xs,
    borderRadius: raio.xl,
    overflow: "hidden",
    backgroundColor: paleta.roxo[950],
    ...sombras.md,
  },
  heroTexto: { flex: 1 },
  // .titulo-apresentacao do site
  heroKicker: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: espacamento.ms,
    borderRadius: raio.pill,
    backgroundColor: sobreNoite.pilula,
  },
  heroKickerTexto: { fontFamily: fontes.marca, fontSize: 10, letterSpacing: 0.8, color: paleta.roxo[200] },
  heroTitulo: { fontFamily: fontes.marca, fontSize: 21, lineHeight: 26, color: cores.textoInverso },
  heroDestaque: { color: paleta.verde[300] },
  heroSub: { marginTop: espacamento.ms, fontFamily: fontes.regular, fontSize: tamanhoFonte.sm, lineHeight: 19, color: paleta.tinta[300] },
  secao: { flexDirection: "row", alignItems: "center", gap: espacamento.sm, marginBottom: espacamento.ms },
  secaoTitulo: tipografia.tituloSecao,
  contador: { minWidth: 22, height: 22, paddingHorizontal: 7, borderRadius: raio.pill, alignItems: "center", justifyContent: "center", backgroundColor: paleta.roxo[100] },
  contadorTexto: { fontFamily: fontes.bold, fontSize: tamanhoFonte.xxs, fontVariant: ["tabular-nums"], color: paleta.roxo[700] },
  carrossel: { marginHorizontal: -espacamento.md, marginBottom: espacamento.lg },
  carrosselConteudo: { paddingHorizontal: espacamento.md, paddingBottom: 4 },
});
