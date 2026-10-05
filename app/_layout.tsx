import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/authContext";
import { NotificacaoProvider } from "../src/context/notificacaoContext";
import { InscricoesProvider } from "../src/context/inscricoesContext";
import { cores } from "../src/constants/colors";

export default function LayoutRaiz() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InscricoesProvider>
          <NotificacaoProvider>
          {/* Ícones escuros sobre o fundo claro; a Home troca para claros por causa do cabeçalho escuro */}
          <StatusBar style="dark" />

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
            <Stack.Screen name="configuracoes" />
            <Stack.Screen name="sobre-nos" />
            <Stack.Screen name="editar-perfil" />
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
        </InscricoesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
