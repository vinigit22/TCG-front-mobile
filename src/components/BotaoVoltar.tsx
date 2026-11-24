import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, paleta, sobreNoite } from "../constants/colors";
import { espacamento, fontes, raio, tamanhoFonte } from "../constants/theme";

interface BotaoVoltarProps {
  fallback?: string;
  // Sobre o fundo escuro da capa
  claro?: boolean;
  // Soma a área segura do topo (quando o botão é o primeiro item da tela)
  recuoTopo?: boolean;
}

// O link "‹ Voltar" (.voltar) do painel web
export function BotaoVoltar({ fallback = "/(tabs)", claro = false, recuoTopo = true }: BotaoVoltarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cor = claro ? sobreNoite.textoSuave : cores.texto3;

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
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={10}
      style={({ pressed }) => [
        estilos.botao,
        claro && estilos.botaoClaro,
        recuoTopo && { marginTop: insets.top + espacamento.xs },
        pressed && (claro ? estilos.pressionadoClaro : estilos.pressionado),
      ]}
    >
      <Ionicons name="chevron-back" size={18} color={cor} />
      <Text style={[estilos.texto, { color: cor }]}>Voltar</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 36,
    marginHorizontal: espacamento.ms,
    marginBottom: espacamento.xs,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: raio.botao,
  },
  botaoClaro: {
    marginHorizontal: espacamento.ms,
  },
  pressionado: {
    backgroundColor: paleta.tinta[100],
  },
  pressionadoClaro: {
    backgroundColor: sobreNoite.realce,
  },
  texto: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.sm,
  },
});
