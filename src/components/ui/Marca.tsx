import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { paleta } from "../../constants/colors";
import { fontes } from "../../constants/theme";
import { Degrade } from "./Degrade";

const LOGO = require("../../../assets/images/logo-meruem.png");

// A mesma imagem do cabeçalho do site (TCG-front-web/public/imagens/logo1.png, 145x53)
export function Marca({ altura = 36 }: { altura?: number }) {
  return (
    <Image
      source={LOGO}
      accessibilityLabel="MERUEM.INC"
      resizeMode="contain"
      style={{ height: altura, width: Math.round((altura * 145) / 53) }}
    />
  );
}

// As três cartas em leque do hero da home do site (.cartas), em tamanho de celular
export function LequeCartas({ escala = 1 }: { escala?: number }) {
  const largura = 58 * escala;
  const altura = 82 * escala;
  const carta = { width: largura, height: altura, marginLeft: -largura / 2, marginTop: -altura / 2, borderRadius: 9 * escala };

  return (
    <View style={{ width: largura * 2.1, height: altura * 1.35 }} pointerEvents="none" accessible={false}>
      <View style={[estilos.carta, carta, { backgroundColor: paleta.roxo[500], transform: [{ translateX: -20 * escala }, { rotate: "-14deg" }] }]} />
      <View style={[estilos.carta, carta, { backgroundColor: paleta.verde[400], transform: [{ translateX: 20 * escala }, { rotate: "12deg" }] }]} />
      <View style={[estilos.carta, carta, estilos.frente, { borderWidth: 3 * escala, transform: [{ translateY: -4 * escala }, { rotate: "-2deg" }] }]}>
        <Degrade de={paleta.roxo[300]} para={paleta.verde[300]} faixas={10} estilo={StyleSheet.absoluteFill} />
        <Text style={[estilos.estrela, { fontSize: 26 * escala, lineHeight: 30 * escala }]}>★</Text>
        <Text style={[estilos.cartaTexto, { fontSize: 7 * escala }]}>TOPDECK</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  carta: {
    position: "absolute",
    left: "50%",
    top: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  frente: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderColor: paleta.branco,
  },
  estrela: {
    color: paleta.roxo[950],
  },
  cartaTexto: {
    fontFamily: fontes.marca,
    letterSpacing: 0.5,
    color: paleta.roxo[950],
  },
});
