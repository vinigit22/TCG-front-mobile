import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Notificacao } from "../models/types";
import { cores, paleta, Tom } from "../constants/colors";
import { espacamento, fontes, raio, sombras, tamanhoFonte } from "../constants/theme";
import { formatarQuando } from "../utils/formatadores";
import { BlocoIcone } from "./ui/BlocoIcone";

interface NotificacaoItemProps {
  notificacao: Notificacao;
  aoPressionar: (notificacao: Notificacao) => void;
}

const iconesPorTipo: Record<Notificacao["tipo"], { icone: keyof typeof Ionicons.glyphMap; tom: Tom }> = {
  CHECK_IN_SOLICITADO: { icone: "alarm-outline", tom: "ambar" },
  INSCRICAO_CONFIRMADA: { icone: "checkmark-circle-outline", tom: "verde" },
  TORNEIO_INICIADO: { icone: "flag-outline", tom: "roxo" },
  RODADA_INICIADA: { icone: "notifications-outline", tom: "roxo" },
  PAREAMENTO: { icone: "people-outline", tom: "azul" },
  RESULTADO_REGISTRADO: { icone: "clipboard-outline", tom: "azul" },
  TORNEIO_FINALIZADO: { icone: "trophy-outline", tom: "ambar" },
  EVENTO_ATUALIZADO: { icone: "calendar-outline", tom: "roxo" },
  TORNEIO_CANCELADO: { icone: "warning-outline", tom: "vermelho" },
  AVISO_GERAL: { icone: "megaphone-outline", tom: "roxo" },
};

export function NotificacaoItem({ notificacao, aoPressionar }: NotificacaoItemProps) {
  const tipo = iconesPorTipo[notificacao.tipo] ?? iconesPorTipo.AVISO_GERAL;
  const naoLida = !notificacao.lida;

  return (
    <Pressable
      style={({ pressed }) => [estilos.container, naoLida && estilos.naoLida, pressed && estilos.pressionado]}
      onPress={() => aoPressionar(notificacao)}
      accessibilityRole="button"
      accessibilityLabel={`${naoLida ? "Não lida. " : ""}${notificacao.titulo}`}
    >
      <BlocoIcone nome={tipo.icone} tom={tipo.tom} tamanho={40} />
      <View style={estilos.textos}>
        <View style={estilos.tituloLinha}>
          <Text style={[estilos.titulo, naoLida && estilos.tituloNaoLida]} numberOfLines={1}>
            {notificacao.titulo}
          </Text>
          {naoLida ? <View style={estilos.bolinha} /> : null}
        </View>
        <Text style={estilos.mensagem} numberOfLines={2}>
          {notificacao.mensagem}
        </Text>
        <Text style={estilos.quando}>{formatarQuando(notificacao.criadoEm)}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacamento.ms,
    padding: 14,
    marginBottom: espacamento.sm,
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombras.xs,
  },
  naoLida: {
    backgroundColor: paleta.roxo[50],
    borderColor: paleta.roxo[200],
  },
  pressionado: {
    opacity: 0.85,
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
  },
  titulo: {
    flex: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.md,
    color: cores.texto,
  },
  tituloNaoLida: {
    fontFamily: fontes.bold,
  },
  mensagem: {
    marginTop: 2,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.sm,
    lineHeight: 19,
    color: cores.texto2,
  },
  quando: {
    marginTop: 6,
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.xs,
    color: cores.texto3,
  },
  bolinha: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: paleta.verde[500],
  },
});
