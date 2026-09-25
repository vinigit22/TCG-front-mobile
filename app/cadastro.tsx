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

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cadastrar, erro } = useAuth();
  const [nome, setNome] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  async function aoCadastrar() {
    if (!nome.trim() || !nickname.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErroValidacao("Preencha todos os campos.");
      return;
    }
    if (!REGEX_EMAIL.test(email.trim())) {
      setErroValidacao("Informe um email válido.");
      return;
    }
    if (senha.length < 6) {
      setErroValidacao("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErroValidacao("As senhas não coincidem.");
      return;
    }

    setErroValidacao(null);
    setCarregando(true);
    try {
      await cadastrar({ nome: nome.trim(), nickname: nickname.trim(), email: email.trim(), senha });
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
        <Text style={estilos.titulo}>Criar conta</Text>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Nome</Text>
          <TextInput style={estilos.input} value={nome} onChangeText={setNome} placeholder="Seu nome" placeholderTextColor={cores.textoSecundario} />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Nickname</Text>
          <TextInput style={estilos.input} value={nickname} onChangeText={setNickname} autoCapitalize="none" placeholder="seunickname" placeholderTextColor={cores.textoSecundario} />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Email</Text>
          <TextInput style={estilos.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="seuemail@exemplo.com" placeholderTextColor={cores.textoSecundario} />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput style={estilos.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••••" placeholderTextColor={cores.textoSecundario} />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Confirmar senha</Text>
          <TextInput style={estilos.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry placeholder="••••••••" placeholderTextColor={cores.textoSecundario} />
        </View>

        {erroValidacao || erro ? (
          <Text style={estilos.erro}>{erroValidacao ?? erro}</Text>
        ) : null}

        <Pressable style={estilos.botao} onPress={aoCadastrar} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={cores.textoClaro} />
          ) : (
            <Text style={estilos.botaoTexto}>CADASTRAR</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace("/login")}>
          <Text style={estilos.link}>Já possui conta? Entrar</Text>
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
    flexGrow: 1,
    justifyContent: "center",
  },
  titulo: {
    color: cores.magenta,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
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