import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";

const COLOR      = "#e74c3c";
const COLOR_DARK = "#a93226";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

// ─── Preview estático ─────────────────────────────────────────────────────────
const OBJETIVO = "🍎";
const GRID_EMOJIS = ["🍊", "🍌", "🍇", "🍓", "🍎", "🥝", "🍑", "🍒", "🍈"];

function PreviewAtencion() {
  return (
    <View style={S.previewContainer}>
      <View style={S.previewCard}>

        {/* Etiqueta objetivo */}
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          paddingVertical: 6, paddingHorizontal: 16,
          marginBottom: 12, marginTop: 14,
          flexDirection: "row", alignItems: "center", gap: 6,
          borderWidth: 1.5, borderColor: COLOR + "44",
          elevation: 2,
        }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: COLOR_DARK }}>Encuentra:</Text>
          <Text style={{ fontSize: 26 }}>{OBJETIVO}</Text>
        </View>

        {/* Grid 3×3 */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: 138, gap: 4 }}>
          {GRID_EMOJIS.map((emoji, i) => {
            const esObjetivo = emoji === OBJETIVO;
            return (
              <View key={i} style={{
                width: 40, height: 40, borderRadius: 8,
                backgroundColor: esObjetivo ? COLOR : "#fff",
                borderWidth: esObjetivo ? 0 : 1,
                borderColor: "#e0e0e0",
                alignItems: "center", justifyContent: "center",
                elevation: esObjetivo ? 3 : 1,
              }}>
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuAtencion() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Zona superior ── */}
      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Atención</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewAtencion />
      </View>

      {/* ── Tarjeta blanca ── */}
      <View style={S.tarjeta}>
        <View style={S.filaHeader}>
          <View style={S.tagObjetivo}>
            <Text style={S.tagObjetivoTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="eye-outline" size={40} color={COLOR} />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>
            Encuentra el emoji objetivo en el tablero lo más rápido posible.
          </Text>
        </View>

        <View style={S.instruccionesTag}>
          <Text style={S.instruccionesTagTexto}>Instrucciones</Text>
        </View>

        <View style={S.instruccionesLista}>
          <Text style={S.instruccionLinea}>👁️ Memoriza el emoji objetivo que aparece arriba.</Text>
          <Text style={S.instruccionLinea}>🔍 Búscalo rápido entre todos los del tablero.</Text>
          <Text style={S.instruccionLinea}>⚡ ¡Tócalo antes de que se acabe el tiempo!</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable
            style={S.botonTutorial}
            onPress={() => router.push("/modulo/atencion/tutorial")}
          >
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable
            style={S.botonIniciar}
            onPress={() => router.push("/modulo/atencion/juego")}
          >
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}