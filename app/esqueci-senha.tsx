import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, paleta } from "../src/constants/colors";
import { espacamento, fontes, raio, tamanhoFonte, tipografia } from "../src/constants/theme";
import { Botao } from "../src/components/ui/Botao";
import { Campo } from "../src/components/ui/Campo";
import { Capa } from "../src/components/ui/Capa";
import { Faixa } from "../src/components/ui/Faixa";
import { authService, mensagemErroAuth } from "../src/services/authService";

type Etapa = "email" | "codigo" | "pronto";

// Duas etapas na mesma tela:
//  1) o jogador informa o email e a API envia o código (POST /auth/esqueci-senha)
//  2) ele cola o código do email e escolhe a nova senha (POST /auth/redefinir-senha)
export default function EsqueciSenha() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [etapa, setEtapa] = useState<Etapa>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviarEmail() {
    if (!email.trim()) {
      setErro("Informe o seu email.");
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await authService.esqueciSenha(email.trim());
      setEtapa("codigo");
    } catch (e) {
      setErro(mensagemErroAuth(e, "esqueci-senha"));
    } finally {
      setCarregando(false);
    }
  }

  async function aoRedefinir() {
    if (!codigo.trim()) {
      setErro("Cole o código que chegou no seu email.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      setErro("As senhas não conferem.");
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await authService.redefinirSenha(codigo, novaSenha);
      setEtapa("pronto");
    } catch (e) {
      setErro(mensagemErroAuth(e, "redefinir-senha"));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={estilos.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + espacamento.xl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Capa fallback="/login" estilo={estilos.capa}>
          <Text style={tipografia.kicker}>APP DO JOGADOR</Text>
          <Text style={estilos.capaTitulo}>Recupere o seu acesso.</Text>
        </Capa>

        <View style={estilos.folha}>
          <Text accessibilityRole="header" style={estilos.titulo}>
            {etapa === "pronto" ? "SENHA NOVA" : "ESQUECI A SENHA"}
          </Text>

          {etapa === "email" ? (
            <>
              <Text style={estilos.subtitulo}>
                Informe o email da sua conta. Se ele estiver cadastrado, enviamos um código para redefinir a senha.
              </Text>

              <View style={estilos.campos}>
                <Campo
                  rotulo="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="seuemail@exemplo.com"
                  onSubmitEditing={aoEnviarEmail}
                  returnKeyType="send"
                />
              </View>

              {erro ? <Faixa tom="vermelho" texto={erro} estilo={estilos.faixa} /> : null}

              <Botao titulo="Enviar código" tamanho="lg" larguraTotal carregando={carregando} aoPressionar={aoEnviarEmail} />

              <Pressable onPress={() => setEtapa("codigo")} accessibilityRole="link" style={estilos.link}>
                <Text style={estilos.linkTexto}>
                  Já tenho um código? <Text style={estilos.linkDestaque}>Informar código</Text>
                </Text>
              </Pressable>
            </>
          ) : null}

          {etapa === "codigo" ? (
            <>
              <Faixa
                tom="verde"
                texto="Se o email estiver cadastrado, o código já está a caminho. Ele vale por 30 minutos."
                estilo={estilos.faixa}
              />

              <View style={estilos.campos}>
                <Campo
                  rotulo="Código do email"
                  value={codigo}
                  onChangeText={setCodigo}
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  numberOfLines={3}
                  placeholder="Cole aqui o código inteiro"
                />
                <Campo
                  rotulo="Nova senha"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  senha
                  autoComplete="new-password"
                  placeholder="••••••••"
                  ajuda="Mínimo de 6 caracteres."
                />
                <Campo
                  rotulo="Confirme a nova senha"
                  value={confirmacao}
                  onChangeText={setConfirmacao}
                  senha
                  autoComplete="new-password"
                  placeholder="••••••••"
                  onSubmitEditing={aoRedefinir}
                  returnKeyType="go"
                />
              </View>

              {erro ? <Faixa tom="vermelho" texto={erro} estilo={estilos.faixa} /> : null}

              <Botao titulo="Redefinir senha" tamanho="lg" larguraTotal carregando={carregando} aoPressionar={aoRedefinir} />

              <Pressable
                onPress={() => {
                  setErro(null);
                  setEtapa("email");
                }}
                accessibilityRole="link"
                style={estilos.link}
              >
                <Text style={estilos.linkTexto}>
                  Não chegou? <Text style={estilos.linkDestaque}>Pedir um novo código</Text>
                </Text>
              </Pressable>
            </>
          ) : null}

          {etapa === "pronto" ? (
            <>
              <Faixa tom="verde" texto="Senha alterada com sucesso. Entre com a nova senha." estilo={estilos.faixa} />
              <Botao titulo="Ir para o login" tamanho="lg" larguraTotal aoPressionar={() => router.replace("/login")} />
            </>
          ) : null}
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
  faixa: {
    marginTop: espacamento.md,
    marginBottom: espacamento.md,
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
