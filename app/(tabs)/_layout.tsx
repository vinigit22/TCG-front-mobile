import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "../../src/constants/colors";

function IconeAba({ simbolo }: { simbolo: string }) {
  return <Text style={{ fontSize: 20 }}>{simbolo}</Text>;
}

export default function LayoutAbas() {
  const insets = useSafeAreaInsets();
  const alturaBase = 62;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.magenta,
        tabBarInactiveTintColor: cores.fundoClaro,
        tabBarStyle: {
          backgroundColor: cores.roxo,
          borderTopWidth: 0,
          height: alturaBase + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 7,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: () => <IconeAba simbolo="🏠" /> }} />
      <Tabs.Screen name="torneios" options={{ title: "Torneios", tabBarIcon: () => <IconeAba simbolo="🏆" /> }} />
      <Tabs.Screen name="notificacoes" options={{ title: "Notificações", tabBarIcon: () => <IconeAba simbolo="🔔" /> }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: () => <IconeAba simbolo="👤" /> }} />
    </Tabs>
  );
}
