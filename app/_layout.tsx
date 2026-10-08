import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Bungee_400Regular } from "@expo-google-fonts/bungee";
import { AuthProvider } from "../src/context/authContext";
import { NotificacaoProvider } from "../src/context/notificacaoContext";
import { InscricoesProvider } from "../src/context/inscricoesContext";
import { cores } from "../src/constants/colors";

SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Bungee_400Regular,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InscricoesProvider>
          <NotificacaoProvider>
            {/* Home troca para ícones claros por causa do cabeçalho escuro */}
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
