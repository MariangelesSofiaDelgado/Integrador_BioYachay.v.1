import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylestutorial";

import { TutorialBubble, ResaltadoAyuda } from "../../../components/TutorialBubble";
import { useInactivityHelper } from "../../../hooks/useInactivity";
import { marcarTutorialVisto } from "../../../services/tutorialStorage";

// Cuántos aciertos SEGUIDOS necesita el usuario para terminar el tutorial
const META_RACHA = 3;

// Tablero mini fijo: 3 pares (6 cartas), siempre el mismo orden para que
// el tutorial sea predecible y fácil de seguir la primera vez.
const FRUTAS_TUTORIAL = ["🍎", "🍌", "🍇", "🍎", "🍌", "🍇"];

interface CartaTutorial {
  id: number;
  contenido: string;
  volteada: boolean;
  encontrada: boolean;
}

function crearTablero(): CartaTutorial[] {
  return FRUTAS_TUTORIAL.map((f, i) => ({
    id: i,
    contenido: f,
    volteada: false,
    encontrada: false,
  }));
}

type Fase = "intro" | "jugando" | "completado";

export default function TutorialMemoria() {
  const router = useRouter();

  const [fase, setFase] = useState<Fase>("intro");
  const [tablero, setTablero] = useState<CartaTutorial[]>(crearTablero());
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [racha, setRacha] = useState(0);
  const [bloqueado, setBloqueado] = useState(false); // evita toques mientras se evalúa un par

  const { necesitaAyuda, registrarActividad } = useInactivityHelper({
    pasoActual: `${fase}-${racha}-${seleccionadas.length}`,
    activo: fase === "intro" || fase === "jugando",
  });

  // Pasamos de "intro" a "jugando" en cuanto el usuario toca la primera carta
  const manejarToque = (index: number) => {
    registrarActividad();
    if (fase === "intro") setFase("jugando");

    if (
      bloqueado ||
      tablero[index].volteada ||
      tablero[index].encontrada ||
      seleccionadas.length === 2
    ) {
      return;
    }

    const nuevo = [...tablero];
    nuevo[index] = { ...nuevo[index], volteada: true };
    setTablero(nuevo);
    setSeleccionadas((prev) => [...prev, index]);
  };

  // Evaluar par cuando hay 2 cartas seleccionadas
  useEffect(() => {
    if (seleccionadas.length !== 2) return;
    setBloqueado(true);
    const [p, s] = seleccionadas;

    if (tablero[p].contenido === tablero[s].contenido) {
      // ✅ Acierto
      setTimeout(() => {
        setTablero((prev) => {
          const n = [...prev];
          n[p] = { ...n[p], encontrada: true };
          n[s] = { ...n[s], encontrada: true };
          return n;
        });
        setSeleccionadas([]);
        setBloqueado(false);
        registrarActividad();

        setRacha((prev) => {
          const nuevaRacha = prev + 1;
          if (nuevaRacha >= META_RACHA) {
            setTimeout(() => setFase("completado"), 500);
          }
          return nuevaRacha;
        });
      }, 500);
    } else {
      // ❌ Fallo: la racha se reinicia, y el tablero vuelve a barajarse para
      // que no memorice la posición exacta sin entender la mecánica.
      setTimeout(() => {
        setTablero((prev) => {
          const n = [...prev];
          n[p] = { ...n[p], volteada: false };
          n[s] = { ...n[s], volteada: false };
          return n;
        });
        setSeleccionadas([]);
        setBloqueado(false);
        setRacha(0);
      }, 800);
    }
  }, [seleccionadas]);

  const mensajeBocadillo = () => {
    if (fase === "intro") {
      return "Toca una carta para descubrir qué fruta tiene.";
    }
    if (fase === "jugando") {
      if (seleccionadas.length === 1) return "Ahora busca su pareja.";
      if (racha === 0) return "Encuentra dos cartas iguales para formar un par.";
      return `¡Vas muy bien! Llevas ${racha} de ${META_RACHA} pares seguidos.`;
    }
    return "¿Listo? ¡Hora de jugar de verdad! 🚀";
  };

  const irAlJuego = () => {
    marcarTutorialVisto("memoria");
    router.replace("/modulo/memoria/juego");
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

        <ResaltadoAyuda
          activo={(fase === "intro" || fase === "jugando") && necesitaAyuda && seleccionadas.length === 0}
          style={styles.tablero}
        >
          {tablero.map((carta, i) => (
            <Pressable
              key={carta.id}
              onPress={() => manejarToque(i)}
              style={[
                styles.carta,
                (carta.volteada || carta.encontrada) && styles.cartaEncontrada,
              ]}
            >
              <Text style={styles.textoCarta}>
                {carta.volteada || carta.encontrada ? carta.contenido : "?"}
              </Text>
            </Pressable>
          ))}
        </ResaltadoAyuda>
      </View>

      <TutorialBubble texto={mensajeBocadillo()} emoji={fase === "completado" ? "🚀" : "💬"} />

      {fase === "completado" && (
        <View style={styles.filaBotones}>
          <View style={styles.botonBaseIniciar}>
            <Pressable style={styles.botonIniciar} onPress={irAlJuego}>
              <Text style={styles.textoBoton}>¡Jugar ahora! 🧠</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}