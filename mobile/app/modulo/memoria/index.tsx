import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";
import { yaVioTutorial, reiniciarTutorial } from "@/services/tutorialStorage";

const COLOR = "#3486e3";
const COLOR_DARK = "#0e57b0";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

// ─── Preview estático del juego de memoria ────────────────────────────────────
const GRID = [
  { emoji: "🍎", reveal: true },
  { emoji: "🍌", reveal: false },
  { emoji: "🍇", reveal: false },
  { emoji: "🍌", reveal: false },
  { emoji: "🍎", reveal: true },
  { emoji: "🍓", reveal: false },
  { emoji: "🥝", reveal: false },
  { emoji: "🍇", reveal: false },
  { emoji: "🍓", reveal: false },
];

function PreviewMemoria() {
  return (
    <View style={S.previewContainer}>
      <View style={S.previewCard}>
        <View style={{
          position: "absolute", top: 10, left: 0, right: 0,
          alignItems: "center",
        }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLOR }}>
            Encuentra los pares
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", width: 132, gap: 4, marginTop: 20 }}>
          {GRID.map((c, i) => (
            <View key={i} style={{
              width: 40, height: 40, borderRadius: 8,
              backgroundColor: c.reveal ? "#fff" : COLOR,
              borderWidth: c.reveal ? 2 : 0,
              borderColor: COLOR,
              alignItems: "center", justifyContent: "center",
              elevation: 2,
            }}>
              {c.reveal
                ? <Text style={{ fontSize: 20 }}>{c.emoji}</Text>
                : <Text style={{ fontSize: 16, color: "#fff", fontWeight: "900" }}>?</Text>
              }
            </View>
          ))}
        </View>

        <View style={{
          position: "absolute", bottom: 10,
          backgroundColor: "#f0fff4", borderRadius: 99,
          paddingVertical: 3, paddingHorizontal: 10,
          borderWidth: 1, borderColor: "#9ae6b4",
        }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: "#276749" }}>
            ✅ ¡Par encontrado!
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuMemoria() {
  const router = useRouter();

  const handleIniciar = async () => {
    const yaVisto = await yaVioTutorial("memoria");
    if (yaVisto) {
      router.push("/modulo/memoria/juego");
    } else {
      router.push("/modulo/memoria/tutorial");
    }
  };

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Memoria</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewMemoria />
      </View>

      <View style={S.tarjeta}>
        <View style={S.filaHeader}>
          <View style={S.tagObjetivo}>
            <Text style={S.tagObjetivoTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="brain" size={40} color={COLOR} />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>
            Encuentra todos los pares de frutas antes de que se acabe el tiempo.
          </Text>
        </View>

        <View style={S.instruccionesTag}>
          <Text style={S.instruccionesTagTexto}>Instrucciones</Text>
        </View>

        <View style={S.instruccionesLista}>
          <Text style={S.instruccionLinea}>🧠 Memoriza la posición de cada fruta.</Text>
          <Text style={S.instruccionLinea}>🃏 Toca dos cartas para encontrar un par.</Text>
          <Text style={S.instruccionLinea}>⏱️ ¡Completa todos los pares a tiempo!</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable
            style={S.botonIniciar}
            onPress={handleIniciar}
          >
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
          <Pressable onPress={() => reiniciarTutorial("memoria")}>
            <Text>🔄 Reiniciar tutorial</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}