import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../src/context/authContext";
import { Usuario } from "../src/models/types";
import { montarUrlImagem } from "../src/services/api";
import { jogadorService } from "../src/services/jogadorService";
import { mensagemDeErro } from "../src/services/erros";
import { cores, paleta } from "../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte } from "../src/constants/theme";
import { AvatarPerfil } from "../src/components/AvatarPerfil";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { Botao } from "../src/components/ui/Botao";
import { CabecalhoPagina } from "../src/components/ui/CabecalhoPagina";
import { Campo } from "../src/components/ui/Campo";
import { Faixa } from "../src/components/ui/Faixa";

const MAXIMO_NOME = 150;
const MAXIMO_NICKNAME = 50;
const MAXIMO_BIO = 300;

export default function EditarPerfil() {
  const router = useRouter();
  const { usuario, autenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !autenticado) router.replace("/login");
  }, [autenticado, carregando, router]);

  if (carregando || !autenticado || !usuario) return <View style={estilos.container} />;

  return <FormularioPerfil key={usuario.id} usuario={usuario} />;
}

function FormularioPerfil({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { atualizarPerfil } = useAuth();

  const [nome, setNome] = useState(usuario.nome);
  const [nickname, setNickname] = useState(usuario.nickname);
  const [bio, setBio] = useState("");
  const [foto, setFoto] = useState<string | undefined>(() => montarUrlImagem(usuario.imagemPerfil));
  const [novaFoto, setNovaFoto] = useState<{ uri: string; mimeType?: string } | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Pré-preenche bio com o valor atual da API
  useEffect(() => {
    jogadorService.buscarBio().then(setBio).catch(() => undefined);
  }, []);

  async function trocarFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const imagem = resultado.assets[0];
      setFoto(imagem.uri);
      setNovaFoto({ uri: imagem.uri, mimeType: imagem.mimeType ?? undefined });
    }
  }

  async function salvar() {
    const nomeLimpo = nome.trim();
    const nicknameLimpo = nickname.trim();

    if (!nomeLimpo || !nicknameLimpo) {
      setErro("Preencha nome e nickname.");
      return;
    }
    if (nomeLimpo.length > MAXIMO_NOME || nicknameLimpo.length > MAXIMO_NICKNAME) {
      setErro(`Nome até ${MAXIMO_NOME} caracteres, nickname até ${MAXIMO_NICKNAME}.`);
      return;
    }

    setErro(null);
    setSalvando(true);
    try {
      await atualizarPerfil({ nome: nomeLimpo, nickname: nicknameLimpo, bio, novaFoto });
      router.back();
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível salvar o perfil."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <CabecalhoPagina titulo="Editar perfil" />

        <View style={estilos.cartao}>
          <Pressable style={estilos.foto} onPress={trocarFoto} accessibilityRole="button" accessibilityLabel="Trocar foto">
            <View>
              <AvatarPerfil foto={foto} nome={nickname || nome} tamanho={96} />
              <View style={estilos.fotoSelo}>
                <Ionicons name="camera" size={15} color={cores.textoInverso} />
              </View>
            </View>
            <Text style={estilos.fotoTexto}>Trocar foto</Text>
          </Pressable>

          <View style={estilos.campos}>
            <Campo rotulo="Nome" value={nome} onChangeText={setNome} maxLength={MAXIMO_NOME} autoComplete="name" />
            <Campo
              rotulo="Nickname"
              value={nickname}
              onChangeText={setNickname}
              maxLength={MAXIMO_NICKNAME}
              autoCapitalize="none"
              ajuda="É o nome que aparece na chave do torneio."
            />
            <View>
              <Campo
                rotulo="Bio"
                opcional
                value={bio}
                onChangeText={(t) => setBio(t.slice(0, MAXIMO_BIO))}
                placeholder="Fale um pouco sobre você..."
                multiline
              />
              <Text style={estilos.contador}>{bio.length}/{MAXIMO_BIO}</Text>
            </View>
          </View>
        </View>

        {erro ? <Faixa tom="vermelho" texto={erro} estilo={estilos.erro} /> : null}

        <Botao titulo="Salvar" tamanho="lg" larguraTotal carregando={salvando} aoPressionar={salvar} estilo={estilos.salvar} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.pagina,
  },
  conteudo: {
    paddingHorizontal: espacamento.md,
    paddingBottom: espacamento.xl,
  },
  cartao: {
    ...cartao,
    borderRadius: raio.cartao,
    padding: espacamento.ml,
  },
  foto: {
    alignItems: "center",
    alignSelf: "center",
    gap: espacamento.sm,
    marginBottom: espacamento.lg,
  },
  fotoSelo: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paleta.roxo[600],
    borderWidth: 3,
    borderColor: cores.superficie,
  },
  fotoTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.sm,
    color: paleta.roxo[600],
  },
  campos: {
    gap: espacamento.md,
  },
  contador: {
    marginTop: 4,
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.xs,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
    color: cores.texto3,
  },
  erro: {
    marginTop: espacamento.md,
  },
  salvar: {
    marginTop: espacamento.lg,
  },
});
