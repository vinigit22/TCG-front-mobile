import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { cores } from "../constants/colors";

interface AvatarPerfilProps {
  foto?: string;
  nome?: string;
  tamanho?: number;
}

export function AvatarPerfil({ foto, nome = "", tamanho = 36 }: AvatarPerfilProps) {
  const iniciais = nome.trim().slice(0, 2).toUpperCase() || "?";
  const estiloAvatar = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };

  if (foto) return <Image source={{ uri: foto }} style={[estilos.imagem, estiloAvatar]} />;

  return (
    <View style={[estilos.placeholder, estiloAvatar]}>
      <Text style={[estilos.iniciais, { fontSize: Math.max(11, tamanho * 0.38) }]}>{iniciais}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  imagem: { backgroundColor: cores.roxo },
  placeholder: { backgroundColor: cores.roxoClaro, alignItems: "center", justifyContent: "center" },
  iniciais: { color: cores.textoClaro, fontWeight: "800" },
});
