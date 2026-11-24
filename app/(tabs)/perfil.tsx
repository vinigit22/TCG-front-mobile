import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarPerfil } from "../../src/components/AvatarPerfil";
import { BlocoIcone } from "../../src/components/ui/BlocoIcone";
import { Botao } from "../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../src/components/ui/CabecalhoPagina";
import { Capa } from "../../src/components/ui/Capa";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { ItemLista } from "../../src/components/ui/ItemLista";
import { useAuth } from "../../src/context/authContext";
import { montarUrlImagem } from "../../src/services/api";
import { jogadorService } from "../../src/services/jogadorService";
import { EstatisticasJogador } from "../../src/models/types";
import { cores, paleta } from "../../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../../src/constants/theme";

const MEDALHAS = {
  ouro: { fundo: paleta.ambar[100], texto: paleta.ambar[700] },
  prata: { fundo: paleta.tinta[150], texto: paleta.tinta[600] },
  bronze: { fundo: "#f8e6d8", texto: "#9a5a2c" },
};

// Indicador (o .kpi do painel web): ícone + rótulo em cima, número grande embaixo
function Indicador({ rotulo, valor, icone, cor }: { rotulo: string; valor: number; icone: keyof typeof Ionicons.glyphMap; cor?: { fundo: string; texto: string } }) {
  return (
    <View style={estilos.kpi}>
      <View style={estilos.kpiRotulo}>
        <BlocoIcone nome={icone} cor={cor} tamanho={28} />
        <Text style={estilos.kpiRotuloTexto}>{rotulo}</Text>
      </View>
      <Text style={estilos.kpiValor}>{valor}</Text>
    </View>
  );
}

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, autenticado, logout } = useAuth();

  const [bio, setBio] = useState<string>("");
  const [trofeus, setTrofeus] = useState<EstatisticasJogador | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Recarrega bio e troféus sempre que a aba ganha foco (inclusive após editar)
  useFocusEffect(
    useCallback(() => {
      if (!autenticado || !usuario) return;
      setCarregando(true);
      Promise.all([
        jogadorService.buscarBio(),
        jogadorService.buscarTrofeus(usuario.id),
      ])
        .then(([bioAtual, trofeusAtuais]) => {
          setBio(bioAtual);
          setTrofeus(trofeusAtuais);
        })
        .catch(() => undefined)
        .finally(() => setCarregando(false));
    }, [autenticado, usuario])
  );

  if (!autenticado || !usuario) {
    return (
      <View style={[estilos.deslogado, { paddingTop: insets.top + espacamento.md }]}>
        <CabecalhoPagina titulo="Perfil" />
        <EstadoVazio
          icone="person-outline"
          titulo="Entre para ver seu perfil"
          texto="Acompanhe seus torneios, troféus e estatísticas fazendo login na sua conta."
        >
          <Botao titulo="Entrar" tamanho="lg" icone="log-in-outline" aoPressionar={() => router.push("/login")} />
        </EstadoVazio>
      </View>
    );
  }

  const foto = montarUrlImagem(usuario.imagemPerfil);

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Capa voltar={false}>
        <View style={estilos.identidade}>
          <Pressable
            onPress={() => router.push("/editar-perfil")}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <AvatarPerfil foto={foto} nome={usuario.nickname || usuario.nome} tamanho={84} contorno />
            <View style={estilos.avatarEditarSelo}>
              <Ionicons name="pencil" size={13} color={paleta.verde[950]} />
            </View>
          </Pressable>
          <View style={estilos.identidadeTextos}>
            <Text style={estilos.nome} numberOfLines={2}>
              {usuario.nome}
            </Text>
            {usuario.nickname ? <Text style={estilos.nickname}>@{usuario.nickname}</Text> : null}
            <Text style={estilos.email} numberOfLines={1}>
              {usuario.email}
            </Text>
          </View>
        </View>
        {carregando ? (
          <ActivityIndicator color={paleta.roxo[200]} style={estilos.carregando} />
        ) : bio ? (
          <Text style={estilos.bio}>{bio}</Text>
        ) : null}
      </Capa>

      <View style={estilos.conteudo}>
        {trofeus !== null ? (
          <>
            <Text accessibilityRole="header" style={estilos.secao}>
              Conquistas
            </Text>
            <View style={estilos.grade}>
              <Indicador rotulo="Ouro" valor={trofeus.ouro} icone="medal" cor={MEDALHAS.ouro} />
              <Indicador rotulo="Prata" valor={trofeus.prata} icone="medal" cor={MEDALHAS.prata} />
              <Indicador rotulo="Bronze" valor={trofeus.bronze} icone="medal" cor={MEDALHAS.bronze} />
              <Indicador rotulo="Torneios" valor={trofeus.torneiosDisputados} icone="trophy" />
            </View>
          </>
        ) : null}

        <Text accessibilityRole="header" style={estilos.secao}>
          Sua conta
        </Text>
        <View style={estilos.menu}>
          <ItemLista icone="trophy-outline" titulo="Meus torneios" detalhe="Inscrições e partidas" aoPressionar={() => router.push("/meus-torneios")} />
          <ItemLista divisor icone="layers-outline" titulo="Meu deck" detalhe="Em breve" aoPressionar={() => router.push("/deck")} />
          <ItemLista divisor icone="create-outline" titulo="Editar perfil" detalhe="Foto, nome, nickname e bio" aoPressionar={() => router.push("/editar-perfil")} />
          <ItemLista divisor icone="settings-outline" titulo="Configurações" aoPressionar={() => router.push("/configuracoes")} />
        </View>

        <Botao titulo="Sair da conta" variante="perigoSuave" icone="log-out-outline" larguraTotal aoPressionar={logout} estilo={estilos.sair} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  identidade: { flexDirection: "row", alignItems: "center", gap: espacamento.md },
  identidadeTextos: { flex: 1, minWidth: 0 },
  avatarEditarSelo: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paleta.verde[400],
    borderWidth: 2,
    borderColor: paleta.roxo[950],
  },
  nome: { fontFamily: fontes.extrabold, fontSize: tamanhoFonte.xl, lineHeight: 25, letterSpacing: -0.3, color: cores.textoInverso },
  nickname: { marginTop: 2, fontFamily: fontes.bold, fontSize: tamanhoFonte.md, color: paleta.verde[300] },
  email: { marginTop: 2, fontFamily: fontes.regular, fontSize: tamanhoFonte.sm, color: paleta.tinta[300] },
  carregando: { marginTop: espacamento.md, alignSelf: "flex-start" },
  bio: { marginTop: espacamento.md, fontFamily: fontes.regular, fontSize: tamanhoFonte.md, lineHeight: 21, color: paleta.tinta[300] },
  conteudo: { paddingHorizontal: espacamento.md, paddingTop: espacamento.lg },
  secao: { ...tipografia.tituloSecao, marginBottom: espacamento.ms },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: espacamento.ms, marginBottom: espacamento.lg },
  kpi: { ...cartao, flexBasis: "47%", flexGrow: 1, padding: 14, gap: 6 },
  kpiRotulo: { flexDirection: "row", alignItems: "center", gap: espacamento.sm },
  kpiRotuloTexto: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.sm, color: cores.texto2 },
  kpiValor: { fontFamily: fontes.bold, fontSize: 28, lineHeight: 32, letterSpacing: -0.8, fontVariant: ["tabular-nums"], color: cores.texto },
  menu: { ...cartao, overflow: "hidden" },
  sair: { marginTop: espacamento.lg, borderRadius: raio.md },
  deslogado: { flex: 1, backgroundColor: cores.pagina, paddingHorizontal: espacamento.md },
});
