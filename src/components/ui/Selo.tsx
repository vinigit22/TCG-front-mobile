import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Tom, tons } from "../../constants/colors";
import { fontes, raio, tamanhoFonte } from "../../constants/theme";

interface SeloProps {
  texto: string;
  tom?: Tom;
  // Ponto colorido antes do texto (.selo::before); o ícone substitui o ponto
  ponto?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
  // Ponto piscando, como o .selo-vivo do web ("em andamento")
  vivo?: boolean;
  estilo?: StyleProp<ViewStyle>;
}

// Selo de status: o .selo do web (pílula 24px, fundo claro do tom, texto escuro do mesmo tom)
export function Selo({ texto, tom = "neutro", ponto = true, icone, vivo = false, estilo }: SeloProps) {
  const cor = tons[tom];
  const [opacidade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!vivo) return;
    const pulso = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidade, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(opacidade, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulso.start();
    return () => pulso.stop();
  }, [vivo, opacidade]);

  return (
    <View style={[estilos.selo, { backgroundColor: cor.fundo }, estilo]}>
      {icone ? (
        <Ionicons name={icone} size={12} color={cor.texto} />
      ) : ponto ? (
        <Animated.View style={[estilos.ponto, { backgroundColor: cor.texto, opacity: vivo ? opacidade : 0.85 }]} />
      ) : null}
      <Text numberOfLines={1} style={[estilos.texto, { color: cor.texto }]}>
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: raio.pill,
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  texto: {
    flexShrink: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.xs,
  },
});
