import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InscricaoButton, EstadoInscricao } from "../../../src/components/Inscricaobutton";
import { Loja } from "../../../src/components/Loja";
import { Vagas } from "../../../src/components/Vagas";
import { buscarTorneioMock } from "../../../src/mocks/torneios";
import { useAuth } from "../../../src/context/authContext";
import { cores } from "../../../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../../../src/constants/theme";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";

export default function DetalhesTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { autenticado } = useAuth();
  const [inscrito, setInscrito] = useState(false);
  const [carregandoInscricao, setCarregandoInscricao] = useState(false);

  const torneio = buscarTorneioMock(Number(id));

  if (!torneio) {
    return (
      
      <View style={estilos.centralizado}>
        <Text style={estilos.mensagemErro}>Torneio não encontrado.</Text>
      </View>
      
    );

  }

  const data = new Date(torneio.dataInicio);
  const dataFormatada = `${String(data.getDate()).padStart(2, "0")}/${String(
    data.getMonth() + 1
  ).padStart(2, "0")}/${data.getFullYear()}`;
  const horarioFormatado = `${String(data.getHours()).padStart(2, "0")}:${String(
    data.getMinutes()
  ).padStart(2, "0")}`;

  let estadoInscricao: EstadoInscricao = "DISPONIVEL";
  if (!autenticado) estadoInscricao = "DESLOGADO";
  else if (inscrito) estadoInscricao = "INSCRITO";
  else if (torneio.vagasDisponiveis <= 0) estadoInscricao = "ESGOTADO";
  if (carregandoInscricao) estadoInscricao = "CARREGANDO";

  function aoPressionarInscricao() {
    if (!autenticado) {
      router.push("/login");
      return;
    }

    setCarregandoInscricao(true);
    setTimeout(() => {
      setInscrito(true);
      setCarregandoInscricao(false);
    }, 600);
  }

  const mostrarChaveamento = torneio.status === "EM_ANDAMENTO" || torneio.status === "FINALIZADO";

  return (
    <ScrollView style={estilos.container} contentContainerStyle={[estilos.conteudo, { paddingTop: insets.top + espacamento.lg, paddingBottom: insets.bottom + espacamento.xl }]} showsVerticalScrollIndicator={false}>
      <Text style={estilos.jogo}>{torneio.jogo}</Text>
      <Text style={estilos.titulo}>{torneio.titulo}</Text>
      <Loja nome={torneio.nomeLoja} />

      {torneio.descricao ? <Text style={estilos.descricao}>{torneio.descricao}</Text> : null}

      <View style={estilos.card}>
        <View style={estilos.linha}>
          <Text style={estilos.rotulo}>Data</Text>
          <Text style={estilos.valor}>{dataFormatada}</Text>
        </View>
        <View style={estilos.linha}>
          <Text style={estilos.rotulo}>Horário</Text>
          <Text style={estilos.valor}>{horarioFormatado}</Text>
        </View>
        {torneio.taxaInscricao > 0 ? (
          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>Inscrição</Text>
            <Text style={estilos.valor}>R$ {torneio.taxaInscricao.toFixed(2)}</Text>
          </View>
        ) : null}
        {torneio.premiacao ? (
          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>Premiação</Text>
            <Text style={estilos.valor}>{torneio.premiacao}</Text>
          </View>
        ) : null}
        <View style={estilos.linha}>
          <Text style={estilos.rotulo}>Vagas</Text>
          <Vagas vagasMax={torneio.vagasMax} vagasDisponiveis={torneio.vagasDisponiveis} />
        </View>
      </View>

      <InscricaoButton estado={estadoInscricao} aoPressionar={aoPressionarInscricao} />

      {mostrarChaveamento ? (
        <Text style={estilos.linkChaveamento} onPress={() => router.push(`/torneio/${torneio.id}/chaveamento`)}>
          Ver chaveamento →
        </Text>
      ) : null}

      {inscrito ? (
        <Text
          style={estilos.linkChaveamento}
          onPress={() => router.push(`/torneio/${torneio.id}/confronto`)}
        >
          Acompanhar minha partida →
        </Text>
      ) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espacamento.lg,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
  mensagemErro: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.md,
  },
  jogo: {
    color: cores.magenta,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
    textTransform: "uppercase",
  },
  titulo: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.xl,
    fontWeight: "900",
    marginBottom: espacamento.xs,
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.md,
    lineHeight: 20,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 2,
    borderColor: cores.verdeEscuro,
    padding: espacamento.md,
    marginVertical: espacamento.lg,
    gap: espacamento.sm,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: tamanhoFonte.sm,
    fontWeight: "600",
  },
  valor: {
    color: cores.textoEscuro,
    fontSize: tamanhoFonte.sm,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },
  linkChaveamento: {
    color: cores.roxo,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.lg,
    textAlign: "center",
  },
});
