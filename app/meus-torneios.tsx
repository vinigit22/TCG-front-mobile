import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { TorneioCard } from "../src/components/torneioCard";
import { torneiosMock } from "../src/mocks/torneios";
import { cores } from "../src/constants/colors";
import { espacamento, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function MeusTorneios() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [autenticado, carregando]);

  if (carregando || !autenticado) {
    return <View style={estilos.container} />;
  }

  const futuros = torneiosMock.filter((torneio) => torneio.status === "INSCRICOES_ABERTAS");
  const andamento = torneiosMock.filter((torneio) => torneio.status === "EM_ANDAMENTO");
  const encerrados = torneiosMock.filter((torneio) => torneio.status === "FINALIZADO");

  const secoes = [
    { titulo: "Em andamento", dados: andamento },
    { titulo: "Próximos", dados: futuros },
    { titulo: "Encerrados", dados: encerrados },
  ].filter((secao) => secao.dados.length > 0);

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <Text style={estilos.titulo}>Meus torneios</Text>

      {secoes.length === 0 ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>Você ainda não está inscrito em nenhum torneio.</Text>
        </View>
      ) : (
        <FlatList
          data={secoes}
          keyExtractor={(item) => item.titulo}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <View style={estilos.secao}>
              <Text style={estilos.secaoTitulo}>{item.titulo}</Text>
              {item.dados.map((torneio) => (
                <TorneioCard
                  key={torneio.id}
                  torneio={torneio}
                  aoPressionar={(t) => router.push(`/torneio/${t.id}`)}
                />
              ))}
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
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.sm,
  },
  lista: {
    padding: espacamento.md,
  },
  secao: {
    marginBottom: espacamento.lg,
  },
  secaoTitulo: {
    color: cores.roxo,
    fontSize: tamanhoFonte.md,
    fontWeight: "800",
    marginBottom: espacamento.sm,
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