import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { useInscricoes } from "../src/context/inscricoesContext";
import { TorneioCard } from "../src/components/torneioCard";
import { torneiosMock } from "../src/mocks/torneios";
import { cores } from "../src/constants/colors";
import { espacamento, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function MeusTorneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado, carregando } = useAuth();
  const { torneioIds, carregandoInscricoes } = useInscricoes();

  useEffect(() => { if (!carregando && !autenticado) router.replace("/login"); }, [autenticado, carregando]);
  if (carregando || !autenticado || carregandoInscricoes) return <View style={estilos.container} />;

  const inscritos = torneiosMock.filter((torneio) => torneioIds.includes(torneio.id));
  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <Text style={estilos.titulo}>Meus torneios</Text>
      {inscritos.length === 0 ? <View style={estilos.centralizado}><Text style={estilos.mensagem}>Você ainda não está inscrito em nenhum torneio.</Text></View>
      : <FlatList data={inscritos} keyExtractor={(item) => String(item.id)} contentContainerStyle={estilos.lista} renderItem={({ item }) => <TorneioCard torneio={item} aoPressionar={(torneio) => router.push(`/torneio/${torneio.id}`)} />} />}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  titulo: { color: cores.verdeEscuro, fontSize: tamanhoFonte.xl, fontWeight: "900", paddingHorizontal: espacamento.md, marginBottom: espacamento.sm },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.md },
  centralizado: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg },
  mensagem: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center" },
});
