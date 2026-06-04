import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import styles from "./styles/stylesjuego";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Frutas variadas que caen
const FRUTAS_DISPONIBLES = ["🍎", "🍐", "🍊", "🍋", "🍌", "🍓", "🍇", "🍉", "🍑", "🥝"];

export default function Juego() {
  const router = useRouter();
  const [puntos, setPuntos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [tiempo, setTiempo] = useState(60);

  const puntosRef = useRef(0);
  const fallosRef = useRef(0);

  const frutasRef = useRef<any[]>([]);
  const [_, setTrigger] = useState(0);

  // --- CANASTA ---
  const canastaX = useRef(new Animated.Value(42));
  const canastaXValue = useRef(42);
  const startX = useRef(42);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastX = useRef<number>(0);

  // Sync puntos/fallos refs para usarlos dentro de closures sin stale state
  useEffect(() => { puntosRef.current = puntos; }, [puntos]);
  useEffect(() => { fallosRef.current = fallos; }, [fallos]);

  // Ancho visual de la canasta (fontSize 52) como % del ancho de pantalla
  const MARGEN_CANASTA = (52 / SCREEN_WIDTH) * 100;

  const obtenerConfiguracionDificultad = () => {
    const totalIntentos = puntosRef.current + fallosRef.current;
    if (totalIntentos > 22) return { intervalo: 300, duracion: 1100, margen: MARGEN_CANASTA, label: "🔥 Difícil" };
    if (totalIntentos > 12) return { intervalo: 550, duracion: 1500, margen: MARGEN_CANASTA, label: "⚡ Medio" };
    return { intervalo: 900, duracion: 2000, margen: MARGEN_CANASTA, label: "🌱 Fácil" };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startX.current = canastaXValue.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const desplazamiento = (gestureState.dx / SCREEN_WIDTH) * 100;
        let nuevoValor = startX.current + desplazamiento;
        if (nuevoValor < 0) nuevoValor = 0;
        if (nuevoValor > 100) nuevoValor = 100;
        canastaX.current.setValue(nuevoValor);
        canastaXValue.current = nuevoValor;
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  useEffect(() => {
    canastaX.current.addListener(({ value }) => { canastaXValue.current = value; });
    return () => canastaX.current.removeAllListeners();
  }, []);

  // Cronómetro
  useEffect(() => {
    if (tiempo <= 0) return;
    const timer = setInterval(() => setTiempo((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempo]);

  // Generador de frutas
  useEffect(() => {
    if (tiempo <= 0) return;

    const generarFruta = () => {
      const { intervalo, duracion, margen } = obtenerConfiguracionDificultad();

      // Posición X aleatoria separada de la anterior
      let newX = Math.random() * 80;
      if (Math.abs(newX - lastX.current) < 20) newX = newX > 50 ? newX - 25 : newX + 25;
      lastX.current = newX;

      // Fruta aleatoria
      const emoji = FRUTAS_DISPONIBLES[Math.floor(Math.random() * FRUTAS_DISPONIBLES.length)];

      const id = Date.now() + Math.random();
      const anim = new Animated.Value(0);
      let atrapada = false;

      anim.addListener(({ value }) => {
        // Zona de captura: cuando la fruta está entre 78% y 88% de su caída
        // (antes de llegar al fondo), comprobamos si la canasta está debajo
        if (!atrapada && value >= 85 && value <= 90) {
          const distancia = Math.abs(newX - canastaXValue.current);
          if (distancia < margen) {
            atrapada = true;
            anim.stopAnimation();
            // Eliminamos la fruta al instante
            frutasRef.current = frutasRef.current.filter(f => f.id !== id);
            setTrigger(prev => prev + 1);
            setPuntos(p => p + 1);
          }
        }
      });

      // Fruta aleatoria del array
      frutasRef.current.push({ id, x: newX, emoji, anim });
      setTrigger(prev => prev + 1);

      Animated.timing(anim, {
        toValue: 100,
        duration: duracion,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !atrapada) {
          frutasRef.current = frutasRef.current.filter(f => f.id !== id);
          setFallos(f => f + 1);
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

  // Nivel visible para el jugador
  const totalIntentos = puntos + fallos;
  const nivelLabel =
    totalIntentos > 22 ? "🔥 Difícil" :
    totalIntentos > 12 ? "⚡ Medio" : "🌱 Fácil";

  return (
    <View style={styles.page}>
      <Stack.Screen options={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 17 }}>⏱️ {tiempo}s</Text>
            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 17 }}>🍎 {puntos}</Text>
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}>❌ {fallos}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{nivelLabel}</Text>
          </View>
        )
      }} />

      <View style={[styles.zonaJuego, { position: "relative", flex: 1 }]}>
        {/* Frutas cayendo */}
        {frutasRef.current.map((f) => (
          <Animated.Text key={f.id} style={[styles.fruta, {
            top: f.anim.interpolate({ inputRange: [0, 100], outputRange: ["-10%", "110%"] }),
            left: `${f.x}%`,
            fontSize: 32,
          }]}>
            {f.emoji}
          </Animated.Text>
        ))}

        {/* Canasta */}
        <Animated.Text
          {...panResponder.panHandlers}
          style={[
            styles.canasta,
            {
              position: 'absolute',
              bottom: 20,
              left: 0,
              fontSize: 52,
              zIndex: 10,
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
