import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Capa } from "../src/components/ui/Capa";
import { Degrade } from "../src/components/ui/Degrade";
import { Marca } from "../src/components/ui/Marca";
import { cores, paleta } from "../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../src/constants/theme";

// Os mesmos blocos da página "Quem somos" do site: título em Bungee roxo e a barra roxo -> verde à esquerda
function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={estilos.bloco}>
      <Degrade estilo={estilos.barra} />
      <Text style={estilos.blocoTitulo}>{titulo}</Text>
      <Text style={estilos.blocoTexto}>{texto}</Text>
    </View>
  );
}

export default function SobreNos() {
  const insets = useSafeAreaInsets();
  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.xl }} showsVerticalScrollIndicator={false}>
        <Capa>
          <Marca altura={44} />
          <Text accessibilityRole="header" style={estilos.titulo}>QUEM SOMOS?</Text>
          <Text style={estilos.texto}>
            Criado por 3 estudantes universitários, o <Text style={estilos.destaque}>TOPDECK</Text> nasceu da paixão por
            jogos de cartas e da necessidade de uma plataforma simples para organizar torneios.
          </Text>
        </Capa>

        <View style={estilos.conteudo}>
          <Bloco titulo="NOSSA MISSÃO" texto="Conectar jogadores e lojas, tornando a organização de torneios de TCG acessível para todos." />
          <Bloco titulo="JOGAMOS" texto="Magic: The Gathering · Pokémon TCG · Yu-Gi-Oh! · One Piece · Lorcana" />
          <Text style={estilos.versao}>TopDeck · versão 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  titulo: { marginTop: espacamento.md, fontFamily: fontes.marca, fontSize: 28, lineHeight: 34, letterSpacing: 1, color: cores.textoInverso },
  texto: { marginTop: espacamento.sm, fontFamily: fontes.regular, fontSize: tamanhoFonte.base, lineHeight: 23, color: paleta.tinta[300] },
  destaque: { fontFamily: fontes.extrabold, color: paleta.verde[300] },
  conteudo: { marginTop: -espacamento.md, paddingHorizontal: espacamento.md },
  bloco: { ...cartao, borderRadius: raio.cartao, overflow: "hidden", paddingVertical: espacamento.ml, paddingLeft: espacamento.lg, paddingRight: espacamento.ml, marginBottom: espacamento.ms },
  barra: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  blocoTitulo: { marginBottom: espacamento.sm, fontFamily: fontes.marca, fontSize: tamanhoFonte.base, letterSpacing: 0.9, color: paleta.roxo[600] },
  blocoTexto: { ...tipografia.corpo, color: cores.texto2 },
  versao: { ...tipografia.legenda, marginTop: espacamento.md, textAlign: "center" },
});
