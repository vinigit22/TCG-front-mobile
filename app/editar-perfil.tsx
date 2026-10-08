import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../src/context/authContext";
import { Usuario } from "../src/models/types";
import { montarUrlImagem } from "../src/services/api";
import { jogadorService } from "../src/services/jogadorService";
import { mensagemDeErro } from "../src/services/erros";
import { cores } from "../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

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
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Editar perfil</Text>

        <Pressable style={estilos.avatarToque} onPress={trocarFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={estilos.avatarImagem} />
          ) : (
            <View style={estilos.avatarPlaceholder}>
              <Text style={estilos.avatarPlaceholderTexto}>
                {(nickname || nome).trim().slice(0, 2).toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <Text style={estilos.trocarFotoTexto}>Trocar foto</Text>
        </Pressable>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Nome</Text>
          <TextInput
            style={estilos.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor={cores.textoSecundario}
          />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Nickname</Text>
          <TextInput
            style={estilos.input}
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="none"
            placeholderTextColor={cores.textoSecundario}
          />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Bio <Text style={estilos.rotuloOpcional}>(opcional)</Text>
          </Text>
          <TextInput
            style={[estilos.input, estilos.inputBio]}
            value={bio}
            onChangeText={(t) => setBio(t.slice(0, MAXIMO_BIO))}
            placeholder="Fale um pouco sobre você..."
            placeholderTextColor={cores.textoSecundario}
            multiline
            textAlignVertical="top"
          />
          <Text style={estilos.contador}>{bio.length}/{MAXIMO_BIO}</Text>
        </View>

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable style={estilos.botaoSalvar} onPress={salvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color={cores.textoClaro} />
          ) : (
            <Text style={estilos.botaoSalvarTexto}>SALVAR</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    paddingHorizontal: espacamento.lg,
    paddingBottom: espacamento.xl,
    alignItems: "center",
  },
  titulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.lg,
  },
  avatarToque: {
    alignItems: "center",
    marginBottom: espacamento.lg,
  },
  avatarImagem: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: cores.roxo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderTexto: {
    color: cores.textoClaro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "900",
  },
  trocarFotoTexto: {
    color: cores.roxo,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.sm,
  },
  campo: {
    width: "100%",
    marginBottom: espacamento.md,
  },
  rotulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    marginBottom: espacamento.xs,
  },
  rotuloOpcional: {
    color: cores.textoSecundario,
    fontWeight: "500",
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
  inputBio: {
    minHeight: 88,
    paddingTop: espacamento.sm,
  },
  contador: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.xs,
    textAlign: "right",
    marginTop: 4,
  },
  erro: {
    color: cores.erro,
    fontSize: tamanhoFonte.sm,
    textAlign: "center",
    marginBottom: espacamento.sm,
  },
  botaoSalvar: {
    width: "100%",
    backgroundColor: cores.roxo,
    borderRadius: raio.md,
    paddingVertical: espacamento.md,
    alignItems: "center",
    marginTop: espacamento.md,
  },
  botaoSalvarTexto: {
    color: cores.textoClaro,
    fontWeight: "800",
    fontSize: tamanhoFonte.md,
  },
});
