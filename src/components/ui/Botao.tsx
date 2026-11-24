import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { cores, paleta, sobreNoite } from "../../constants/colors";
import { fontes, raio } from "../../constants/theme";

// Mesmas variantes de .btn-primario, .btn-acento, .btn-secundario... do web.
// "contorno" é o .btn-contorno da navbar do site, para usar sobre o fundo escuro.
export type VarianteBotao = "primario" | "acento" | "secundario" | "fantasma" | "perigo" | "perigoSuave" | "contorno";

// sm e md seguem .btn-sm e .btn; lg é o botão grande do site (.btn-entrar, .btn-cadastrar), em Bungee
export type TamanhoBotao = "sm" | "md" | "lg";

interface BotaoProps {
  titulo: string;
  aoPressionar?: () => void;
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
  larguraTotal?: boolean;
  estilo?: StyleProp<ViewStyle>;
}

const variantes: Record<VarianteBotao, { fundo: string; pressionado: string; texto: string; borda?: string }> = {
  primario: { fundo: cores.primaria, pressionado: cores.primariaPressionada, texto: cores.textoInverso },
  acento: { fundo: cores.acento, pressionado: cores.acentoPressionado, texto: cores.textoSobreAcento },
  secundario: { fundo: cores.superficie, pressionado: paleta.tinta[50], texto: cores.texto, borda: cores.bordaForte },
  fantasma: { fundo: "transparent", pressionado: paleta.tinta[100], texto: cores.texto2 },
  perigo: { fundo: paleta.vermelho[500], pressionado: paleta.vermelho[700], texto: cores.textoInverso },
  perigoSuave: { fundo: "transparent", pressionado: paleta.vermelho[100], texto: paleta.vermelho[700] },
  contorno: { fundo: "transparent", pressionado: sobreNoite.pilula, texto: cores.textoInverso, borda: sobreNoite.contorno },
};

const tamanhos: Record<TamanhoBotao, { altura: number; padding: number; fonte: number; raio: number; icone: number }> = {
  sm: { altura: 34, padding: 12, fonte: 13, raio: raio.sm, icone: 15 },
  md: { altura: 44, padding: 16, fonte: 14, raio: raio.botao, icone: 17 },
  lg: { altura: 52, padding: 22, fonte: 14, raio: raio.cta, icone: 18 },
};

export function Botao({
  titulo,
  aoPressionar,
  variante = "primario",
  tamanho = "md",
  icone,
  carregando = false,
  desabilitado = false,
  larguraTotal = false,
  estilo,
}: BotaoProps) {
  const cor = variantes[variante];
  const medida = tamanhos[tamanho];
  const grande = tamanho === "lg";
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      hitSlop={tamanho === "sm" ? 6 : undefined}
      style={({ pressed }) => [
        estilos.botao,
        {
          height: medida.altura,
          paddingHorizontal: medida.padding,
          borderRadius: medida.raio,
          backgroundColor: pressed ? cor.pressionado : cor.fundo,
        },
        cor.borda ? { borderWidth: 1.5, borderColor: cor.borda } : null,
        grande && variante === "primario" && estilos.sombraRoxa,
        grande && variante === "acento" && estilos.sombraVerde,
        larguraTotal && estilos.larguraTotal,
        pressed && estilos.pressionado,
        desabilitado && estilos.desabilitado,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cor.texto} />
      ) : (
        <View style={estilos.conteudo}>
          {icone ? <Ionicons name={icone} size={medida.icone} color={cor.texto} /> : null}
          <Text
            numberOfLines={1}
            style={[
              grande ? estilos.textoGrande : estilos.texto,
              { color: cor.texto, fontSize: medida.fonte },
            ]}
          >
            {titulo}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  larguraTotal: {
    alignSelf: "stretch",
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  texto: {
    fontFamily: fontes.semibold,
  },
  textoGrande: {
    fontFamily: fontes.marca,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  // .btn:active
  pressionado: {
    transform: [{ translateY: 1 }],
  },
  desabilitado: {
    opacity: 0.5,
  },
  // Sombra colorida dos botões grandes do site
  sombraRoxa: {
    shadowColor: paleta.roxo[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  sombraVerde: {
    shadowColor: paleta.verde[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
});
