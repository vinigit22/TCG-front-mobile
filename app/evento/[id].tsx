import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";
import { Loja } from "../../src/components/Loja";
import { Capa } from "../../src/components/ui/Capa";
import { DataBloco } from "../../src/components/ui/DataBloco";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { Selo } from "../../src/components/ui/Selo";
import { Evento } from "../../src/models/types";
import { eventoService } from "../../src/services/eventoService";
import { montarUrlImagem } from "../../src/services/api";
import { formatarData, formatarHora } from "../../src/utils/formatadores";
import { ROTULOS_STATUS_EVENTO, ROTULOS_TIPO_EVENTO, TOM_STATUS_EVENTO } from "../../src/utils/status";
import { cores, paleta, sobreNoite } from "../../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../../src/constants/theme";

export default function DetalheEvento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [imagemComErro, setImagemComErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      eventoService
        .buscar(Number(id))
        .then(setEvento)
        .catch(() => setEvento(null))
        .finally(() => setCarregando(false));
    }, [id])
  );

  if (carregando) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centro}>
          <ActivityIndicator color={cores.primaria} size="large" />
        </View>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centro}>
          <EstadoVazio icone="calendar-outline" titulo="Evento não encontrado" texto="Ele pode ter sido cancelado pela loja." />
        </View>
      </View>
    );
  }

  const imagem = montarUrlImagem(evento.imagem);

  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.xl }} showsVerticalScrollIndicator={false}>
        <Capa>
          <View style={estilos.capaTopo}>
            <View style={estilos.tipo}>
              <Text style={estilos.tipoTexto}>{ROTULOS_TIPO_EVENTO[evento.tipo]}</Text>
            </View>
            <Selo
              texto={ROTULOS_STATUS_EVENTO[evento.status]}
              tom={TOM_STATUS_EVENTO[evento.status]}
              vivo={evento.status === "EM_ANDAMENTO"}
            />
          </View>
          <Text accessibilityRole="header" style={estilos.titulo}>
            {evento.titulo}
          </Text>
          {evento.nomeLoja ? <Loja nome={evento.nomeLoja} claro /> : null}
        </Capa>

        <View style={estilos.conteudo}>
          {imagem ? (
            imagemComErro ? (
              <View style={[estilos.imagem, estilos.imagemIndisponivel]}>
                <Ionicons name="image-outline" size={32} color={paleta.roxo[400]} />
                <Text style={estilos.imagemIndisponivelTexto}>Nao foi possivel carregar esta imagem</Text>
              </View>
            ) : (
              <Image source={{ uri: imagem }} style={estilos.imagem} resizeMode="cover" onError={() => setImagemComErro(true)} accessibilityLabel={`Imagem do evento ${evento.titulo}`} />
            )
          ) : null}
          <View style={estilos.cartaoData}>
            <DataBloco dataIso={evento.dataInicio} />
            <View style={estilos.dataTextos}>
              <Text style={tipografia.sobretitulo}>Data e horário</Text>
              <Text style={estilos.valor}>
                {formatarData(evento.dataInicio)} · {formatarHora(evento.dataInicio)}
              </Text>
              {evento.vagasMax ? <Text style={estilos.vagas}>Limite de {evento.vagasMax} pessoas</Text> : null}
            </View>
          </View>

          {evento.descricao ? (
            <View style={estilos.bloco}>
              <Text style={estilos.blocoTitulo}>Sobre o evento</Text>
              <Text style={estilos.texto}>{evento.descricao}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  capaTopo: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: espacamento.sm, marginBottom: espacamento.ms },
  tipo: { height: 24, justifyContent: "center", paddingHorizontal: 10, borderRadius: raio.pill, backgroundColor: sobreNoite.pilula },
  imagemIndisponivel: { alignItems: "center", justifyContent: "center", gap: espacamento.sm },
  imagemIndisponivelTexto: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.sm, color: paleta.roxo[600] },
  tipoTexto: { fontFamily: fontes.bold, fontSize: tamanhoFonte.xs, color: paleta.roxo[200] },
  titulo: { marginBottom: espacamento.ms, fontFamily: fontes.marca, fontSize: 23, lineHeight: 29, letterSpacing: 0.4, color: cores.textoInverso },
  conteudo: { marginTop: -espacamento.md, paddingHorizontal: espacamento.md },
  imagem: { width: "100%", height: 200, marginBottom: espacamento.md, borderRadius: raio.cartao, backgroundColor: paleta.roxo[100] },
  cartaoData: { ...cartao, flexDirection: "row", alignItems: "center", gap: 14, padding: espacamento.md, borderRadius: raio.cartao },
  dataTextos: { flex: 1, gap: 3 },
  valor: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.base, color: cores.texto },
  vagas: { ...tipografia.legenda, marginTop: 2 },
  bloco: { marginTop: espacamento.lg },
  blocoTitulo: { ...tipografia.tituloSecao, marginBottom: 6 },
  texto: { ...tipografia.corpo, color: cores.texto2 },
});
