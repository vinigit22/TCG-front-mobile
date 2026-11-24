import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Torneio } from "../models/types";
import { cores, paleta } from "../constants/colors";
import { espacamento, fontes, raio, sombras, tamanhoFonte, tipografia } from "../constants/theme";
import { formatarDataCurta, formatarTaxa } from "../utils/formatadores";
import { ROTULOS_STATUS_TORNEIO, TOM_STATUS_TORNEIO } from "../utils/status";
import { Loja } from "./Loja";
import { Vagas } from "./Vagas";
import { Degrade } from "./ui/Degrade";
import { Selo } from "./ui/Selo";

interface TorneioCardProps {
  torneio: Torneio;
  aoPressionar: (torneio: Torneio) => void;
}

function Chip({ texto, icone }: { texto: string; icone?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={estilos.chip}>
      {icone ? <Ionicons name={icone} size={13} color={paleta.tinta[700]} /> : null}
      <Text style={estilos.chipTexto} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

// O mesmo cartão da página Torneios do site: barra roxo->verde, jogo, status, título em Bungee, chips e vagas
export function TorneioCard({ torneio, aoPressionar }: TorneioCardProps) {
  const cidade = torneio.endereco ? `${torneio.endereco.cidade}/${torneio.endereco.estado}` : null;

  return (
    <Pressable
      style={({ pressed }) => [estilos.card, pressed && estilos.cardPressionado]}
      onPress={() => aoPressionar(torneio)}
      accessibilityRole="button"
      accessibilityLabel={`${torneio.titulo}, ${ROTULOS_STATUS_TORNEIO[torneio.status]}`}
    >
      <Degrade estilo={estilos.barra} />

      <View style={estilos.topo}>
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

      <Text style={estilos.titulo} numberOfLines={2}>
        {torneio.titulo}
      </Text>

      <View style={estilos.info}>
        <Loja nome={torneio.nomeLoja} verificada={torneio.lojaVerificada} />
        <View style={estilos.infoLinha}>
          <View style={estilos.infoItem}>
            <Ionicons name="calendar-outline" size={14} color={cores.texto3} />
            <Text style={estilos.infoTexto}>{formatarDataCurta(torneio.dataInicio)}</Text>
          </View>
          {cidade ? (
            <View style={estilos.infoItem}>
              <Ionicons name="location-outline" size={14} color={cores.texto3} />
              <Text style={estilos.infoTexto} numberOfLines={1}>
                {cidade}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={estilos.chips}>
        <Chip texto={formatarTaxa(torneio.taxaInscricao)} icone="ticket-outline" />
        {torneio.formato ? <Chip texto={torneio.formato} /> : null}
        {torneio.premiacao ? <Chip texto={torneio.premiacao} icone="trophy-outline" /> : null}
      </View>

      <View style={estilos.rodape}>
        <Vagas vagasMax={torneio.vagasMax} vagasDisponiveis={torneio.vagasDisponiveis} />
        <View style={estilos.ver}>
          <Text style={estilos.verTexto}>Ver</Text>
          <Ionicons name="chevron-forward" size={15} color={paleta.roxo[600]} />
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: espacamento.md,
    paddingLeft: espacamento.ml + 2,
    paddingRight: espacamento.md,
    marginBottom: espacamento.ms,
    overflow: "hidden",
    ...sombras.xs,
  },
  // Como :hover no site: borda roxa clara
  cardPressionado: {
    borderColor: paleta.roxo[200],
    backgroundColor: paleta.roxo[50],
  },
  barra: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacamento.sm,
    marginBottom: 10,
  },
  // .torneio-jogo-tag
  jogo: {
    flexShrink: 1,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: raio.pill,
    backgroundColor: paleta.roxo[100],
  },
  jogoTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.xs,
    color: paleta.roxo[700],
  },
  titulo: {
    ...tipografia.tituloCartao,
    marginBottom: espacamento.sm,
  },
  info: {
    gap: 6,
    marginBottom: espacamento.ms,
  },
  infoLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: espacamento.md,
    rowGap: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.sm,
    color: cores.texto2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  // .torneio-chip
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
    height: 28,
    paddingHorizontal: 10,
    borderRadius: raio.sm,
    backgroundColor: paleta.tinta[100],
  },
  chipTexto: {
    flexShrink: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhoFonte.sm,
    color: paleta.tinta[700],
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.md,
    marginTop: espacamento.ms,
    paddingTop: espacamento.ms,
    borderTopWidth: 1,
    borderTopColor: cores.divisor,
  },
  ver: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  verTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.sm,
    color: paleta.roxo[600],
  },
});
