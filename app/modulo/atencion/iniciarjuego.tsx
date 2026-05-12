import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./../atencion/styles/stylesjuego";

const FRUTAS = [
  "🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒", "🍈", "🍍",
  "🥭", "🍋", "🍏", "🥥", "🍐", "⚽", "🏀", "🎾", "🏐", "🎯",
  "🎲", "🎮", "🎪", "🎨", "🎭", "🎸"
];

interface Carta {
  id: number;
  fruta: string;
}

export default function IniciarJuego() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Obtener parámetros de juego.tsx - garantizar que sean strings
  const cantidadObjetos = params.cantidadObjetos 
    ? parseInt(Array.isArray(params.cantidadObjetos) ? params.cantidadObjetos[0] : params.cantidadObjetos)
    : 1;
  const cuadricula = Array.isArray(params.cuadricula) ? params.cuadricula[0] : (params.cuadricula || "3x3");
  const tiempoMemorizar = params.tiempoMemorizar 
    ? parseInt(Array.isArray(params.tiempoMemorizar) ? params.tiempoMemorizar[0] : params.tiempoMemorizar)
    : 30;
  const tiempoJuegoConfig = params.tiempoJuego 
    ? parseInt(Array.isArray(params.tiempoJuego) ? params.tiempoJuego[0] : params.tiempoJuego)
    : 60;

  // Estados del juego
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [frutasObjetivo, setFrutasObjetivo] = useState<string[]>([]);
  const [mostrandoFrutas, setMostrandoFrutas] = useState(true);
  const [tiempoRestanteMemorizar, setTiempoRestanteMemorizar] = useState(tiempoMemorizar);
  const [tiempoRestanteJuego, setTiempoRestanteJuego] = useState(tiempoJuegoConfig);
  const [frutasEncontradas, setFrutasEncontradas] = useState<string[]>([]);
  const [fallos, setFallos] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [ganador, setGanador] = useState(false);

  // 🔹 Generar cartas con frutas SIN REPETIR
  const generarCartas = (): { cartas: Carta[]; objetivos: string[] } => {
    const size = parseInt(cuadricula[0]);
    const total = size * size;
    const nuevasCartas: Carta[] = [];
    const objetivos: string[] = [];

    // Asegurar que no haya más cartas que emojis disponibles
    if (total > FRUTAS.length) {
      console.warn(`No hay suficientes emojis para llenar ${total} cartas. Se usan los ${FRUTAS.length} disponibles.`);
    }

    // Shuffle de las frutas
    const frutasBarajadas = [...FRUTAS].sort(() => Math.random() - 0.5);
    
    // Crear cartas sin repetir
    for (let i = 0; i < total && i < frutasBarajadas.length; i++) {
      nuevasCartas.push({
        id: i,
        fruta: frutasBarajadas[i],
      });
    }

    // Seleccionar frutas objetivos SOLO DE LAS CARTAS QUE EXISTEN
    const frutasEnCartas = nuevasCartas.map(c => c.fruta);
    const frutas_temp = [...frutasEnCartas];
    for (let i = 0; i < cantidadObjetos && frutas_temp.length > 0; i++) {
      const idx = Math.floor(Math.random() * frutas_temp.length);
      objetivos.push(frutas_temp[idx]);
      frutas_temp.splice(idx, 1);
    }

    return { cartas: nuevasCartas, objetivos };
  };

  // 🔹 Inicializar el juego al montar el componente
  useEffect(() => {
    const { cartas: nuevasCartas, objetivos } = generarCartas();
    setCartas(nuevasCartas);
    setFrutasObjetivo(objetivos);
    setMostrandoFrutas(true);
    setTiempoRestanteMemorizar(tiempoMemorizar);
    setTiempoRestanteJuego(tiempoJuegoConfig);
    setFallos(0);
  }, []);

  // 🔹 Temporizador para ocultar las frutas
  useEffect(() => {
    if (!mostrandoFrutas || tiempoRestanteMemorizar <= 0) return;

    const timer = setInterval(() => {
      setTiempoRestanteMemorizar((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMostrandoFrutas(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mostrandoFrutas, tiempoRestanteMemorizar]);

  // 🔹 Temporizador de duración del juego
  useEffect(() => {
    if (mostrandoFrutas || juegoTerminado) return;

    const timer = setInterval(() => {
      setTiempoRestanteJuego((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJuegoTerminado(true);
          setGanador(false); // Tiempo agotado, perdió
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mostrandoFrutas, juegoTerminado]);

  // 🔹 Verificar si ganó
  useEffect(() => {
    if (frutasEncontradas.length === frutasObjetivo.length && frutasObjetivo.length > 0) {
      setJuegoTerminado(true);
      setGanador(true);
    }
  }, [frutasEncontradas, frutasObjetivo]);

  // 🔹 Manejar clic en una carta
  const handleCartaPress = (id: number) => {
    if (mostrandoFrutas || juegoTerminado) return;

    const carta = cartas.find((c) => c.id === id);
    if (!carta) return;

    // Verificar si esta fruta es un objetivo y aún no ha sido encontrada
    if (frutasObjetivo.includes(carta.fruta) && !frutasEncontradas.includes(carta.fruta)) {
      setFrutasEncontradas([...frutasEncontradas, carta.fruta]);
    } else if (!frutasObjetivo.includes(carta.fruta) || frutasEncontradas.includes(carta.fruta)) {
      // Si no es un objetivo o ya fue encontrada, contar como fallo
      setFallos(fallos + 1);
    }
  };

  // 🔹 Renderizar una carta
  const renderCarta = (carta: Carta) => {
    return (
      <Pressable
        key={carta.id}
        style={[
          styles.carta,
          mostrandoFrutas ? styles.cartaMostrada : null,
          frutasEncontradas.includes(carta.fruta) && frutasObjetivo.includes(carta.fruta) ? styles.cartaEncontrada : null,
        ]}
        onPress={() => handleCartaPress(carta.id)}
      >
        <Text style={styles.simbolo}>
          {mostrandoFrutas ? carta.fruta : "❓"}
        </Text>
      </Pressable>
    );
  };

  // 🔹 Ancho dinámico del grid
  const size = parseInt(cuadricula[0]);
  const gridWidth = size * 70;

  // 🔹 Pantalla de resumen
  if (juegoTerminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={[styles.titulo, { color: ganador ? "#4CAF50" : "#F44336" }]}>
          {ganador ? "¡GANASTE! 🎉" : "JUEGO TERMINADO"}
        </Text>

        <View style={styles.resumenContainer}>
          <Text style={styles.resumenTexto}>
            Objetos a buscar: <Text style={styles.resumenNumero}>{cantidadObjetos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Objetos encontradas: <Text style={styles.resumenNumero}>{frutasEncontradas.length}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Aciertos: <Text style={{ color: "#4CAF50" }}>{frutasEncontradas.length}</Text> | Fallos: <Text style={{ color: "#F44336" }}>{fallos}</Text>
          </Text>
          <View style={styles.objetivosContainer}>
            <Text style={styles.resumenTexto}>Objetivos:</Text>
            <View style={styles.frutasObjetivosRow}>
              {frutasObjetivo.map((fruta) => (
                <Text
                  key={fruta}
                  style={[
                    styles.frutaObjetivo,
                    frutasEncontradas.includes(fruta) ? styles.frutaEncontrada : null,
                  ]}
                >
                  {fruta}
                </Text>
              ))}
            </View>
          </View>
          <Text style={styles.resumenTexto}>
            Tiempo usado: <Text style={styles.resumenNumero}>{tiempoJuegoConfig - tiempoRestanteJuego}s</Text>
          </Text>
        </View>

        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>JUEGO DE ATENCIÓN</Text>

      {/* Mostrar contador de tiempo mientras se ven las frutas */}
      {mostrandoFrutas && (
        <Text style={styles.infoTiempo}>
          Memoriza las frutas: {tiempoRestanteMemorizar}s
        </Text>
      )}

      {/* Mostrar instrucción después de voltear cartas */}
      {!mostrandoFrutas && (
        <View>
          <Text style={styles.instruccion}>
            Encuentra las frutas:
          </Text>
          <View style={styles.frutasObjetivosRow}>
            {frutasObjetivo.map((fruta) => (
              <Text
                key={fruta}
                style={[
                  styles.frutaBuscador,
                  frutasEncontradas.includes(fruta) ? styles.frutaEncontradaBuscador : null,
                ]}
              >
                {fruta}
              </Text>
            ))}
          </View>
          <Text style={styles.marcador}>
            ✓ Aciertos: {frutasEncontradas.length}/{frutasObjetivo.length} | ✗ Fallos: {fallos} | Tiempo: {tiempoRestanteJuego}s
          </Text>
        </View>
      )}

      {/* Grid de cartas */}
      <View style={[styles.grid, { width: gridWidth, marginTop: 30 }]}>
        {cartas.map((carta) => renderCarta(carta))}
      </View>

      {/* Botón para salir */}
      <Pressable
        style={styles.botonVolver}
        onPress={() => router.back()}
      >
        <Text style={styles.textoBoton}>Salir</Text>
      </Pressable>
    </View>
  );
}

