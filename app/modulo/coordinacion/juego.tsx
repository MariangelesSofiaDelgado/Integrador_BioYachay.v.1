import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import styles from "./styles/stylesjuego";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Juego() {
  const [puntos, setPuntos] = useState(0);
  const [frutas, setFrutas] = useState<any[]>([]);
  
  const canastaX = useRef(new Animated.Value(42)).current;

  // Generador de frutas cada 1.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevaFruta = {
        id: Date.now(),
        x: Math.random() * 80, // Posición aleatoria 0-80%
        animacion: new Animated.Value(-10),
      };
      setFrutas((prev) => [...prev, nuevaFruta]);
      
      // Lanzar caída
      Animated.timing(nuevaFruta.animacion, {
        toValue: 105,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        setFrutas((prev) => prev.filter(f => f.id !== nuevaFruta.id));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.zonaJuego}>
        {frutas.map((f) => (
          <Animated.Text
            key={f.id}
            style={[styles.fruta, { top: f.animacion.interpolate({
              inputRange: [0, 100], outputRange: ["0%", "100%"]
            }), left: `${f.x}%` }]}
          >
            🍎
          </Animated.Text>
        ))}
        
        <Animated.Text style={[styles.canasta, { left: canastaX.interpolate({
            inputRange: [0, 100], outputRange: ["0%", "100%"]
        }) }]}>
          🧺
        </Animated.Text>
      </View>

      <View style={styles.contenedorInfo}>
        <Text style={styles.textoPuntaje}>Puntaje: {puntos}</Text>
      </View>
    </View>
  );
}