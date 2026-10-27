import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/context/authContext";
import { CHAVE_PREFERENCIA_PUSH } from "../src/constants/storage";
import { cores, paleta } from "../src/constants/colors";
import { cartao, espacamento, raio, tipografia } from "../src/constants/theme";
import { BotaoVoltar } from "../src/components/BotaoVoltar";
import { Botao } from "../src/components/ui/Botao";
import { CabecalhoPagina } from "../src/components/ui/CabecalhoPagina";
import { ItemLista } from "../src/components/ui/ItemLista";

export default function Configuracoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_PREFERENCIA_PUSH).then(v => v !== null && setNotificacoesAtivas(v === "true")).catch(() => undefined);
  }, []);

  function alterarNotificacoes(valor: boolean) {
    setNotificacoesAtivas(valor);
    AsyncStorage.setItem(CHAVE_PREFERENCIA_PUSH, String(valor)).catch(() => undefined);
  }

  async function sair() {
    await logout();
    router.replace("/(tabs)");
  }

  return (
    <View style={[estilos.container, { paddingBottom: insets.bottom }]}>
      <BotaoVoltar />
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoPagina titulo="Configurações" />

        <Text style={estilos.grupo}>Conta</Text>
        <View style={estilos.cartao}>
          <ItemLista icone="create-outline" titulo="Editar perfil" detalhe="Foto, nome, nickname e bio" aoPressionar={() => router.push("/editar-perfil")} />
        </View>

        <Text style={estilos.grupo}>Preferências</Text>
        <View style={estilos.cartao}>
          <ItemLista
            icone="notifications-outline"
            titulo="Notificações push"
            detalhe="Em breve"
            direita={
              // O mesmo interruptor do web: verde quando ligado
              <Switch
                value={notificacoesAtivas}
                onValueChange={alterarNotificacoes}
                trackColor={{ true: paleta.verde[500], false: paleta.tinta[300] }}
                thumbColor={cores.superficie}
                ios_backgroundColor={paleta.tinta[300]}
              />
            }
          />
        </View>

        <Text style={estilos.grupo}>Sobre</Text>
        <View style={estilos.cartao}>
          <ItemLista icone="information-circle-outline" titulo="Sobre o MERUEM.INC" detalhe="Quem faz o TopDeck" aoPressionar={() => router.push("/sobre-nos" as Href)} />
        </View>

        <Botao titulo="Sair da conta" variante="perigoSuave" icone="log-out-outline" larguraTotal aoPressionar={sair} estilo={estilos.sair} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  conteudo: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
  grupo: { ...tipografia.sobretitulo, marginTop: espacamento.sm, marginBottom: espacamento.sm, marginLeft: 4 },
  cartao: { ...cartao, overflow: "hidden", marginBottom: espacamento.md },
  sair: { marginTop: espacamento.md, borderRadius: raio.md },
});
