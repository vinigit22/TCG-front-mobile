import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

export type EstadoInscricao = "DESLOGADO" | "DISPONIVEL" | "ESGOTADO" | "INSCRITO" | "CARREGANDO";

interface InscricaoButtonProps {
  estado: EstadoInscricao;
  aoPressionar: () => void;
}

const rotulos: Record<EstadoInscricao, string> = {
  DESLOGADO: "ENTRAR PARA SE INSCREVER",
  DISPONIVEL: "INSCREVER-SE",
  ESGOTADO: "ENTRAR NA LISTA DE ESPERA",
  INSCRITO: "VOCÊ ESTÁ INSCRITO",
  CARREGANDO: "AGUARDE",
};

export function InscricaoButton({ estado, aoPressionar }: InscricaoButtonProps) {
  const desabilitado = estado === "INSCRITO" || estado === "CARREGANDO";

  return (
    <Pressable
      disabled={desabilitado}
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.botao,
        estado === "INSCRITO" && estilos.botaoInscrito,
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
    borderRadius: raio.pill,
    paddingVertical: espacamento.md,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoInscrito: {
    backgroundColor: cores.verdeEscuro,
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
