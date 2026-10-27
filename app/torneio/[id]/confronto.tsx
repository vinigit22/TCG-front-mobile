import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/authContext";
import { useChaveamento } from "../../../src/hooks/useChaveamento";
import { usePartida } from "../../../src/hooks/usePartida";
import { Chaveamento, StatusPartida } from "../../../src/models/types";
import { cores, paleta, Tom } from "../../../src/constants/colors";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";
import { Botao } from "../../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../../src/components/ui/CabecalhoPagina";
import { EstadoVazio } from "../../../src/components/ui/EstadoVazio";
import { Faixa } from "../../../src/components/ui/Faixa";
import { Selo } from "../../../src/components/ui/Selo";
import { TOM_STATUS_PARTIDA } from "../../../src/utils/status";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../../../src/constants/theme";

const INTERVALO_ATUALIZACAO = 10000;

// Do ponto de vista do jogador (o painel da loja usa os rótulos de core/rotulos.ts)
const rotulosStatus: Record<StatusPartida, string> = {
  AGUARDANDO: "Aguardando partida",
  PRONTA: "Novo confronto disponível",
  EM_ANDAMENTO: "Partida em andamento",
  FINALIZADA: "Partida finalizada",
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

function Detalhe({ rotulo, children, largo }: { rotulo: string; children: React.ReactNode; largo?: boolean }) {
  return (
    <View style={[estilos.detalhe, largo && estilos.detalheLargo]}>
      <Text style={tipografia.sobretitulo}>{rotulo}</Text>
      {children}
    </View>
  );
}

interface CartaoHistoricoProps {
  partida: Chaveamento;
  nickname?: string;
}

function CartaoHistorico({ partida, nickname }: CartaoHistoricoProps) {
  const souJogadorA = partida.jogadorA === nickname;
  const adversario = souJogadorA ? partida.jogadorB : partida.jogadorA;
  const resumo = resumirResultado(partida, nickname);
  const tom: Tom = resumo ? (resumo.venceu ? "verde" : "vermelho") : TOM_STATUS_PARTIDA[partida.status];

  return (
    <View style={estilos.historico}>
      <View style={estilos.historicoTextos}>
        <Text style={estilos.historicoRodada}>
          {partida.nomeRodada} · Mesa {partida.mesa}
        </Text>
        <Text style={estilos.historicoAdversario} numberOfLines={1}>
          vs {adversario ?? (partida.status === "FINALIZADA" ? "sem adversário (bye)" : "a definir")}
        </Text>
      </View>
      <Selo texto={resumo ? resumo.texto : rotulosStatus[partida.status]} tom={tom} ponto={false} />
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
            <ActivityIndicator color={cores.primaria} size="large" />
          ) : (
            <EstadoVazio
              icone="game-controller-outline"
              titulo="Você ainda não tem partidas"
              texto="Quando a loja gerar a chave, sua partida aparece aqui."
            />
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
        contentContainerStyle={[estilos.conteudo, { paddingBottom: insets.bottom + espacamento.lg }]}
      >
        <CabecalhoPagina titulo={tituloAtual} subtitulo={partidaAtual.nomeRodada} />

        <View style={estilos.card}>
          <View style={estilos.versus}>
            <Text style={estilos.versusRotulo}>SEU ADVERSÁRIO</Text>
            <Text style={estilos.versusNome} numberOfLines={2}>
              {textoAdversario}
            </Text>
          </View>
          <View style={estilos.grade}>
            <Detalhe rotulo="Mesa">
              <Text style={estilos.valor}>{partidaAtual.mesa}</Text>
            </Detalhe>
            <Detalhe rotulo="Status" largo>
              <Selo
                texto={rotulosStatus[statusExibido]}
                tom={TOM_STATUS_PARTIDA[statusExibido]}
                vivo={statusExibido === "EM_ANDAMENTO"}
              />
            </Detalhe>
          </View>
          {resultado ? (
            <View style={estilos.resultado}>
              <Text style={tipografia.sobretitulo}>Resultado</Text>
              <Text style={[estilos.valor, { color: resultado === "Vitória" ? paleta.verde[700] : paleta.vermelho[700] }]}>
                {resultado} ({souJogadorA ? partidaAtual.gamesA : partidaAtual.gamesB} x{" "}
                {souJogadorA ? partidaAtual.gamesB : partidaAtual.gamesA})
              </Text>
            </View>
          ) : null}
        </View>

        {mostrarCheckIn ? (
          <View style={estilos.blocoCheckIn}>
            {meuCheckIn ? (
              <Faixa
                tom="verde"
                titulo="Presença confirmada."
                texto={checkInAdversario ? "Seu adversário também confirmou." : "Aguardando seu adversário confirmar."}
              />
            ) : convocada ? (
              <>
                <Faixa tom="ambar" titulo="Sua partida foi convocada." texto="Confirme sua presença antes que o prazo acabe." />
                <Botao
                  titulo="Confirmar presença"
                  variante="acento"
                  tamanho="lg"
                  icone="checkmark-circle-outline"
                  larguraTotal
                  aoPressionar={() => router.push(`/check-in/${partidaAtual.partidaId}` as never)}
                />
              </>
            ) : (
              <Faixa tom="vermelho" texto="O prazo de check-in terminou. Fale com a loja." />
            )}
          </View>
        ) : null}

        {historico.length > 0 ? (
          <>
            <Text accessibilityRole="header" style={estilos.secao}>
              Partidas anteriores
            </Text>
            <View style={estilos.listaHistorico}>
              {historico.map((partida, indice) => (
                <View key={partida.partidaId} style={indice > 0 ? estilos.divisor : undefined}>
                  <CartaoHistorico partida={partida} nickname={nickname} />
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.pagina,
  },
  conteudo: {
    paddingHorizontal: espacamento.md,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacamento.lg,
  },
  card: {
    ...cartao,
    borderRadius: raio.cartao,
    overflow: "hidden",
  },
  versus: {
    padding: espacamento.md,
    backgroundColor: paleta.roxo[50],
    borderBottomWidth: 1,
    borderBottomColor: paleta.roxo[100],
  },
  versusRotulo: {
    ...tipografia.sobretitulo,
    color: paleta.roxo[600],
  },
  versusNome: {
    marginTop: 4,
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.xl,
    lineHeight: 26,
    letterSpacing: 0.3,
    color: paleta.roxo[950],
  },
  grade: {
    flexDirection: "row",
    gap: espacamento.md,
    padding: espacamento.md,
  },
  detalhe: {
    minWidth: 72,
    gap: 6,
  },
  detalheLargo: {
    flex: 1,
  },
  valor: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.lg,
    color: cores.texto,
  },
  resultado: {
    gap: 4,
    marginHorizontal: espacamento.md,
    paddingVertical: espacamento.md,
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  blocoCheckIn: {
    gap: espacamento.ms,
    marginTop: espacamento.md,
  },
  secao: {
    ...tipografia.tituloSecao,
    marginTop: espacamento.xl,
    marginBottom: espacamento.ms,
  },
  listaHistorico: {
    ...cartao,
    overflow: "hidden",
  },
  divisor: {
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  historico: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.ms,
    paddingVertical: 12,
    paddingHorizontal: espacamento.md,
  },
  historicoTextos: {
    flex: 1,
    minWidth: 0,
  },
  historicoRodada: {
    ...tipografia.legenda,
  },
  historicoAdversario: {
    marginTop: 2,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
});
