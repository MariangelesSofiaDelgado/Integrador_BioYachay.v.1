import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import styles from "./styles/stylesjuego";

interface Ejercicio {
  id: string;
  nombre: string;
  instruccion: string;
  duracion: number; // segundos
  gif: string;
}

const EJERCICIOS: Ejercicio[] = [
  {
    id: "calentamiento",
    nombre: "Calentamiento",
    instruccion: "Mueve los brazos suavemente hacia los lados, como en la animación.",
    duracion: 20,
    gif: "https://commons.wikimedia.org/wiki/Special:FilePath/Man_Doing_Warm_Up_Exercise_GIF_Animation_Loop.gif",
  },
  {
    id: "hombros",
    nombre: "Movilidad de hombros",
    instruccion: "Realiza pequeños círculos con los hombros, sin forzar el movimiento.",
    duracion: 20,
    gif: "https://commons.wikimedia.org/wiki/Special:FilePath/Shoulder_motion_with_rotator_cuff_(supraspinatus).gif",
  },
  {
    id: "brazo",
    nombre: "Estiramiento de brazo",
    instruccion: "Extiende un brazo y luego el otro, siguiendo el ritmo del ejemplo.",
    duracion: 20,
    gif: "https://commons.wikimedia.org/wiki/Special:FilePath/One-arm-triceps-extension-2.gif",
  },
  {
    id: "marcha",
    nombre: "Marcha en el sitio",
    instruccion: "Levanta las rodillas alternando los pies, como si caminaras sin avanzar.",
    duracion: 25,
    gif: "https://commons.wikimedia.org/wiki/Special:FilePath/Man_Doing_Warm_Up_Exercise_GIF_Animation_Loop.gif",
  },
  {
    id: "tobillos",
    nombre: "Círculos de tobillo",
    instruccion: "Con el pie apoyado en la punta, gira el tobillo despacio hacia ambos lados.",
    duracion: 20,
    gif: "https://commons.wikimedia.org/wiki/Special:FilePath/Man_Doing_Warm_Up_Exercise_GIF_Animation_Loop.gif",
  },
];

const COLOR = "#e67e22";

export default function JuegoCognitivas() {
  const router = useRouter();

  const [indice, setIndice] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(EJERCICIOS[0].duracion);
  const [iniciado, setIniciado] = useState(false);
  const [corriendo, setCorriendo] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ejercicio = EJERCICIOS[indice];

  // ── Cronómetro: descuenta 1s por segundo mientras `corriendo` es true ──────
  useEffect(() => {
    if (!corriendo) return;

    intervaloRef.current = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 1) {
          clearInterval(intervaloRef.current as any);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [corriendo, indice]);

  // ── Cuando el tiempo llega a 0: pasa automáticamente al siguiente ejercicio ─
  useEffect(() => {
    if (!corriendo || tiempoRestante > 0) return;

    const esUltimo = indice === EJERCICIOS.length - 1;

    if (esUltimo) {
      setCorriendo(false);
      setFinalizado(true);
      return;
    }

    const timer = setTimeout(() => {
      const siguiente = indice + 1;
      setIndice(siguiente);
      setTiempoRestante(EJERCICIOS[siguiente].duracion);
      // Sigue corriendo automáticamente: solo se pidió UN botón de Iniciar
      // para toda la sesión.
    }, 900); // pequeña pausa de transición entre ejercicios

    return () => clearTimeout(timer);
  }, [tiempoRestante, corriendo, indice]);

  const handleIniciar = () => {
    setIniciado(true);
    setCorriendo(true);
  };

  const volverAlModulo = () => {
    router.replace("/modulo/cognitivas");
  };

  // ── Pantalla de finalización ────────────────────────────────────────────────
  if (finalizado) {
    return (
      <View style={styles.finContenedor}>
        <Stack.Screen options={{ headerShown: true, headerTitle: "", headerStyle: { backgroundColor: COLOR }, headerTintColor: "#fff" }} />
        <Text style={styles.finEmoji}>🎉</Text>
        <Text style={styles.finTitulo}>¡Excelente trabajo!</Text>
        <Text style={styles.finTexto}>
          Completaste los {EJERCICIOS.length} ejercicios de movilidad de hoy.
        </Text>
        <Pressable style={styles.botonIniciar} onPress={volverAlModulo}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: COLOR },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      {/* ── GIF del ejercicio actual ── */}
      <View style={styles.zonaGif}>
        <View style={styles.marcoGif}>
          <Image source={{ uri: ejercicio.gif }} style={styles.gif} resizeMode="cover" />

          {/* Cronómetro, solo visible una vez iniciada la sesión */}
          {iniciado && (
            <View style={styles.cronometroBadge}>
              <MaterialCommunityIcons name="timer-outline" size={18} color="#fff" />
              <Text style={styles.cronometroTexto}>{tiempoRestante}s</Text>
            </View>
          )}
        </View>

        <Text style={styles.progresoTexto}>
          Ejercicio {indice + 1} de {EJERCICIOS.length}
        </Text>
      </View>

      {/* ── Tarjeta blanca inferior ── */}
      <View style={styles.tarjeta}>
        <View>
          <Text style={styles.nombreEjercicio}>{ejercicio.nombre}</Text>
          <View style={styles.instruccionBox}>
            <Text style={styles.instruccionTexto}>{ejercicio.instruccion}</Text>
          </View>
        </View>

 
        {!iniciado && (
          <Pressable style={styles.botonIniciar} onPress={handleIniciar}>
            <Text style={styles.textoBoton}>Iniciar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}