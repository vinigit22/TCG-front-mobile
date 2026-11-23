import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, paleta, sobreNoite } from "../constants/colors";
import { espacamento, fontes, raio, tamanhoFonte } from "../constants/theme";
import { Marca } from "./ui/Marca";

interface BarraNavegacaoProps {
  aoAbrirPesquisa: () => void;
  aoFecharPesquisa: () => void;
  pesquisaAberta: boolean;
  termoPesquisa: string;
  aoMudarPesquisa: (texto: string) => void;
}

// Cabeçalho da home: a navbar do site (fundo roxo-noite, linha lilás embaixo, a mesma logo)
export function BarraNavegacao({ aoAbrirPesquisa, aoFecharPesquisa, pesquisaAberta, termoPesquisa, aoMudarPesquisa }: BarraNavegacaoProps) {
  const insets = useSafeAreaInsets();
  const campoPesquisa = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (pesquisaAberta) requestAnimationFrame(() => campoPesquisa.current?.focus());
  }, [pesquisaAberta]);

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm }]}>
      {pesquisaAberta ? (
        <View style={estilos.linha}>
          <View style={estilos.campo}>
            <Ionicons name="search-outline" size={18} color={paleta.tinta[300]} />
            <TextInput
              ref={campoPesquisa}
              value={termoPesquisa}
              onChangeText={aoMudarPesquisa}
              placeholder="Torneios, jogos ou lojas"
              placeholderTextColor={paleta.tinta[400]}
              style={estilos.pesquisa}
              returnKeyType="search"
              accessibilityLabel="Pesquisar"
            />
          </View>
          <Pressable
            onPress={aoFecharPesquisa}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Fechar pesquisa"
            style={({ pressed }) => [estilos.botaoIcone, pressed && estilos.botaoPressionado]}
          >
            <Ionicons name="close" size={22} color={cores.textoInverso} />
          </Pressable>
        </View>
      ) : (
        <View style={estilos.linha}>
          <Marca altura={36} />
          <Pressable
            style={({ pressed }) => [estilos.botaoIcone, pressed && estilos.botaoPressionado]}
            onPress={aoAbrirPesquisa}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Pesquisar torneios"
          >
            <Ionicons name="search-outline" size={20} color={cores.textoInverso} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: "rgba(19, 12, 42, 0.96)",
    paddingHorizontal: espacamento.md,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: sobreNoite.borda,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacamento.sm,
    minHeight: 42,
  },
  // .menu-botao da navbar
  botaoIcone: {
    width: 42,
    height: 42,
    borderRadius: raio.botao,
    backgroundColor: sobreNoite.realce,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoPressionado: {
    backgroundColor: sobreNoite.pilula,
  },
  campo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: raio.botao,
    backgroundColor: sobreNoite.campo,
    borderWidth: 1,
    borderColor: sobreNoite.borda,
  },
  pesquisa: {
    flex: 1,
    paddingVertical: 0,
    color: cores.textoInverso,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.base,
  },
});
