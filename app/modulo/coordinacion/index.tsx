import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, Text, View } from "react-native";
import styles from "./styles/stylesindex";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const FRUTAS = ["🍎", "🍌", "🍇", "🍓", "🍊", "🥝", "🍍", "🍉"];
const CANTIDAD_FRUTAS = 5; 

export default function ModuloCoordinacion() {
  const router = useRouter();

  const canastaAnim = useRef(new Animated.Value(0)).current;

  const frutasAnims = useRef(
    Array.from({ length: CANTIDAD_FRUTAS }, (_, index) => new Animated.Value(-100 - index * 90))
  ).current;

  const frutasConfig = useRef(
    Array.from({ length: CANTIDAD_FRUTAS }, () => ({
      icono: FRUTAS[Math.floor(Math.random() * FRUTAS.length)],
      left: Math.random() * 82, 
    }))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(canastaAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: false, // Cambiado a false para poder animar la propiedad 'left' sin problemas
        }),
        Animated.timing(canastaAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: false,
        }),
      ])
    ).start();

    const animarFrutaIndividual = (index: number, esPrimeraVez: boolean) => {
      if (!esPrimeraVez) {
        frutasAnims[index].setValue(-60);
        frutasConfig[index].icono = FRUTAS[Math.floor(Math.random() * FRUTAS.length)],
        frutasConfig[index].left = Math.random() * 82;
      }

      Animated.timing(frutasAnims[index], {
        toValue: SCREEN_HEIGHT, 
        duration: 2400 + Math.random() * 800,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          animarFrutaIndividual(index, false);
        }
      });
    };

    frutasAnims.forEach((_, index) => {
      animarFrutaIndividual(index, true); 
    });

    return () => {
      frutasAnims.forEach((anim) => anim.stopAnimation());
      canastaAnim.stopAnimation();
    };
  }, []);

  // Control exacto en porcentaje para que no se desfase en ningún teléfono
  const canastaX = canastaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["3%", "85%"], 
  });

  const iniciarJuego = () => {
    router.push("../modulo/coordinacion/juego");
  };

  return (
    <View style={styles.page}>
      
      {/* --- CAPA DE FONDO: LLUVIA DE FRUTAS --- */}
      <View style={styles.capaAnimacionGlobal} pointerEvents="none">
        {frutasAnims.map((animValue, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.frutaAnimada,
              {
                transform: [{ translateY: animValue }],
                left: `${frutasConfig[index].left}%`,
              },
            ]}
          >
            {frutasConfig[index].icono}
          </Animated.Text>
        ))}
      </View>

      {/* --- INTERFAZ SUPERIOR (ZONA GRIS) --- */}
      <View style={styles.zonaSuperior}>
        <Text style={styles.titulo}>Atrapa las frutas</Text>
        <View style={styles.tituloLinea} />

        {/* Pista de la Canasta */}
        <View style={styles.espacioGrisLibre}>
          <Animated.Text
            style={[
              styles.canastaAnimada,
              { left: canastaX },
            ]}
          >
            🧺
          </Animated.Text>
        </View>
      </View>

      {/* --- TARJETA BLANCA (40% DEL ALTO TOTAL) --- */}
      <View style={styles.contenedor}>
        
        {/* Fila Objetivo */}
        <View style={styles.headerRow}>
          <View style={styles.objetivoContenedor}>
            <Text style={styles.objetivoTitulo}>Objetivo</Text>
          </View>
          <Ionicons name="eye" size={30} color="#e93232" />
        </View>
        
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>
            Fortalecer retención visual
          </Text>
        </View>

        {/* Fila Instrucciones */}
        <View style={styles.headerRow}>
          <View style={styles.instruccionesContenedor}>
            <Text style={styles.instruccionesTitulo}>Instrucciones</Text>
          </View>
        </View>
        
        <View style={styles.indicaciones}>
          <Text style={styles.indicacion}>🧺 Toca Iniciar para empezar a jugar.</Text>
          <Text style={styles.indicacion}>👆 Toca las frutas para atraparlas.</Text>
          <Text style={styles.indicacion}>⏱️ ¡Atrapa la mayor cantidad posible!</Text>
        </View>

        {/* --- FILA DE BOTONES (TUTORIAL + INICIAR) --- */}
        <View style={styles.filaBotones}>
          
          {/* Botón Tutorial (Rojo) */}
          <View style={styles.botonBaseTutorial}>
            <Pressable 
              style={styles.botonTutorial} 
              onPress={() => router.push("../modulo/coordinacion/tutorial")}
            >
              <Text style={styles.textoBoton}>Tutorial</Text>
            </Pressable>
          </View>

          {/* Botón Iniciar (Naranja) */}
          <View style={styles.botonBaseIniciar}>
            <Pressable 
              style={styles.botonIniciar} 
              onPress={() => router.push("../modulo/coordinacion/juego")}
            >
              <Text style={styles.textoBoton}>Iniciar</Text>
            </Pressable>
          </View>

        </View>

      </View>

    </View>
  );
}