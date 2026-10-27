import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../src/services/api";
import { AvatarPerfil } from "../../src/components/AvatarPerfil";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";
import { Botao } from "../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../src/components/ui/CabecalhoPagina";
import { FundoNoite } from "../../src/components/ui/Capa";
import { Faixa } from "../../src/components/ui/Faixa";
import { Selo } from "../../src/components/ui/Selo";
import { cores, paleta } from "../../src/constants/colors";
import { cartao, espacamento, fontes, raio, sombras, tamanhoFonte } from "../../src/constants/theme";

interface PartidaCheckIn {
  id: number;
  mesa: number;
  checkInExpiraEm?: string | null;
  checkInAEm?: string | null;
  checkInBEm?: string | null;
  inscricaoA?: { jogador: { conta: { id: number }; nickname: string } } | null;
  inscricaoB?: { jogador: { conta: { id: number }; nickname: string } } | null;
}

function segundosRestantes(expiraEm?: string | null): number {
  if (!expiraEm) return 0;
  return Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000));
}

function formatarTempo(seg: number): string {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Jogador({ nickname, confirmado }: { nickname: string; confirmado: boolean }) {
  return (
    <View style={estilos.jogador}>
      <AvatarPerfil nome={nickname} tamanho={52} />
      <Text style={estilos.jogadorNome} numberOfLines={1}>
        {nickname}
      </Text>
      {confirmado ? (
        <Selo texto="Check-in feito" tom="verde" icone="checkmark" />
      ) : (
        <Selo texto="Aguardando" tom="neutro" />
      )}
    </View>
  );
}

export default function CheckIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [partida, setPartida] = useState<PartidaCheckIn | null>(null);
  const [segundos, setSegundos] = useState(0);
  const [fazendoCheckIn, setFazendoCheckIn] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.get<PartidaCheckIn>(`/partidas/${id}`).then(({ data }) => {
      setPartida(data);
      setSegundos(segundosRestantes(data.checkInExpiraEm));
    });
  }, [id]);

  // Polling a cada 5s para atualizar o estado (ambos check-ins)
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const { data } = await api.get<PartidaCheckIn>(`/partidas/${id}`);
        setPartida(data);
        setSegundos(segundosRestantes(data.checkInExpiraEm));
      } catch {
        // ignora erros de rede no polling
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [id]);

  // Conta regressiva
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSegundos((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function fazerCheckIn() {
    setErro(null);
    setFazendoCheckIn(true);
    try {
      const { data } = await api.post<PartidaCheckIn>(`/partidas/${id}/check-in`);
      setPartida(data);
      setSucesso(true);
    } catch (e: any) {
      setErro(e?.response?.data?.detail ?? "Não foi possível fazer check-in.");
    } finally {
      setFazendoCheckIn(false);
    }
  }

  const expirou = segundos === 0 && !!partida?.checkInExpiraEm;

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoPagina titulo="Check-in" subtitulo={partida ? `Mesa ${partida.mesa}` : "Confirme que você está na mesa"} />

        {!partida ? (
          <ActivityIndicator color={cores.primaria} size="large" />
        ) : (
          <>
            {/* Cronômetro */}
            {expirou ? (
              <View style={[estilos.timer, estilos.timerExpirado]}>
                <Text style={estilos.timerExpiradoTexto}>PRAZO EXPIRADO</Text>
              </View>
            ) : (
              <View style={estilos.timer} accessibilityLabel={`Faltam ${formatarTempo(segundos)} para fazer check-in`}>
                <FundoNoite />
                <Text style={estilos.timerTexto}>{formatarTempo(segundos)}</Text>
                <Text style={estilos.timerLabel}>para fazer check-in</Text>
              </View>
            )}

            {/* Status dos dois jogadores */}
            <View style={estilos.jogadores}>
              <Jogador nickname={partida.inscricaoA?.jogador.nickname ?? "Jogador A"} confirmado={!!partida.checkInAEm} />
              <Text style={estilos.vs}>VS</Text>
              <Jogador nickname={partida.inscricaoB?.jogador.nickname ?? "Jogador B"} confirmado={!!partida.checkInBEm} />
            </View>

            <View style={estilos.acoes}>
              {erro ? <Faixa tom="vermelho" texto={erro} /> : null}

              {sucesso ? (
                <Faixa tom="verde" titulo="Presença confirmada!" texto="Aguarde a loja iniciar a partida." />
              ) : expirou ? (
                <Faixa tom="ambar" texto="O prazo de check-in expirou. Entre em contato com a loja." />
              ) : (
                <Botao
                  titulo="Confirmar presença"
                  variante="acento"
                  tamanho="lg"
                  icone="checkmark-circle-outline"
                  larguraTotal
                  carregando={fazendoCheckIn}
                  aoPressionar={fazerCheckIn}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  conteudo: {
    paddingHorizontal: espacamento.md,
    paddingBottom: espacamento.xl,
  },
  timer: {
    alignItems: "center",
    paddingVertical: espacamento.lg,
    borderRadius: raio.cartao,
    overflow: "hidden",
    backgroundColor: paleta.roxo[950],
    ...sombras.md,
  },
  timerTexto: {
    fontFamily: fontes.extrabold,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    color: cores.textoInverso,
  },
  timerLabel: {
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.md,
    color: paleta.tinta[300],
  },
  timerExpirado: {
    backgroundColor: paleta.vermelho[100],
    shadowOpacity: 0,
    elevation: 0,
  },
  timerExpiradoTexto: {
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.xl,
    letterSpacing: 1,
    color: paleta.vermelho[700],
  },
  jogadores: {
    ...cartao,
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    marginTop: espacamento.md,
    padding: espacamento.md,
    borderRadius: raio.cartao,
  },
  jogador: { flex: 1, alignItems: "center", gap: 8 },
  jogadorNome: {
    maxWidth: "100%",
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.base,
    textAlign: "center",
    color: cores.texto,
  },
  vs: {
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.lg,
    color: paleta.roxo[300],
  },
  acoes: {
    gap: espacamento.ms,
    marginTop: espacamento.lg,
  },
});
