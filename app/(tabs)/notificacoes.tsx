import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificacaoItem } from "../../src/components/NotificacaoItem";
import { Botao } from "../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { useAuth } from "../../src/context/authContext";
import { useNotificacoes } from "../../src/context/notificacaoContext";
import { Notificacao } from "../../src/models/types";
import { cores } from "../../src/constants/colors";
import { espacamento } from "../../src/constants/theme";

export default function Notificacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autenticado } = useAuth();
  const { notificacoes, quantidadeNaoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();

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

  const cabecalho = (
    <CabecalhoPagina
      titulo="Avisos"
      subtitulo={
        autenticado && quantidadeNaoLidas > 0
          ? `${quantidadeNaoLidas} ${quantidadeNaoLidas === 1 ? "aviso novo" : "avisos novos"}`
          : "Inscrições, check-ins e resultados"
      }
      acao={
        autenticado && quantidadeNaoLidas > 0 ? (
          <Botao
            titulo="Marcar lidas"
            variante="fantasma"
            tamanho="sm"
            icone="checkmark-done"
            aoPressionar={() => marcarTodasComoLidas().catch(() => undefined)}
          />
        ) : null
      }
    />
  );

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.md }]}>
      {!autenticado ? (
        <View style={estilos.lista}>
          {cabecalho}
          <EstadoVazio
            icone="notifications-outline"
            titulo="Entre para ver seus avisos"
            texto="A loja avisa por aqui quando sua partida é chamada e quando sai o resultado."
          >
            <Botao titulo="Entrar" icone="log-in-outline" aoPressionar={() => router.push("/login")} />
          </EstadoVazio>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={
            <EstadoVazio
              icone="notifications-outline"
              titulo="Nenhum aviso por enquanto"
              texto="Quando você se inscrever num torneio, os avisos da loja chegam aqui."
            />
          }
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => <NotificacaoItem notificacao={item} aoPressionar={abrirNotificacao} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.pagina,
  },
  lista: {
    paddingHorizontal: espacamento.md,
    paddingBottom: espacamento.xl,
  },
});
