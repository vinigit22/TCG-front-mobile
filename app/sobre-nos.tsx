import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { cores } from "../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../src/constants/theme";

export default function SobreNos() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Sobre nós</Text>
        <View style={estilos.cartao}>
          <Text style={estilos.marca}>MERUEM.INC</Text>
          <Text style={estilos.texto}>Uma plataforma para encontrar, acompanhar e participar de eventos e torneios de TCG.</Text>
        </View>
        <View style={estilos.cartao}>
          <Text style={estilos.subtitulo}>Nossa proposta</Text>
          <Text style={estilos.texto}>Aproximar jogadores, lojas e comunidades em um único lugar, deixando a experiência dos torneios mais simples.</Text>
        </View>
        <Text style={estilos.versao}>Versão 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: espacamento.lg, paddingBottom: espacamento.xl },
  titulo: { color: cores.verdeEscuro, fontSize: tamanhoFonte.xl, fontWeight: "900", marginBottom: espacamento.lg },
  cartao: { backgroundColor: cores.branco, borderRadius: raio.md, padding: espacamento.lg, marginBottom: espacamento.md, ...sombra },
  marca: { color: cores.magenta, fontSize: tamanhoFonte.lg, fontWeight: "900", marginBottom: espacamento.sm, letterSpacing: 0.8 },
  subtitulo: { color: cores.textoEscuro, fontSize: tamanhoFonte.md, fontWeight: "800", marginBottom: espacamento.sm },
  texto: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, lineHeight: 23 },
  versao: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, textAlign: "center", marginTop: espacamento.sm },
});
