import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles/stylesindex";

// Configuración del juego
const TIEMPO_UNICO = 60;
const CONFIG_CARTAS = {
  facil: 8,
  normal: 12,
  dificil: 20
} as const;

const FRUTAS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥥", "🥝", "🍉", "🍒"];

const NIVELES = [
  { id: "facil", etiqueta: "Fácil" },
  { id: "normal", etiqueta: "Normal" },
  { id: "dificil", etiqueta: "Difícil" },
] as const;

export default function ModuloMemoria() {
  const router = useRouter();
  const [dificultad, setDificultad] = useState<keyof typeof CONFIG_CARTAS>("normal");

  // Genera y desordena los pares de frutas para la vista previa
  const cartasPrevia = useMemo(() => {
    const cantidadTotal = CONFIG_CARTAS[dificultad];
    const seleccion = FRUTAS.slice(0, cantidadTotal / 2);
    const pares = [...seleccion, ...seleccion];
    
    // Algoritmo de barajado Fisher-Yates
    for (let i = pares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pares[i], pares[j]] = [pares[j], pares[i]];
    }
    return pares;
  }, [dificultad]);

 // Calcula el ancho máximo para forzar las filas deseadas
  const obtenerAnchoMaximo = () => {
    if (dificultad === 'facil') return 210;  // 4 cartas por fila -> 2 filas
    if (dificultad === 'normal') return 210; // 4 cartas por fila -> 3 filas
    
    // CAMBIO AQUÍ: 
    // 260px permite exactamente 5 cartas por fila. 
    // 20 cartas / 5 por fila = 4 filas exactas.
    return 260; 
  };

  return (
    <View style={styles.contenedor}>
      {/* --- Encabezado --- */}
      <View style={styles.navbar}>
        <View style={styles.bloqueTitulos}>
          <Text style={styles.headerTitulo}>JUEGO DE MEMORIA</Text>
          <Text style={styles.headerSubtitulo}>Encuentra todos los pares</Text>
        </View>
        
        <View style={styles.contenedorDificultad}>
          {NIVELES.map((nivel) => (
            <Pressable
              key={nivel.id}
              onPress={() => setDificultad(nivel.id)} 
              style={[
                styles.opcionDificultad, 
                dificultad === nivel.id && styles.opcionSeleccionada
              ]}
            >
              <Text style={[
                styles.textoOpcion, 
                dificultad === nivel.id && styles.textoSeleccionado
              ]}>
                {nivel.etiqueta}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.contenedorTiempo}>
          <Text style={styles.textoTiempo}>Tiempo: {TIEMPO_UNICO} seg</Text>
        </View>
      </View>

      {/* --- Contenido / Previa --- */}
      <View style={styles.cuerpo}>
        <View style={styles.espacioJuego}>
          <Text style={styles.textoResumen}>
            Tablero de {CONFIG_CARTAS[dificultad]} cartas
          </Text>
          
          <View style={[styles.cuadrillaCartas, { maxWidth: obtenerAnchoMaximo() }]}>
            {cartasPrevia.map((fruta, i) => (
              <View key={i} style={styles.cartaMiniatura}>
                <Text style={styles.emojiCarta}>{fruta}</Text>
              </View>
            ))}
          </View>
        </View>

<Pressable 
  style={styles.botonIniciar} 
  onPress={() => router.push({
    pathname: "/modulo/memoria/juego",
    params: { 
      nivel: dificultad, 
      tiempo: TIEMPO_UNICO, 
      // Enviamos el mazo barajado de la previa para que coincida
      mazo: JSON.stringify(cartasPrevia) 
    }
  })}
>
  <Text style={styles.textoBoton}>¡EMPEZAR!</Text>
</Pressable>
      </View>
    </View>
  );
}
