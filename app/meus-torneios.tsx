import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { useInscricoes } from "../src/context/inscricoesContext";
import { TorneioCard } from "../src/components/torneioCard";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { Botao } from "../src/components/ui/Botao";
import { CabecalhoPagina } from "../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../src/components/ui/EstadoVazio";
import { cores } from "../src/constants/colors";
import { espacamento } from "../src/constants/theme";

export default function MeusTorneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado, carregando } = useAuth();
  const { torneiosInscritos, carregandoInscricoes } = useInscricoes();

  useEffect(() => { if (!carregando && !autenticado) router.replace("/login"); }, [autenticado, carregando, router]);
  if (carregando || !autenticado || carregandoInscricoes) return <View style={estilos.container} />;

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <FlatList
        data={torneiosInscritos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={<CabecalhoPagina titulo="Meus torneios" subtitulo="Os torneios em que você está inscrito" />}
        ListEmptyComponent={
          <EstadoVazio icone="trophy-outline" titulo="Nenhuma inscrição ainda" texto="Escolha um torneio na aba Descobrir e faça sua inscrição pelo app.">
            <Botao titulo="Descobrir torneios" icone="compass-outline" aoPressionar={() => router.navigate("/(tabs)")} />
          </EstadoVazio>
        }
        renderItem={({ item }) => <TorneioCard torneio={item} aoPressionar={(torneio) => router.push(`/torneio/${torneio.id}`)} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
});
