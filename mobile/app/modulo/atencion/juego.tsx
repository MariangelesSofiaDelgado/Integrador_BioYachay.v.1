import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import styles from "./../atencion/styles/stylesjuego";
import { TUTORIAL_ATENCION_KEY } from "./tutorial";

const EMOJIS = [
  "🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒", "🍈", "🍍",
  "🥭", "🍋", "🍏", "🥥", "🍐", "⚽", "🏀", "🎾", "🏐", "🎯",
  "🎲", "🎮", "🎪", "🎨", "🎭", "🎸"
];

interface Carta {
  id: number;
  emoji: string;
}

// Cada carta tiene su propio set de valores animados
interface CartaAnim {
  escala: Animated.Value;
  bordeColor: Animated.Value; // 0 = blanco, 1 = verde, 2 = rojo
  brillo: Animated.Value;
}

function crearCartaAnim(): CartaAnim {
  return {
    escala:     new Animated.Value(1),
    bordeColor: new Animated.Value(0),
    brillo:     new Animated.Value(1),
  };
}

export default function AtencionJuego() {
  const router = useRouter();
  const TIEMPO_TOTAL = 60;

  const getDificultadPorAciertos = (n: number) => {
    if (n < 6)  return "facil";
    if (n < 9)  return "normal";
    if (n < 12) return "dificil";
    return "dificil";
  };
  const getCuadriculaPorDificultad = (d: string) => {
    if (d === "normal")  return "4x4";
    if (d === "dificil") return "5x5";
    return "3x3";
  };

  const [aciertos, setAciertos]           = useState(0);
  const [fallos, setFallos]               = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [cartas, setCartas]               = useState<Carta[]>([]);
  const [objetivoEmoji, setObjetivoEmoji] = useState("");
  const [cuadricula, setCuadricula]       = useState("3x3");
  const [cartaAnim, setCartaAnim]         = useState<CartaAnim[]>([]);

  // Pulso del emoji objetivo
  const objetivoPulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(objetivoPulso, { toValue: 1.12, duration: 500, useNativeDriver: true }),
        Animated.timing(objetivoPulso, { toValue: 1,    duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const generarRonda = (gridSize = cuadricula) => {
    const size  = parseInt(gridSize[0]);
    const total = size * size;
    const barajado = [...EMOJIS].sort(() => Math.random() - 0.5);
    const nuevasCartas: Carta[] = barajado
      .slice(0, total)
      .map((emoji, i) => ({ id: i, emoji }));
    const objetivo = nuevasCartas[Math.floor(Math.random() * nuevasCartas.length)].emoji;
    return { cartas: nuevasCartas, objetivo };
  };

  const aplicarRonda = (gridSize = cuadricula) => {
    const { cartas: nuevas, objetivo } = generarRonda(gridSize);
    setCartas(nuevas);
    setObjetivoEmoji(objetivo);
    setCartaAnim(nuevas.map(() => crearCartaAnim()));
  };

  useEffect(() => { aplicarRonda(); }, []);

  // Timer
  useEffect(() => {
    if (juegoTerminado) return;
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) { clearInterval(timer); terminarJuego(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [juegoTerminado]);

  const terminarJuego = () => {
    AsyncStorage.setItem(TUTORIAL_ATENCION_KEY, "1");
    setJuegoTerminado(true);
  };

  // ── Animaciones al tocar ──────────────────────────────────────────────
  const animarAcierto = (anim: CartaAnim) => {
    // Escala: rebote hacia arriba
    Animated.sequence([
      Animated.timing(anim.escala, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.timing(anim.escala, { toValue: 0.95, duration: 80,  useNativeDriver: true }),
      Animated.timing(anim.escala, { toValue: 1,    duration: 100, useNativeDriver: true }),
    ]).start();

    // Borde verde: aparece y desaparece en 500ms
    Animated.sequence([
      Animated.timing(anim.bordeColor, { toValue: 1, duration: 80,  useNativeDriver: false }),
      Animated.delay(340),
      Animated.timing(anim.bordeColor, { toValue: 0, duration: 80,  useNativeDriver: false }),
    ]).start();
  };

  const animarFallo = (anim: CartaAnim) => {
    // Vibración lateral (shake)
    Animated.sequence([
      Animated.timing(anim.escala, { toValue: 0.9,  duration: 60,  useNativeDriver: true }),
      Animated.timing(anim.escala, { toValue: 1,    duration: 60,  useNativeDriver: true }),
    ]).start();

    // Borde rojo: aparece y desaparece en 500ms
    Animated.sequence([
      Animated.timing(anim.bordeColor, { toValue: 2, duration: 60,  useNativeDriver: false }),
      Animated.delay(380),
      Animated.timing(anim.bordeColor, { toValue: 0, duration: 60,  useNativeDriver: false }),
    ]).start();
  };

  const handleCartaPress = (emoji: string, index: number) => {
    if (juegoTerminado) return;
    const anim = cartaAnim[index];

    if (emoji === objetivoEmoji) {
      animarAcierto(anim);
      const nuevoAciertos = aciertos + 1;
      setAciertos(nuevoAciertos);

      const dificultadActual = getDificultadPorAciertos(aciertos);
      const nuevaDificultad  = getDificultadPorAciertos(nuevoAciertos);

      // Pequeño delay para que la animación sea visible antes de cambiar ronda
      setTimeout(() => {
        if (dificultadActual !== nuevaDificultad) {
          const nuevaCuadricula = getCuadriculaPorDificultad(nuevaDificultad);
          setCuadricula(nuevaCuadricula);
          aplicarRonda(nuevaCuadricula);
        } else {
          aplicarRonda();
        }
      }, 420);
    } else {
      animarFallo(anim);
      setFallos((f) => f + 1);
    }
  };

  // ── Pantalla de resumen ───────────────────────────────────────────────
  if (juegoTerminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={[styles.titulo, { color: "#2f5279" }]}>JUEGO TERMINADO</Text>
        <View style={styles.resumenContainer}>
          <Text style={styles.resumenTexto}>
            Aciertos:{" "}
            <Text style={{ color: "#4CAF50", fontSize: 24, fontWeight: "bold" }}>{aciertos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Fallos:{" "}
            <Text style={{ color: "#F44336", fontSize: 24, fontWeight: "bold" }}>{fallos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Precisión:{" "}
            <Text style={{ color: "#2f5279", fontSize: 20, fontWeight: "bold" }}>
              {aciertos + fallos > 0 ? Math.round((aciertos / (aciertos + fallos)) * 100) : 0}%
            </Text>
          </Text>
        </View>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const size     = parseInt(cuadricula[0]);
  const gridWidth = size * 70;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>JUEGO DE ATENCIÓN</Text>

      {/* Objetivo con pulso */}
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text style={styles.instruccion}>Encuentra:</Text>
        <Animated.Text
          style={[styles.objetivoGrande, { transform: [{ scale: objetivoPulso }] }]}
        >
          {objetivoEmoji}
        </Animated.Text>
      </View>

      <Text style={styles.marcador}>
        ✓ {aciertos} | ✗ {fallos} | ⏱️ {tiempoRestante}s
      </Text>

      {/* Grid de cartas */}
      <View style={[styles.grid, { width: gridWidth, marginTop: 20 }]}>
        {cartas.map((carta, index) => {
          const anim = cartaAnim[index];
          if (!anim) return null;

          // Interpolamos bordeColor: 0→blanco, 1→verde, 2→rojo
          const borderColorInterp = anim.bordeColor.interpolate({
            inputRange:  [0, 1, 2],
            outputRange: ["#ffffff", "#4CAF50", "#F44336"],
          });
          const borderWidthInterp = anim.bordeColor.interpolate({
            inputRange:  [0, 0.1, 1, 1.9, 2],
            outputRange: [0, 3, 3, 3, 3],
          });

          return (
            <Animated.View
              key={`${cuadricula}-${carta.id}`}
              style={[
                styles.carta,
                {
                  transform:   [{ scale: anim.escala }],
                  borderColor: borderColorInterp,
                  borderWidth: borderWidthInterp,
                },
              ]}
            >
              <Pressable
                style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}
                onPress={() => handleCartaPress(carta.emoji, index)}
              >
                <Text style={styles.simbolo}>{carta.emoji}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <Pressable style={styles.botonVolver} onPress={terminarJuego}>
        <Text style={styles.textoBoton}>Finalizar</Text>
      </Pressable>
    </View>
  );
}
