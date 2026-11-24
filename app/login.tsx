import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { cores, paleta } from "../src/constants/colors";
import { espacamento, fontes, raio, tamanhoFonte, tipografia } from "../src/constants/theme";
import { Botao } from "../src/components/ui/Botao";
import { Campo } from "../src/components/ui/Campo";
import { Capa } from "../src/components/ui/Capa";
import { Faixa } from "../src/components/ui/Faixa";

const VANTAGENS = ["Inscrição nos torneios das lojas", "Check-in na mesa e chave ao vivo", "Troféus e histórico de partidas"];

// Como o login do site: painel roxo-noite com as vantagens e o formulário logo abaixo
export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, erro, limparErro } = useAuth();

  // O erro fica no contexto: sem limpar, o erro de uma tentativa anterior (ou da outra tela) apareceria aqui
  useEffect(() => {
    limparErro();
  }, [limparErro]);

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

  const mensagemErro = erroValidacao ?? erro;

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + espacamento.xl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Capa fallback="/(tabs)" estilo={estilos.capa}>
          <Text style={tipografia.kicker}>APP DO JOGADOR</Text>
          <Text style={estilos.capaTitulo}>Seus torneios no bolso.</Text>
          <View style={estilos.vantagens}>
            {VANTAGENS.map((vantagem) => (
              <View key={vantagem} style={estilos.vantagem}>
                <View style={estilos.losango} />
                <Text style={estilos.vantagemTexto}>{vantagem}</Text>
              </View>
            ))}
          </View>
        </Capa>

        <View style={estilos.folha}>
          <Text accessibilityRole="header" style={estilos.titulo}>ACESSAR</Text>
          <Text style={estilos.subtitulo}>Entre com a sua conta de jogador.</Text>

          <View style={estilos.campos}>
            <Campo
              rotulo="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="seuemail@exemplo.com"
            />
            <Campo
              rotulo="Senha"
              value={senha}
              onChangeText={setSenha}
              senha
              autoComplete="current-password"
              placeholder="••••••••"
              onSubmitEditing={aoEntrar}
              returnKeyType="go"
            />
          </View>

          {mensagemErro ? <Faixa tom="vermelho" texto={mensagemErro} estilo={estilos.erro} /> : null}

          <Pressable onPress={() => router.push("/esqueci-senha")} accessibilityRole="link" style={estilos.esqueci}>
            <Text style={estilos.linkDestaque}>Esqueci minha senha</Text>
          </Pressable>

          <Botao titulo="Entrar" tamanho="lg" larguraTotal carregando={carregando} aoPressionar={aoEntrar} />

          <Pressable onPress={() => router.replace("/cadastro")} accessibilityRole="link" style={estilos.link}>
            <Text style={estilos.linkTexto}>
              Não possui conta? <Text style={estilos.linkDestaque}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.superficie,
  },
  capa: {
    paddingBottom: espacamento.lg,
  },
  capaTitulo: {
    marginTop: espacamento.sm,
    fontFamily: fontes.extrabold,
    fontSize: tamanhoFonte.xxl,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: cores.textoInverso,
  },
  vantagens: {
    gap: 10,
    marginTop: espacamento.md,
  },
  vantagem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // O losango verde da lista do login do site
  losango: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: paleta.verde[400],
    transform: [{ rotate: "45deg" }],
  },
  vantagemTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.md,
    color: paleta.tinta[300],
  },
  // Folha branca que sobe por cima da capa
  folha: {
    flexGrow: 1,
    marginTop: -espacamento.lg,
    paddingHorizontal: espacamento.lg,
    paddingTop: espacamento.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: cores.superficie,
  },
  titulo: {
    fontFamily: fontes.marca,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 1.6,
    color: paleta.roxo[900],
  },
  subtitulo: {
    marginTop: 4,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.md,
    color: cores.texto3,
  },
  campos: {
    gap: espacamento.md,
    marginTop: espacamento.lg,
    marginBottom: espacamento.lg,
  },
  erro: {
    marginTop: -espacamento.sm,
    marginBottom: espacamento.md,
  },
  esqueci: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    marginTop: -espacamento.sm,
    marginBottom: espacamento.md,
    borderRadius: raio.sm,
  },
  link: {
    alignSelf: "center",
    paddingVertical: espacamento.sm,
    marginTop: espacamento.md,
    borderRadius: raio.sm,
  },
  linkTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.md,
    color: cores.texto3,
  },
  linkDestaque: {
    fontFamily: fontes.bold,
    color: paleta.roxo[600],
  },
});
