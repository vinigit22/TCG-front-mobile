import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Chaveamento as ChaveamentoTipo } from "../models/types";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

interface ChaveamentoProps {
  partidas: ChaveamentoTipo[];
}

const coresPorStatus: Record<ChaveamentoTipo["status"], string> = {
  AGUARDANDO: cores.textoSecundario,
  PRONTA: cores.magenta,
  EM_ANDAMENTO: cores.alerta,
  FINALIZADA: cores.sucesso,
};

export function Chaveamento({ partidas }: ChaveamentoProps) {
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

  if (rodadas.length === 0) {
    return <Text style={estilos.vazio}>O chaveamento ainda não foi gerado.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {rodadas.map(([numero, rodada]) => (
        <View key={numero} style={estilos.coluna}>
          <Text style={estilos.nomeRodada}>{rodada.nome}</Text>
          {rodada.partidas.map((partida) => {
            // Sem vencedor definido nenhum lado é destacado (antes, dois lados vazios "empatavam" como vencedor)
            const venceuA = !!partida.vencedor && partida.vencedor === partida.jogadorA;
            const venceuB = !!partida.vencedor && partida.vencedor === partida.jogadorB;
            // Lado vazio numa partida já finalizada = avanço sem adversário (bye)
            const ladoVazio = partida.status === "FINALIZADA" ? "Sem adversário" : "A definir";

            return (
            <View key={partida.partidaId} style={estilos.partida}>
              <Text style={estilos.mesa}>Mesa {partida.mesa}</Text>
              <Text style={[estilos.jogador, venceuA && estilos.vencedor]}>
                {partida.jogadorA ?? ladoVazio}
              </Text>
              <Text style={estilos.versus}>vs</Text>
              <Text style={[estilos.jogador, venceuB && estilos.vencedor]}>
                {partida.jogadorB ?? ladoVazio}
              </Text>
              <Text style={[estilos.status, { color: coresPorStatus[partida.status] }]}>
                {partida.status.replace("_", " ")}
              </Text>
            </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  vazio: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    padding: espacamento.md,
  },
  coluna: {
    width: 180,
    marginRight: espacamento.md,
  },
  nomeRodada: {
    color: cores.verdeEscuro,
    fontWeight: "800",
    fontSize: tamanhoFonte.sm,
    textTransform: "uppercase",
    marginBottom: espacamento.sm,
  },
  partida: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamento.sm,
    marginBottom: espacamento.sm,
  },
  mesa: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    marginBottom: espacamento.xs,
  },
  jogador: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "600",
  },
  vencedor: {
    color: cores.magenta,
    fontWeight: "800",
  },
  versus: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    marginVertical: 2,
  },
  status: {
    fontSize: tamanhoFonte.xs,
    fontWeight: "700",
    marginTop: espacamento.xs,
    textTransform: "capitalize",
  },
});
