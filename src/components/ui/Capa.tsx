import React, { useCallback } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { paleta } from "../../constants/colors";
import { espacamento } from "../../constants/theme";
import { BotaoVoltar } from "../BotaoVoltar";
import { Degrade } from "./Degrade";

interface BrilhoProps {
  cor: string;
  tamanho: number;
  intensidade: number;
  posicao: ViewStyle;
}

// Um radial-gradient do web feito com anéis concêntricos translúcidos: mais forte no centro, some na borda
export function Brilho({ cor, tamanho, intensidade, posicao }: BrilhoProps) {
  const aneis = 7;
  return (
    <View style={[{ position: "absolute", width: tamanho, height: tamanho }, posicao]}>
      {Array.from({ length: aneis }, (_, indice) => {
        const lado = tamanho * (1 - indice / aneis);
        return (
          <View
            key={indice}
            style={{
              position: "absolute",
              left: (tamanho - lado) / 2,
              top: (tamanho - lado) / 2,
              width: lado,
              height: lado,
              borderRadius: lado / 2,
              backgroundColor: cor,
              opacity: intensidade / aneis,
            }}
          />
        );
      })}
    </View>
  );
}

// Fundo --gradiente-noite do web: roxo-950 -> roxo-800, brilho roxo no alto à direita e verde embaixo à esquerda
export function FundoNoite() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Degrade de={paleta.roxo[950]} para={paleta.roxo[800]} faixas={24} estilo={StyleSheet.absoluteFill} />
      <Brilho cor={paleta.roxo[500]} tamanho={380} intensidade={0.55} posicao={{ top: -210, right: -130 }} />
      <Brilho cor={paleta.verde[500]} tamanho={300} intensidade={0.3} posicao={{ bottom: -200, left: -130 }} />
    </View>
  );
}

interface CapaProps {
  children: React.ReactNode;
  voltar?: boolean;
  fallback?: string;
  estilo?: StyleProp<ViewStyle>;
}

// Topo escuro das telas de detalhe (torneio, evento, loja, perfil), como o hero e o login do site.
// Enquanto a tela está em foco, os ícones da barra de status ficam claros.
export function Capa({ children, voltar = true, fallback, estilo }: CapaProps) {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  return (
    <View style={[estilos.capa, { paddingTop: insets.top + (voltar ? espacamento.xs : espacamento.lg) }, estilo]}>
      <FundoNoite />
      {voltar ? <BotaoVoltar claro recuoTopo={false} fallback={fallback} /> : null}
      <View style={estilos.conteudo}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  capa: {
    backgroundColor: paleta.roxo[950],
    overflow: "hidden",
  },
  conteudo: {
    paddingHorizontal: espacamento.ml,
    paddingTop: espacamento.sm,
    paddingBottom: espacamento.xl,
  },
});
