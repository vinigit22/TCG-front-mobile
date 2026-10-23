import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Chaveamento as ChaveamentoTipo } from "../models/types";
import { cores } from "../constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../constants/theme";

interface ChaveamentoProps {
  partidas: ChaveamentoTipo[];
}

const coresPorStatus: Record<ChaveamentoTipo["status"], string> = {
  AGUARDANDO: cores.textoSecundario,
  PRONTA: cores.magenta,
  EM_ANDAMENTO: cores.alerta,
  FINALIZADA: cores.sucesso,
};

const rotulosPorStatus: Record<ChaveamentoTipo["status"], string> = {
  AGUARDANDO: "Aguardando",
  PRONTA: "Pronta",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
};

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
      {campeao ? (
        <View style={estilos.selo}>
          <Text style={estilos.textoSelo}>Campeão</Text>
        </View>
      ) : null}
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
  const cor = coresPorStatus[partida.status];

  return (
    <Pressable
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.partida,
        eFinal && estilos.partidaFinal,
        eFinal && temCampeao && estilos.partidaCampea,
        pressed && estilos.partidaPressionada,
      ]}
    >
      <View style={estilos.topoPartida}>
        <Text style={estilos.mesa}>Mesa {partida.mesa}</Text>
        <View style={estilos.statusLinha}>
          <View style={[estilos.ponto, { backgroundColor: cor }]} />
          <Text style={[estilos.statusTexto, { color: cor }]}>{rotulosPorStatus[partida.status]}</Text>
        </View>
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
      <Text style={estilos.dica}>Toque para ver os detalhes</Text>
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
          <View style={estilos.campeaoAvatar}>
            <Text style={estilos.campeaoInicial}>{campeao.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={estilos.campeaoRotulo}>Campeão do torneio</Text>
          <Text style={estilos.campeaoNome}>{campeao}</Text>
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
              style={[estilos.aba, ativa && (eFinal ? estilos.abaFinalAtiva : estilos.abaAtiva)]}
            >
              <Text style={[estilos.abaTitulo, ativa && estilos.abaTituloAtivo]}>{rodada.nome}</Text>
              <Text style={[estilos.abaContagem, ativa && estilos.abaContagemAtiva]}>
                {concluidas}/{rodada.partidas.length}
              </Text>
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
                <Text style={estilos.modalVersus}>x</Text>
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
                  <Text style={[estilos.modalValor, { color: coresPorStatus[selecionada.status] }]}>
                    {rotulosPorStatus[selecionada.status]}
                  </Text>
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

              <Pressable style={estilos.modalBotao} onPress={() => setSelecionada(null)}>
                <Text style={estilos.modalBotaoTexto}>Fechar</Text>
              </Pressable>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  vazio: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    padding: espacamento.md,
  },
  campeao: {
    backgroundColor: cores.roxo,
    borderRadius: raio.lg,
    borderWidth: 2,
    borderColor: cores.magenta,
    alignItems: "center",
    paddingVertical: espacamento.lg,
    paddingHorizontal: espacamento.md,
    marginBottom: espacamento.md,
    ...sombra,
  },
  campeaoAvatar: {
    width: 72,
    height: 72,
    borderRadius: raio.pill,
    backgroundColor: cores.magenta,
    borderWidth: 4,
    borderColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espacamento.sm,
  },
  campeaoInicial: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.xxl,
    fontWeight: "900",
  },
  campeaoRotulo: {
    color: cores.fundo,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
  },
  campeaoNome: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginTop: 2,
  },
  abasScroll: {
    flexGrow: 0,
  },
  abas: {
    paddingVertical: espacamento.xs,
  },
  aba: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    borderRadius: raio.pill,
    paddingVertical: 6,
    paddingHorizontal: espacamento.md,
    marginRight: espacamento.sm,
  },
  abaAtiva: {
    backgroundColor: cores.verdeEscuro,
  },
  abaFinalAtiva: {
    backgroundColor: cores.magenta,
    borderColor: cores.magenta,
  },
  abaTitulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "800",
  },
  abaTituloAtivo: {
    color: cores.textoClaro,
  },
  abaContagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
    marginLeft: 6,
  },
  abaContagemAtiva: {
    color: cores.fundoClaro,
  },
  resumoRodada: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    fontWeight: "600",
    marginTop: espacamento.md,
    marginBottom: espacamento.sm,
  },
  lista: {
    paddingBottom: espacamento.lg,
  },
  partida: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    padding: espacamento.sm,
    marginBottom: espacamento.md,
  },
  partidaFinal: {
    borderColor: cores.magenta,
  },
  partidaCampea: {
    borderWidth: 3,
  },
  partidaPressionada: {
    opacity: 0.8,
  },
  topoPartida: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: espacamento.sm,
  },
  mesa: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
  },
  statusLinha: {
    flexDirection: "row",
    alignItems: "center",
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: raio.pill,
    marginRight: 5,
  },
  statusTexto: {
    fontSize: tamanhoFonte.xs,
    fontWeight: "800",
  },
  linhaJogador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.offWhite,
    borderRadius: raio.sm,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    paddingVertical: 9,
    paddingHorizontal: espacamento.sm,
    marginBottom: 4,
  },
  linhaVencedora: {
    backgroundColor: cores.fundoClaro,
    borderLeftColor: cores.magenta,
  },
  linhaPerdedora: {
    opacity: 0.55,
  },
  nomeJogador: {
    flex: 1,
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.md,
    fontWeight: "600",
  },
  nomeVencedor: {
    fontWeight: "900",
  },
  nomeIndefinido: {
    color: cores.textoSecundario,
    fontStyle: "italic",
    fontWeight: "500",
  },
  selo: {
    backgroundColor: cores.magenta,
    borderRadius: raio.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: espacamento.xs,
  },
  textoSelo: {
    color: cores.textoClaro,
    fontSize: 11,
    fontWeight: "900",
  },
  placar: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "700",
    marginLeft: espacamento.sm,
    minWidth: 16,
    textAlign: "right",
  },
  placarVencedor: {
    color: cores.magentaEscuro,
    fontWeight: "900",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    textAlign: "center",
    marginTop: 4,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(30, 42, 33, 0.65)",
    justifyContent: "center",
    padding: espacamento.lg,
  },
  modal: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    padding: espacamento.lg,
  },
  modalRodada: {
    color: cores.magenta,
    fontSize: tamanhoFonte.sm,
    fontWeight: "800",
  },
  modalMesa: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.md,
  },
  modalPlacar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.offWhite,
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.md,
  },
  modalLado: {
    flex: 1,
    alignItems: "center",
  },
  modalNome: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  modalNomeVencedor: {
    color: cores.magentaEscuro,
    fontWeight: "900",
  },
  modalGames: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.xxl,
    fontWeight: "900",
    marginTop: espacamento.xs,
  },
  modalVersus: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    fontWeight: "700",
    marginHorizontal: espacamento.sm,
  },
  modalInfo: {
    gap: espacamento.sm,
    marginBottom: espacamento.lg,
  },
  modalLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalRotulo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    fontWeight: "600",
  },
  modalValor: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: espacamento.md,
  },
  modalBotao: {
    backgroundColor: cores.roxo,
    borderRadius: raio.pill,
    paddingVertical: espacamento.sm + 2,
    alignItems: "center",
  },
  modalBotaoTexto: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "800",
  },
});