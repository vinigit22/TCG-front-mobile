import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../src/services/api";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../../src/constants/theme";

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

export default function CheckIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Check-in da Partida</Text>

        {!partida ? (
          <ActivityIndicator color={cores.roxo} size="large" />
        ) : (
          <>
            <Text style={estilos.mesa}>Mesa {partida.mesa}</Text>

            {/* Cronômetro */}
            <View style={[estilos.timer, expirou && estilos.timerExpirado]}>
              <Text style={[estilos.timerTexto, expirou && estilos.timerTextoExpirado]}>
                {expirou ? "Prazo expirado" : formatarTempo(segundos)}
              </Text>
              {!expirou && (
                <Text style={estilos.timerLabel}>para fazer check-in</Text>
              )}
            </View>

            {/* Status dos dois jogadores */}
            <View style={estilos.jogadores}>
              <View style={estilos.jogadorItem}>
                <Text style={estilos.jogadorNome}>
                  {partida.inscricaoA?.jogador.nickname ?? "Jogador A"}
                </Text>
                <Text style={[estilos.checkStatus, partida.checkInAEm ? estilos.ok : estilos.pendente]}>
                  {partida.checkInAEm ? "✓ Check-in feito" : "Aguardando"}
                </Text>
              </View>
              <Text style={estilos.vs}>VS</Text>
              <View style={estilos.jogadorItem}>
                <Text style={estilos.jogadorNome}>
                  {partida.inscricaoB?.jogador.nickname ?? "Jogador B"}
                </Text>
                <Text style={[estilos.checkStatus, partida.checkInBEm ? estilos.ok : estilos.pendente]}>
                  {partida.checkInBEm ? "✓ Check-in feito" : "Aguardando"}
                </Text>
              </View>
            </View>

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            {sucesso ? (
              <View style={estilos.sucessoBox}>
                <Text style={estilos.sucessoTexto}>✓ Presença confirmada! Aguarde a loja iniciar a partida.</Text>
              </View>
            ) : expirou ? (
              <Text style={estilos.aviso}>O prazo de check-in expirou. Entre em contato com a loja.</Text>
            ) : (
              <Pressable style={estilos.botao} onPress={fazerCheckIn} disabled={fazendoCheckIn}>
                {fazendoCheckIn ? (
                  <ActivityIndicator color={cores.textoClaro} />
                ) : (
                  <Text style={estilos.botaoTexto}>CONFIRMAR PRESENÇA</Text>
                )}
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacamento.xl,
    gap: espacamento.lg,
  },
  titulo: { color: cores.textoEscuro, fontSize: tamanhoFonte.xl, fontWeight: "900" },
  mesa: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, fontWeight: "600" },
  timer: {
    alignItems: "center",
    backgroundColor: cores.roxo,
    borderRadius: raio.lg,
    paddingVertical: espacamento.lg,
    paddingHorizontal: espacamento.xl * 2,
  },
  timerExpirado: { backgroundColor: cores.erro },
  timerTexto: { color: cores.textoClaro, fontSize: 48, fontWeight: "900" },
  timerTextoExpirado: { fontSize: tamanhoFonte.lg },
  timerLabel: { color: cores.textoClaro, fontSize: tamanhoFonte.sm, opacity: 0.8 },
  jogadores: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.md,
    width: "100%",
  },
  jogadorItem: { flex: 1, alignItems: "center", gap: 4 },
  jogadorNome: { color: cores.textoEscuro, fontWeight: "700", fontSize: tamanhoFonte.md, textAlign: "center" },
  checkStatus: { fontSize: tamanhoFonte.sm, fontWeight: "600" },
  ok: { color: cores.sucesso },
  pendente: { color: cores.textoSecundario },
  vs: { color: cores.textoSecundario, fontWeight: "900", fontSize: tamanhoFonte.lg },
  erro: { color: cores.erro, fontSize: tamanhoFonte.sm, textAlign: "center" },
  aviso: { color: cores.alerta, fontSize: tamanhoFonte.sm, textAlign: "center" },
  sucessoBox: {
    backgroundColor: cores.sucesso + "22",
    borderRadius: raio.md,
    padding: espacamento.md,
  },
  sucessoTexto: { color: cores.sucesso, fontWeight: "700", textAlign: "center" },
  botao: {
    backgroundColor: cores.roxo,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.xl,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: { color: cores.textoClaro, fontWeight: "800", fontSize: tamanhoFonte.md },
});
