import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { chaveamentoMock } from "../../../src/mocks/notificacoesEChaveamento";
import { cores } from "../../../src/constants/colors";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";
import { espacamento, raio, tamanhoFonte } from "../../../src/constants/theme";

const rotulosStatus: Record<string, string> = {
  AGUARDANDO: "Aguardando partida",
  PRONTA: "Novo confronto disponível",
  EM_ANDAMENTO: "Partida em andamento",
  FINALIZADA: "Partida finalizada",
};

export default function ConfrontoTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const partidas = chaveamentoMock.filter((partida) => partida.torneioId === Number(id));
  const partidaAtual = partidas.find((partida) => partida.status !== "FINALIZADA") ?? partidas[0];

  if (!partidaAtual) {
    return (
      <View style={estilos.centralizado}>
        <Text style={estilos.mensagem}>Você ainda não tem partidas neste torneio.</Text>
      </View>
    );
  }

  const adversario =
    partidaAtual.jogadorA && partidaAtual.jogadorB
      ? partidaAtual.jogadorA
      : partidaAtual.jogadorA ?? partidaAtual.jogadorB ?? "A definir";

  return (
    
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.lg }]}>
      <BotaoVoltar />
      <Text style={estilos.rodada}>{partidaAtual.nomeRodada.toUpperCase()}</Text>

      <View style={estilos.card}>
        <Text style={estilos.rotulo}>SEU ADVERSÁRIO</Text>
        <Text style={estilos.valor}>{adversario}</Text>

        <Text style={estilos.rotulo}>MESA</Text>
        <Text style={estilos.valor}>{partidaAtual.mesa}</Text>

        <Text style={estilos.rotulo}>STATUS</Text>
        <Text style={estilos.status}>{rotulosStatus[partidaAtual.status]}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espacamento.lg,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundo,
    paddingHorizontal: espacamento.lg,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
  },
  rodada: {
    color: cores.magenta,
    fontWeight: "900",
    fontSize: tamanhoFonte.lg,
    marginBottom: espacamento.lg,
    textAlign: "center",
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    paddingHorizontal: espacamento.lg,
    gap: espacamento.xs,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
    marginTop: espacamento.sm,
  },
  valor: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "800",
  },
  status: {
    color: cores.alerta,
    fontSize: tamanhoFonte.md,
    fontWeight: "700",
  },
});
