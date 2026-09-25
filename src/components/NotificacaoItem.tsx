import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Notificacao } from "../models/types";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

interface NotificacaoItemProps {
  notificacao: Notificacao;
  aoPressionar: (notificacao: Notificacao) => void;
}

const iconesPorTipo: Record<Notificacao["tipo"], string> = {
  INSCRICAO_CONFIRMADA: "✅",
  TORNEIO_INICIADO: "🏁",
  RODADA_INICIADA: "🔔",
  PAREAMENTO: "⚔️",
  RESULTADO_REGISTRADO: "📋",
  TORNEIO_FINALIZADO: "🏆",
  EVENTO_ATUALIZADO: "📅",
  TORNEIO_CANCELADO: "⚠️",
  AVISO_GERAL: "📣",
};

function formatarQuando(dataIso: string) {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${hora}:${minuto}`;
}

export function NotificacaoItem({ notificacao, aoPressionar }: NotificacaoItemProps) {
  return (
    <Pressable
      style={[estilos.container, !notificacao.lida && estilos.naoLida]}
      onPress={() => aoPressionar(notificacao)}
    >
      <Text style={estilos.icone}>{iconesPorTipo[notificacao.tipo]}</Text>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{notificacao.titulo}</Text>
        <Text style={estilos.mensagem} numberOfLines={2}>
          {notificacao.mensagem}
        </Text>
        <Text style={estilos.quando}>{formatarQuando(notificacao.criadoEm)}</Text>
      </View>
      {!notificacao.lida ? <View style={estilos.bolinha} /> : null}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: "flex-start",
    gap: espacamento.sm,
  },
  naoLida: {
    backgroundColor: cores.offWhite,
    borderColor: cores.magenta,
  },
  icone: {
    fontSize: tamanhoFonte.lg,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    color: cores.textoEscuro,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.xs / 2,
  },
  quando: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    marginTop: espacamento.xs,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.magenta,
    marginTop: espacamento.xs,
  },
});
