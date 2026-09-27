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
import { cores } from "../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";

export default function EditarPerfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, autenticado, carregando, atualizarPerfil } = useAuth();

  const [nome, setNome] = useState("");
  const [nickname, setNickname] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [autenticado, carregando]);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setNickname(usuario.nickname ?? "");
      setFoto(usuario.foto);
    }
  }, [usuario]);

  if (carregando || !autenticado || !usuario) {
    return <View style={estilos.container} />;
  }

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
      setFoto(resultado.assets[0].uri);
    }
  }

  async function salvar() {
    setSalvando(true);
    try {
      await atualizarPerfil({ nome: nome.trim(), nickname: nickname.trim(), foto });
      router.back();
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
                {(nickname || nome).slice(0, 2).toUpperCase()}
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