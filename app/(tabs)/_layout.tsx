import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ColorValue, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, paleta, sobreNoite } from "../../src/constants/colors";
import { fontes } from "../../src/constants/theme";
import { useAuth } from "../../src/context/authContext";
import { useNotificacoes } from "../../src/context/notificacaoContext";
import { montarUrlImagem } from "../../src/services/api";

type NomeIcone = keyof typeof Ionicons.glyphMap;

function icone(nome: string) {
  return function IconeAba({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={(focused ? nome : `${nome}-outline`) as NomeIcone} size={22} color={color as string} />;
  };
}

function IconePerfilAba({ color, focused }: { color: ColorValue; focused: boolean }) {
  const { usuario } = useAuth();
  const foto = montarUrlImagem(usuario?.imagemPerfil);
  if (foto) return <Image source={{ uri: foto }} style={[estilos.avatarAba, { borderColor: color as string }]} />;
  return <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color as string} />;
}

// Barra de abas com a cara da navbar do site: fundo roxo-noite, rótulos em Bungee, ativo em verde-menta
export default function LayoutAbas() {
  const insets = useSafeAreaInsets();
  const { quantidadeNaoLidas } = useNotificacoes();
  const alturaBase = 62;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: sobreNoite.destaque,
        tabBarInactiveTintColor: paleta.tinta[400],
        tabBarStyle: {
          backgroundColor: cores.noite,
          borderTopWidth: 1,
          borderTopColor: sobreNoite.borda,
          height: alturaBase + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 7,
        },
        tabBarLabelStyle: estilos.rotulo,
        tabBarBadgeStyle: estilos.contador,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Descobrir", tabBarIcon: icone("compass") }} />
      <Tabs.Screen name="torneios" options={{ title: "Torneios", tabBarIcon: icone("trophy") }} />
      <Tabs.Screen name="eventos" options={{ title: "Eventos", tabBarIcon: icone("calendar") }} />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: "Avisos",
          tabBarIcon: icone("notifications"),
          tabBarBadge: quantidadeNaoLidas > 0 ? (quantidadeNaoLidas > 9 ? "9+" : quantidadeNaoLidas) : undefined,
        }}
      />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: IconePerfilAba }} />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  rotulo: {
    fontFamily: fontes.marca,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  contador: {
    backgroundColor: paleta.verde[400],
    color: paleta.verde[950],
    fontFamily: fontes.bold,
    fontSize: 10,
  },
  avatarAba: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5 },
});
