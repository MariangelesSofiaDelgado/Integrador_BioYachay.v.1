import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const COLOR = "#9b59b6";
const COLOR_DARK = "#6c3483";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

// ─── Figura: triángulo CSS-style con borders ──────────────────────────────────
function Triangulo({ size, color }: { size: number; color: string }) {
  return (
    <View style={{
      width: 0, height: 0,
      borderLeftWidth: size / 2,
      borderRightWidth: size / 2,
      borderBottomWidth: size,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: color,
    }} />
  );
}

// ─── Molde punteado genérico ──────────────────────────────────────────────────
function Molde({ size, children }: { size: number; children?: React.ReactNode }) {
  return (
    <View style={{
      width: size, height: size,
      borderWidth: 2, borderColor: "#bbb",
      borderStyle: "dashed", borderRadius: 10,
      alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </View>
  );
}

// ─── Preview estático ─────────────────────────────────────────────────────────
function PreviewVisoespacial() {
  return (
    <View style={S.previewContainer}>
      <View style={S.previewCard}>

        {/* Etiqueta */}
        <View style={{ position: "absolute", top: 10, left: 0, right: 0, alignItems: "center" }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLOR }}>
            Encaja las figuras
          </Text>
        </View>

        {/* Fila de pares figura + molde */}
        <View style={{ flexDirection: "row", gap: 24, alignItems: "center", marginTop: 8 }}>

          {/* Par 1: triángulo */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <Triangulo size={34} color="#e74c3c" />
            <Molde size={44}>
              <Triangulo size={26} color="#ccc" />
            </Molde>
          </View>

          {/* Par 2: círculo */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#3182ce" }} />
            <Molde size={44}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: "#ccc", opacity: 0.5 }} />
            </Molde>
          </View>

          {/* Par 3: rombo */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <View style={{
              width: 28, height: 28, backgroundColor: "#9b59b6",
              borderRadius: 4, transform: [{ rotate: "45deg" }],
            }} />
            <Molde size={44}>
              <View style={{
                width: 22, height: 22, backgroundColor: "#ccc",
                borderRadius: 3, opacity: 0.5, transform: [{ rotate: "45deg" }],
              }} />
            </Molde>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuVisoespacial() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Zona superior ── */}
      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Visoespacial</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewVisoespacial />
      </View>

      {/* ── Tarjeta blanca ── */}
      <View style={S.tarjeta}>
        <View style={S.filaHeader}>
          <View style={S.tagObjetivo}>
            <Text style={S.tagObjetivoTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={40} color={COLOR} />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>
            Arrastra cada figura y colócala exactamente en su silueta punteada.
          </Text>
        </View>

        <View style={S.instruccionesTag}>
          <Text style={S.instruccionesTagTexto}>Instrucciones</Text>
        </View>

        <View style={S.instruccionesLista}>
          <Text style={S.instruccionLinea}>🧩 Observa las figuras de colores en pantalla.</Text>
          <Text style={S.instruccionLinea}>👆 Arrastra cada figura libremente.</Text>
          <Text style={S.instruccionLinea}>🎯 Suéltala sobre su silueta punteada para encajarla.</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable
            style={S.botonTutorial}
            onPress={() => router.push("/modulo/visoespacial/tutorial")}
          >
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable
            style={S.botonIniciar}
            onPress={() => router.push("/modulo/visoespacial/juego")}
          >
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}