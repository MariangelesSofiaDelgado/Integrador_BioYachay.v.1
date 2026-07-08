import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";

const COLOR = "#e67e22";
const COLOR_DARK = "#a85a12";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

const TIPOS_EJERCICIO = [
  { emoji: "🔥", nombre: "Calentamiento" },
  { emoji: "🙆", nombre: "Hombros" },
  { emoji: "💪", nombre: "Brazos" },
  { emoji: "🚶", nombre: "Piernas" },
  { emoji: "🦶", nombre: "Tobillos" },
];

function PreviewCognitivas() {
  return (
    <View style={S.previewContainer}>
      <View style={[S.previewCard, { overflow: "visible" }]}>
        <View style={{ position: "absolute", top: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLOR }}>
            Muévete a tu ritmo
          </Text>
        </View>

        <Text style={{ fontSize: 74 }}>🤸</Text>

        {/* Reloj decorativo, alude al cronómetro de la siguiente pantalla */}
        <View
          style={{
            position: "absolute",
            bottom: 14,
            right: 18,
            backgroundColor: COLOR + "22",
            borderRadius: 999,
            padding: 6,
          }}
        >
          <MaterialCommunityIcons name="timer-outline" size={22} color={COLOR} />
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuCognitivas() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Zona superior ── */}
      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Cognitivo</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewCognitivas />
      </View>

      {/* ── Tarjeta blanca ── */}
      <View style={S.tarjeta}>
        {/* Objetivo */}
        <View style={S.filaHeader}>
          <View style={S.tagObjetivo}>
            <Text style={S.tagObjetivoTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="human-handsup" size={40} color={COLOR} />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>
            Realiza ejercicios sencillos de movilidad, guiados por una
            animación y un cronómetro, para mantener tu cuerpo activo y
            prevenir el deterioro cognitivo.
          </Text>
        </View>

        {/* Tipos de ejercicio */}
        <View style={S.instruccionesTag}>
          <Text style={S.instruccionesTagTexto}>Ejercicios de hoy</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {TIPOS_EJERCICIO.map((tipo) => (
            <View
              key={tipo.nombre}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLOR + "18",
                borderRadius: 999,
                paddingVertical: 5,
                paddingHorizontal: 12,
                gap: 5,
              }}
            >
              <Text style={{ fontSize: 15 }}>{tipo.emoji}</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: COLOR_DARK }}>
                {tipo.nombre}
              </Text>
            </View>
          ))}
        </View>

        {/* Instrucciones */}
        <View style={S.instruccionesLista}>
          <Text style={S.instruccionLinea}>⏱️ Cada ejercicio dura solo unos segundos.</Text>
          <Text style={S.instruccionLinea}>🎬 Observa la animación y repite el movimiento.</Text>
          <Text style={S.instruccionLinea}>🙆 Hazlo sin prisa, a tu propio ritmo.</Text>
        </View>

        {/* Botón único de Iniciar */}
        <View style={S.filaBotones}>
          <Pressable
            style={S.botonIniciar}
            onPress={() => router.push("/modulo/cognitivas/juego")}
          >
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}