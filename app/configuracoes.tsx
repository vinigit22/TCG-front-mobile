import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { CHAVE_PREFERENCIA_PUSH } from "../src/constants/storage";
import { cores } from "../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function Configuracoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  // A escolha fica guardada no aparelho; o envio de push ainda não existe no backend
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_PREFERENCIA_PUSH)
      .then((valor) => {
        if (valor !== null) setNotificacoesAtivas(valor === "true");
      })
      .catch(() => undefined);
  }, []);

  function alterarNotificacoes(valor: boolean) {
    setNotificacoesAtivas(valor);
    AsyncStorage.setItem(CHAVE_PREFERENCIA_PUSH, String(valor)).catch(() => undefined);
  }

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
          <View>
            <Text style={estilos.itemTexto}>Notificações push</Text>
            <Text style={estilos.itemDetalhe}>Em breve</Text>
          </View>
          <Switch
            value={notificacoesAtivas}
            onValueChange={alterarNotificacoes}
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
  itemDetalhe: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    marginTop: 2,
  },
  itemSeta: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.lg,
  },
  botaoSair: {
    borderWidth: 1,
    borderColor: cores.erro,
    borderRadius: raio.md,
    paddingVertical: espacamento.sm,
    alignItems: "center",
    marginTop: espacamento.lg,
  },
  botaoSairTexto: {
    color: cores.erro,
    fontWeight: "800",
  },
});
