import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Tom, tons } from "../constants/colors";
import { fontes, raio, tamanhoFonte } from "../constants/theme";
import { Botao, VarianteBotao } from "./ui/Botao";

// ENCERRADO: o torneio não está com inscrições abertas (o backend recusaria a inscrição)
export type EstadoInscricao =
  | "DESLOGADO"
  | "DISPONIVEL"
  | "ESGOTADO"
  | "INSCRITO"
  | "LISTA_ESPERA"
  | "ENCERRADO"
  | "CARREGANDO";

interface InscricaoButtonProps {
  estado: EstadoInscricao;
  aoPressionar: () => void;
}

const acoes: Partial<Record<EstadoInscricao, { titulo: string; variante: VarianteBotao; icone: keyof typeof Ionicons.glyphMap }>> = {
  DESLOGADO: { titulo: "Entrar para se inscrever", variante: "primario", icone: "log-in-outline" },
  DISPONIVEL: { titulo: "Inscrever-se", variante: "acento", icone: "add-circle-outline" },
  ESGOTADO: { titulo: "Entrar na lista de espera", variante: "primario", icone: "hourglass-outline" },
};

// Estados sem ação: um bloco com as cores dos selos em vez de um botão desabilitado
const situacoes: Partial<Record<EstadoInscricao, { texto: string; tom: Tom; icone: keyof typeof Ionicons.glyphMap }>> = {
  INSCRITO: { texto: "Você está inscrito", tom: "verde", icone: "checkmark-circle" },
  LISTA_ESPERA: { texto: "Você está na lista de espera", tom: "ambar", icone: "hourglass" },
  ENCERRADO: { texto: "Inscrições fechadas", tom: "neutro", icone: "lock-closed" },
};

export function InscricaoButton({ estado, aoPressionar }: InscricaoButtonProps) {
  if (estado === "CARREGANDO") {
    return <Botao titulo="Aguarde" variante="acento" tamanho="lg" carregando larguraTotal />;
  }

  const acao = acoes[estado];
  if (acao) {
    return (
      <Botao
        titulo={acao.titulo}
        variante={acao.variante}
        icone={acao.icone}
        tamanho="lg"
        larguraTotal
        aoPressionar={aoPressionar}
      />
    );
  }

  const situacao = situacoes[estado]!;
  const cor = tons[situacao.tom];
  return (
    <View style={[estilos.situacao, { backgroundColor: cor.fundo }]} accessibilityRole="text">
      <Ionicons name={situacao.icone} size={18} color={cor.texto} />
      <Text style={[estilos.situacaoTexto, { color: cor.texto }]}>{situacao.texto.toUpperCase()}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  situacao: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: raio.cta,
  },
  situacaoTexto: {
    fontFamily: fontes.marca,
    fontSize: tamanhoFonte.sm,
    letterSpacing: 0.9,
  },
});
