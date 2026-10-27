import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TorneioCard } from "../../src/components/torneioCard";
import { Botao } from "../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { useAuth } from "../../src/context/authContext";
import { useInscricoes } from "../../src/context/inscricoesContext";
import { cores } from "../../src/constants/colors";
import { espacamento } from "../../src/constants/theme";
import { Torneio } from "../../src/models/types";

export default function Torneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado } = useAuth();
  const { torneiosInscritos, carregandoInscricoes } = useInscricoes();

  function abrirTorneio(torneio: Torneio) {
    router.push(`/torneio/${torneio.id}`);
  }

  const cabecalho = <CabecalhoPagina titulo="Meus torneios" subtitulo="Os torneios em que você está inscrito" />;

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.md }]}>
      {carregandoInscricoes ? (
        <View style={estilos.lista}>
          {cabecalho}
          <ActivityIndicator color={cores.primaria} size="large" style={estilos.carregando} />
        </View>
      ) : (
        <FlatList
          data={torneiosInscritos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <TorneioCard torneio={item} aoPressionar={abrirTorneio} />}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={
            autenticado ? (
              <EstadoVazio
                icone="trophy-outline"
                titulo="Nenhuma inscrição ainda"
                texto="Escolha um torneio na aba Descobrir e faça sua inscrição pelo app."
              >
                <Botao titulo="Descobrir torneios" icone="compass-outline" aoPressionar={() => router.navigate("/(tabs)")} />
              </EstadoVazio>
            ) : (
              <EstadoVazio
                icone="person-outline"
                titulo="Entre para ver seus torneios"
                texto="Suas inscrições, check-ins e partidas ficam salvos na sua conta."
              >
                <Botao titulo="Entrar" icone="log-in-outline" aoPressionar={() => router.push("/login")} />
              </EstadoVazio>
            )
          }
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
  carregando: { marginTop: espacamento.xl },
});
