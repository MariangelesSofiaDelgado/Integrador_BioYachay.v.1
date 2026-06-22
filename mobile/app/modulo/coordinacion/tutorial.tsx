import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, Text, View } from "react-native";
import styles from "./styles/stylestutorial";

import { useInactivityHelper } from "../../../hooks/useInactivity";
import { TutorialBubble, ResaltadoAyuda } from "../../../components/TutorialBubble";
import { FlechaIndicadora } from "../../../components/FlechaIndicadora";
import { marcarTutorialVisto } from "../../../services/tutorialStorage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Cuántas atrapadas SEGUIDAS necesita el usuario para terminar el tutorial
const META_RACHA = 4;

// Fases del tutorial jugado (distinto de "paso" numérico clásico)
type Fase = "intro" | "jugando" | "completado";

export default function Tutorial() {
  const router = useRouter();

  const [fase, setFase] = useState<Fase>("intro");
  const [racha, setRacha] = useState(0); // atrapadas SEGUIDAS, se reinicia si falla
  const [frutaAtrapada, setFrutaAtrapada] = useState(false);
  const [frutaCayendo, setFrutaCayendo] = useState(false);
  const [frutaX, setFrutaX] = useState(45);
  const [direccionFlecha, setDireccionFlecha] = useState<"izquierda" | "derecha" | null>(null);
  const [introMovida, setIntroMovida] = useState(false); // si ya movió la canasta en la intro

  const porcentajeX = useRef(new Animated.Value(42)).current;
  const ultimoPorcentajeX = useRef(42);

  const frutaY = useRef(new Animated.Value(-10)).current;
  const escalaFruta = useRef(new Animated.Value(1)).current;

  // Pulse de la canasta durante la intro (para llamar la atención antes de jugar)
  const escalaCanastaIntro = useRef(new Animated.Value(1)).current;

  // ─────────────────────────────────────────────────────────────
  // SISTEMA DE AYUDA POR INACTIVIDAD (8s)
  // Usamos `fase` + `racha` como clave: se reinicia el contador cada vez
  // que cambia de fase o el usuario atrapa/falla una fruta.
  // ─────────────────────────────────────────────────────────────
  const { necesitaAyuda, registrarActividad } = useInactivityHelper({
    pasoActual: `${fase}-${racha}`,
    activo: fase === "jugando" || fase === "intro",
  });

  // Guardar posición real de la canasta
  useEffect(() => {
    const idEscucha = porcentajeX.addListener((state) => {
      ultimoPorcentajeX.current = state.value;
    });
    return () => porcentajeX.removeListener(idEscucha);
  }, [porcentajeX]);

  // Pulse continuo de la canasta SOLO durante la intro (antes de mover)
  useEffect(() => {
    if (fase === "intro" && !introMovida) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(escalaCanastaIntro, { toValue: 1.15, duration: 500, useNativeDriver: true }),
          Animated.timing(escalaCanastaIntro, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      escalaCanastaIntro.setValue(1);
    }
  }, [fase, introMovida]);

  // Cuando el usuario ya movió la canasta en la intro, pasamos a la fase de juego
  useEffect(() => {
    if (fase === "intro" && introMovida) {
      const timer = setTimeout(() => setFase("jugando"), 900); // pequeña pausa para que lea el feedback
      return () => clearTimeout(timer);
    }
  }, [introMovida]);

  // Latido de la fruta si lleva mucho tiempo cayendo sin ser atrapada (refuerzo visual extra)
  useEffect(() => {
    if (fase === "jugando" && frutaCayendo && necesitaAyuda) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(escalaFruta, { toValue: 1.4, duration: 600, useNativeDriver: true }),
          Animated.timing(escalaFruta, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      escalaFruta.setValue(1);
    }
  }, [fase, frutaCayendo, necesitaAyuda]);

  // ─────────────────────────────────────────────────────────────
  // LÓGICA DE CAÍDA DE FRUTA + CÁLCULO DE LA FLECHA INDICADORA
  // ─────────────────────────────────────────────────────────────
  const iniciarCaidaFruta = () => {
    setFrutaAtrapada(false);
    setFrutaCayendo(true);
    frutaY.setValue(-10);

    const xAleatoria = Math.floor(Math.random() * (80 - 5 + 1)) + 5;
    setFrutaX(xAleatoria);

    // 🆕 Calculamos de entrada hacia qué lado debe moverse la canasta
    // y mantenemos la flecha actualizada mientras la fruta cae, por si
    // la canasta ya se movió pero aún no está alineada.
    const actualizarFlecha = () => {
      const diferencia = xAleatoria - ultimoPorcentajeX.current;
      if (Math.abs(diferencia) < 4) {
        setDireccionFlecha(null); // ya está bien alineada, no hace falta indicar
      } else {
        setDireccionFlecha(diferencia > 0 ? "derecha" : "izquierda");
      }
    };
    actualizarFlecha();
    const intervaloFlecha = setInterval(actualizarFlecha, 250);

    const durationCaida = 3200; // ritmo cómodo para tutorial, sin presión de dificultad
    let evaluado = false;

    const idY = frutaY.addListener((state) => {
      if (state.value >= 78 && state.value <= 83 && !evaluado) {
        const canastaIzquierda = ultimoPorcentajeX.current;
        const canastaDerecha = ultimoPorcentajeX.current + 18;

        if (xAleatoria >= (canastaIzquierda - 5) && xAleatoria <= canastaDerecha) {
          evaluado = true;
          setFrutaAtrapada(true);
          setFrutaCayendo(false);
          setDireccionFlecha(null);
          clearInterval(intervaloFlecha);
          frutaY.setValue(-10);
          frutaY.removeListener(idY);
          registrarActividad();

          // ✅ Atrapada: sube la racha
          setRacha((prev) => {
            const nuevaRacha = prev + 1;
            if (nuevaRacha >= META_RACHA) {
              setTimeout(() => setFase("completado"), 500);
            }
            return nuevaRacha;
          });
        }
      }
    });

    Animated.timing(frutaY, {
      toValue: 105,
      duration: durationCaida,
      useNativeDriver: false,
    }).start(({ finished }) => {
      frutaY.removeListener(idY);
      clearInterval(intervaloFlecha);
      setDireccionFlecha(null);
      setFrutaCayendo(false);
      if (finished && !evaluado) {
        // ❌ Falló: la racha se reinicia a 0 (debe lograr 4 SEGUIDAS)
        setRacha(0);
      }
    });
  };

  // Lanza una nueva fruta cada vez que estamos en fase "jugando" y no hay una cayendo
  useEffect(() => {
    if (fase === "jugando" && !frutaCayendo && !frutaAtrapada) {
      const timer = setTimeout(() => iniciarCaidaFruta(), 700);
      return () => clearTimeout(timer);
    }
    if (fase === "jugando" && frutaAtrapada) {
      // pequeña pausa de celebración antes de soltar la siguiente fruta
      const timer = setTimeout(() => {
        setFrutaAtrapada(false);
        iniciarCaidaFruta();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fase, frutaCayendo, frutaAtrapada]);

  // ─────────────────────────────────────────────────────────────
  // GESTOS DE LA CANASTA
  // ─────────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        registrarActividad();
        if (fase === "intro") setIntroMovida(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const anchoReal = Dimensions.get("window").width;
        let nuevoPorcentaje = (gestureState.moveX / anchoReal) * 100;
        nuevoPorcentaje -= 7.5;

        if (nuevoPorcentaje < 0) nuevoPorcentaje = 0;
        if (nuevoPorcentaje > 85) nuevoPorcentaje = 85;

        porcentajeX.setValue(nuevoPorcentaje);
        registrarActividad();
      },
    })
  ).current;

  const posicionCanastaString = porcentajeX.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const posicionFrutaString = frutaY.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // ─────────────────────────────────────────────────────────────
  // MENSAJES DEL BOCADILLO, según la fase y el estado del momento
  // (esto reemplaza el texto estático: cambia en tiempo real, como el juego mismo)
  // ─────────────────────────────────────────────────────────────
  const mensajeBocadillo = () => {
    if (fase === "intro") {
      return introMovida
        ? "¡Eso es! Ya sabes mover la canasta."
        : "Toca la canasta y arrástrala de un lado a otro.";
    }
    if (fase === "jugando") {
      if (frutaAtrapada) return "🎉 ¡Atrapada! Sigamos con la siguiente.";
      if (direccionFlecha === "derecha") return "¡Muévete hacia la derecha!";
      if (direccionFlecha === "izquierda") return "¡Muévete hacia la izquierda!";
      if (racha === 0) return "Atrapa la fruta para empezar tu racha.";
      return `¡Vas muy bien! Llevas ${racha} de ${META_RACHA} seguidas.`;
    }
    return "¿Listo? ¡Hora de jugar! 🚀";
  };

  const irAlJuego = () => {
    marcarTutorialVisto("coordinacion");
    router.replace("/modulo/coordinacion/juego");
  };

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#2ecc71" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      <View style={styles.zonaSuperior}>
        <Text style={styles.titulo}>
          {fase === "completado" ? "¡Tutorial completado!" : "Aprende a jugar"}
        </Text>
        <View style={styles.tituloLinea} />

        {/* Indicador de racha, visible solo mientras juega */}
        {fase === "jugando" && (
          <View style={{ position: "absolute", top: 8, right: 16, flexDirection: "row", gap: 4 }}>
            {Array.from({ length: META_RACHA }).map((_, i) => (
              <Text key={i} style={{ fontSize: 20, opacity: i < racha ? 1 : 0.25 }}>
                🍎
              </Text>
            ))}
          </View>
        )}

        {/* Fruta cayendo, solo durante la fase de juego */}
        {fase === "jugando" && frutaCayendo && (
          <Animated.View
            style={[
              styles.frutaAnimada,
              { top: posicionFrutaString, left: `${frutaX}%`, transform: [{ scale: escalaFruta }] },
            ]}
          >
            <Text style={{ fontSize: 40 }}>🍎</Text>
          </Animated.View>
        )}

        {/* Fruta atrapada: chispa de celebración momentánea */}
        {fase === "jugando" && frutaAtrapada && (
          <View style={[styles.frutaAnimada, { top: "78%", left: `${frutaX}%` }]}>
            <Text style={{ fontSize: 40 }}>✨</Text>
          </View>
        )}

        {/* 🆕 Flecha indicadora de dirección, flotando sobre la canasta */}
        {fase === "jugando" && direccionFlecha && (
          <View style={{ position: "absolute", bottom: 70, alignSelf: "center" }}>
            <FlechaIndicadora direccion={direccionFlecha} />
          </View>
        )}

        <ResaltadoAyuda
          activo={fase === "jugando" && necesitaAyuda}
          style={[styles.canastaAnimada, { left: posicionCanastaString, position: "absolute" }]}
        >
          <Animated.Text
            {...panResponder.panHandlers}
            style={{
              fontSize: styles.canastaAnimada.fontSize, // o el tamaño que use tu estilo original
              transform: fase === "intro" ? [{ scale: escalaCanastaIntro }] : undefined,
            }}
          >
            🧺
          </Animated.Text>
        </ResaltadoAyuda>
      </View>

      {/* Bocadillo dinámico: el "texto del tutorial" que en realidad es feedback en vivo del juego */}
      <TutorialBubble texto={mensajeBocadillo()} emoji={fase === "completado" ? "🚀" : "💬"} />

      {/* Botón final, solo aparece cuando se completa la racha de 4 */}
      {fase === "completado" && (
        <View style={styles.filaBotones}>
          <View style={styles.botonBaseIniciar}>
            <Pressable style={styles.botonIniciar} onPress={irAlJuego}>
              <Text style={styles.textoBoton}>¡Jugar ahora! 🍎</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}