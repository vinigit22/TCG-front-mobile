import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";
import { TorneioCard } from "../../src/components/torneioCard";
import { Capa } from "../../src/components/ui/Capa";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { ItemLista } from "../../src/components/ui/ItemLista";
import { Selo } from "../../src/components/ui/Selo";
import { Loja, Torneio } from "../../src/models/types";
import { lojaService } from "../../src/services/lojaService";
import { torneioService } from "../../src/services/torneioService";
import { cores, paleta } from "../../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../../src/constants/theme";

export default function PerfilLoja() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loja, setLoja] = useState<Loja | null>(null);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const lojaId = Number(id);
      setCarregando(true);
      Promise.all([lojaService.buscar(lojaId), torneioService.listar(lojaId)])
        .then(([perfil, lista]) => {
          setLoja(perfil);
          setTorneios(lista);
        })
        .finally(() => setCarregando(false));
    }, [id])
  );

  if (carregando || !loja) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centro}>
          {carregando ? (
            <ActivityIndicator color={cores.primaria} size="large" />
          ) : (
            <EstadoVazio icone="storefront-outline" titulo="Loja não encontrada" />
          )}
        </View>
      </View>
    );
  }

  const endereco = loja.endereco
    ? `${loja.endereco.logradouro}${loja.endereco.numero ? `, ${loja.endereco.numero}` : ""} · ${loja.endereco.cidade}/${loja.endereco.estado}`
    : null;

  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.xl }} showsVerticalScrollIndicator={false}>
        <Capa>
          <View style={estilos.identidade}>
            <View style={estilos.icone}>
              <Ionicons name="storefront" size={26} color={paleta.verde[950]} />
            </View>
            <View style={estilos.identidadeTextos}>
              <Text accessibilityRole="header" style={estilos.nome} numberOfLines={2}>
                {loja.nome}
              </Text>
              {loja.verificada ? <Selo texto="Loja verificada" tom="verde" icone="checkmark-circle" /> : null}
            </View>
          </View>
          {loja.descricao ? <Text style={estilos.descricao}>{loja.descricao}</Text> : null}
        </Capa>

        <View style={estilos.conteudo}>
          {loja.telefone || endereco ? (
            <View style={estilos.contato}>
              {loja.telefone ? <ItemLista icone="call-outline" titulo={loja.telefone} detalhe="Telefone" /> : null}
              {endereco ? <ItemLista divisor={!!loja.telefone} icone="location-outline" titulo={endereco} detalhe="Endereço" /> : null}
            </View>
          ) : null}

          <Text accessibilityRole="header" style={estilos.secao}>
            Torneios da loja
          </Text>
          {torneios.length ? (
            torneios.map((torneio) => (
              <TorneioCard key={torneio.id} torneio={torneio} aoPressionar={(item) => router.push(`/torneio/${item.id}`)} />
            ))
          ) : (
            <EstadoVazio icone="trophy-outline" titulo="Nenhum torneio público" texto="Esta loja ainda não abriu inscrições." />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  identidade: { flexDirection: "row", alignItems: "center", gap: 14 },
  identidadeTextos: { flex: 1, gap: 6 },
  icone: { width: 56, height: 56, borderRadius: raio.lg, alignItems: "center", justifyContent: "center", backgroundColor: paleta.verde[400] },
  nome: { fontFamily: fontes.marca, fontSize: tamanhoFonte.xl, lineHeight: 26, letterSpacing: 0.4, color: cores.textoInverso },
  descricao: { marginTop: espacamento.md, fontFamily: fontes.regular, fontSize: tamanhoFonte.md, lineHeight: 21, color: paleta.tinta[300] },
  conteudo: { marginTop: -espacamento.md, paddingHorizontal: espacamento.md },
  contato: { ...cartao, borderRadius: raio.cartao, overflow: "hidden", marginBottom: espacamento.sm },
  secao: { ...tipografia.tituloSecao, marginTop: espacamento.md, marginBottom: espacamento.ms },
});
