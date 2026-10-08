import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "../constants/colors";
import { espacamento, fontes, raio, tamanhoFonte } from "../constants/theme";
import { useAuth } from "../context/authContext";
import { AvatarPerfil } from "./AvatarPerfil";
import { montarUrlImagem } from "../services/api";

interface BarraNavegacaoProps {
  aoAbrirNotificacoes: () => void;
  aoAbrirPerfil: () => void;
  aoAbrirPesquisa: () => void;
  aoFecharPesquisa: () => void;
  pesquisaAberta: boolean;
  termoPesquisa: string;
  aoMudarPesquisa: (texto: string) => void;
  quantidadeNaoLidas?: number;
}

export function BarraNavegacao({ aoAbrirNotificacoes, aoAbrirPerfil, aoAbrirPesquisa, aoFecharPesquisa, pesquisaAberta, termoPesquisa, aoMudarPesquisa, quantidadeNaoLidas = 0 }: BarraNavegacaoProps) {
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const campoPesquisa = useRef<TextInput>(null);

  useEffect(() => {
    if (pesquisaAberta) requestAnimationFrame(() => campoPesquisa.current?.focus());
  }, [pesquisaAberta]);

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm, paddingBottom: espacamento.sm }]}>
      {pesquisaAberta ? (
        <View style={estilos.linhaPesquisa}>
          <Ionicons name="search-outline" size={21} color={cores.textoClaro} />
          <TextInput
            ref={campoPesquisa}
            value={termoPesquisa}
            onChangeText={aoMudarPesquisa}
            placeholder="Pesquisar torneios, jogos ou lojas"
            placeholderTextColor={cores.fundoClaro}
            style={estilos.pesquisa}
            returnKeyType="search"
          />
          <Pressable onPress={aoFecharPesquisa} hitSlop={10} accessibilityLabel="Fechar pesquisa">
            <Ionicons name="close" size={24} color={cores.textoClaro} />
          </Pressable>
        </View>
      ) : (
        <View style={estilos.linhaSuperior}>
          <Text numberOfLines={1} style={estilos.logo}>MERUEM.INC</Text>
          <View style={estilos.acoes}>
            <Pressable style={estilos.botaoIcone} onPress={aoAbrirPesquisa} hitSlop={8} accessibilityLabel="Pesquisar torneios">
              <Ionicons name="search-outline" size={21} color={cores.textoClaro} />
            </Pressable>
            <Pressable style={estilos.botaoIcone} onPress={aoAbrirNotificacoes} hitSlop={8} accessibilityLabel="Abrir notificações">
              <Ionicons name="notifications-outline" size={20} color={cores.textoClaro} />
              {quantidadeNaoLidas > 0 ? <View style={estilos.marcador}><Text style={estilos.marcadorTexto}>{quantidadeNaoLidas > 9 ? "9+" : quantidadeNaoLidas}</Text></View> : null}
            </Pressable>
            <Pressable style={estilos.botaoIcone} onPress={aoAbrirPerfil} hitSlop={8} accessibilityLabel="Abrir perfil">
              {usuario ? <AvatarPerfil foto={montarUrlImagem(usuario.imagemPerfil)} nome={usuario.nickname || usuario.nome} tamanho={36} /> : <Ionicons name="person-outline" size={20} color={cores.textoClaro} />}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { backgroundColor: cores.verdeEscuro, paddingHorizontal: espacamento.md, borderBottomLeftRadius: raio.lg, borderBottomRightRadius: raio.lg },
  linhaSuperior: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 40 },
  linhaPesquisa: { flexDirection: "row", alignItems: "center", minHeight: 40, gap: espacamento.sm },
  logo: { color: cores.magenta, fontFamily: fontes.marca, fontSize: tamanhoFonte.lg, letterSpacing: 1.5, flex: 1, marginRight: espacamento.sm },
  acoes: { flexDirection: "row", gap: espacamento.sm },
  botaoIcone: { width: 36, height: 36, borderRadius: raio.pill, backgroundColor: cores.roxo, alignItems: "center", justifyContent: "center" },
  pesquisa: { flex: 1, color: cores.textoClaro, fontSize: tamanhoFonte.md, paddingVertical: 0 },
  marcador: { position: "absolute", top: -4, right: -4, backgroundColor: cores.magenta, borderRadius: raio.pill, minWidth: 17, height: 17, paddingHorizontal: 3, alignItems: "center", justifyContent: "center" },
  marcadorTexto: { color: cores.textoClaro, fontSize: 9, fontWeight: "900" },
});
