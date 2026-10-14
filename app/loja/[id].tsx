import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { BotaoVoltar } from "../../src/components/BotaoVoltar";
import { TorneioCard } from "../../src/components/torneioCard";
import { Loja } from "../../src/models/types";
import { lojaService } from "../../src/services/lojaService";
import { torneioService } from "../../src/services/torneioService";
import { cores } from "../../src/constants/colors";
import { espacamento, tamanhoFonte } from "../../src/constants/theme";

export default function PerfilLoja() {
  const { id } = useLocalSearchParams<{ id: string }>(); const router = useRouter();
  const [loja, setLoja] = useState<Loja | null>(null); const [torneios, setTorneios] = useState<any[]>([]); const [carregando, setCarregando] = useState(true);
  useFocusEffect(useCallback(() => { const lojaId=Number(id); setCarregando(true); Promise.all([lojaService.buscar(lojaId), torneioService.listar(lojaId)]).then(([perfil, lista]) => { setLoja(perfil); setTorneios(lista); }).finally(() => setCarregando(false)); }, [id]));
  return <View style={estilos.container}><BotaoVoltar />{carregando ? <View style={estilos.centro}><ActivityIndicator color={cores.roxo} size="large" /></View> : !loja ? <View style={estilos.centro}><Text style={estilos.mensagem}>Loja não encontrada.</Text></View> : <ScrollView contentContainerStyle={estilos.conteudo}><Text style={estilos.titulo}>{loja.nome}{loja.verificada ? " ✓" : ""}</Text>{loja.descricao ? <Text style={estilos.descricao}>{loja.descricao}</Text> : null}{loja.telefone ? <Text style={estilos.info}>{loja.telefone}</Text> : null}{loja.endereco ? <Text style={estilos.info}>{loja.endereco.logradouro}, {loja.endereco.numero} · {loja.endereco.cidade}/{loja.endereco.estado}</Text> : null}<Text style={estilos.subtitulo}>Torneios da loja</Text>{torneios.length ? torneios.map(torneio => <TorneioCard key={torneio.id} torneio={torneio} aoPressionar={item => router.push(`/torneio/${item.id}`)} />) : <Text style={estilos.mensagem}>Esta loja ainda não possui torneios públicos.</Text>}</ScrollView>}</View>;
}
const estilos=StyleSheet.create({container:{flex:1,backgroundColor:cores.fundo},conteudo:{padding:espacamento.md,paddingBottom:espacamento.xl},centro:{flex:1,alignItems:"center",justifyContent:"center"},titulo:{color:cores.textoEscuro,fontSize:tamanhoFonte.xl,fontWeight:"900"},descricao:{color:cores.textoSecundario,fontSize:tamanhoFonte.md,marginTop:espacamento.sm},info:{color:cores.roxo,fontSize:tamanhoFonte.sm,marginTop:espacamento.sm},subtitulo:{color:cores.verdeEscuro,fontSize:tamanhoFonte.lg,fontWeight:"900",marginTop:espacamento.lg,marginBottom:espacamento.sm},mensagem:{color:cores.textoSecundario,fontSize:tamanhoFonte.md,textAlign:"center"}});