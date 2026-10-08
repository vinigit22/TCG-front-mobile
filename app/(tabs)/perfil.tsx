import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/authContext";
import { montarUrlImagem } from "../../src/services/api";
import { jogadorService } from "../../src/services/jogadorService";
import { EstatisticasJogador } from "../../src/models/types";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../../src/constants/theme";

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, autenticado, logout } = useAuth();

  const [bio, setBio] = useState<string>("");
  const [trofeus, setTrofeus] = useState<EstatisticasJogador | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Recarrega bio e troféus sempre que a aba ganha foco (inclusive após editar)
  useFocusEffect(
    useCallback(() => {
      if (!autenticado || !usuario) return;
      setCarregando(true);
      Promise.all([
        jogadorService.buscarBio(),
        jogadorService.buscarTrofeus(usuario.id),
      ])
        .then(([bioAtual, trofeusAtuais]) => {
          setBio(bioAtual);
          setTrofeus(trofeusAtuais);
        })
        .catch(() => undefined)
        .finally(() => setCarregando(false));
    }, [autenticado, usuario])
  );

  if (!autenticado || !usuario) {
    return (
      <View style={[estilos.deslogado, { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.lg }]}>
        <Text style={estilos.deslogadoTitulo}>Entre para ver seu perfil</Text>
        <Text style={estilos.deslogadoTexto}>
          Acompanhe seus torneios, troféus e estatísticas fazendo login na sua conta.
        </Text>
        <Pressable style={estilos.botaoEntrar} onPress={() => router.push("/login")}>
          <Text style={estilos.botaoEntrarTexto}>ENTRAR</Text>
        </Pressable>
      </View>
    );
  }

  const foto = montarUrlImagem(usuario.imagemPerfil);
  const iniciais = (usuario.nickname || usuario.nome || "?").trim().slice(0, 2).toUpperCase() || "?";

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={[estilos.conteudo, { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho: avatar + dados */}
      <Pressable onPress={() => router.push("/editar-perfil")} style={estilos.avatarToque}>
        {foto ? (
          <Image source={{ uri: foto }} style={estilos.avatarImagem} />
        ) : (
          <View style={estilos.avatar}>
            <Text style={estilos.avatarTexto}>{iniciais}</Text>
          </View>
        )}
        <View style={estilos.avatarEditarSelo}>
          <Text style={estilos.avatarEditarTexto}>✎</Text>
        </View>
      </Pressable>

      <Text style={estilos.nome}>{usuario.nome}</Text>
      {usuario.nickname ? <Text style={estilos.nickname}>@{usuario.nickname}</Text> : null}
      <Text style={estilos.email}>{usuario.email}</Text>

      {/* Bio */}
      {carregando ? (
        <ActivityIndicator color={cores.roxo} style={{ marginVertical: espacamento.md }} />
      ) : bio ? (
        <Text style={estilos.bio}>{bio}</Text>
      ) : null}

      {/* Troféus */}
      {trofeus !== null ? (
        <View style={estilos.trofeusCard}>
          <Text style={estilos.trofeusTitle}>Conquistas</Text>
          <View style={estilos.trofeusLinha}>
            <View style={estilos.trofeusItem}>
              <Text style={estilos.trofeusIcone}>🥇</Text>
              <Text style={estilos.trofeusNumero}>{trofeus.ouro}</Text>
              <Text style={estilos.trofeusRotulo}>Ouro</Text>
            </View>
            <View style={estilos.trofeusDivisor} />
            <View style={estilos.trofeusItem}>
              <Text style={estilos.trofeusIcone}>🥈</Text>
              <Text style={estilos.trofeusNumero}>{trofeus.prata}</Text>
              <Text style={estilos.trofeusRotulo}>Prata</Text>
            </View>
            <View style={estilos.trofeusDivisor} />
            <View style={estilos.trofeusItem}>
              <Text style={estilos.trofeusIcone}>🥉</Text>
              <Text style={estilos.trofeusNumero}>{trofeus.bronze}</Text>
              <Text style={estilos.trofeusRotulo}>Bronze</Text>
            </View>
            <View style={estilos.trofeusDivisor} />
            <View style={estilos.trofeusItem}>
              <Text style={estilos.trofeusIcone}>🏆</Text>
              <Text style={estilos.trofeusNumero}>{trofeus.torneiosDisputados}</Text>
              <Text style={estilos.trofeusRotulo}>Torneios</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Menu */}
      <View style={estilos.menu}>
        <Pressable style={estilos.item} onPress={() => router.push("/meus-torneios")}>
          <Text style={estilos.itemTexto}>Meus torneios</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>
        <Pressable style={estilos.item} onPress={() => router.push("/deck")}>
          <Text style={estilos.itemTexto}>Meu deck</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>
        <Pressable style={estilos.item} onPress={() => router.push("/configuracoes")}>
          <Text style={estilos.itemTexto}>⚙ Configurações</Text>
          <Text style={estilos.itemSeta}>›</Text>
        </Pressable>
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

  // Avatar
  avatarToque: { marginBottom: espacamento.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.roxo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImagem: { width: 88, height: 88, borderRadius: 44 },
  avatarEditarSelo: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: cores.roxo,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: cores.fundo,
  },
  avatarEditarTexto: { color: cores.textoClaro, fontSize: 13, fontWeight: "900" },
  avatarTexto: { color: cores.textoClaro, fontSize: tamanhoFonte.xl, fontWeight: "900" },

  // Dados
  nome: { color: cores.textoEscuro, fontSize: tamanhoFonte.lg, fontWeight: "800" },
  nickname: { color: cores.roxo, fontSize: tamanhoFonte.sm, fontWeight: "700", marginTop: 2 },
  email: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, marginTop: espacamento.xs },
  bio: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    textAlign: "center",
    lineHeight: 20,
    marginTop: espacamento.md,
    paddingHorizontal: espacamento.sm,
  },

  // Troféus
  trofeusCard: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamento.md,
    marginTop: espacamento.lg,
    ...sombra,
  },
  trofeusTitle: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    marginBottom: espacamento.md,
  },
  trofeusLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trofeusItem: { flex: 1, alignItems: "center", gap: 4 },
  trofeusDivisor: { width: 1, height: 40, backgroundColor: cores.borda },
  trofeusIcone: { fontSize: 22 },
  trofeusNumero: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "800",
    lineHeight: tamanhoFonte.lg + 4,
  },
  trofeusRotulo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    fontWeight: "600",
  },

  // Menu
  menu: { width: "100%", gap: espacamento.sm, marginTop: espacamento.lg },
  item: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    paddingHorizontal: espacamento.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  itemTexto: { color: cores.textoEscuro, fontSize: tamanhoFonte.md, fontWeight: "600" },
  itemSeta: { color: cores.textoSecundario, fontSize: tamanhoFonte.lg },

  botaoSair: {
    marginTop: espacamento.xl,
    borderWidth: 1,
    borderColor: cores.erro,
    borderRadius: raio.md,
    paddingVertical: espacamento.sm,
    paddingHorizontal: espacamento.xl,
  },
  botaoSairTexto: { color: cores.erro, fontWeight: "800" },

  // Deslogado
  deslogado: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacamento.xl,
  },
  deslogadoTitulo: { color: cores.textoEscuro, fontSize: tamanhoFonte.lg, fontWeight: "800", marginBottom: espacamento.sm, textAlign: "center" },
  deslogadoTexto: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, textAlign: "center", marginBottom: espacamento.lg },
  botaoEntrar: { backgroundColor: cores.roxo, borderRadius: raio.md, paddingVertical: espacamento.md, paddingHorizontal: espacamento.xl },
  botaoEntrarTexto: { color: cores.textoClaro, fontWeight: "800" },
});
