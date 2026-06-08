import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, Text, View } from "react-native";
import styles from "./styles/stylestutorial";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Tutorial() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);

  // --- ESTADOS PARA LA MANZANA (PASO 2) ---
  const [fallos, setFallos] = useState(0); 
  const [frutaAtrapada, setFrutaAtrapada] = useState(false);
  
  // Posición horizontal de la fruta (Porcentaje del 5% al 85% para que no se corte en los bordes)
  const [frutaX, setFrutaX] = useState(45); 

  // --- ANIMACIÓN DE LA CANASTA (EJE X - PORCENTAJE) ---
  const porcentajeX = useRef(new Animated.Value(42)).current;
  const ultimoPorcentajeX = useRef(42);

  // --- ANIMACIONES DE LA FRUTA ---
  const frutaY = useRef(new Animated.Value(-10)).current; 
  const escalaFruta = useRef(new Animated.Value(1)).current; 

  // Guardar posición de la canasta en tiempo real
  useEffect(() => {
    const idEscucha = porcentajeX.addListener((state) => {
      ultimoPorcentajeX.current = state.value;
    });
    return () => porcentajeX.removeListener(idEscucha);
  }, [porcentajeX]);

  // --- EFECTO DE LATIDO INFINITO (PULSE) ---
  useEffect(() => {
    if (paso === 2 && !frutaAtrapada && fallos >= 2) {
      const animacionLatido = Animated.loop(
        Animated.sequence([
          Animated.timing(escalaFruta, {
            toValue: 1.4, 
            duration: 600,
            useNativeDriver: true, 
          }),
          Animated.timing(escalaFruta, {
            toValue: 1.0, 
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animacionLatido.start();
      return () => animacionLatido.stop();
    } else {
      escalaFruta.setValue(1);
    }
  }, [paso, fallos, frutaAtrapada]);

  // --- LÓGICA DE CAÍDA DE LA MANZANA ---
  const iniciarCaidaFruta = () => {
    setFrutaAtrapada(false);
    frutaY.setValue(-10); // Reinicia arriba

    // GENERAR POSICIÓN HORIZONTAL AL AZAR (Entre 5% y 80% de la pantalla)
    const xAleatoria = Math.floor(Math.random() * (80 - 5 + 1)) + 5;
    setFrutaX(xAleatoria);

    const durationCaida = fallos >= 2 ? 4500 : 2500;
    let evaluado = false;

    const idY = frutaY.addListener((state) => {
      // Evaluamos el choque cuando pasa a la altura fija de la canasta (78% al 83%)
      if (state.value >= 78 && state.value <= 83 && !evaluado) {
        const canastaIzquierda = ultimoPorcentajeX.current;
        const canastaDerecha = ultimoPorcentajeX.current + 18; // Margen de ancho de la canasta (18%)

        // CORRECCIÓN: Ahora evalúa contra la posición dinámica 'xAleatoria'
        if (xAleatoria >= (canastaIzquierda - 5) && xAleatoria <= canastaDerecha) {
          evaluado = true;
          setFrutaAtrapada(true);
          frutaY.setValue(-10); 
          frutaY.removeListener(idY);
        }
      }
    });

    Animated.timing(frutaY, {
      toValue: 105, // Pasa de largo de la canasta y cae tras la tarjeta blanca
      duration: durationCaida,
      useNativeDriver: false,
    }).start(({ finished }) => {
      frutaY.removeListener(idY);
      if (finished && !evaluado) {
        setFallos((prev) => prev + 1); // Si llegó abajo sin tocar la canasta, cuenta como fallo
      }
    });
  };

  useEffect(() => {
    if (paso === 2 && !frutaAtrapada) {
      const timer = setTimeout(() => {
        iniciarCaidaFruta();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [paso, fallos]);

  // 1. Asegúrate de tener esto fuera del componente (al inicio de tu archivo)
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ... dentro del componente:
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    // Cambiamos a _ (guion bajo) para decirle a TS que no usaremos esas variables y quitar el aviso
    onPanResponderGrant: (_, __) => {}, 

    onPanResponderMove: (_, gestureState) => {
      // Usamos el ancho real de pantalla
      const anchoReal = Dimensions.get("window").width; 
      
      let nuevoPorcentaje = (gestureState.moveX / anchoReal) * 100;

      // Ajuste de centrado (si el emoji mide 15%, restamos la mitad: 7.5)
      nuevoPorcentaje = nuevoPorcentaje - 7.5; 

      // Límites estrictos para evitar que se salga
      if (nuevoPorcentaje < 0) nuevoPorcentaje = 0;
      if (nuevoPorcentaje > 85) nuevoPorcentaje = 85; 

      porcentajeX.setValue(nuevoPorcentaje);
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

  const avanzarPaso = () => {
    if (paso === 1) {
      setPaso(2);
    } else if (paso === 2) {
      if (frutaAtrapada) {
        setPaso(3);
      }
    } else {
      // 👈 Cambiado para ir a la raíz del proyecto (tu menú principal)
      router.push("/modulo/coordinacion"); 
    }
  };

  const obtenerTextosPaso = () => {
    switch (paso) {
      case 1:
        return {
          titulo: "Paso 1 de 3",
          descripcion: "¡Vamos a aprender a jugar! Mira la canasta abajo.",
          indicacion: "👆 Pon tu dedo en la canasta y arrástrala de izquierda a derecha.",
          boton: "Entendido 👍",
        };
      case 2:
        return {
          titulo: "Paso 2 de 3",
          descripcion: frutaAtrapada 
            ? "🎉 ¡Excelente! Lograste atrapar la manzana de forma correcta." 
            : "Las frutas caerán desde arriba de la pantalla de forma aleatoria.",
          indicacion: frutaAtrapada
            ? "👉 Presiona Siguiente para ver las reglas finales."
            : fallos >= 2 
              ? "🐢 ¡La fruta va lento y latiendo! Desplaza rápido tu canasta hacia donde está cayendo."
              : "🍎 ¡Mira arriba! Mueve la canasta hacia los lados para interceptar la manzana antes de que caiga.",
          boton: frutaAtrapada ? "Siguiente ➡️" : "Esperando que la atrapes... 🍎",
        };
      case 3:
        return {
          titulo: "Paso 3 de 3",
          descripcion: "¡Has completado el tutorial!",
          indicacion: "Presiona el botón para volver al menú principal.",
          boton: "Volver al Menú 🏠", // 👈 Cambiado el texto
        };
      default:
        return { titulo: "", descripcion: "", indicacion: "", boton: "" };
    }
  };

  const infoPaso = obtenerTextosPaso();

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
        <Text style={styles.titulo}>Módulo Tutorial</Text>
        <View style={styles.tituloLinea} />
        
        {/* LA MANZANA RESPONSIVA CON POSICIÓN X ALEATORIA */}
        {paso === 2 && (
          <Animated.View
            style={[
              styles.frutaAnimada,
              { 
                top: posicionFrutaString, 
                left: `${frutaX}%`, // 👈 Usa el estado frutaX que cambia al azar
                transform: [{ scale: escalaFruta }] 
              }
            ]}
          >
            <Text style={{ fontSize: 40 }}>
              {frutaAtrapada ? "✨" : "🍎"}
            </Text>
          </Animated.View>
        )}

        {/* LA CANASTA */}
        <Animated.Text
          {...panResponder.panHandlers}
          style={[
            styles.canastaAnimada,
            { left: posicionCanastaString },
          ]}
        >
          🧺
        </Animated.Text>
      </View>

      <View style={styles.contenedor}>
        <View style={styles.headerRow}>
          <View style={styles.pasoContenedor}>
            <Text style={styles.pasoTitulo}>{infoPaso.titulo}</Text>
          </View>
          <Ionicons name="school" size={30} color="#faa638" />
        </View>
        
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>{infoPaso.descripcion}</Text>
        </View>

        <View style={styles.indicaciones}>
          <Text style={styles.indicacion}>{infoPaso.indicacion}</Text>
        </View>

        <View style={styles.filaBotones}>
          <View style={styles.botonBaseIniciar}>
            <Pressable 
              style={[styles.botonIniciar, (paso === 2 && !frutaAtrapada) && { backgroundColor: "#ccc" }]} 
              onPress={avanzarPaso}
              disabled={paso === 2 && !frutaAtrapada}
            >
              <Text style={styles.textoBoton}>{infoPaso.boton}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}