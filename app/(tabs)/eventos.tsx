import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isAxiosError } from "axios";
import { eventoService } from "../../src/services/eventoService";
import { Evento } from "../../src/models/types";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../../src/constants/theme";

const INTERVALO_ATUALIZACAO = 15000;
const STATUS_VISIVEIS: Evento["status"][] = ["PUBLICADO", "EM_ANDAMENTO"];

const tipos: Record<Evento["tipo"], string> = {
  TROCA: "Troca de cartas",
  CONFRATERNIZACAO: "Confraternização",
  PROMOCAO: "Promoção",
  LANCAMENTO: "Lançamento",
  CASUAL: "Casual",
  OUTRO: "Evento especial",
};

const status: Record<Evento["status"], string> = {
  RASCUNHO: "Em breve",
  PUBLICADO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
};

function data(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function descreverErro(erro: unknown) {
  if (isAxiosError(erro)) {
    const endereco = `${erro.config?.baseURL ?? ""}${erro.config?.url ?? ""}`;
    if (erro.response) return `HTTP ${erro.response.status} em ${endereco}`;
    return `Sem resposta de ${endereco} (${erro.code ?? erro.message})`;
  }
  return erro instanceof Error ? erro.message : String(erro);
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

  const cabecalho = <Text style={estilos.titulo}>Eventos</Text>;

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm }]}>
      {carregando ? (
        <View style={estilos.estado}>
          <Text style={estilos.titulo}>Eventos</Text>
          <View style={estilos.centro}>
            <ActivityIndicator color={cores.roxo} size="large" />
          </View>
        </View>
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={estilos.titulo}>Eventos</Text>
          <View style={estilos.centro}>
            <Text style={estilos.mensagem}>Nao foi possivel carregar os eventos.</Text>
            <Text style={estilos.detalhe}>{detalheErro}</Text>
            <Pressable style={estilos.tentar} onPress={() => carregar()}>
              <Text style={estilos.tentarTexto}>TENTAR NOVAMENTE</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={<Text style={estilos.mensagem}>Nenhum evento disponível no momento.</Text>}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.roxo} colors={[cores.roxo]} />}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [estilos.card, pressed && { opacity: 0.85 }]}
              onPress={() => router.push(`/evento/${item.id}` as never)}
            >
              <View style={estilos.cardTopo}>
                <Text style={estilos.tipo}>{tipos[item.tipo]}</Text>
                <Text style={estilos.status}>{status[item.status]}</Text>
              </View>
              <Text style={estilos.cardTitulo}>{item.titulo}</Text>
              {item.nomeLoja ? <Text style={estilos.loja}>{item.nomeLoja}</Text> : null}
              <Text style={estilos.data}>{data(item.dataInicio)}</Text>
              {item.descricao ? (
                <Text style={estilos.descricao} numberOfLines={2}>
                  {item.descricao}
                </Text>
              ) : null}
            </Pressable>
          )}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  lista: { paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl },
  estado: { flex: 1, paddingHorizontal: espacamento.md },
  centro: { flex: 1, padding: espacamento.lg, alignItems: "center", justifyContent: "center" },
  titulo: { alignSelf: "stretch", color: cores.textoEscuro, fontSize: tamanhoFonte.xl, fontWeight: "900", marginBottom: espacamento.lg },
  mensagem: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center" },
  detalhe: { color: cores.textoSecundario, fontSize: tamanhoFonte.xs, textAlign: "center", marginTop: espacamento.sm },
  tentar: { backgroundColor: cores.roxo, borderRadius: raio.md, paddingVertical: espacamento.sm, paddingHorizontal: espacamento.md, marginTop: espacamento.md },
  tentarTexto: { color: cores.textoClaro, fontWeight: "800", fontSize: tamanhoFonte.xs },
  card: { backgroundColor: cores.branco, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda, padding: espacamento.md, marginBottom: espacamento.md, ...sombra },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", marginBottom: espacamento.xs },
  tipo: { color: cores.magenta, fontWeight: "700", fontSize: tamanhoFonte.xs, textTransform: "uppercase" },
  status: { color: cores.textoSecundario, fontSize: tamanhoFonte.xs, fontWeight: "600" },
  cardTitulo: { color: cores.textoEscuro, fontSize: tamanhoFonte.lg, fontWeight: "800", marginBottom: espacamento.xs },
  loja: { color: cores.roxo, fontSize: tamanhoFonte.xs, fontWeight: "600", marginBottom: 2 },
  data: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, marginBottom: espacamento.xs },
  descricao: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, lineHeight: 18 },
});