import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { eventoService } from "../../src/services/eventoService";
import { Evento } from "../../src/models/types";
import { cores } from "../../src/constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../../src/constants/theme";

const ROTULOS_TIPO: Record<Evento["tipo"], string> = {
  TROCA: "Troca de cartas",
  CONFRATERNIZACAO: "Confraternização",
  PROMOCAO: "Promoção",
  LANCAMENTO: "Lançamento",
  CASUAL: "Casual",
  OUTRO: "Evento especial",
};

const ROTULOS_STATUS: Record<Evento["status"], string> = {
  RASCUNHO: "Em breve",
  PUBLICADO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
};

function formatarData(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function Eventos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      eventoService
        .listar(["PUBLICADO", "EM_ANDAMENTO"])
        .then(setEventos)
        .catch(() => setErro("Não foi possível carregar os eventos."))
        .finally(() => setCarregando(false));
    }, [])
  );

  return (
    <View style={[estilos.container, { paddingTop: insets.top + espacamento.sm }]}>
      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator color={cores.roxo} size="large" />
        </View>
      ) : erro ? (
        <View style={estilos.centro}>
          <Text style={estilos.mensagem}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={<Text style={estilos.titulo}>Eventos</Text>}
          ListEmptyComponent={
            <Text style={estilos.mensagem}>Nenhum evento disponível no momento.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [estilos.card, pressed && { opacity: 0.85 }]}
              onPress={() => router.push(`/evento/${item.id}` as never)}
            >
              <View style={estilos.cardTopo}>
                <Text style={estilos.tipo}>{ROTULOS_TIPO[item.tipo]}</Text>
                <Text style={estilos.status}>{ROTULOS_STATUS[item.status]}</Text>
              </View>
              <Text style={estilos.cardTitulo}>{item.titulo}</Text>
              {item.nomeLoja ? <Text style={estilos.loja}>{item.nomeLoja}</Text> : null}
              <Text style={estilos.data}>{formatarData(item.dataInicio)}</Text>
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
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: espacamento.lg },
  titulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.md,
  },
  mensagem: { color: cores.textoSecundario, fontSize: tamanhoFonte.md, textAlign: "center" },
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamento.md,
    marginBottom: espacamento.md,
    ...sombra,
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: espacamento.xs,
  },
  tipo: {
    color: cores.magenta,
    fontWeight: "700",
    fontSize: tamanhoFonte.xs,
    textTransform: "uppercase",
  },
  status: { color: cores.textoSecundario, fontSize: tamanhoFonte.xs, fontWeight: "600" },
  cardTitulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.lg,
    fontWeight: "800",
    marginBottom: espacamento.xs,
  },
  loja: { color: cores.roxo, fontSize: tamanhoFonte.xs, fontWeight: "600", marginBottom: 2 },
  data: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, marginBottom: espacamento.xs },
  descricao: { color: cores.textoSecundario, fontSize: tamanhoFonte.sm, lineHeight: 18 },
});
