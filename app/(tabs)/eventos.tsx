import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isAxiosError } from "axios";
import { eventoService } from "../../src/services/eventoService";
import { Evento } from "../../src/models/types";
import { Botao } from "../../src/components/ui/Botao";
import { CabecalhoPagina } from "../../src/components/ui/CabecalhoPagina";
import { DataBloco } from "../../src/components/ui/DataBloco";
import { EstadoVazio } from "../../src/components/ui/EstadoVazio";
import { Selo } from "../../src/components/ui/Selo";
import { cores, paleta } from "../../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte } from "../../src/constants/theme";
import { formatarHora } from "../../src/utils/formatadores";
import { ROTULOS_STATUS_EVENTO, ROTULOS_TIPO_EVENTO, TOM_STATUS_EVENTO } from "../../src/utils/status";
import { montarUrlImagem } from "../../src/services/api";

const INTERVALO_ATUALIZACAO = 15000;
const STATUS_VISIVEIS: Evento["status"][] = ["PUBLICADO", "EM_ANDAMENTO"];

function descreverErro(erro: unknown) {
  if (isAxiosError(erro)) {
    const endereco = `${erro.config?.baseURL ?? ""}${erro.config?.url ?? ""}`;
    if (erro.response) return `HTTP ${erro.response.status} em ${endereco}`;
    return `Sem resposta de ${endereco} (${erro.code ?? erro.message})`;
  }
  return erro instanceof Error ? erro.message : String(erro);
}

function CartaoEvento({ evento, aoPressionar }: { evento: Evento; aoPressionar: () => void }) {
  const [imagemComErro, setImagemComErro] = useState(false);
  const imagem = montarUrlImagem(evento.imagem);

  return (
    <Pressable
      style={({ pressed }) => [estilos.card, !imagem && estilos.cardSemImagem, pressed && estilos.cardPressionado]}
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={evento.titulo}
    >
      {imagem ? <View style={estilos.midia}>
        {imagem && !imagemComErro ? (
          <Image source={{ uri: imagem }} style={estilos.imagem} resizeMode="cover" onError={() => setImagemComErro(true)} accessibilityLabel={`Imagem do evento ${evento.titulo}`} />
        ) : (
          <View style={estilos.imagemIndisponivel}>
            <Ionicons name="image-outline" size={28} color={paleta.roxo[200]} />
            <Text style={estilos.imagemIndisponivelTexto}>{imagem ? "Imagem indisponivel" : "Evento"}</Text>
          </View>
        )}
        <View style={estilos.dataSobreposta}>
          <DataBloco dataIso={evento.dataInicio} />
        </View>
      </View> : null}
      {!imagem ? <DataBloco dataIso={evento.dataInicio} /> : null}
      <View style={[estilos.cardCorpo, !imagem && estilos.cardCorpoSemImagem]}>
        <View style={estilos.cardTopo}>
          <Text style={estilos.tipo} numberOfLines={1}>
            {ROTULOS_TIPO_EVENTO[evento.tipo]}
          </Text>
          <Selo
            texto={ROTULOS_STATUS_EVENTO[evento.status]}
            tom={TOM_STATUS_EVENTO[evento.status]}
            vivo={evento.status === "EM_ANDAMENTO"}
          />
        </View>
        <Text style={estilos.cardTitulo} numberOfLines={2}>
          {evento.titulo}
        </Text>
        <View style={estilos.linhaInfo}>
          <Ionicons name="time-outline" size={13} color={cores.texto3} />
          <Text style={estilos.info}>{formatarHora(evento.dataInicio)}</Text>
          {evento.nomeLoja ? (
            <>
              <Text style={estilos.ponto}>·</Text>
              <Text style={estilos.info} numberOfLines={1}>
                {evento.nomeLoja}
              </Text>
            </>
          ) : null}
        </View>
        {evento.descricao ? (
          <Text style={estilos.descricao} numberOfLines={2}>
            {evento.descricao}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Eventos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);
  const [detalheErro, setDetalheErro] = useState("");

  const carregar = useCallback((silencioso = false) => {
    if (!silencioso) setCarregando(true);
    eventoService
      .listar(STATUS_VISIVEIS)
      .then((lista) => {
        setEventos(lista);
        setErro(false);
      })
      .catch((e) => {
        if (!silencioso) {
          setErro(true);
          setDetalheErro(descreverErro(e));
        }
      })
      .finally(() => {
        setCarregando(false);
        setAtualizando(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
      const intervalo = setInterval(() => carregar(true), INTERVALO_ATUALIZACAO);
      return () => clearInterval(intervalo);
    }, [carregar])
  );

  const atualizar = () => {
    setAtualizando(true);
    carregar(true);
  };

  const cabecalho = <CabecalhoPagina titulo="Eventos" subtitulo="Trocas, lançamentos e noites casuais nas lojas" />;

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.md }]}>
      {carregando ? (
        <View style={estilos.lista}>
          {cabecalho}
          <ActivityIndicator color={cores.primaria} size="large" style={estilos.carregando} />
        </View>
      ) : erro ? (
        <View style={estilos.lista}>
          {cabecalho}
          <EstadoVazio erro titulo="Não foi possível carregar os eventos" texto={detalheErro}>
            <Botao titulo="Tentar de novo" variante="secundario" icone="refresh" aoPressionar={() => carregar()} />
          </EstadoVazio>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={
            <EstadoVazio
              icone="calendar-outline"
              titulo="Nenhum evento no momento"
              texto="Quando uma loja publicar um evento, ele aparece aqui."
            />
          }
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.primaria} colors={[cores.primaria]} />}
          renderItem={({ item }) => <CartaoEvento evento={item} aoPressionar={() => router.push(`/evento/${item.id}` as never)} />}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.pagina },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
  carregando: { marginTop: espacamento.xl },
  card: {
    ...cartao,
    overflow: "hidden",
    marginBottom: espacamento.ms,
    borderRadius: raio.cartao,
  },
  cardSemImagem: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: espacamento.md },
  cardPressionado: { borderColor: paleta.roxo[200], backgroundColor: paleta.roxo[50] },
  midia: { height: 190, backgroundColor: paleta.roxo[800] },
  imagem: { width: "100%", height: "100%" },
  imagemIndisponivel: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: espacamento.xs, backgroundColor: paleta.roxo[800] },
  imagemIndisponivelTexto: { fontFamily: fontes.semibold, fontSize: tamanhoFonte.sm, color: paleta.roxo[100] },
  dataSobreposta: { position: "absolute", top: espacamento.ms, left: espacamento.ms },
  cardCorpo: { padding: espacamento.md },
  cardCorpoSemImagem: { flex: 1, minWidth: 0, padding: 0 },
  cardTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: espacamento.sm, marginBottom: 6 },
  tipo: { flexShrink: 1, fontFamily: fontes.bold, fontSize: tamanhoFonte.xxs, letterSpacing: 0.6, textTransform: "uppercase", color: paleta.roxo[600] },
  cardTitulo: { fontFamily: fontes.extrabold, fontSize: tamanhoFonte.lg, lineHeight: 22, letterSpacing: -0.2, color: cores.texto },
  linhaInfo: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  info: { flexShrink: 1, fontFamily: fontes.medio, fontSize: tamanhoFonte.sm, color: cores.texto2 },
  ponto: { fontFamily: fontes.bold, color: cores.texto3 },
  descricao: { marginTop: 6, fontFamily: fontes.regular, fontSize: tamanhoFonte.sm, lineHeight: 19, color: cores.texto3 },
});
