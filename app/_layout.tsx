import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/authContext";
import { NotificacaoProvider } from "../src/context/notificacaoContext";
import { cores } from "../src/constants/colors";

export default function LayoutRaiz() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificacaoProvider>
          <StatusBar style="light" />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: cores.fundo,
              },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="torneio/[id]/index" />
            <Stack.Screen name="torneio/[id]/chaveamento" />
            <Stack.Screen name="torneio/[id]/confronto" />
            <Stack.Screen name="meus-torneios" />
            <Stack.Screen name="deck" />
            <Stack.Screen
              name="login"
              options={{
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="cadastro"
              options={{
                presentation: "modal",
              }}
            />
          </Stack>
        </NotificacaoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}