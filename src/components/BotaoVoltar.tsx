import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "../constants/colors";
import { espacamento, raio } from "../constants/theme";

interface BotaoVoltarProps {
  fallback?: string;
}

export function BotaoVoltar({ fallback = "/(tabs)" }: BotaoVoltarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as any);
    }
  }

  return (
    <Pressable
      onPress={voltar}
      style={[
        estilos.botao,
        {
          marginTop: insets.top + espacamento.sm,
        },
      ]}
      hitSlop={10}
    >
      <Text style={estilos.seta}>‹</Text>
      <Text style={estilos.texto}>Voltar</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    marginHorizontal: espacamento.md,
    marginBottom: espacamento.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.roxo,
    borderRadius: raio.pill,
    paddingHorizontal: espacamento.sm,
    paddingVertical: 6,
  },
  seta: {
    color: cores.textoClaro,
    fontSize: 28,
    lineHeight: 24,
    marginRight: 3,
  },
  texto: {
    color: cores.textoClaro,
    fontSize: 13,
    fontWeight: "800",
  },
});