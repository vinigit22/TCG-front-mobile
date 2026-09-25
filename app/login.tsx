import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { cores } from "../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, erro } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  async function aoEntrar() {
    if (!email.trim() || !senha.trim()) {
      setErroValidacao("Preencha email e senha.");
      return;
    }

    setErroValidacao(null);
    setCarregando(true);
    try {
      await login({ email: email.trim(), senha });
      router.back();
    } catch {
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <BotaoVoltar fallback="/(tabs)" />
      <ScrollView
        contentContainerStyle={[estilos.conteudo, { paddingBottom: insets.bottom + espacamento.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo}>MERUEM.INC</Text>
        <Text style={estilos.subtitulo}>Entre na sua conta</Text>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Email</Text>
          <TextInput
            style={estilos.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={cores.textoSecundario}
          />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput
            style={estilos.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={cores.textoSecundario}
          />
        </View>

        {erroValidacao || erro ? (
          <Text style={estilos.erro}>{erroValidacao ?? erro}</Text>
        ) : null}

        <Pressable style={estilos.botao} onPress={aoEntrar} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={cores.textoClaro} />
          ) : (
            <Text style={estilos.botaoTexto}>ENTRAR</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace("/cadastro")}>
          <Text style={estilos.link}>Não possui conta? Cadastre-se</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espacamento.lg,
    justifyContent: "center",
    flexGrow: 1,
  },
  titulo: {
    color: cores.magenta,
    fontSize: tamanhoFonte.xxl,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
    marginBottom: espacamento.xl,
  },
  campo: {
    marginBottom: espacamento.md,
  },
  rotulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    marginBottom: espacamento.xs,
  },
  input: {
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: espacamento.md,
    paddingVertical: espacamento.sm,
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.md,
  },
  erro: {
    color: cores.erro,
    fontSize: tamanhoFonte.sm,
    marginBottom: espacamento.md,
    textAlign: "center",
  },
  botao: {
    backgroundColor: cores.roxo,
    borderRadius: raio.pill,
    paddingVertical: espacamento.md,
    alignItems: "center",
    marginTop: espacamento.sm,
    marginBottom: espacamento.lg,
  },
  botaoTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.md,
  },
  link: {
    color: cores.magenta,
    textAlign: "center",
    fontWeight: "700",
  },
});