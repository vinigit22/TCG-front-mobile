import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Loja } from "../models/types";
import { cores } from "../constants/colors";
import { espacamento, raio, sombra, tamanhoFonte } from "../constants/theme";
export function LojaCard({ loja, aoPressionar }: { loja: Loja; aoPressionar: (loja: Loja) => void }) {
 const local=loja.endereco ? `${loja.endereco.cidade}, ${loja.endereco.estado}` : undefined;
 return <Pressable style={({pressed})=>[s.card,pressed&&s.pressed]} onPress={()=>aoPressionar(loja)}><View style={s.icone}><Ionicons name="storefront-outline" size={24} color={cores.textoClaro}/></View><View style={s.conteudo}><Text style={s.nome} numberOfLines={1}>{loja.nome}{loja.verificada ? " ✓" : ""}</Text>{loja.descricao?<Text style={s.descricao} numberOfLines={2}>{loja.descricao}</Text>:null}{local?<Text style={s.local}>{local}</Text>:null}</View><Ionicons name="chevron-forward" size={20} color={cores.textoSecundario}/></Pressable>;
}
const s=StyleSheet.create({card:{backgroundColor:cores.branco,borderRadius:raio.lg,borderWidth:1,borderColor:cores.borda,padding:espacamento.sm,marginBottom:espacamento.sm,flexDirection:"row",alignItems:"center",gap:espacamento.sm,...sombra},pressed:{opacity:.85},icone:{width:54,height:54,borderRadius:raio.md,backgroundColor:cores.roxo,alignItems:"center",justifyContent:"center"},conteudo:{flex:1},nome:{color:cores.textoEscuro,fontSize:tamanhoFonte.md,fontWeight:"800"},descricao:{color:cores.textoSecundario,fontSize:tamanhoFonte.xs,marginTop:2},local:{color:cores.roxo,fontSize:tamanhoFonte.xs,fontWeight:"600",marginTop:4}});