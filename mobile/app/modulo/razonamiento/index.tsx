/**
 * modulo/razonamiento/index.tsx
 * Preview estático: círculo con número objetivo + fichas numéricas seleccionables.
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";
import { yaVioTutorial, reiniciarTutorial } from "@/services/tutorialStorage";

const COLOR = "#f39c12";
const COLOR_DARK = "#b7770d";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

// ─── Preview estático ─────────────────────────────────────────────────────────
const FICHAS = [
  { num: 4, sel: false },
  { num: 6, sel: true },
  { num: 2, sel: false },
  { num: 7, sel: true },
  { num: 3, sel: false },
  { num: 5, sel: false },
];

function PreviewRazonamiento() {
  return (
    <View style={S.previewContainer}>
      <View style={S.previewCard}>

        {/* Etiqueta */}
        <View style={{ position: "absolute", top: 10, left: 0, right: 0, alignItems: "center" }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLOR }}>
            Suma hasta el objetivo
          </Text>
        </View>

        {/* Círculo objetivo */}
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: COLOR,
          alignItems: "center", justifyContent: "center",
          marginBottom: 10, marginTop: 16,
          elevation: 4,
        }}>
          <View style={{
            width: 50, height: 50, borderRadius: 25,
            backgroundColor: "#fff",
            alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ fontSize: 22, fontWeight: "900", color: COLOR_DARK }}>13</Text>
          </View>
        </View>

        {/* Fichas */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: 156, gap: 6, justifyContent: "center" }}>
          {FICHAS.map((f, i) => (
            <View key={i} style={{
              width: 40, height: 40, borderRadius: 10,
              backgroundColor: f.sel ? COLOR : "#fff",
              borderWidth: 1.5,
              borderColor: COLOR,
              alignItems: "center", justifyContent: "center",
              elevation: 2,
            }}>
              <Text style={{
                fontSize: 17, fontWeight: "900",
                color: f.sel ? "#fff" : COLOR_DARK,
              }}>{f.num}</Text>
            </View>
          ))}
        </View>

        {/* Suma parcial */}
        <View style={{
          position: "absolute", bottom: 10,
          backgroundColor: "#fff8ec", borderRadius: 99,
          paddingVertical: 3, paddingHorizontal: 10,
          borderWidth: 1, borderColor: COLOR + "66",
        }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: COLOR_DARK }}>
            Suma actual: 13 ✅
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MenuRazonamiento() {
  const router = useRouter();

  const handleIniciar = async () => {
    const yaVisto = await yaVioTutorial("razonamiento");
    if (yaVisto) {
      router.push("/modulo/razonamiento/juego");
    } else {
      router.push("/modulo/razonamiento/tutorial");
    }
  };
  
}