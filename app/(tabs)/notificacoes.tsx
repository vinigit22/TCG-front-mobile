import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificacaoItem } from "../../src/components/NotificacaoItem";
import { useAuth } from "../../src/context/authContext";
import { useNotificacoes } from "../../src/context/notificacaoContext";
import { Notificacao } from "../../src/models/types";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../../src/constants/theme";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";

export default function Notificacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado } = useAuth();
  const { notificacoes, marcarComoLida } = useNotificacoes();

  // Abrir marca como lida (como no backend); a notificação continua na lista
  async function abrirNotificacao(notificacao: Notificacao) {
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id).catch(() => undefined);
    }

    // Check-in: abre diretamente a tela da partida
    if (notificacao.tipo === "CHECK_IN_SOLICITADO" && notificacao.partidaId) {
      router.push(`/check-in/${notificacao.partidaId}` as never);
      return;
    }

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

      {!autenticado ? (
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagem}>Entre na sua conta para ver suas notificações.</Text>
          <Pressable style={estilos.botaoEntrar} onPress={() => router.push("/login")}>
            <Text style={estilos.botaoEntrarTexto}>ENTRAR</Text>
          </Pressable>
        </View>
      ) : notificacoes.length === 0 ? (
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
  botaoEntrar: {
    backgroundColor: cores.roxo,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.xl,
    marginTop: espacamento.lg,
  },
  botaoEntrarTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
  },
});
