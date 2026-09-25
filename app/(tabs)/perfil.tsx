import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/authContext";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../../src/constants/theme";

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, autenticado, logout } = useAuth();
  const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false);

  if (!autenticado || !usuario) {
    return (
      <View style={[estilos.deslogadoContainer, { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.lg }]}>
        <Text style={estilos.deslogadoTitulo}>Entre para ver seu perfil</Text>
        <Text style={estilos.deslogadoTexto}>
          Acompanhe seus torneios, deck e estatísticas fazendo login na sua conta.
        </Text>
        <Pressable style={estilos.botaoEntrar} onPress={() => router.push("/login")}>
          <Text style={estilos.botaoEntrarTexto}>ENTRAR</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={[
        estilos.conteudo,
        { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.avatar}>
        <Text style={estilos.avatarTexto}>
          {(usuario.nickname ?? usuario.nome).slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text style={estilos.nome}>{usuario.nome}</Text>
      {usuario.nickname ? <Text style={estilos.nickname}>@{usuario.nickname}</Text> : null}
      <Text style={estilos.email}>{usuario.email}</Text>

      <View style={estilos.acoes}>
        <Pressable style={estilos.item} onPress={() => router.push("/meus-torneios")}>
          <Text style={estilos.itemTexto}>Meus torneios</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>
        <Pressable style={estilos.item} onPress={() => router.push("/deck")}>
          <Text style={estilos.itemTexto}>Meu deck</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>
        <Pressable style={estilos.item} onPress={() => setConfiguracoesAbertas((aberto) => !aberto)}>
          <Text style={estilos.itemTexto}>⚙ Configurações</Text>
          <Text style={estilos.itemSeta}>{configuracoesAbertas ? "⌃" : "›"}</Text>
        </Pressable>

        {configuracoesAbertas ? (
          <View style={estilos.painelConfiguracoes}>
            <Pressable style={estilos.configItem} onPress={() => {}}>
              <Text style={estilos.configTitulo}>Editar perfil</Text>
              <Text style={estilos.configDescricao}>Alterar suas informações pessoais.</Text>
            </Pressable>
            <Pressable style={estilos.configItem} onPress={() => {}}>
              <Text style={estilos.configTitulo}>Notificações</Text>
              <Text style={estilos.configDescricao}>Preferências de avisos do aplicativo.</Text>
            </Pressable>
            <View style={estilos.configItem}>
              <Text style={estilos.configTitulo}>Sobre o MERUEM.INC</Text>
              <Text style={estilos.configDescricao}>Aplicativo para acompanhamento de eventos e torneios de TCG.</Text>
            </View>
          </View>
        ) : null}
      </View>

      <Pressable style={estilos.botaoSair} onPress={logout}>
        <Text style={estilos.botaoSairTexto}>SAIR</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { alignItems: "center", paddingHorizontal: espacamento.lg },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.roxo,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espacamento.md,
  },
  avatarTexto: { color: cores.textoClaro, fontSize: tamanhoFonte.xl, fontWeight: "900" },
  nome: { color: cores.textoEscuro, fontSize: tamanhoFonte.lg, fontWeight: "800" },
  nickname: { color: cores.magenta, fontSize: tamanhoFonte.sm, fontWeight: "700", marginTop: 2 },
  email: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, marginTop: espacamento.xs, marginBottom: espacamento.lg },
  acoes: { width: "100%", gap: espacamento.sm },
  item: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...sombra,
  },
  itemTexto: { color: cores.textoEscuro, fontSize: tamanhoFonte.md, fontWeight: "600" },
  itemSeta: { color: cores.textoSecundario, fontSize: tamanhoFonte.lg },
  painelConfiguracoes: {
    width: "100%",
    backgroundColor: cores.fundoClaro,
    borderRadius: raio.md,
    padding: espacamento.sm,
    borderWidth: 1,
    borderColor: cores.verdeEscuro,
  },
  configItem: { padding: espacamento.sm },
  configTitulo: { color: cores.verdeEscuro, fontSize: tamanhoFonte.sm, fontWeight: "800" },
  configDescricao: { color: cores.textoSecundario, fontSize: tamanhoFonte.xs, marginTop: 3 },
  botaoSair: {
    marginTop: espacamento.xl,
    borderWidth: 2,
    borderColor: cores.erro,
    borderRadius: raio.pill,
    paddingVertical: espacamento.sm,
    paddingHorizontal: espacamento.xl,
  },
  botaoSairTexto: { color: cores.erro, fontWeight: "800" },
  deslogadoContainer: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacamento.xl,
  },
  deslogadoTitulo: { color: cores.verdeEscuro, fontSize: tamanhoFonte.lg, fontWeight: "800", marginBottom: espacamento.sm, textAlign: "center" },
  deslogadoTexto: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, textAlign: "center", marginBottom: espacamento.lg },
  botaoEntrar: { backgroundColor: cores.magenta, borderRadius: raio.pill, paddingVertical: espacamento.md, paddingHorizontal: espacamento.xl },
  botaoEntrarTexto: { color: cores.textoClaro, fontWeight: "800" },
});
