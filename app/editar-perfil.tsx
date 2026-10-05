import React, { useEffect, useState } from "react";
import {
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
import { mensagemDeErro } from "../src/services/erros";
import { cores } from "../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

// Mesmos limites do backend (UsuarioJogadorRequest)
const MAXIMO_NOME = 150;
const MAXIMO_NICKNAME = 50;

export default function EditarPerfil() {
  const router = useRouter();
  const { usuario, autenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [autenticado, carregando, router]);

  if (carregando || !autenticado || !usuario) {
    return <View style={estilos.container} />;
  }

  // O formulário só monta com o usuário carregado: os campos começam com os dados dele
  return <FormularioPerfil key={usuario.id} usuario={usuario} />;
}

function FormularioPerfil({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { atualizarPerfil } = useAuth();

  const [nome, setNome] = useState(usuario.nome);
  const [nickname, setNickname] = useState(usuario.nickname);
  // foto: o que aparece na tela; novaFoto: imagem escolhida agora, que vai por upload ao salvar
  const [foto, setFoto] = useState<string | undefined>(() => montarUrlImagem(usuario.imagemPerfil));
  const [novaFoto, setNovaFoto] = useState<{ uri: string; mimeType?: string } | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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
      setErro(`O nome pode ter até ${MAXIMO_NOME} caracteres e o nickname até ${MAXIMO_NICKNAME}.`);
      return;
    }

    setErro(null);
    setSalvando(true);
    try {
      await atualizarPerfil({ nome: nomeLimpo, nickname: nicknameLimpo, novaFoto });
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
          <TextInput style={estilos.input} value={nome} onChangeText={setNome} placeholderTextColor={cores.textoSecundario} />
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Nickname</Text>
          <TextInput style={estilos.input} value={nickname} onChangeText={setNickname} autoCapitalize="none" placeholderTextColor={cores.textoSecundario} />
        </View>

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable style={estilos.botaoSalvar} onPress={salvar} disabled={salvando}>
          <Text style={estilos.botaoSalvarTexto}>{salvando ? "SALVANDO..." : "SALVAR"}</Text>
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
    alignItems: "center",
  },
  titulo: {
    color: cores.verdeEscuro,
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
    color: cores.magenta,
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
    textAlign: "center",
  },
  botaoSalvar: {
    width: "100%",
    backgroundColor: cores.roxo,
    borderRadius: raio.pill,
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