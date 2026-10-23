import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/authContext";
import { useChaveamento } from "../../../src/hooks/useChaveamento";
import { usePartida } from "../../../src/hooks/usePartida";
import { Chaveamento } from "../../../src/models/types";
import { cores } from "../../../src/constants/colors";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";
import { espacamento, raio, tamanhoFonte } from "../../../src/constants/theme";

const INTERVALO_ATUALIZACAO = 10000;

const rotulosStatus: Record<string, string> = {
  AGUARDANDO: "Aguardando partida",
  PRONTA: "Novo confronto disponível",
  EM_ANDAMENTO: "Partida em andamento",
  FINALIZADA: "Partida finalizada",
};

const coresStatus: Record<string, string> = {
  AGUARDANDO: cores.textoSecundario,
  PRONTA: cores.magenta,
  EM_ANDAMENTO: cores.sucesso,
  FINALIZADA: cores.textoSecundario,
};

function resumirResultado(partida: Chaveamento, nickname?: string) {
  if (partida.status !== "FINALIZADA") return null;
  const souJogadorA = partida.jogadorA === nickname;
  const adversario = souJogadorA ? partida.jogadorB : partida.jogadorA;
  if (!adversario) return { texto: "Avançou sem adversário", venceu: true };
  if (!partida.vencedor) return null;
  const venceu = partida.vencedor === nickname;
  const meusGames = souJogadorA ? partida.gamesA : partida.gamesB;
  const gamesAdversario = souJogadorA ? partida.gamesB : partida.gamesA;
  return {
    texto: `${venceu ? "Vitória" : "Derrota"} (${meusGames} x ${gamesAdversario})`,
    venceu,
  };
}

interface CartaoHistoricoProps {
  partida: Chaveamento;
  nickname?: string;
}

function CartaoHistorico({ partida, nickname }: CartaoHistoricoProps) {
  const souJogadorA = partida.jogadorA === nickname;
  const adversario = souJogadorA ? partida.jogadorB : partida.jogadorA;
  const resumo = resumirResultado(partida, nickname);

  return (
    <View style={[estilos.card, estilos.cardHistorico]}>
      <Text style={estilos.rotulo}>RODADA</Text>
      <Text style={estilos.valor}>{partida.nomeRodada}</Text>

      <Text style={estilos.rotulo}>ADVERSÁRIO</Text>
      <Text style={estilos.valor}>{adversario ?? (partida.status === "FINALIZADA" ? "Sem adversário (bye)" : "A definir")}</Text>

      <Text style={estilos.rotulo}>MESA</Text>
      <Text style={estilos.valor}>{partida.mesa}</Text>

      {resumo ? (
        <>
          <Text style={estilos.rotulo}>RESULTADO</Text>
          <Text style={[estilos.valor, { color: resumo.venceu ? cores.sucesso : cores.erro }]}>{resumo.texto}</Text>
        </>
      ) : (
        <>
          <Text style={estilos.rotulo}>STATUS</Text>
          <Text style={[estilos.status, { color: coresStatus[partida.status] }]}>{rotulosStatus[partida.status]}</Text>
        </>
      )}
    </View>
  );
}

export default function ConfrontoTorneio() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const { partidas, carregando } = useChaveamento(Number(id), INTERVALO_ATUALIZACAO);

  const nickname = usuario?.nickname;
  const minhasPartidas = nickname
    ? partidas
        .filter((partida) => partida.jogadorA === nickname || partida.jogadorB === nickname)
        .sort((a, b) => a.rodada - b.rodada)
    : [];
  const partidaAtual =
    minhasPartidas.find((partida) => partida.status !== "FINALIZADA") ?? minhasPartidas[minhasPartidas.length - 1];

  const detalhe = usePartida(partidaAtual?.partidaId, INTERVALO_ATUALIZACAO);

  if (carregando || !partidaAtual) {
    return (
      <View style={[estilos.container, { paddingBottom: insets.bottom + espacamento.lg }]}>
        <BotaoVoltar />
        <View style={estilos.centralizado}>
          {carregando ? (
            <ActivityIndicator color={cores.verdeEscuro} size="large" />
          ) : (
            <Text style={estilos.mensagem}>Você ainda não tem partidas neste torneio.</Text>
          )}
        </View>
      </View>
    );
  }

  const souJogadorA = partidaAtual.jogadorA === nickname;
  const adversario = souJogadorA ? partidaAtual.jogadorB : partidaAtual.jogadorA;
  const finalizada = partidaAtual.status === "FINALIZADA";
  const textoAdversario = adversario ?? (finalizada ? "Sem adversário (bye)" : "A definir");

  let resultado: string | null = null;
  if (finalizada && partidaAtual.vencedor) {
    resultado = partidaAtual.vencedor === nickname ? "Vitória" : "Derrota";
  }

  const meuCheckIn = souJogadorA ? detalhe?.checkInAEm : detalhe?.checkInBEm;
  const checkInAdversario = souJogadorA ? detalhe?.checkInBEm : detalhe?.checkInAEm;
  const convocada = !!detalhe?.checkInExpiraEm && new Date(detalhe.checkInExpiraEm).getTime() > Date.now();
  const ambosConfirmaram = !!detalhe?.checkInAEm && !!detalhe?.checkInBEm;
  const emAndamento = !finalizada && (partidaAtual.status === "EM_ANDAMENTO" || ambosConfirmaram);
  const statusExibido = emAndamento ? "EM_ANDAMENTO" : partidaAtual.status;
  const mostrarCheckIn = !finalizada && !emAndamento && !!detalhe?.checkInExpiraEm;

  const tituloAtual = finalizada ? "Última partida" : emAndamento ? "Partida atual" : "Próxima partida";
  const historico = minhasPartidas
    .filter((partida) => partida.partidaId !== partidaAtual.partidaId)
    .sort((a, b) => b.rodada - a.rodada);

  return (
    <View style={estilos.container}>
      <BotaoVoltar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.lg }}
      >
        <Text style={estilos.secao}>{tituloAtual}</Text>
        <Text style={estilos.rodada}>{partidaAtual.nomeRodada.toUpperCase()}</Text>

        <View style={estilos.card}>
          <Text style={estilos.rotulo}>SEU ADVERSÁRIO</Text>
          <Text style={estilos.valor}>{textoAdversario}</Text>

          <Text style={estilos.rotulo}>MESA</Text>
          <Text style={estilos.valor}>{partidaAtual.mesa}</Text>

          <Text style={estilos.rotulo}>STATUS</Text>
          <Text style={[estilos.status, { color: coresStatus[statusExibido] }]}>
            {rotulosStatus[statusExibido]}
          </Text>

          {resultado ? (
            <>
              <Text style={estilos.rotulo}>RESULTADO</Text>
              <Text style={estilos.valor}>
                {resultado} ({souJogadorA ? partidaAtual.gamesA : partidaAtual.gamesB} x{" "}
                {souJogadorA ? partidaAtual.gamesB : partidaAtual.gamesA})
              </Text>
            </>
          ) : null}
        </View>

        {mostrarCheckIn ? (
          <View style={estilos.blocoCheckIn}>
            {meuCheckIn ? (
              <>
                <Text style={estilos.checkInConfirmado}>Presença confirmada</Text>
                <Text style={estilos.checkInInfo}>
                  {checkInAdversario ? "Seu adversário também confirmou." : "Aguardando seu adversário confirmar."}
                </Text>
              </>
            ) : convocada ? (
              <>
                <Text style={estilos.checkInTitulo}>Sua partida foi convocada</Text>
                <Text style={estilos.checkInInfo}>Confirme sua presença antes que o prazo acabe.</Text>
                <Pressable
                  style={estilos.botao}
                  onPress={() => router.push(`/check-in/${partidaAtual.partidaId}` as never)}
                >
                  <Text style={estilos.botaoTexto}>CONFIRMAR PRESENÇA</Text>
                </Pressable>
              </>
            ) : (
              <Text style={estilos.checkInInfo}>O prazo de check-in terminou. Fale com a loja.</Text>
            )}
          </View>
        ) : null}

        {historico.length > 0 ? (
          <>
            <Text style={[estilos.secao, estilos.secaoHistorico]}>Partidas anteriores</Text>
            {historico.map((partida) => (
              <CartaoHistorico key={partida.partidaId} partida={partida} nickname={nickname} />
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacamento.lg,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
  },
  secao: {
    color: cores.verdeEscuro,
    fontWeight: "800",
    fontSize: tamanhoFonte.sm,
    textAlign: "center",
    marginBottom: espacamento.xs,
  },
  secaoHistorico: {
    marginTop: espacamento.xl,
    marginBottom: espacamento.sm,
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
    marginHorizontal: espacamento.lg,
    paddingHorizontal: espacamento.lg,
    paddingBottom: espacamento.md,
    gap: espacamento.xs,
  },
  cardHistorico: {
    marginBottom: espacamento.md,
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
    fontSize: tamanhoFonte.md,
    fontWeight: "700",
  },
  blocoCheckIn: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    marginHorizontal: espacamento.lg,
    marginTop: espacamento.lg,
    padding: espacamento.md,
    gap: espacamento.sm,
    alignItems: "center",
  },
  checkInTitulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.md,
    fontWeight: "800",
  },
  checkInConfirmado: {
    color: cores.sucesso,
    fontSize: tamanhoFonte.md,
    fontWeight: "800",
  },
  checkInInfo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    textAlign: "center",
  },
  botao: {
    backgroundColor: cores.roxo,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.xl,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.md,
  },
});