import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TorneioCard } from "../../src/components/torneioCard";
import { useInscricoes } from "../../src/context/inscricoesContext";
import { cores } from "../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../src/constants/theme";
import { Torneio } from "../../src/models/types";

export default function Torneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { torneiosInscritos, carregandoInscricoes } = useInscricoes();

  function abrirTorneio(torneio: Torneio) {
    router.push(`/torneio/${torneio.id}`);
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm, paddingBottom: insets.bottom }]}>
      {carregandoInscricoes ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator color={cores.verdeEscuro} size="large" />
        </View>
      ) : (
        <FlatList
          data={torneiosInscritos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <TorneioCard torneio={item} aoPressionar={abrirTorneio} />}
          ListHeaderComponent={<Text style={estilos.titulo}>Meus torneios</Text>}
          ListEmptyComponent={<Text style={estilos.mensagemVazia}>Você ainda não está inscrito em nenhum torneio.</Text>}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.md },
  titulo: { color: cores.verdeEscuro, fontSize: tamanhoFonte.xl, fontWeight: "900", marginBottom: espacamento.sm },
  centralizado: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg },
  mensagemVazia: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center", marginTop: espacamento.md },
});
