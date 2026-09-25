import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Torneio } from "../models/types";
import { cores } from "../constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../constants/theme";
import { Vagas } from "./Vagas";
import { Loja } from "./Loja";

interface TorneioCardProps {
  torneio: Torneio;
  aoPressionar: (torneio: Torneio) => void;
}

const rotulosStatus: Record<Torneio["status"], string> = {
  RASCUNHO: "Em breve",
  INSCRICOES_ABERTAS: "Inscrições abertas",
  INSCRICOES_ENCERRADAS: "Inscrições encerradas",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADO: "Encerrado",
  CANCELADO: "Cancelado",
};

function formatarData(dataIso: string) {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return { data: `${dia}/${mes}/${data.getFullYear()}`, horario: `${hora}:${minuto}` };
}

export function TorneioCard({ torneio, aoPressionar }: TorneioCardProps) {
  const { data, horario } = formatarData(torneio.dataInicio);

  return (
    <Pressable
      style={({ pressed }) => [estilos.card, pressed && estilos.cardPressionado]}
      onPress={() => aoPressionar(torneio)}
    >
      <View style={estilos.cabecalho}>
        <Text style={estilos.jogo}>{torneio.jogo}</Text>
        <Text style={estilos.status}>{rotulosStatus[torneio.status]}</Text>
      </View>

      <Text style={estilos.titulo}>{torneio.titulo}</Text>
      <Loja nome={torneio.nomeLoja} />

      <View style={estilos.linhaInfo}>
        <Text style={estilos.info}>{data}</Text>
        <Text style={estilos.info}>{horario}</Text>
      </View>

      <View style={estilos.rodape}>
        <Vagas vagasMax={torneio.vagasMax} vagasDisponiveis={torneio.vagasDisponiveis} />
        <Pressable style={estilos.botao} onPress={() => aoPressionar(torneio)}>
          <Text style={estilos.textoBotao}>VER TORNEIO</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    padding: espacamento.md,
    marginBottom: espacamento.md,
    ...sombra,
  },
  cardPressionado: {
    opacity: 0.85,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: espacamento.xs,
  },
  jogo: {
    color: cores.magenta,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
    textTransform: "uppercase",
  },
  status: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    fontWeight: "600",
  },
  titulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "800",
    marginBottom: espacamento.xs,
  },
  linhaInfo: {
    flexDirection: "row",
    gap: espacamento.md,
    marginTop: espacamento.sm,
    marginBottom: espacamento.sm,
  },
  info: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: espacamento.xs,
  },
  botao: {
    backgroundColor: cores.roxo,
    paddingVertical: espacamento.sm,
    paddingHorizontal: espacamento.md,
    borderRadius: raio.pill,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.xs,
    fontWeight: "800",
  },
});
