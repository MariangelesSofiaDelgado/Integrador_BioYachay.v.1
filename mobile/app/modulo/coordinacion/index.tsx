
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";

const COLOR       = "#2ecc71";
const COLOR_DARK  = "#1a8a4a";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

// ─── Preview estático del juego de coordinación ───────────────────────────────
const FRUTAS_PREVIEW = [
  { emoji: "🍎", left: 118,  top: 108  },
  { emoji: "🍊", left: 72,  top: 128 },
  { emoji: "🍇", left: 132,  top: 34 },
  { emoji: "🍌", left: 108,  top: 55  },
];

function PreviewCoordinacion() {
  return (
    <View style={S.previewContainer}>
      <View style={[S.previewCard, { overflow: "visible" }]}>

        {/* Etiqueta */}
        <View style={{ position: "absolute", top: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLOR }}>
            Atrapa las frutas
          </Text>
        </View>

        {/* Frutas estáticas en distintas posiciones */}
        <View style={{
          width: "100%", height: "100%",
          position: "absolute", top: 0, left: 0,
        }}>
          {FRUTAS_PREVIEW.map((f, i) => (
            <Text key={i} style={{
              position: "absolute",
              left: f.left, top: f.top,
              fontSize: 28,
            }}>{f.emoji}</Text>
          ))}
        </View>

        {/* Línea guía */}
        <View style={{
          position: "absolute", bottom: 52,
          left: 12, right: 12, height: 1,
          borderStyle: "dashed", borderWidth: 1,
          borderColor: COLOR + "55",
        }} />

        {/* Canasta */}
        <Text style={{
          position: "absolute", bottom: 10,
          left: "36%", fontSize: 40,
        }}>🧺</Text>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuCoordinacion() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Zona superior ── */}
      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Coordinación</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewCoordinacion />
      </View>

      {/* ── Tarjeta blanca ── */}
      <View style={S.tarjeta}>
        {/* Objetivo */}
        <View style={S.filaHeader}>
          <View style={S.tagObjetivo}>
            <Text style={S.tagObjetivoTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="hand-pointing-up" size={40} color={COLOR} />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>
            Mueve la canasta y atrapa la mayor cantidad de frutas posible.
          </Text>
        </View>

        {/* Instrucciones */}
        <View style={S.instruccionesTag}>
          <Text style={S.instruccionesTagTexto}>Instrucciones</Text>
        </View>

        <View style={S.instruccionesLista}>
          <Text style={S.instruccionLinea}>🧺 Arrastra la canasta con tu dedo.</Text>
          <Text style={S.instruccionLinea}>👆 Intercepta las frutas antes de que caigan.</Text>
          <Text style={S.instruccionLinea}>⏱️ ¡Atrapa la mayor cantidad posible!</Text>
        </View>

        {/* Botones */}
        <View style={S.filaBotones}>
          <Pressable
            style={S.botonTutorial}
            onPress={() => router.push("/modulo/coordinacion/tutorial")}
          >
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable
            style={S.botonIniciar}
            onPress={() => router.push("/modulo/coordinacion/juego")}
          >
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}