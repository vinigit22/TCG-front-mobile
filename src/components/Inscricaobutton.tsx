import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

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

const rotulos: Record<EstadoInscricao, string> = {
  DESLOGADO: "ENTRAR PARA SE INSCREVER",
  DISPONIVEL: "INSCREVER-SE",
  ESGOTADO: "ENTRAR NA LISTA DE ESPERA",
  INSCRITO: "VOCÊ ESTÁ INSCRITO",
  LISTA_ESPERA: "VOCÊ ESTÁ NA LISTA DE ESPERA",
  ENCERRADO: "INSCRIÇÕES FECHADAS",
  CARREGANDO: "AGUARDE",
};

const SEM_ACAO: EstadoInscricao[] = ["INSCRITO", "LISTA_ESPERA", "ENCERRADO", "CARREGANDO"];

export function InscricaoButton({ estado, aoPressionar }: InscricaoButtonProps) {
  const desabilitado = SEM_ACAO.includes(estado);

  return (
    <Pressable
      disabled={desabilitado}
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.botao,
        (estado === "INSCRITO" || estado === "LISTA_ESPERA") && estilos.botaoInscrito,
        estado === "ENCERRADO" && estilos.botaoEncerrado,
        pressed && !desabilitado && estilos.botaoPressionado,
      ]}
    >
      {estado === "CARREGANDO" ? (
        <ActivityIndicator color={cores.textoClaro} />
      ) : (
        <Text style={estilos.texto}>{rotulos[estado]}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: cores.magenta,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoInscrito: {
    backgroundColor: cores.verdeEscuro,
  },
  botaoEncerrado: {
    backgroundColor: cores.encerrado,
  },
  botaoPressionado: {
    opacity: 0.85,
  },
  texto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.md,
    letterSpacing: 0.5,
  },
});
