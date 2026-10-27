import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InscricaoButton, EstadoInscricao } from "../../../src/components/Inscricaobutton";
import { Loja } from "../../../src/components/Loja";
import { Vagas } from "../../../src/components/Vagas";
import { BotaoVoltar } from "../../../src/components/BotaoVoltar";
import { Botao } from "../../../src/components/ui/Botao";
import { Capa } from "../../../src/components/ui/Capa";
import { EstadoVazio } from "../../../src/components/ui/EstadoVazio";
import { Faixa } from "../../../src/components/ui/Faixa";
import { Selo } from "../../../src/components/ui/Selo";
import { useAuth } from "../../../src/context/authContext";
import { useInscricoes } from "../../../src/context/inscricoesContext";
import { useTorneio } from "../../../src/hooks/useTorneio";
import { Inscricao, Torneio } from "../../../src/models/types";
import { mensagemDeErro } from "../../../src/services/erros";
import { formatarData, formatarHora, formatarTaxa } from "../../../src/utils/formatadores";
import { ROTULOS_STATUS_TORNEIO, TOM_STATUS_TORNEIO } from "../../../src/utils/status";
import { cores, paleta, sobreNoite } from "../../../src/constants/colors";
import { cartao, espacamento, fontes, raio, tamanhoFonte, tipografia } from "../../../src/constants/theme";
import { ehMenorDeIdade } from "../../../src/utils/idade";

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

// Um par rótulo/valor da grade de detalhes (.detalhes dt/dd no web)
function Detalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={estilos.detalhe}>
      <Text style={tipografia.sobretitulo}>{rotulo}</Text>
      <Text style={estilos.detalheValor}>{valor}</Text>
    </View>
  );
}

export default function DetalhesTorneio() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { autenticado, usuario } = useAuth();
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
          <ActivityIndicator color={cores.primaria} size="large" />
        </View>
      </View>
    );
  }

  if (!torneio) {
    return (
      <View style={estilos.container}>
        <BotaoVoltar />
        <View style={estilos.centralizado}>
          <EstadoVazio icone="trophy-outline" titulo="Torneio não encontrado" texto="Ele pode ter sido cancelado pela loja." />
        </View>
      </View>
    );
  }

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
  const local = torneio.endereco
    ? `${torneio.endereco.logradouro}${torneio.endereco.numero ? `, ${torneio.endereco.numero}` : ""} · ${torneio.endereco.cidade}/${torneio.endereco.estado}`
    : null;

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espacamento.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Capa>
          <View style={estilos.capaTopo}>
            <View style={estilos.jogo}>
              <Text style={estilos.jogoTexto} numberOfLines={1}>
                {torneio.jogo}
              </Text>
            </View>
            <Selo
              texto={ROTULOS_STATUS_TORNEIO[torneio.status]}
              tom={TOM_STATUS_TORNEIO[torneio.status]}
              vivo={torneio.status === "EM_ANDAMENTO"}
            />
          </View>
          <Text accessibilityRole="header" style={estilos.titulo}>
            {torneio.titulo}
          </Text>
          <Loja nome={torneio.nomeLoja} verificada={torneio.lojaVerificada} claro />
        </Capa>

        <View style={estilos.conteudo}>
          <View style={estilos.cartaoDetalhes}>
            <View style={estilos.grade}>
              <Detalhe rotulo="Data" valor={formatarData(torneio.dataInicio)} />
              <Detalhe rotulo="Horário" valor={formatarHora(torneio.dataInicio)} />
              <Detalhe rotulo="Inscrição" valor={formatarTaxa(torneio.taxaInscricao)} />
              {torneio.formato ? <Detalhe rotulo="Formato" valor={torneio.formato} /> : null}
              {torneio.inscricoesAte ? <Detalhe rotulo="Inscrições até" valor={formatarData(torneio.inscricoesAte)} /> : null}
              {torneio.totalRodadas ? <Detalhe rotulo="Rodadas" valor={String(torneio.totalRodadas)} /> : null}
            </View>
            {torneio.premiacao ? (
              <View style={estilos.premiacao}>
                <Text style={tipografia.sobretitulo}>Premiação</Text>
                <Text style={estilos.detalheValor}>{torneio.premiacao}</Text>
              </View>
            ) : null}
            <View style={estilos.vagas}>
              <Text style={tipografia.sobretitulo}>Vagas</Text>
              <Vagas vagasMax={torneio.vagasMax} vagasDisponiveis={torneio.vagasDisponiveis} />
            </View>
          </View>

          {inscricao && ehMenorDeIdade(usuario?.dataNascimento) ? (
            <Faixa
              tom="vermelho"
              titulo="Menor de 18 anos."
              texto="No dia do torneio, leve a autorização dos seus pais ou responsáveis para poder participar."
              estilo={estilos.avisoMenor}
            />
          ) : null}

          {local ? (
            <View style={estilos.bloco}>
              <Text style={estilos.blocoTitulo}>Local</Text>
              <Text style={estilos.texto}>{local}</Text>
            </View>
          ) : null}

          {torneio.descricao ? (
            <View style={estilos.bloco}>
              <Text style={estilos.blocoTitulo}>Sobre o torneio</Text>
              <Text style={estilos.texto}>{torneio.descricao}</Text>
            </View>
          ) : null}

          <View style={estilos.acoes}>
            <InscricaoButton estado={estadoInscricao} aoPressionar={aoPressionarInscricao} />
            {erroInscricao ? <Faixa tom="vermelho" texto={erroInscricao} /> : null}

            {chaveamentoDisponivel ? (
              <Botao
                titulo="Ver chaveamento"
                variante="secundario"
                icone="git-network-outline"
                larguraTotal
                aoPressionar={() => router.push(`/torneio/${torneio.id}/chaveamento`)}
              />
            ) : null}

            {/* A partida só existe depois que a chave é gerada */}
            {inscricao && chaveamentoDisponivel ? (
              <Botao
                titulo="Acompanhar minha partida"
                variante="secundario"
                icone="game-controller-outline"
                larguraTotal
                aoPressionar={() => router.push(`/torneio/${torneio.id}/confronto`)}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.pagina,
  },
  centralizado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  capaTopo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: espacamento.sm,
    marginBottom: espacamento.ms,
  },
  jogo: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: raio.pill,
    backgroundColor: sobreNoite.pilula,
  },
  jogoTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.xs,
    color: paleta.roxo[200],
  },
  titulo: {
    marginBottom: espacamento.ms,
    fontFamily: fontes.marca,
    fontSize: 23,
    lineHeight: 29,
    letterSpacing: 0.4,
    color: cores.textoInverso,
  },
  // O cartão de detalhes sobe por cima da capa, como os cartões de recursos na home do site
  conteudo: {
    marginTop: -espacamento.md,
    paddingHorizontal: espacamento.md,
  },
  cartaoDetalhes: {
    ...cartao,
    borderRadius: raio.cartao,
    padding: espacamento.md,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: espacamento.md,
  },
  detalhe: {
    width: "50%",
    gap: 3,
    paddingRight: espacamento.sm,
  },
  detalheValor: {
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.base,
    color: cores.texto,
  },
  premiacao: {
    gap: 3,
    marginTop: espacamento.md,
    paddingTop: espacamento.md,
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  vagas: {
    gap: 8,
    marginTop: espacamento.md,
    paddingTop: espacamento.md,
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  avisoMenor: {
    marginTop: espacamento.lg,
  },
  bloco: {
    marginTop: espacamento.lg,
  },
  blocoTitulo: {
    ...tipografia.tituloSecao,
    marginBottom: 6,
  },
  texto: {
    ...tipografia.corpo,
    color: cores.texto2,
  },
  acoes: {
    gap: espacamento.ms,
    marginTop: espacamento.lg,
  },
});