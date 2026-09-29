import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "../../src/constants/colors";
import { useAuth } from "../../src/context/authContext";

function IconePerfilAba() {
  const { usuario } = useAuth();
  if (usuario?.foto) return <Image source={{ uri: usuario.foto }} style={estilos.avatarAba} />;
  return <Ionicons name="person-outline" size={22} color={cores.fundoClaro} />;
}

export default function LayoutAbas() {
  const insets = useSafeAreaInsets();
  const alturaBase = 62;

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: cores.magenta, tabBarInactiveTintColor: cores.fundoClaro, tabBarStyle: { backgroundColor: cores.roxo, borderTopWidth: 0, height: alturaBase + insets.bottom, paddingBottom: Math.max(insets.bottom, 8), paddingTop: 7 }, tabBarLabelStyle: { fontSize: 11, fontWeight: "700" } }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="torneios" options={{ title: "Torneios", tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="notificacoes" options={{ title: "Notificações", tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: () => <IconePerfilAba /> }} />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  avatarAba: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: cores.fundoClaro },
});
