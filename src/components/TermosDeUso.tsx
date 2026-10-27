import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { cores, fundoModal } from "../constants/colors";
import { TERMOS_ATUALIZADOS_EM, TERMOS_DE_USO } from "../constants/termos";
import { espacamento, fontes, raio, sombras, tamanhoFonte, tipografia } from "../constants/theme";
import { Botao } from "./ui/Botao";

interface TermosDeUsoProps {
  visivel: boolean;
  aoFechar: () => void;
  aoConcordar: () => void;
}

export function TermosDeUso({ visivel, aoFechar, aoConcordar }: TermosDeUsoProps) {
  const { height: alturaTela } = useWindowDimensions();

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={estilos.fundo} onPress={aoFechar}>
        <Pressable style={[estilos.cartao, { maxHeight: alturaTela * 0.86 }]} onPress={() => {}}>
          <View style={estilos.topo}>
            <View style={estilos.topoTextos}>
              <Text accessibilityRole="header" style={estilos.titulo}>
                TERMOS DE USO
              </Text>
              <Text style={estilos.atualizado}>Atualizado em {TERMOS_ATUALIZADOS_EM}</Text>
            </View>
            <Pressable
              onPress={aoFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              style={estilos.fechar}
            >
              <Ionicons name="close" size={22} color={cores.texto2} />
            </Pressable>
          </View>

          <ScrollView style={estilos.leitura} contentContainerStyle={estilos.leituraConteudo}>
            {TERMOS_DE_USO.map((secao) => (
              <View key={secao.titulo} style={estilos.secao}>
                <Text style={estilos.secaoTitulo}>{secao.titulo}</Text>
                <Text style={estilos.secaoTexto}>{secao.texto}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={estilos.rodape}>
            <Botao titulo="Concordo" variante="acento" tamanho="lg" larguraTotal aoPressionar={aoConcordar} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: "center",
    padding: espacamento.md,
    backgroundColor: fundoModal,
  },
  cartao: {
    overflow: "hidden",
    borderRadius: raio.xl,
    backgroundColor: cores.superficie,
    ...sombras.lg,
  },
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: espacamento.md,
    padding: espacamento.ml,
    paddingBottom: espacamento.ms,
    borderBottomWidth: 1,
    borderBottomColor: cores.divisor,
  },
  topoTextos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    ...tipografia.tituloCartao,
  },
  atualizado: {
    ...tipografia.legenda,
  },
  fechar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: raio.pill,
    backgroundColor: cores.superficie2,
  },
  leitura: {
    flexShrink: 1,
  },
  leituraConteudo: {
    gap: espacamento.md,
    padding: espacamento.ml,
  },
  secao: {
    gap: 4,
  },
  secaoTitulo: {
    fontFamily: fontes.extrabold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
  secaoTexto: {
    ...tipografia.corpo,
    color: cores.texto2,
  },
  rodape: {
    padding: espacamento.ml,
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
});