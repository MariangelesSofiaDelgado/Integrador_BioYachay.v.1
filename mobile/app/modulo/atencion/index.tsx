import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { crearEstilosModulo } from "../styleModuloBase";
import { TUTORIAL_ATENCION_KEY } from "../atencion/tutorial";

const COLOR      = "#e74c3c";
const COLOR_DARK = "#a93226";

const S = crearEstilosModulo(COLOR, COLOR_DARK);

const OBJETIVO    = "🍎";
const GRID_EMOJIS = ["🍊", "🍌", "🍇", "🍓", "🍎", "🥝", "🍑", "🍒", "🍈"];

function PreviewAtencion() {
  return (
    <View style={S.previewContainer}>
      <View style={S.previewCard}>
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

export default function MenuAtencion() {
  const router = useRouter();
  const [tutorialVisto, setTutorialVisto] = useState<boolean | null>(null);

  // Se re-ejecuta cada vez que esta pantalla vuelve al foco
  // (ej: después de volver del juego o del tutorial)
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(TUTORIAL_ATENCION_KEY).then((val) => {
        setTutorialVisto(val === "1");
      });
    }, [])
  );

  const handleJugar = () => {
    if (tutorialVisto) {
      router.push("/modulo/atencion/juego");
    } else {
      router.push("/modulo/atencion/tutorial");
    }
  };

  const handleReiniciarTutorial = async () => {
    await AsyncStorage.removeItem(TUTORIAL_ATENCION_KEY);
    setTutorialVisto(false);
    router.push("/modulo/atencion/tutorial");
  };

  if (tutorialVisto === null) return null;

  return (
    <View style={S.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={S.zonaSuperior}>
        <View style={S.tituloWrapper}>
          <Text style={S.titulo}>Atención</Text>
          <View style={S.tituloLinea} />
        </View>
        <PreviewAtencion />
      </View>

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
          {/* Reiniciar tutorial — solo visible después de haber jugado por primera vez */}
          {tutorialVisto && (
            <Pressable style={S.botonIniciar} onPress={handleReiniciarTutorial}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
                <Text style={S.textoBoton}>Reiniciar tutorial</Text>
              </View>
            </Pressable>
          )}

          {/* Botón principal — siempre visible */}
          <Pressable style={S.botonIniciar} onPress={handleJugar}>
            <Text style={S.textoBoton}>Jugar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
