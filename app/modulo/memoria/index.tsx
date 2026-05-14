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

  // Vista previa fija 3x3 (solo visual)
  const previa3x3 = FRUTAS.slice(0, 9);

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
    <View style={styles.page}>
      <Text style={styles.titulo}>JUEGO DE MEMORIA</Text>
      <View style={styles.tituloLinea} />

      {/* Tarjetas arriba (preview 3x3) */}
      <View style={styles.espacioJuego}>
        <Text style={styles.textoResumen}>Vista previa</Text>
        <View style={[styles.grid, { width: 210 }]}> 
          {previa3x3.map((fruta, i) => (
            <View key={i} style={styles.cartaMiniatura}>
              <Text style={styles.emojiCarta}>{fruta}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.contenedor}>
        <View style={styles.headerRow}>
          <View style={styles.objetivoContenedor}>
            <Text style={styles.objetivoTitulo}>Objetivo</Text>
          </View>
        </View>
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>Encuentra los pares y ejercita la memoria</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.instruccionesContenedor}>
            <Text style={styles.instruccionesTitulo}>Instrucciones</Text>
          </View>
        </View>
        <View style={styles.indicaciones}>
          <Text style={styles.indicacion}>Toca una carta para voltearla.</Text>
          <Text style={styles.indicacion}>Encuentra todos los pares antes de que acabe el tiempo.</Text>
        </View>

        <View style={styles.botonBase}>
          <Pressable
            style={styles.botonIniciar}
            onPress={() => router.push({ pathname: "/modulo/memoria/juego", params: { tiempo: TIEMPO_UNICO } })}
          >
            <Text style={styles.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
