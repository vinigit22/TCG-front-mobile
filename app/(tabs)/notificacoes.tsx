import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificacaoItem } from "../../src/components/NotificacaoItem";
import { useNotificacoes } from "../../src/context/notificacaoContext";
import { cores } from "../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../src/constants/theme";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";

export default function Notificacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notificacoes, removerNotificacao } = useNotificacoes();

  async function abrirNotificacao(
    notificacao: (typeof notificacoes)[number]
  ) {
    await removerNotificacao(notificacao.id);

    if (notificacao.torneioId) {
      router.push(`/torneio/${notificacao.torneioId}`);
    }
  }

  return (
    <View
      style={[
        estilos.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <BotaoVoltar />

      <Text style={estilos.titulo}>Notificações</Text>

      {notificacoes.length === 0 ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>
            Você não tem novas notificações.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <NotificacaoItem
              notificacao={item}
              aoPressionar={abrirNotificacao}
            />
          )}
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
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.sm,
  },
  lista: {
    paddingHorizontal: espacamento.md,
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