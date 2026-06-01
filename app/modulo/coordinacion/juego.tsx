import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import styles from "./styles/stylesjuego";
// Asegúrate de importar esto al principio del archivo:
import { PanResponder } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FRUTAS_DISPONIBLES = ["🍎", "🍐", "🍊", "🍋", "🍌", "🍓"];

export default function Juego() {
  const router = useRouter();
  const [puntos, setPuntos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [tiempo, setTiempo] = useState(60);
  const ultimaGeneracionRef = useRef<number>(0);
  
  const frutasRef = useRef<any[]>([]);
  const [_, setTrigger] = useState(0); 

  // --- REFS DE CONTROL DE LA CANASTA (Declaradas en orden correcto) ---
  const canastaX = useRef(new Animated.Value(42));
  const canastaXValue = useRef(42);
  const startX = useRef(42); // Guarda la posición base al tocar para evitar saltos
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastX = useRef<number>(0);

  const obtenerConfiguracionDificultad = () => {
    const totalIntentos = puntos + fallos;
    if (totalIntentos > 22) return { intervalo: 300, duracion: 1400 };
    if (totalIntentos > 12) return { intervalo: 600, duracion: 1700 };
    return { intervalo: 900, duracion: 2000 };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // Guardamos la ubicación exacta de la canasta al iniciar el toque
        startX.current = canastaXValue.current;
      },

      onPanResponderMove: (_, gestureState) => {
        // Convertimos el desplazamiento físico del dedo (dx) a porcentaje de pantalla
        const desplazamiento = (gestureState.dx / SCREEN_WIDTH) * 100;
        let nuevoValor = startX.current + desplazamiento;

        // Límites perfectos (0% es el extremo izquierdo, 100% el derecho)
        if (nuevoValor < 0) nuevoValor = 0;
        if (nuevoValor > 100) nuevoValor = 100;

        // Actualización 1:1 inmediata
        canastaX.current.setValue(nuevoValor);
        canastaXValue.current = nuevoValor;
      },

      onPanResponderRelease: () => {
        // Eliminado __getValue() por completo para limpiar el error ts(2551)
      },
    })
  ).current;

  useEffect(() => {
    canastaX.current.addListener(({ value }) => { canastaXValue.current = value; });
    return () => canastaX.current.removeAllListeners();
  }, []);

  // 1. Cronómetro (Independiente)
  useEffect(() => {
    if (tiempo <= 0) return;
    const timer = setInterval(() => setTiempo((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempo]);

  // 2. Generador de Frutas
  useEffect(() => {
    if (tiempo <= 0) return;

    const generarFruta = () => {
      const { intervalo, duracion } = obtenerConfiguracionDificultad();
        
      let newX = Math.random() * 80;
      if (Math.abs(newX - lastX.current) < 20) newX = newX > 50 ? newX - 25 : newX + 25;
      lastX.current = newX;

      const id = Date.now();
      const anim = new Animated.Value(0);
      let atrapada = false;

      anim.addListener(({ value }) => {
        const margen = duracion < 2000 ? 35 : 20;
        // Detección de colisión utilizando la escala unificada de 0 a 100
        if (!atrapada && value > 85 && value < 95 && Math.abs(newX - canastaXValue.current) < margen) {
          atrapada = true;
          setPuntos(p => p + 1); // <-- SUMA UN ACIERTO AQUÍ
          anim.stopAnimation();
          frutasRef.current = frutasRef.current.filter(f => f.id !== id);
          setTrigger(prev => prev + 1);
        }
      });

      frutasRef.current.push({ id, x: newX, emoji: "🍎", anim }); 
      setTrigger(prev => prev + 1);

      Animated.timing(anim, {
        toValue: 100,
        duration: duracion,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !atrapada) {
          frutasRef.current = frutasRef.current.filter(f => f.id !== id);
          setFallos(f => f + 1); // <-- SÓLO SUMA UN FALLO AQUÍ (Ya no regala puntos)
          setTrigger(prev => prev + 1);
        }
      });

      timeoutRef.current = setTimeout(generarFruta, intervalo);
    };

    const timer = setTimeout(generarFruta, 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutRef.current as any);
    };
  }, [puntos, tiempo]);

  return (
    <View style={styles.page}>
      <Stack.Screen options={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 18 }}>⏱️ {tiempo}s</Text>
            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>🍎 {puntos}</Text>
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>❌ {fallos}</Text>
          </View>
        )
      }} />

      <View style={styles.zonaJuego}>
  {/* Frutas */}
  {frutasRef.current.map((f) => (
    <Animated.Text key={f.id} style={[styles.fruta, {
      top: f.anim.interpolate({ inputRange: [0, 100], outputRange: ["-10%", "110%"] }),
      left: `${f.x}%`
    }]}>{f.emoji}</Animated.Text>
  ))}

  {/* Asegúrate de usar Animated.Text en lugar de Animated.View */}
<Animated.Text
  {...panResponder.panHandlers}
  style={[
    styles.canasta,
    {
      transform: [{
        translateX: canastaX.current.interpolate({
          inputRange: [0, 100],
          outputRange: [0, SCREEN_WIDTH - 80] 
        })
      }]
    }
  ]}
>
  🧺
</Animated.Text>
</View>
    </View>
  );
}