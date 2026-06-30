import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylestutorial";

import { TutorialBubble, ResaltadoAyuda } from "../../../components/TutorialBubble";
import { useInactivityHelper } from "../../../hooks/useInactivity";
import { marcarTutorialVisto } from "../../../services/tutorialStorage";

// Cuántos aciertos SEGUIDOS necesita el usuario para terminar el tutorial
const META_RACHA = 3;

// Rondas fijas y predecibles para el tutorial (a diferencia del juego real
// que es aleatorio). Cada ronda: fichas + el objetivo correcto.
const RONDAS = [
  { fichas: [3, 5, 2, 6], objetivo: 8 },   // 3+5
  { fichas: [4, 6, 1, 3], objetivo: 7 },   // 4+3
  { fichas: [2, 5, 4, 1], objetivo: 9 },   // 5+4
];

type Fase = "intro" | "jugando" | "completado";

export default function TutorialRazonamiento() {
  const router = useRouter();

  const [fase, setFase] = useState<Fase>("intro");
  const [rondaIndex, setRondaIndex] = useState(0);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [racha, setRacha] = useState(0);

  const ronda = RONDAS[rondaIndex];
  const sumaActual = seleccionadas.reduce((acc, i) => acc + ronda.fichas[i], 0);

  const { necesitaAyuda, registrarActividad } = useInactivityHelper({
    pasoActual: `${fase}-${racha}-${seleccionadas.length}`,
    activo: fase === "intro" || fase === "jugando",
  });

  const siguienteRonda = () => {
    setRondaIndex((prev) => (prev + 1) % RONDAS.length);
    setSeleccionadas([]);
  };

  const manejarToque = (index: number) => {
    registrarActividad();
    if (fase === "intro") setFase("jugando");

    if (seleccionadas.includes(index)) {
      setSeleccionadas((prev) => prev.filter((i) => i !== index));
      return;
    }

    const nuevasSeleccionadas = [...seleccionadas, index];
    const nuevaSuma = nuevasSeleccionadas.reduce((acc, i) => acc + ronda.fichas[i], 0);

    setSeleccionadas(nuevasSeleccionadas);

    if (nuevaSuma === ronda.objetivo) {
      // ✅ Acierto
      registrarActividad();
      setTimeout(() => {
        setRacha((prev) => {
          const nuevaRacha = prev + 1;
          if (nuevaRacha >= META_RACHA) {
            setTimeout(() => setFase("completado"), 400);
          } else {
            siguienteRonda();
          }
          return nuevaRacha;
        });
      }, 400);
    } else if (nuevaSuma > ronda.objetivo) {
      // ❌ Se pasó: reinicia la racha y la ronda actual
      setTimeout(() => {
        setSeleccionadas([]);
        setRacha(0);
      }, 600);
    }
  };

  const mensajeBocadillo = () => {
    if (fase === "intro") {
      return `Toca las fichas que sumen ${ronda.objetivo}.`;
    }
    if (fase === "jugando") {
      if (sumaActual > 0 && sumaActual < ronda.objetivo) {
        return `Vas en ${sumaActual}. ¡Sigue sumando hasta ${ronda.objetivo}!`;
      }
      if (racha === 0) {
        return `Toca las fichas que sumen ${ronda.objetivo}.`;
      }
      return `¡Bien hecho! Llevas ${racha} de ${META_RACHA} aciertos seguidos.`;
    }
    return "¿Listo? ¡Hora de jugar de verdad! 🚀";
  };

  const irAlJuego = () => {
    marcarTutorialVisto("razonamiento");
    router.replace("/modulo/razonamiento/juego");
  };

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#337ab7" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      <View style={styles.zonaSuperior}>
        <Text style={styles.titulo}>
          {fase === "completado" ? "¡Tutorial completado!" : "Aprende a jugar"}
        </Text>
        <View style={styles.tituloLinea} />

        {fase === "jugando" && (
          <View style={styles.rachaFila}>
            {Array.from({ length: META_RACHA }).map((_, i) => (
              <Text key={i} style={{ fontSize: 20, opacity: i < racha ? 1 : 0.25 }}>
                🍀
              </Text>
            ))}
          </View>
        )}

        {fase !== "completado" && (
          <View style={styles.circuloObjetivo}>
            <View style={styles.circuloObjetivoInterno}>
              <Text style={styles.textoObjetivo}>{ronda.objetivo}</Text>
            </View>
          </View>
        )}

        {fase !== "completado" && (
          <ResaltadoAyuda
            activo={(fase === "intro" || fase === "jugando") && necesitaAyuda && seleccionadas.length === 0}
            style={styles.tablero}
          >
            {ronda.fichas.map((num, i) => {
              const sel = seleccionadas.includes(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => manejarToque(i)}
                  style={[styles.ficha, sel && styles.fichaSeleccionada]}
                >
                  <Text style={[styles.textoFicha, sel && styles.textoFichaSeleccionada]}>
                    {num}
                  </Text>
                </Pressable>
              );
            })}
          </ResaltadoAyuda>
        )}

        {fase === "jugando" && (
          <Text style={styles.sumaActual}>Suma actual: {sumaActual}</Text>
        )}
      </View>

      <TutorialBubble texto={mensajeBocadillo()} emoji={fase === "completado" ? "🚀" : "💬"} />

      {fase === "completado" && (
        <View style={styles.filaBotones}>
          <View style={styles.botonBaseIniciar}>
            <Pressable style={styles.botonIniciar} onPress={irAlJuego}>
              <Text style={styles.textoBoton}>¡Jugar ahora! 🔢</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}