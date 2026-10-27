import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Chaveamento as ChaveamentoTipo } from "../models/types";
import { cores, fundoModal, paleta, sobreNoite } from "../constants/colors";
import { cartao, espacamento, fontes, raio, sombras, tamanhoFonte, tipografia } from "../constants/theme";
import { ROTULOS_STATUS_PARTIDA, TOM_STATUS_PARTIDA } from "../utils/status";
import { Botao } from "./ui/Botao";
import { FundoNoite } from "./ui/Capa";
import { Selo } from "./ui/Selo";

interface ChaveamentoProps {
  partidas: ChaveamentoTipo[];
}

function nomeDoLado(partida: ChaveamentoTipo, lado: "A" | "B") {
  const nome = lado === "A" ? partida.jogadorA : partida.jogadorB;
  if (nome) return nome;
  return partida.status === "FINALIZADA" ? "Sem adversário" : "A definir";
}

function descreverResultado(partida: ChaveamentoTipo) {
  switch (partida.resultado) {
    case "VITORIA_A":
      return `Vitória de ${partida.jogadorA}`;
    case "VITORIA_B":
      return `Vitória de ${partida.jogadorB}`;
    case "WO_A":
      return `Vitória de ${partida.jogadorA} por W.O.`;
    case "WO_B":
      return `Vitória de ${partida.jogadorB} por W.O.`;
    case "EMPATE":
      return "Empate";
    case "DUPLO_NO_SHOW":
      return "Nenhum jogador compareceu";
    default:
      if (partida.vencedor) return `Vitória de ${partida.vencedor}`;
      return partida.status === "FINALIZADA" ? "Avanço sem adversário" : "Resultado ainda não registrado";
  }
}

function SeloPartida({ partida }: { partida: ChaveamentoTipo }) {
  return (
    <Selo
      texto={ROTULOS_STATUS_PARTIDA[partida.status]}
      tom={TOM_STATUS_PARTIDA[partida.status]}
      vivo={partida.status === "EM_ANDAMENTO"}
    />
  );
}

interface LinhaJogadorProps {
  nome: string;
  games: number;
  definido: boolean;
  venceu: boolean;
  perdeu: boolean;
  mostrarPlacar: boolean;
  campeao: boolean;
}

function LinhaJogador({ nome, games, definido, venceu, perdeu, mostrarPlacar, campeao }: LinhaJogadorProps) {
  return (
    <View style={[estilos.linhaJogador, venceu && estilos.linhaVencedora, perdeu && estilos.linhaPerdedora]}>
      <Text
        numberOfLines={1}
        style={[estilos.nomeJogador, venceu && estilos.nomeVencedor, !definido && estilos.nomeIndefinido]}
      >
        {nome}
      </Text>
      {campeao ? <Selo texto="Campeão" tom="ambar" icone="trophy" /> : null}
      {mostrarPlacar ? <Text style={[estilos.placar, venceu && estilos.placarVencedor]}>{games}</Text> : null}
    </View>
  );
}

interface CartaoPartidaProps {
  partida: ChaveamentoTipo;
  eFinal: boolean;
  temCampeao: boolean;
  aoPressionar: () => void;
}

function CartaoPartida({ partida, eFinal, temCampeao, aoPressionar }: CartaoPartidaProps) {
  const venceuA = !!partida.vencedor && partida.vencedor === partida.jogadorA;
  const venceuB = !!partida.vencedor && partida.vencedor === partida.jogadorB;
  const mostrarPlacar = partida.status === "FINALIZADA" || partida.status === "EM_ANDAMENTO";

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityHint="Abre os detalhes da partida"
      style={({ pressed }) => [
        estilos.partida,
        eFinal && estilos.partidaFinal,
        pressed && estilos.partidaPressionada,
      ]}
    >
      <View style={estilos.topoPartida}>
        <Text style={estilos.mesa}>MESA {partida.mesa}</Text>
        <SeloPartida partida={partida} />
      </View>
      <LinhaJogador
        nome={nomeDoLado(partida, "A")}
        games={partida.gamesA}
        definido={!!partida.jogadorA}
        venceu={venceuA}
        perdeu={venceuB}
        mostrarPlacar={mostrarPlacar}
        campeao={eFinal && temCampeao && venceuA}
      />
      <LinhaJogador
        nome={nomeDoLado(partida, "B")}
        games={partida.gamesB}
        definido={!!partida.jogadorB}
        venceu={venceuB}
        perdeu={venceuA}
        mostrarPlacar={mostrarPlacar}
        campeao={eFinal && temCampeao && venceuB}
      />
    </Pressable>
  );
}

export function Chaveamento({ partidas }: ChaveamentoProps) {
  const { height: alturaTela } = useWindowDimensions();
  const [selecionada, setSelecionada] = useState<ChaveamentoTipo | null>(null);
  const [rodadaEscolhida, setRodadaEscolhida] = useState<number | null>(null);

  const rodadas = useMemo(() => {
    const mapa = new Map<number, { nome: string; partidas: ChaveamentoTipo[] }>();
    partidas.forEach((partida) => {
      const existente = mapa.get(partida.rodada);
      if (existente) {
        existente.partidas.push(partida);
      } else {
        mapa.set(partida.rodada, { nome: partida.nomeRodada, partidas: [partida] });
      }
    });
    return Array.from(mapa.entries()).sort(([a], [b]) => a - b);
  }, [partidas]);

  const campeao = useMemo(() => {
    if (rodadas.length === 0) return null;
    const ultimaRodada = rodadas[rodadas.length - 1][1].partidas;
    const final = ultimaRodada.length === 1 ? ultimaRodada[0] : null;
    return final && final.status === "FINALIZADA" && final.vencedor ? final.vencedor : null;
  }, [rodadas]);

  const rodadaAtual = useMemo(() => {
    if (rodadas.length === 0) return null;
    const emAberto = rodadas.find(([, rodada]) => rodada.partidas.some((partida) => partida.status !== "FINALIZADA"));
    return emAberto ? emAberto[0] : rodadas[rodadas.length - 1][0];
  }, [rodadas]);

  if (rodadas.length === 0) {
    return <Text style={estilos.vazio}>O chaveamento ainda não foi gerado.</Text>;
  }

  const numeroAtivo = rodadaEscolhida ?? rodadaAtual;
  const indiceAtivo = Math.max(0, rodadas.findIndex(([numero]) => numero === numeroAtivo));
  const rodadaAtiva = rodadas[indiceAtivo][1];
  const eFinalAtiva = indiceAtivo === rodadas.length - 1;
  const finalizadasAtiva = rodadaAtiva.partidas.filter((partida) => partida.status === "FINALIZADA").length;
  const alturaMaxima = alturaTela * (campeao ? 0.45 : 0.62);

  return (
    <View>
      {campeao ? (
        <View style={estilos.campeao}>
          <FundoNoite />
          <View style={estilos.campeaoTrofeu}>
            <Ionicons name="trophy" size={28} color={paleta.ambar[700]} />
          </View>
          <Text style={estilos.campeaoRotulo}>CAMPEÃO DO TORNEIO</Text>
          <Text style={estilos.campeaoNome} numberOfLines={1}>
            {campeao}
          </Text>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.abasScroll}
        contentContainerStyle={estilos.abas}
      >
        {rodadas.map(([numero, rodada], indice) => {
          const ativa = indice === indiceAtivo;
          const eFinal = indice === rodadas.length - 1;
          const concluidas = rodada.partidas.filter((partida) => partida.status === "FINALIZADA").length;
          return (
            <Pressable
              key={numero}
              onPress={() => setRodadaEscolhida(numero)}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}
              style={[estilos.aba, ativa && estilos.abaAtiva]}
            >
              {eFinal ? (
                <Ionicons name="trophy-outline" size={14} color={ativa ? cores.textoInverso : paleta.ambar[700]} />
              ) : null}
              <Text style={[estilos.abaTitulo, ativa && estilos.abaTituloAtivo]}>{rodada.nome}</Text>
              <View style={[estilos.contador, ativa && estilos.contadorAtivo]}>
                <Text style={[estilos.contadorTexto, ativa && estilos.contadorTextoAtivo]}>
                  {concluidas}/{rodada.partidas.length}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={estilos.resumoRodada}>
        {finalizadasAtiva} de {rodadaAtiva.partidas.length} partidas finalizadas
      </Text>

      <ScrollView
        style={{ maxHeight: alturaMaxima }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.lista}
      >
        {rodadaAtiva.partidas.map((partida) => (
          <CartaoPartida
            key={partida.partidaId}
            partida={partida}
            eFinal={eFinalAtiva}
            temCampeao={!!campeao}
            aoPressionar={() => setSelecionada(partida)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={selecionada !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelecionada(null)}
      >
        <Pressable style={estilos.fundoModal} onPress={() => setSelecionada(null)}>
          {selecionada ? (
            <Pressable style={estilos.modal} onPress={() => {}}>
              <Text style={estilos.modalRodada}>{selecionada.nomeRodada}</Text>
              <Text style={estilos.modalMesa}>Mesa {selecionada.mesa}</Text>

              <View style={estilos.modalPlacar}>
                <View style={estilos.modalLado}>
                  <Text
                    numberOfLines={2}
                    style={[
                      estilos.modalNome,
                      !!selecionada.vencedor && selecionada.vencedor === selecionada.jogadorA && estilos.modalNomeVencedor,
                    ]}
                  >
                    {nomeDoLado(selecionada, "A")}
                  </Text>
                  <Text style={estilos.modalGames}>{selecionada.gamesA}</Text>
                </View>
                <Text style={estilos.modalVersus}>VS</Text>
                <View style={estilos.modalLado}>
                  <Text
                    numberOfLines={2}
                    style={[
                      estilos.modalNome,
                      !!selecionada.vencedor && selecionada.vencedor === selecionada.jogadorB && estilos.modalNomeVencedor,
                    ]}
                  >
                    {nomeDoLado(selecionada, "B")}
                  </Text>
                  <Text style={estilos.modalGames}>{selecionada.gamesB}</Text>
                </View>
              </View>

              <View style={estilos.modalInfo}>
                <View style={estilos.modalLinha}>
                  <Text style={estilos.modalRotulo}>Status</Text>
                  <SeloPartida partida={selecionada} />
                </View>
                <View style={estilos.modalLinha}>
                  <Text style={estilos.modalRotulo}>Resultado</Text>
                  <Text style={estilos.modalValor}>{descreverResultado(selecionada)}</Text>
                </View>
                {selecionada.vencedor ? (
                  <View style={estilos.modalLinha}>
                    <Text style={estilos.modalRotulo}>Vencedor</Text>
                    <Text style={estilos.modalValor}>{selecionada.vencedor}</Text>
                  </View>
                ) : null}
              </View>

              <Botao titulo="Fechar" variante="secundario" larguraTotal aoPressionar={() => setSelecionada(null)} />
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  vazio: {
    ...tipografia.pequeno,
    padding: espacamento.md,
  },
  campeao: {
    alignItems: "center",
    paddingVertical: espacamento.lg,
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.md,
    borderRadius: raio.cartao,
    overflow: "hidden",
    backgroundColor: paleta.roxo[950],
    ...sombras.md,
  },
  campeaoTrofeu: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espacamento.sm,
    backgroundColor: paleta.ambar[100],
    borderWidth: 3,
    borderColor: paleta.ambar[500],
  },
  campeaoRotulo: {
    ...tipografia.kicker,
  },
  campeaoNome: {
    marginTop: 4,
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.xxl,
    letterSpacing: 0.5,
    color: cores.textoInverso,
  },
  abasScroll: {
    flexGrow: 0,
  },
  abas: {
    gap: espacamento.sm,
    paddingVertical: espacamento.xs,
  },
  aba: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  abaAtiva: {
    backgroundColor: paleta.roxo[600],
    borderColor: paleta.roxo[600],
  },
  abaTitulo: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.sm,
    color: cores.texto2,
  },
  abaTituloAtivo: {
    color: cores.textoInverso,
  },
  // .contador do web
  contador: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: raio.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paleta.tinta[150],
  },
  contadorAtivo: {
    backgroundColor: sobreNoite.pilula,
  },
  contadorTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.xxs,
    fontVariant: ["tabular-nums"],
    color: paleta.tinta[700],
  },
  contadorTextoAtivo: {
    color: cores.textoInverso,
  },
  resumoRodada: {
    ...tipografia.legenda,
    marginTop: espacamento.ms,
    marginBottom: espacamento.sm,
  },
  lista: {
    paddingBottom: espacamento.lg,
  },
  partida: {
    ...cartao,
    borderRadius: raio.md,
    padding: espacamento.ms,
    marginBottom: espacamento.ms,
  },
  partidaFinal: {
    borderColor: paleta.ambar[500],
    borderWidth: 1.5,
  },
  partidaPressionada: {
    borderColor: paleta.roxo[200],
    backgroundColor: paleta.roxo[50],
  },
  topoPartida: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mesa: {
    ...tipografia.sobretitulo,
  },
  linhaJogador: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    minHeight: 40,
    paddingHorizontal: espacamento.ms,
    marginBottom: 4,
    borderRadius: raio.sm,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    backgroundColor: paleta.tinta[50],
  },
  linhaVencedora: {
    backgroundColor: paleta.verde[50],
    borderLeftColor: paleta.verde[500],
  },
  linhaPerdedora: {
    opacity: 0.55,
  },
  nomeJogador: {
    flex: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
  nomeVencedor: {
    fontFamily: fontes.extrabold,
  },
  nomeIndefinido: {
    fontFamily: fontes.medio,
    fontStyle: "italic",
    color: cores.texto3,
  },
  placar: {
    minWidth: 18,
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.lg,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
    color: cores.texto,
  },
  placarVencedor: {
    fontFamily: fontes.extrabold,
    color: paleta.verde[700],
  },
  fundoModal: {
    flex: 1,
    backgroundColor: fundoModal,
    justifyContent: "center",
    padding: espacamento.lg,
  },
  // dialog.modal do web
  modal: {
    backgroundColor: cores.superficie,
    borderRadius: raio.xl,
    padding: espacamento.lg,
    ...sombras.lg,
  },
  modalRodada: {
    ...tipografia.sobretitulo,
    color: paleta.roxo[600],
  },
  modalMesa: {
    ...tipografia.titulo,
    marginTop: 2,
    marginBottom: espacamento.md,
  },
  modalPlacar: {
    flexDirection: "row",
    alignItems: "center",
    padding: espacamento.md,
    marginBottom: espacamento.md,
    borderRadius: raio.md,
    backgroundColor: paleta.tinta[50],
    borderWidth: 1,
    borderColor: cores.divisor,
  },
  modalLado: {
    flex: 1,
    alignItems: "center",
  },
  modalNome: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.sm,
    textAlign: "center",
    color: cores.texto,
  },
  modalNomeVencedor: {
    fontFamily: fontes.extrabold,
    color: paleta.verde[700],
  },
  modalGames: {
    marginTop: espacamento.xs,
    fontFamily: fontes.extrabold,
    fontSize: 34,
    lineHeight: 40,
    fontVariant: ["tabular-nums"],
    color: cores.texto,
  },
  modalVersus: {
    marginHorizontal: espacamento.sm,
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.md,
    color: cores.texto3,
  },
  modalInfo: {
    gap: espacamento.ms,
    marginBottom: espacamento.lg,
  },
  modalLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalRotulo: {
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.md,
    color: cores.texto3,
  },
  modalValor: {
    flexShrink: 1,
    marginLeft: espacamento.md,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.md,
    textAlign: "right",
    color: cores.texto,
  },
});
