import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InscricaoButton, EstadoInscricao } from "../../../src/components/Inscricaobutton";
import { Loja } from "../../../src/components/Loja";
import { Vagas } from "../../../src/components/Vagas";
import { useAuth } from "../../../src/context/authContext";
import { useInscricoes } from "../../../src/context/inscricoesContext";
import { useTorneio } from "../../../src/hooks/useTorneio";
import { Inscricao, Torneio } from "../../../src/models/types";
import { mensagemDeErro } from "../../../src/services/erros";
import { formatarMoeda } from "../../../src/utils/formatadores";
import { cores } from "../../../src/constants/colors";
import { espacamento, raio, tamanhoFonte } from "../../../src/constants/theme";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";

// Mesmas regras do backend: só entra com inscrições abertas; torneio cheio leva à lista de espera
function calcularEstadoInscricao(
  torneio: Torneio,
  inscricao: Inscricao | undefined,
  autenticado: boolean,
  carregando: boolean
): EstadoInscricao {
  if (carregando) return "CARREGANDO";
  if (inscricao) return inscricao.status === "LISTA_ESPERA" ? "LISTA_ESPERA" : "INSCRITO";
  if (torneio.status !== "INSCRICOES_ABERTAS") return "ENCERRADO";
  if (!autenticado) return "DESLOGADO";
  if (torneio.vagasDisponiveis <= 0) return "ESGOTADO";
  return "DISPONIVEL";
}

export default function DetalhesTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { autenticado } = useAuth();
  const { inscricaoDoTorneio, inscrever } = useInscricoes();
  const { torneio, carregando } = useTorneio(Number(id));
  const inscricao = inscricaoDoTorneio(Number(id));
  const [carregandoInscricao, setCarregandoInscricao] = useState(false);
  const [erroInscricao, setErroInscricao] = useState<string | null>(null);

  if (carregando) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centralizado}>
          <ActivityIndicator color={cores.verdeEscuro} size="large" />
        </View>
      </View>
    );
  }

  if (!torneio) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centralizado}>
          <Text style={estilos.mensagemErro}>Torneio não encontrado.</Text>
        </View>
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

  const estadoInscricao = calcularEstadoInscricao(torneio, inscricao, autenticado, carregandoInscricao);

  async function aoPressionarInscricao() {
    if (!autenticado) {
      router.push("/login");
      return;
    }
    if (!torneio) return;

    setErroInscricao(null);
    setCarregandoInscricao(true);
    try {
      await inscrever(torneio);
    } catch (e) {
      setErroInscricao(mensagemDeErro(e, "Não foi possível concluir a inscrição."));
    } finally {
      setCarregandoInscricao(false);
    }
  }

  const chaveamentoDisponivel = torneio.status === "EM_ANDAMENTO" || torneio.status === "FINALIZADO";

  return (
    <View style={estilos.container}>
      <BotaoVoltar />
      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={[estilos.conteudo, { paddingBottom: insets.bottom + espacamento.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.jogo}>{torneio.jogo}</Text>
        <Text style={estilos.titulo}>{torneio.titulo}</Text>
        <Loja nome={torneio.nomeLoja} verificada={torneio.lojaVerificada} />

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
              <Text style={estilos.valor}>{formatarMoeda(torneio.taxaInscricao)}</Text>
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
        {erroInscricao ? <Text style={estilos.erroInscricao}>{erroInscricao}</Text> : null}

        {chaveamentoDisponivel ? (
          <Text style={estilos.linkChaveamento} onPress={() => router.push(`/torneio/${torneio.id}/chaveamento`)}>
            Ver chaveamento →
          </Text>
        ) : null}

        {/* A partida só existe depois que a chave é gerada */}
        {inscricao && chaveamentoDisponivel ? (
          <Text
            style={estilos.linkChaveamento}
            onPress={() => router.push(`/torneio/${torneio.id}/confronto`)}
          >
            Acompanhar minha partida →
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: espacamento.lg,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  erroInscricao: {
    color: cores.erro,
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.sm,
    textAlign: "center",
  },
  linkChaveamento: {
    color: cores.roxo,
    fontWeight: "700",
    fontSize: tamanhoFonte.sm,
    marginTop: espacamento.lg,
    textAlign: "center",
  },
});
