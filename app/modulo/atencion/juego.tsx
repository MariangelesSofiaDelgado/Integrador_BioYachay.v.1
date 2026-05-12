import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./../atencion/styles/stylesjuego";

const EMOJIS = [
  "🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒", "🍈", "🍍",
  "🥭", "🍋", "🍏", "🥥", "🍐", "⚽", "🏀", "🎾", "🏐", "🎯",
  "🎲", "🎮", "🎪", "🎨", "🎭", "🎸"
];

interface Carta {
  id: number;
  emoji: string;
}

export default function AtencionJuego() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const cuadricula = Array.isArray(params.cuadricula) ? params.cuadricula[0] : (params.cuadricula || "4x4");
  const TIEMPO_TOTAL = 60;

  // Estados
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [objetivoEmoji, setObjetivoEmoji] = useState("");
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // 🔹 Generar nueva ronda
  const generarRonda = (): { cartas: Carta[]; objetivo: string } => {
    const size = parseInt(cuadricula[0]);
    const total = size * size;
    const nuevasCartas: Carta[] = [];

    // Shuffle emojis
    const emojisBarajados = [...EMOJIS].sort(() => Math.random() - 0.5);

    // Crear cartas
    for (let i = 0; i < total && i < emojisBarajados.length; i++) {
      nuevasCartas.push({
        id: i,
        emoji: emojisBarajados[i],
      });
    }

    // Elegir objetivo aleatoriamente de las cartas
    const objetivoAleatorio = nuevasCartas[Math.floor(Math.random() * nuevasCartas.length)].emoji;

    return { cartas: nuevasCartas, objetivo: objetivoAleatorio };
  };

  // 🔹 Inicializar primer ronda
  useEffect(() => {
    const { cartas: nuevasCartas, objetivo } = generarRonda();
    setCartas(nuevasCartas);
    setObjetivoEmoji(objetivo);
  }, []);

  
  // 🔹 Timer del juego - 60 segundos
  useEffect(() => {
    if (juegoTerminado) return;

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJuegoTerminado(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [juegoTerminado]);

  // 🔹 Manejar clic en carta
  const handleCartaPress = (emoji: string) => {
    if (juegoTerminado) return;

    if (emoji === objetivoEmoji) {
      // ✅ Acierto - generar nueva ronda
      setAciertos(aciertos + 1);
      const { cartas: nuevasCartas, objetivo } = generarRonda();
      setCartas(nuevasCartas);
      setObjetivoEmoji(objetivo);
    } else {
      // ❌ Fallo
      setFallos(fallos + 1);
    }
  };

  // 🔹 Pantalla de resumen
  if (juegoTerminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={[styles.titulo, { color: "#2f5279" }]}>JUEGO TERMINADO</Text>

        <View style={styles.resumenContainer}>
          <Text style={styles.resumenTexto}>
            Aciertos: <Text style={{ color: "#4CAF50", fontSize: 24, fontWeight: "bold" }}>{aciertos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Fallos: <Text style={{ color: "#F44336", fontSize: 24, fontWeight: "bold" }}>{fallos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Precisión: <Text style={{ color: "#2f5279", fontSize: 20, fontWeight: "bold" }}>
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

  const size = parseInt(cuadricula[0]);
  const gridWidth = size * 70;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>JUEGO DE ATENCIÓN</Text>

      {/* Información del juego */}
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text style={styles.instruccion}>Encuentra:</Text>
        <Text style={styles.objetivoGrande}>{objetivoEmoji}</Text>
      </View>

      <Text style={styles.marcador}>
        ✓ {aciertos} | ✗ {fallos} | ⏱️ {tiempoRestante}s
      </Text>

      {/* Grid de cartas visibles */}
      <View style={[styles.grid, { width: gridWidth, marginTop: 20 }]}>
        {cartas.map((carta) => (
          <Pressable
            key={carta.id}
            style={styles.carta}
            onPress={() => handleCartaPress(carta.emoji)}
          >
            <Text style={styles.simbolo}>{carta.emoji}</Text>
          </Pressable>
        ))}
      </View>

      {/* Botón para salir */}
      <Pressable
        style={styles.botonVolver}
        onPress={() => setJuegoTerminado(true)}
      >
        <Text style={styles.textoBoton}>Finalizar</Text>
      </Pressable>
    </View>
  );
}
