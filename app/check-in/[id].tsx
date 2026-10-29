import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../src/services/api";
import { useAuth } from "../../src/context/authContext";
import { AvatarPerfil } from "../../src/components/AvatarPerfil";
import { Botao } from "../../src/components/ui/Botao";
import { Faixa } from "../../src/components/ui/Faixa";
import { Selo } from "../../src/components/ui/Selo";
import { cores, paleta } from "../../src/constants/colors";
import { espacamento, fontes, raio, sombras, tamanhoFonte } from "../../src/constants/theme";
import { StatusPartida } from "../../src/models/types";

const INTERVALO_ATUALIZACAO = 3000;

interface JogadorPartida {
  jogador: { contaId: number; nickname: string };
}

interface PartidaCheckIn {
  id: number;
  mesa: number;
  status: StatusPartida;
  resultado?: string | null;
  checkInExpiraEm?: string | null;
  checkInAEm?: string | null;
  checkInBEm?: string | null;
  inscricaoA?: JogadorPartida | null;
  inscricaoB?: JogadorPartida | null;
  vencedor?: JogadorPartida | null;
  rodada?: { nome: string; torneio: { id: number } };
}

// A API manda datas sem fuso e com microssegundos ("2026-10-28T15:20:12.123456"): corta para milissegundos
function instante(valor?: string | null): number {
  if (!valor) return 0;
  const tempo = new Date(valor.replace(/(\.\d{3})\d+/, "$1")).getTime();
  return Number.isNaN(tempo) ? 0 : tempo;
}

function formatarTempo(seg: number): string {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Fase =
  | "convocada" // chamado: botão gigante para confirmar
  | "aguardando" // eu confirmei, falta o adversário
  | "iniciada" // os dois confirmaram: a partida começou sozinha
  | "expirado" // o prazo acabou e o servidor ainda está encerrando a partida
  | "venceuWo"
  | "perdeuWo"
  | "semVencedor" // ninguém confirmou: a chave desta mesa se perde
  | "encerrada"
  | "naoConvocada";

export default function CheckIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();

  const [partida, setPartida] = useState<PartidaCheckIn | null>(null);
  const [agora, setAgora] = useState(Date.now());
  const [fazendoCheckIn, setFazendoCheckIn] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const avisouConvocacao = useRef(false);

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      api
        .get<PartidaCheckIn>(`/partidas/${id}`)
        .then(({ data }) => {
          if (ativo) setPartida(data);
        })
        .catch(() => undefined); // erro de rede no polling: tenta de novo no próximo ciclo
    carregar();
    const intervalo = setInterval(carregar, INTERVALO_ATUALIZACAO);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [id]);

  // Relógio da contagem regressiva
  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  async function fazerCheckIn() {
    setErro(null);
    setFazendoCheckIn(true);
    try {
      const { data } = await api.post<PartidaCheckIn>(`/partidas/${id}/check-in`);
      setPartida(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    } catch (e: any) {
      setErro(e?.response?.data?.detail ?? "Não foi possível confirmar sua presença. Tente de novo.");
    } finally {
      setFazendoCheckIn(false);
    }
  }

  function fechar() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)" as never);
  }

  const souA = partida?.inscricaoA?.jogador.contaId === usuario?.id;
  const adversario = partida ? (souA ? partida.inscricaoB : partida.inscricaoA)?.jogador.nickname : undefined;
  const meuCheckIn = souA ? partida?.checkInAEm : partida?.checkInBEm;
  const checkInAdversario = souA ? partida?.checkInBEm : partida?.checkInAEm;
  const segundos = Math.max(0, Math.ceil((instante(partida?.checkInExpiraEm) - agora) / 1000));

  let fase: Fase = "naoConvocada";
  if (partida) {
    if (partida.status === "FINALIZADA") {
      if (partida.resultado === "DUPLO_NO_SHOW") fase = "semVencedor";
      else if (partida.resultado === "WO_A" || partida.resultado === "WO_B") {
        fase = partida.vencedor?.jogador.contaId === usuario?.id ? "venceuWo" : "perdeuWo";
      } else fase = "encerrada";
    } else if (partida.status === "EM_ANDAMENTO") fase = "iniciada";
    else if (!partida.checkInExpiraEm) fase = "naoConvocada";
    else if (segundos === 0) fase = "expirado";
    else if (meuCheckIn) fase = "aguardando";
    else fase = "convocada";
  }

  // Vibra uma vez quando o jogador cai na tela de convocação
  useEffect(() => {
    if (fase === "convocada" && !avisouConvocacao.current) {
      avisouConvocacao.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    }
  }, [fase]);

  const verde = fase === "convocada" || fase === "aguardando" || fase === "iniciada" || fase === "venceuWo";
  const vermelho = fase === "perdeuWo" || fase === "semVencedor";
  const fundo = verde ? paleta.verde[400] : vermelho ? paleta.vermelho[700] : cores.noite;
  const corTexto = verde ? paleta.verde[950] : paleta.branco;
  const subtitulo = partida ? `Mesa ${partida.mesa}${partida.rodada ? ` · ${partida.rodada.nome}` : ""}` : "";
  const torneioId = partida?.rodada?.torneio.id;

  return (
    <View style={[estilos.tela, { backgroundColor: fundo, paddingTop: insets.top + espacamento.sm, paddingBottom: insets.bottom + espacamento.md }]}>
      <Pressable
        onPress={fechar}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        hitSlop={12}
        style={estilos.fechar}
      >
        <Ionicons name="close" size={28} color={corTexto} />
      </Pressable>

      {!partida ? (
        <View style={estilos.centro}>
          <ActivityIndicator color={paleta.branco} size="large" />
        </View>
      ) : fase === "convocada" ? (
        <>
          <View style={estilos.topo}>
            <Text style={[estilos.kicker, { color: corTexto }]}>{subtitulo.toUpperCase()}</Text>
            <Text style={[estilos.titulo, { color: corTexto }]}>Você foi chamado!</Text>
            <Text style={[estilos.versus, { color: corTexto }]}>contra @{adversario ?? "seu adversário"}</Text>
            <Text
              style={[estilos.tempo, { color: corTexto }]}
              accessibilityLabel={`Faltam ${formatarTempo(segundos)} para confirmar`}
            >
              {formatarTempo(segundos)}
            </Text>
            <Text style={[estilos.tempoRotulo, { color: corTexto }]}>para confirmar presença</Text>
          </View>

          <Pressable
            onPress={fazerCheckIn}
            disabled={fazendoCheckIn}
            accessibilityRole="button"
            accessibilityLabel="Confirmar presença"
            accessibilityState={{ busy: fazendoCheckIn }}
            style={({ pressed }) => [
              estilos.botaoGigante,
              pressed && estilos.botaoGiganteApertado,
            ]}
          >
            {fazendoCheckIn ? (
              <ActivityIndicator color={paleta.verde[300]} size="large" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={120} color={paleta.verde[300]} />
                <Text style={estilos.botaoTexto}>Confirmar{"\n"}presença</Text>
              </>
            )}
          </Pressable>

          {erro ? <Faixa tom="vermelho" texto={erro} /> : null}
          <Text style={[estilos.rodape, { color: corTexto }]}>
            A partida só começa quando você e seu adversário confirmarem. Quem não confirmar a tempo perde por W.O.
          </Text>
        </>
      ) : (
        <View style={estilos.centro}>
          <View style={estilos.cartaoEstado}>
            <Ionicons
              name={
                fase === "aguardando" || fase === "iniciada" || fase === "venceuWo"
                  ? "checkmark-circle"
                  : fase === "expirado"
                    ? "hourglass-outline"
                    : fase === "naoConvocada" || fase === "encerrada"
                      ? "information-circle-outline"
                      : "close-circle"
              }
              size={104}
              color={verde ? paleta.verde[950] : paleta.branco}
            />
            <Text style={[estilos.tituloEstado, { color: corTexto }]}>
              {fase === "aguardando" && "Presença confirmada!"}
              {fase === "iniciada" && "Partida iniciada!"}
              {fase === "expirado" && "Tempo esgotado"}
              {fase === "venceuWo" && "Você venceu por W.O."}
              {fase === "perdeuWo" && "Você perdeu por W.O."}
              {fase === "semVencedor" && "Ninguém confirmou"}
              {fase === "encerrada" && "Partida encerrada"}
              {fase === "naoConvocada" && "Ainda não foi chamado"}
            </Text>
            <Text style={[estilos.textoEstado, { color: corTexto }]}>
              {fase === "aguardando" &&
                `Aguardando @${adversario ?? "seu adversário"} confirmar. Se ele não confirmar em ${formatarTempo(segundos)}, você vence por W.O.`}
              {fase === "iniciada" && `Vá para a mesa ${partida.mesa}. Boa sorte contra @${adversario ?? "seu adversário"}!`}
              {fase === "expirado" && "O prazo para confirmar acabou. Estamos encerrando a partida…"}
              {fase === "venceuWo" && `@${adversario ?? "Seu adversário"} não compareceu. Você avança na chave.`}
              {fase === "perdeuWo" && "Você não confirmou presença a tempo. Seu adversário avança na chave."}
              {fase === "semVencedor" && "Nenhum dos dois confirmou presença: ninguém avança desta mesa e a chave dela se perde."}
              {fase === "encerrada" && "O resultado desta partida já foi registrado pela loja."}
              {fase === "naoConvocada" && "Quando a loja chamar você para a mesa, esta tela vira o botão de confirmar presença."}
            </Text>

            {fase === "aguardando" || fase === "iniciada" ? (
              <View style={estilos.jogadores}>
                <JogadorCheck nickname={usuario?.nickname ?? "Você"} confirmado={!!meuCheckIn} />
                <JogadorCheck nickname={adversario ?? "Adversário"} confirmado={!!checkInAdversario} />
              </View>
            ) : null}
          </View>

          {fase === "iniciada" && torneioId !== undefined ? (
            <Botao
              titulo="Ver minha partida"
              variante="primario"
              tamanho="lg"
              larguraTotal
              aoPressionar={() => router.replace(`/torneio/${torneioId}/confronto` as never)}
            />
          ) : fase !== "aguardando" && fase !== "expirado" ? (
            <Botao titulo="Voltar" variante="secundario" tamanho="lg" larguraTotal aoPressionar={fechar} />
          ) : null}
        </View>
      )}
    </View>
  );
}

function JogadorCheck({ nickname, confirmado }: { nickname: string; confirmado: boolean }) {
  return (
    <View style={estilos.jogador}>
      <AvatarPerfil nome={nickname} tamanho={44} />
      <Text style={estilos.jogadorNome} numberOfLines={1}>
        {nickname}
      </Text>
      {confirmado ? <Selo texto="Confirmou" tom="verde" icone="checkmark" /> : <Selo texto="Aguardando" tom="neutro" />}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    paddingHorizontal: espacamento.md,
    gap: espacamento.md,
  },
  fechar: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    gap: espacamento.lg,
  },
  topo: {
    alignItems: "center",
    gap: 4,
  },
  kicker: {
    fontFamily: fontes.extrabold,
    fontSize: tamanhoFonte.sm,
    letterSpacing: 1.2,
    opacity: 0.8,
  },
  titulo: {
    fontFamily: fontes.marca,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0.6,
    textAlign: "center",
    textTransform: "uppercase",
  },
  versus: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.lg,
  },
  tempo: {
    marginTop: espacamento.sm,
    fontFamily: fontes.extrabold,
    fontSize: 64,
    lineHeight: 72,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
  },
  tempoRotulo: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.md,
    opacity: 0.8,
  },
  // Ocupa o resto da tela: é o único alvo de toque
  botaoGigante: {
    flex: 1,
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    gap: espacamento.sm,
    borderRadius: 36,
    backgroundColor: paleta.verde[950],
    ...sombras.md,
  },
  botaoGiganteApertado: {
    backgroundColor: paleta.verde[900],
    transform: [{ scale: 0.985 }],
  },
  botaoTexto: {
    fontFamily: fontes.marca,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    color: paleta.branco,
  },
  rodape: {
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.sm,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.85,
  },
  cartaoEstado: {
    alignItems: "center",
    gap: espacamento.ms,
    paddingVertical: espacamento.lg,
    paddingHorizontal: espacamento.md,
    borderRadius: raio.cartao,
  },
  tituloEstado: {
    fontFamily: fontes.marca,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.6,
    textAlign: "center",
    textTransform: "uppercase",
  },
  textoEstado: {
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.base,
    lineHeight: 22,
    textAlign: "center",
  },
  jogadores: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    gap: espacamento.lg,
    marginTop: espacamento.sm,
    padding: espacamento.md,
    borderRadius: raio.cartao,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  jogador: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  jogadorNome: {
    maxWidth: "100%",
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.base,
    color: paleta.verde[950],
  },
});
