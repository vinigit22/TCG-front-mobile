import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "../constants/colors";
import { espacamento, raio, tamanhoFonte } from "../constants/theme";

interface BarraNavegacaoProps {
  termoPesquisa: string;
  aoMudarPesquisa: (texto: string) => void;
  aoAbrirNotificacoes: () => void;
  aoAbrirPerfil: () => void;
  quantidadeNaoLidas?: number;
  mostrarPesquisa?: boolean;
}

export function BarraNavegacao({
  termoPesquisa,
  aoMudarPesquisa,
  aoAbrirNotificacoes,
  aoAbrirPerfil,
  quantidadeNaoLidas = 0,
  mostrarPesquisa = true,
}: BarraNavegacaoProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        estilos.container,
        {
          paddingTop: insets.top + espacamento.sm,
        },
      ]}
    >
      <View style={estilos.linhaSuperior}>
        <Text numberOfLines={1} style={estilos.logo}>
          MERUEM.INC
        </Text>

        <View style={estilos.acoes}>
          <Pressable
            style={estilos.botaoIcone}
            onPress={aoAbrirNotificacoes}
            hitSlop={8}
          >
            <Text style={estilos.icone}>🔔</Text>

            {quantidadeNaoLidas > 0 ? (
              <View style={estilos.marcador}>
                <Text style={estilos.marcadorTexto}>
                  {quantidadeNaoLidas > 9 ? "9+" : quantidadeNaoLidas}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            style={estilos.botaoIcone}
            onPress={aoAbrirPerfil}
            hitSlop={8}
          >
            <Text style={estilos.icone}>👤</Text>
          </Pressable>
        </View>
      </View>

      {mostrarPesquisa ? (
        <TextInput
          value={termoPesquisa}
          onChangeText={aoMudarPesquisa}
          placeholder="Buscar torneios, lojas ou jogos"
          placeholderTextColor={cores.textoSecundario}
          style={estilos.pesquisa}
          returnKeyType="search"
        />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: cores.verdeEscuro,
    paddingHorizontal: espacamento.md,
    paddingBottom: espacamento.md,
    borderBottomLeftRadius: raio.lg,
    borderBottomRightRadius: raio.lg,
  },
  linhaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  logo: {
    color: cores.magenta,
    fontWeight: "900",
    fontSize: tamanhoFonte.lg,
    letterSpacing: 1,
    flex: 1,
    marginRight: espacamento.sm,
  },
  acoes: {
    flexDirection: "row",
    gap: espacamento.sm,
  },
  botaoIcone: {
    width: 36,
    height: 36,
    borderRadius: raio.pill,
    backgroundColor: cores.roxo,
    alignItems: "center",
    justifyContent: "center",
  },
  icone: {
    fontSize: tamanhoFonte.md,
  },
  marcador: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: cores.magenta,
    borderRadius: raio.pill,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  marcadorTexto: {
    color: cores.textoClaro,
    fontSize: 9,
    fontWeight: "900",
  },
  pesquisa: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: raio.pill,
    paddingHorizontal: espacamento.md,
    paddingVertical: espacamento.sm,
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.sm,
  },
});