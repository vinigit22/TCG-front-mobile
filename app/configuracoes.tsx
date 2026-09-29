import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { cores } from "../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function Configuracoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  async function sair() {
    await logout();
    router.replace("/(tabs)");
  }

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Configurações</Text>

        <Pressable style={estilos.item} onPress={() => router.push("/editar-perfil")}>
          <Text style={estilos.itemTexto}>Editar perfil</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>

        <View style={estilos.item}>
          <Text style={estilos.itemTexto}>Notificações push</Text>
          <Switch
            value={notificacoesAtivas}
            onValueChange={setNotificacoesAtivas}
            trackColor={{ true: cores.magenta, false: cores.textoSecundario }}
          />
        </View>

        <Pressable style={estilos.item} onPress={() => router.push("/sobre-nos" as Href)}>
          <Text style={estilos.itemTexto}>Sobre o MERUEM.INC</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>

        <Pressable style={estilos.botaoSair} onPress={sair}>
          <Text style={estilos.botaoSairTexto}>SAIR DA CONTA</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    paddingHorizontal: espacamento.lg,
  },
  titulo: {
    color: cores.verdeEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.lg,
  },
  item: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: espacamento.sm,
    ...sombra,
  },
  itemTexto: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.md,
    fontWeight: "600",
  },
  itemSeta: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.lg,
  },
  botaoSair: {
    borderWidth: 2,
    borderColor: cores.erro,
    borderRadius: raio.pill,
    paddingVertical: espacamento.sm,
    alignItems: "center",
    marginTop: espacamento.lg,
  },
  botaoSairTexto: {
    color: cores.erro,
    fontWeight: "800",
  },
});
