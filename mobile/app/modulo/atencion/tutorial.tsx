import AsyncStorage from "@react-native-async-storage/async-storage";
export const TUTORIAL_ATENCION_KEY = "tutorial_atencion_visto";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import styles from "../atencion/styles/stylestutorial";

// Pool de emojis — todos distintos
const POOL_EMOJIS = [
  "🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒", "🍍", "🥭",
  "🍋", "🍏", "🥥", "🍐", "🫐", "🍉", "🍈", "🌽", "🥕", "🍄",
];

/**
 * Devuelve `cantidad` emojis distintos barajados del pool.
 * Garantiza que no hay repetidos en la misma ronda.
 */
function elegirEmojisSinRepetir(cantidad: number): string[] {
  const barajado = [...POOL_EMOJIS].sort(() => Math.random() - 0.5);
  return barajado.slice(0, cantidad);
}

/**
 * Construye las cartas para una ronda:
 * - `cantidad` emojis distintos
 * - el objetivo ocupa una posición aleatoria
 * - devuelve { cartas, objetivo, indiceObjetivo }
 */
function generarCartasConObjetivo(cantidad: number) {
  const emojis = elegirEmojisSinRepetir(cantidad);
  const indiceObjetivo = Math.floor(Math.random() * cantidad);
  const objetivo = emojis[indiceObjetivo];
  return { cartas: emojis, objetivo, indiceObjetivo };
}

// Configuración fija de los 3 pasos del tutorial
const CONFIG_PASOS = [
  {
    paso: 1,
    instruccion: "👀 Mira bien este dibujo",
    descripcion: "Este es el dibujo que debes buscar.\n¡No lo olvides!",
    mostrarFlecha: false,
    mostrarObjetivo: true,
    mensajeCorrecto: "",
    totalCartas: 3,
  },
  {
    paso: 2,
    instruccion: "🔍 Ahora búscalo entre las cartas",
    descripcion: "Toca la carta que tenga este dibujo 👆",
    mostrarFlecha: true,  
    mostrarObjetivo: true,
    mensajeCorrecto: "¡Muy bien! 🎉 ¡Eso es!",
    totalCartas: 3,
  },
  {
    paso: 3,
    instruccion: "⭐ ¡Ahora tú solo! ⭐",
    descripcion: "Busca el dibujo y tócalo 👇",
    mostrarFlecha: false,
    mostrarObjetivo: true,
    mensajeCorrecto: "¡Excelente! 🌟 ¡Lo lograste!",
    totalCartas: 3,
  },
];

interface EstadoPaso {
  cartas: string[];
  objetivo: string;
  indiceObjetivo: number;
}

export default function Tutorial() {
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(0);
  const [estadoPaso, setEstadoPaso] = useState<EstadoPaso>(() =>
    generarCartasConObjetivo(CONFIG_PASOS[0].totalCartas)
  );
  const [mensajeVisible, setMensajeVisible] = useState("");
  const [cartaSeleccionada, setCartaSeleccionada] = useState<number | null>(null);
  const [completado, setCompletado] = useState(false);

  // Animaciones
  const pulsoAnim = useRef(new Animated.Value(1)).current;
  const flechaAnim = useRef(new Animated.Value(0)).current;    // translateY flecha
  const mensajeAnim = useRef(new Animated.Value(0)).current;
  const cartaAnimaciones = useRef(
    [0, 1, 2].map(() => new Animated.Value(1))
  ).current;

  const config = CONFIG_PASOS[pasoActual];

  // ── Pulso del emoji objetivo ──────────────────────────────────────────
  useEffect(() => {
    pulsoAnim.setValue(1);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulsoAnim, { toValue: 1.14, duration: 650, useNativeDriver: true }),
        Animated.timing(pulsoAnim, { toValue: 1,    duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pasoActual]);

  // ── Bounce de la flecha (solo paso con flecha) ────────────────────────
  useEffect(() => {
    flechaAnim.setValue(0);
    if (!config.mostrarFlecha) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flechaAnim, { toValue: -8, duration: 380, useNativeDriver: true }),
        Animated.timing(flechaAnim, { toValue:  0, duration: 380, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pasoActual]);

  // ── Reset al cambiar de paso ──────────────────────────────────────────
  useEffect(() => {
    const nuevo = generarCartasConObjetivo(config.totalCartas);
    setEstadoPaso(nuevo);
    setMensajeVisible("");
    setCartaSeleccionada(null);
    mensajeAnim.setValue(0);
    cartaAnimaciones.forEach((a) => a.setValue(1));
  }, [pasoActual]);

  // ── Manejar toque en carta ────────────────────────────────────────────
  const handleCartaPress = (emoji: string, index: number) => {
    if (cartaSeleccionada !== null) return;

    Animated.sequence([
      Animated.timing(cartaAnimaciones[index], { toValue: 0.82, duration: 90,  useNativeDriver: true }),
      Animated.timing(cartaAnimaciones[index], { toValue: 1,    duration: 140, useNativeDriver: true }),
    ]).start();

    setCartaSeleccionada(index);

    if (emoji === estadoPaso.objetivo) {
      const msg = config.mensajeCorrecto || "¡Muy bien! 🎉";
      setMensajeVisible(msg);
      Animated.timing(mensajeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();

      setTimeout(() => {
        if (pasoActual + 1 < CONFIG_PASOS.length) {
          setPasoActual((p) => p + 1);
        } else {
          setCompletado(true);
          setTimeout(() => router.replace("/modulo/atencion/juego"), 2000);
        }
      }, 1800);
    } else {
      setMensajeVisible("Ese no es... ¡Intenta de nuevo! 😊");
      Animated.timing(mensajeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      setTimeout(() => {
        setCartaSeleccionada(null);
        setMensajeVisible("");
        mensajeAnim.setValue(0);
      }, 1600);
    }
  };

  // ── Estilo de cada carta según estado ────────────────────────────────
  const getEstiloCarta = (emoji: string, index: number) => {
    // Después de seleccionar
    if (cartaSeleccionada !== null && index === cartaSeleccionada) {
      return emoji === estadoPaso.objetivo ? styles.cartaCorrecta : styles.cartaIncorrecta;
    }
    // Antes de seleccionar: resaltar la carta objetivo si el paso tiene flecha
    if (cartaSeleccionada === null && config.mostrarFlecha && index === estadoPaso.indiceObjetivo) {
      return styles.cartaResaltada;
    }
    return styles.carta;
  };

  // ── Pantalla de finalización (auto-redirige al juego en 2s) ─────────
  if (completado) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.emojiGrande}>🏆</Text>
        <Text style={styles.tituloCompletado}>¡Muy bien!</Text>
        <Text style={styles.subtituloCompletado}>
          Ya sabes cómo jugar.{"\n"}Iniciando el juego...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {/* Indicador de pasos */}
      <View style={styles.indicadorPasos}>
        {CONFIG_PASOS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.puntoPaso,
              i === pasoActual
                ? styles.puntoPasoActivo
                : i < pasoActual
                ? styles.puntoPasoCompletado
                : styles.puntoPasoPendiente,
            ]}
          />
        ))}
      </View>

      {/* Instrucción */}
      <Text style={styles.instruccion}>{config.instruccion}</Text>
      <Text style={styles.descripcion}>{config.descripcion}</Text>

      {/* Objetivo */}
      {config.mostrarObjetivo && (
        <View style={styles.objetivoContenedor}>
          <Text style={styles.etiquetaObjetivo}>Busca este:</Text>
          <Animated.Text
            style={[styles.objetivoEmoji, { transform: [{ scale: pulsoAnim }] }]}
          >
            {estadoPaso.objetivo}
          </Animated.Text>
        </View>
      )}

      {/* Cartas */}
      <View style={styles.gridCartas}>
        {estadoPaso.cartas.map((emoji, index) => {
          const esObjetivoConFlecha =
            config.mostrarFlecha &&
            index === estadoPaso.indiceObjetivo &&
            cartaSeleccionada === null;

          return (
            // Wrapper relativo para posicionar la flecha encima de la carta
            <View key={`${pasoActual}-${index}`} style={styles.cartaWrapper}>
              {/* Flecha FUERA de la carta, flotando encima */}
              {esObjetivoConFlecha && (
                <Animated.Text
                  style={[
                    styles.flechaFlotante,
                    { transform: [{ translateY: flechaAnim }] },
                  ]}
                >
                  👇
                </Animated.Text>
              )}

              <Animated.View style={{ transform: [{ scale: cartaAnimaciones[index] }] }}>
                <Pressable
                  style={getEstiloCarta(emoji, index)}
                  onPress={() => handleCartaPress(emoji, index)}
                >
                  <Text style={styles.simboloCarta}>{emoji}</Text>

                  {/* Etiqueta "¡Toca aquí!" pegada abajo dentro de la carta */}
                  {esObjetivoConFlecha && (
                    <View style={styles.etiquetaToca}>
                      <Text style={styles.textoToca}>¡Toca aquí!</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            </View>
          );
        })}
      </View>

      {/* Mensaje de resultado */}
      <Animated.View style={[styles.mensajeContenedor, { opacity: mensajeAnim }]}>
        {mensajeVisible !== "" && (
          <Text
            style={[
              styles.mensajeTexto,
              mensajeVisible.includes("no es") ? styles.mensajeError : styles.mensajeCorrecto,
            ]}
          >
            {mensajeVisible}
          </Text>
        )}
      </Animated.View>

      {/* Botón salir */}
      <Pressable style={styles.botonSalir} onPress={() => router.back()}>
        <Text style={styles.textoBotonSalir}>Salir del tutorial</Text>
      </Pressable>
    </View>
  );
}
