import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { cores, paleta } from "../../constants/colors";
import { fontes, raio, tamanhoFonte, tipografia } from "../../constants/theme";

interface CampoProps extends TextInputProps {
  rotulo: string;
  opcional?: boolean;
  erro?: string | null;
  ajuda?: string;
  // Campo de senha com o botão "Mostrar/Ocultar", como no login do site
  senha?: boolean;
}

// Rótulo + campo + ajuda/erro: o .campo/.controle do web, com o mesmo anel roxo ao focar
export function Campo({ rotulo, opcional, erro, ajuda, senha, multiline, style, onFocus, onBlur, ...props }: CampoProps) {
  const [focado, setFocado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {opcional ? <Text style={estilos.opcional}> (opcional)</Text> : null}
      </Text>
      <View style={[estilos.anel, focado && (erro ? estilos.anelErro : estilos.anelFocado)]}>
        <View
          style={[
            estilos.controle,
            multiline && estilos.controleMultilinha,
            focado && estilos.controleFocado,
            !!erro && estilos.controleErro,
          ]}
        >
          <TextInput
            {...props}
            accessibilityLabel={props.accessibilityLabel ?? rotulo}
            multiline={multiline}
            secureTextEntry={senha ? !mostrarSenha : props.secureTextEntry}
            placeholderTextColor={paleta.tinta[400]}
            textAlignVertical={multiline ? "top" : "center"}
            style={[estilos.input, multiline && estilos.inputMultilinha, style]}
            onFocus={(evento) => {
              setFocado(true);
              onFocus?.(evento);
            }}
            onBlur={(evento) => {
              setFocado(false);
              onBlur?.(evento);
            }}
          />
          {senha ? (
            <Pressable
              onPress={() => setMostrarSenha((atual) => !atual)}
              style={({ pressed }) => [estilos.mostrar, pressed && estilos.mostrarPressionado]}
              accessibilityRole="button"
              hitSlop={6}
            >
              <Text style={estilos.mostrarTexto}>{mostrarSenha ? "Ocultar" : "Mostrar"}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : ajuda ? <Text style={estilos.ajuda}>{ajuda}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: {
    gap: 6,
  },
  rotulo: tipografia.rotulo,
  opcional: {
    fontFamily: fontes.medio,
    color: cores.texto3,
  },
  // O anel de foco (--anel-foco) é uma borda externa de 3px; a margem negativa mantém o campo alinhado
  anel: {
    marginHorizontal: -3,
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: raio.md + 3,
  },
  anelFocado: {
    borderColor: "rgba(108, 76, 224, 0.28)",
  },
  anelErro: {
    borderColor: "rgba(229, 72, 77, 0.22)",
  },
  controle: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    borderWidth: 1,
    borderColor: cores.bordaForte,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  controleMultilinha: {
    alignItems: "flex-start",
  },
  controleFocado: {
    borderColor: paleta.roxo[500],
  },
  controleErro: {
    borderColor: paleta.vermelho[500],
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhoFonte.base,
  },
  inputMultilinha: {
    minHeight: 96,
    lineHeight: 21,
  },
  mostrar: {
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginRight: 6,
    borderRadius: raio.sm,
  },
  mostrarPressionado: {
    backgroundColor: paleta.roxo[50],
  },
  mostrarTexto: {
    fontFamily: fontes.bold,
    fontSize: tamanhoFonte.xs,
    color: paleta.roxo[600],
  },
  ajuda: tipografia.legenda,
  erro: {
    fontFamily: fontes.medio,
    fontSize: tamanhoFonte.xs,
    color: paleta.vermelho[700],
  },
});
