import React from "react";
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { paleta } from "../constants/colors";
import { fontes } from "../constants/theme";

interface AvatarPerfilProps {
  foto?: string;
  nome?: string;
  tamanho?: number;
  // Contorno branco, para o avatar sobre a capa escura
  contorno?: boolean;
  estilo?: StyleProp<ViewStyle>;
}

// O .avatar do web: iniciais em roxo-700 sobre roxo-100 quando não há foto
export function AvatarPerfil({ foto, nome = "", tamanho = 36, contorno = false, estilo }: AvatarPerfilProps) {
  const iniciais = nome.trim().slice(0, 2).toUpperCase() || "?";
  const borda = contorno ? Math.max(2, Math.round(tamanho * 0.045)) : 0;
  const formato = {
    width: tamanho,
    height: tamanho,
    borderRadius: tamanho / 2,
    borderWidth: borda,
    borderColor: paleta.branco,
  };

  if (foto) {
    return (
      <View style={estilo}>
        <Image source={{ uri: foto }} accessibilityLabel={nome} style={[estilos.imagem, formato]} />
      </View>
    );
  }

  return (
    <View style={[estilos.placeholder, formato, estilo]} accessibilityLabel={nome}>
      <Text style={[estilos.iniciais, { fontSize: Math.max(11, Math.round(tamanho * 0.36)) }]}>{iniciais}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  imagem: { backgroundColor: paleta.roxo[100] },
  placeholder: { backgroundColor: paleta.roxo[100], alignItems: "center", justifyContent: "center" },
  iniciais: { color: paleta.roxo[700], fontFamily: fontes.bold, letterSpacing: 0.4 },
});
