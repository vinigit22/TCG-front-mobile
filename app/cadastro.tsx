import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import { espacamento, fontes, raio, sombras, tamanhoFonte } from "../src/constants/theme";
import { dataParaIso, ehMenorDeIdade, mascararData } from "../src/utils/idade";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { TermosDeUso } from "../src/components/TermosDeUso";
import { PoliticaDePrivacidade } from "../src/components/PoliticaDePrivacidade";
import { Botao } from "../src/components/ui/Botao";
import { Campo } from "../src/components/ui/Campo";
import { Brilho } from "../src/components/ui/Capa";
import { Degrade } from "../src/components/ui/Degrade";
import { Faixa } from "../src/components/ui/Faixa";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Como o cadastro do site: cartão branco com a barra roxo -> verde no topo e o botão verde
export default function Cadastro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cadastrar, erro, limparErro } = useAuth();

  // O erro fica no contexto: sem limpar, o erro de uma tentativa anterior (ou da outra tela) apareceria aqui
  useEffect(() => {
    limparErro();
  }, [limparErro]);

  const [nome, setNome] = useState("");
  const [nickname, setNickname] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [termosAbertos, setTermosAbertos] = useState(false);
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);
  const [privacidadeAberta, setPrivacidadeAberta] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const dataIso = dataParaIso(dataNascimento);
  const dataInvalida = dataNascimento.length === 10 && !dataIso;
  const menorDeIdade = ehMenorDeIdade(dataIso);

  async function aoCadastrar() {
    if (!nome.trim() || !nickname.trim() || !dataNascimento || !email.trim() || !senha || !confirmarSenha) {
      setErroValidacao("Preencha todos os campos.");
      return;
    }
    if (!dataIso) {
      setErroValidacao("Informe uma data de nascimento válida (dd/mm/aaaa).");
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

    if (!aceitouTermos || !aceitouPrivacidade) {
      setErroValidacao("Leia e aceite os Termos de Uso e a Pol\u00edtica de Privacidade para continuar.");
      return;
    }

    setErroValidacao(null);
    setCarregando(true);
    try {
      await cadastrar({
        nome: nome.trim(),
        nickname: nickname.trim(),
        email: email.trim(),
        senha,
        dataNascimento: dataIso,
      });
      router.back();
    } catch {
    } finally {
      setCarregando(false);
    }
  }

  function aoConcordar() {
    setAceitouTermos(true);
    setTermosAbertos(false);
  }

  function aoConcordarComPrivacidade() {
    setAceitouPrivacidade(true);
    setPrivacidadeAberta(false);
  }

  const mensagemErro = erroValidacao ?? erro;

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Os dois brilhos suaves do fundo da página de cadastro do site */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Brilho cor={paleta.roxo[200]} tamanho={420} intensidade={0.9} posicao={{ top: -200, right: -180 }} />
        <Brilho cor={paleta.verde[200]} tamanho={380} intensidade={0.8} posicao={{ bottom: -200, left: -180 }} />
      </View>

      <BotaoVoltar fallback="/(tabs)" />
      <ScrollView
        contentContainerStyle={[estilos.conteudo, { paddingBottom: insets.bottom + espacamento.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cartao}>
          <Degrade horizontal faixas={24} estilo={estilos.barra} />

          <Text accessibilityRole="header" style={estilos.titulo}>CRIAR CONTA</Text>
          <Text style={estilos.subtitulo}>Cadastre-se para entrar nos torneios das lojas.</Text>

          <View style={estilos.campos}>
            <Campo rotulo="Nome" value={nome} onChangeText={setNome} autoComplete="name" placeholder="Seu nome" />
            <Campo
              rotulo="Nickname"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              placeholder="seunickname"
              ajuda="É o nome que aparece na chave do torneio."
            />
            <Campo
              rotulo="Data de nascimento"
              value={dataNascimento}
              onChangeText={(texto) => setDataNascimento(mascararData(texto))}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="dd/mm/aaaa"
              erro={dataInvalida ? "Informe uma data válida." : null}
            />
            {menorDeIdade ? (
              <Faixa
                tom="vermelho"
                titulo="Menor de 18 anos."
                texto="Toda vez que for participar de um torneio, será necessária a autorização dos seus pais ou responsáveis."
              />
            ) : null}
            <Campo
              rotulo="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="seuemail@exemplo.com"
            />
            <Campo rotulo="Senha" value={senha} onChangeText={setSenha} senha autoComplete="new-password" placeholder="Pelo menos 6 caracteres" />
            <Campo rotulo="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} senha autoComplete="new-password" placeholder="Repita a senha" />
          </View>

          <View style={[estilos.termos, aceitouTermos && estilos.termosAceitos]}>
            <Pressable
              onPress={() => setAceitouTermos((aceitou) => !aceitou)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: aceitouTermos }}
              accessibilityLabel="Aceitar os termos de uso"
              style={[estilos.caixaAceite, aceitouTermos && estilos.caixaAceiteMarcada]}
            >
              {aceitouTermos ? <Ionicons name="checkmark" size={18} color={cores.superficie} /> : null}
            </Pressable>
            <Pressable onPress={() => setTermosAbertos(true)} accessibilityRole="link" style={estilos.termosLeitura}>
              <Text style={estilos.termosTitulo}>Termos de uso</Text>
              <Text style={estilos.termosInfo}>Toque aqui para ler o documento.</Text>
            </Pressable>
          </View>

          <View style={[estilos.termos, aceitouPrivacidade && estilos.termosAceitos]}>
            <Pressable
              onPress={() => setAceitouPrivacidade((aceitou) => !aceitou)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: aceitouPrivacidade }}
              accessibilityLabel={"Aceitar a Pol\u00edtica de Privacidade"}
              style={[estilos.caixaAceite, aceitouPrivacidade && estilos.caixaAceiteMarcada]}
            >
              {aceitouPrivacidade ? <Ionicons name="checkmark" size={18} color={cores.superficie} /> : null}
            </Pressable>
            <Pressable onPress={() => setPrivacidadeAberta(true)} accessibilityRole="link" style={estilos.termosLeitura}>
              <Text style={estilos.termosTitulo}>{"Pol\u00edtica de Privacidade"}</Text>
              <Text style={estilos.termosInfo}>Toque aqui para ler o documento.</Text>
            </Pressable>
          </View>

          {mensagemErro ? <Faixa tom="vermelho" texto={mensagemErro} estilo={estilos.erro} /> : null}

          <Botao
            titulo="Cadastrar"
            variante="acento"
            tamanho="lg"
            larguraTotal
            carregando={carregando}
            desabilitado={!aceitouTermos || !aceitouPrivacidade}
            aoPressionar={aoCadastrar}
          />

          <Pressable onPress={() => router.replace("/login")} accessibilityRole="link" style={estilos.link}>
            <Text style={estilos.linkTexto}>
              Já possui conta? <Text style={estilos.linkDestaque}>Entrar</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <TermosDeUso visivel={termosAbertos} aoFechar={() => setTermosAbertos(false)} aoConcordar={aoConcordar} />
      <PoliticaDePrivacidade visivel={privacidadeAberta} aoFechar={() => setPrivacidadeAberta(false)} aoConcordar={aoConcordarComPrivacidade} />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.pagina,
    overflow: "hidden",
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: espacamento.md,
  },
  cartao: {
    paddingHorizontal: espacamento.ml,
    paddingTop: espacamento.xl,
    paddingBottom: espacamento.lg,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: cores.superficie,
    ...sombras.lg,
  },
  barra: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  titulo: {
    fontFamily: fontes.marca,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 1.2,
    textAlign: "center",
    color: paleta.roxo[900],
  },
  subtitulo: {
    marginTop: 6,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.md,
    textAlign: "center",
    color: cores.texto3,
  },
  campos: {
    gap: espacamento.md,
    marginTop: espacamento.lg,
    marginBottom: espacamento.lg,
  },
  termos: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.ms,
    padding: espacamento.ms,
    marginBottom: espacamento.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaForte,
    backgroundColor: cores.superficie,
  },
  termosAceitos: {
    borderColor: paleta.verde[200],
    backgroundColor: paleta.verde[50],
  },
  caixaAceite: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: raio.sm,
    borderWidth: 2,
    borderColor: paleta.roxo[500],
    backgroundColor: cores.superficie,
  },
  caixaAceiteMarcada: {
    borderColor: paleta.verde[600],
    backgroundColor: paleta.verde[600],
  },
  termosPressionado: {
    borderColor: paleta.roxo[200],
    backgroundColor: paleta.roxo[50],
  },
  termosLeitura: {
    flex: 1,
    gap: 2,
    paddingVertical: 2,
  },
  termosTextos: {
    flex: 1,
    gap: 2,
  },
  termosTitulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
    textDecorationLine: "underline",
  },
  termosInfo: {
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.sm,
    color: cores.texto2,
  },
  erro: {
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