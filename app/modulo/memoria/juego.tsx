import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import styles from './styles/stylesjuego';

interface Carta {
  id: number;
  contenido: string;
  volteada: boolean;
  encontrada: boolean;
}

const CONFIG_CARTAS = {
  facil: 8,
  normal: 12,
  dificil: 20,
} as const;

const FRUTAS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥥", "🥝", "🍉", "🍒"];

export default function PantallaJuego() {
  const { nivel, mazo, tiempo } = useLocalSearchParams();
  const router = useRouter();
  
  const [tablero, setTablero] = useState<Carta[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [memorizando, setMemorizando] = useState(true);
  const [contadorMemo, setContadorMemo] = useState(5);
  const [segundos, setSegundos] = useState(Number(tiempo) || 60);
  const [nivelActual, setNivelActual] = useState<string>((nivel as string) || 'normal');
  const [pares, setPares] = useState<number>(6); // 6 pares => 4x3 (12 cartas)
  
  // Estos NO se reinician al completar el tablero, solo al dar "Reintentar"
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);

  const aciertosRef = useRef(0);
  const fallosRef = useRef(0);

  useEffect(() => { aciertosRef.current = aciertos; }, [aciertos]);
  useEffect(() => { fallosRef.current = fallos; }, [fallos]);

  // --- FUNCIÓN SOLO PARA GENERAR NUEVO TABLERO (Sin tocar marcador) ---
  const generarMazoPorNivel = useCallback((nivelKey: keyof typeof CONFIG_CARTAS) => {
    const cantidadTotal = CONFIG_CARTAS[nivelKey];
    const seleccion = FRUTAS.slice(0, cantidadTotal / 2);
    const pares = [...seleccion, ...seleccion];
    // barajar
    for (let i = pares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pares[i], pares[j]] = [pares[j], pares[i]];
    }
    return pares;
  }, []);

  const mezclarYGenerarTablero = useCallback((mazoJson?: string, nivelKey?: keyof typeof CONFIG_CARTAS) => {
    let frutas: string[] = [];
    if (mazoJson) {
      try { frutas = JSON.parse(mazoJson); } catch { frutas = []; }
    }
    if ((!frutas || frutas.length === 0) && nivelKey) {
      frutas = generarMazoPorNivel(nivelKey);
    }
    // si aún no hay frutas, fallback a nivelActual
    if ((!frutas || frutas.length === 0)) {
      // generar por pares actuales
      const seleccion = FRUTAS.slice(0, pares);
      frutas = [...seleccion, ...seleccion];
      for (let i = frutas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [frutas[i], frutas[j]] = [frutas[j], frutas[i]];
      }
    }
    const mazoMezclado = [...frutas].sort(() => Math.random() - 0.5);
    const nuevoTablero = mazoMezclado.map((fruta: string) => ({
      id: Math.random(), 
      contenido: fruta,
      volteada: true,
      encontrada: false,
    }));
    setTablero(nuevoTablero);
    setMemorizando(true);
    setContadorMemo(5);
    setSeleccionadas([]);
  }, [generarMazoPorNivel, nivelActual]);

  // --- AL INICIAR POR PRIMERA VEZ ---
  useEffect(() => {
    if (mazo) mezclarYGenerarTablero(mazo as string);
    else mezclarYGenerarTablero(undefined, undefined);
  }, [mazo, mezclarYGenerarTablero]);



  // --- FINALIZAR PARTIDA ---
  const finalizarJuego = useCallback(() => {
    let mensajeEvaluacion = aciertosRef.current < 5 ? "¡Sigue practicando! 💪" : "¡Excelente memoria! 🐘🏆";

    Alert.alert(
      "⏱️ ¡TIEMPO AGOTADO!",
      `RESUMEN FINAL:\n\n✅ Aciertos Totales: ${aciertosRef.current}\n❌ Fallos Totales: ${fallosRef.current}\n\n${mensajeEvaluacion}`,
      [
        { text: "MENÚ", onPress: () => router.back(), style: "destructive" },
        { text: "REINTENTAR", onPress: () => {
            // Aquí SI reiniciamos todo manualmente
            setAciertos(0);
            setFallos(0);
            setSegundos(Number(tiempo) || 60);
            if(mazo) mezclarYGenerarTablero(mazo as string);
        }}
      ],
      { cancelable: false }
    );
  }, [mazo, tiempo, router, mezclarYGenerarTablero]);

  // Cronómetro de memorización
  useEffect(() => {
    let intervaloMemo: any;
    if (memorizando && contadorMemo > 0) {
      intervaloMemo = setInterval(() => setContadorMemo(c => c - 1), 1000);
    } else if (contadorMemo === 0 && memorizando) {
      setTablero(prev => prev.map(c => ({ ...c, volteada: false })));
      setMemorizando(false);
    }
    return () => clearInterval(intervaloMemo);
  }, [memorizando, contadorMemo]);

  // Cronómetro principal
  useEffect(() => {
    let intervaloJuego: any;
    if (!memorizando && segundos > 0) {
      intervaloJuego = setInterval(() => {
        setSegundos(s => {
          if (s <= 1) {
            clearInterval(intervaloJuego);
            finalizarJuego();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervaloJuego);
  }, [memorizando, segundos, finalizarJuego]);

  const manejarClick = (index: number) => {
    if (memorizando || segundos === 0 || tablero[index].volteada || tablero[index].encontrada || seleccionadas.length === 2) return;
    const nuevoTablero = [...tablero];
    nuevoTablero[index].volteada = true;
    setTablero(nuevoTablero);
    setSeleccionadas([...seleccionadas, index]);
  };

  useEffect(() => {
    if (seleccionadas.length === 2) {
      const [p, s] = seleccionadas;
      if (tablero[p].contenido === tablero[s].contenido) {
        setAciertos(a => a + 1);
        setTablero(prev => {
          const n = [...prev];
          n[p].encontrada = true;
          n[s].encontrada = true;
          return n;
        });
        setSeleccionadas([]);
        // (sin cambios automáticos de dificultad)
      } else {
        setFallos(f => f + 1);
        setTimeout(() => {
          setTablero(prev => {
            const n = [...prev];
            n[p].volteada = false;
            n[s].volteada = false;
            return n;
          });
          setSeleccionadas([]);
        }, 800);
      }
    }
  }, [seleccionadas, tablero]);

  // --- Al completar ronda, regenerar tablero ---
  useEffect(() => {
    if (tablero.length > 0 && tablero.every(c => c.encontrada)) {
      setTimeout(() => {
        mezclarYGenerarTablero(undefined, undefined);
      }, 800);
    }
  }, [tablero, mezclarYGenerarTablero]);

  return (
    <View style={styles.container}>
      <Text style={styles.tituloGrande}>¡ENCUENTRA LOS PARES!</Text>
      <View style={styles.headerStats}>
        <View style={styles.statBox}><Text style={styles.statLabel}>TIEMPO</Text><Text style={styles.statValue}>{segundos}s</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>ACIERTOS</Text><Text style={styles.statValue}>{aciertos}</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>FALLOS</Text><Text style={styles.statValue}>{fallos}</Text></View>
      </View>
      {memorizando && (
        <View style={styles.bannerMemo}>
          <Text style={styles.textoBanner}>Memoriza en: {contadorMemo}s</Text>
        </View>
      )}
      {/* Calcular ancho del grid según número de cartas para respetar 3x2 inicial */}
      {(() => {
        const totalCards = tablero.length > 0 ? tablero.length : pares * 2;
        const columns = Math.min(5, Math.max(2, Math.ceil(Math.sqrt(totalCards))));
        const gridWidth = columns * 70; // aproximado: carta width + margins
        return (
          <View style={[styles.grid, { width: gridWidth, marginTop: 20 }]}>
            {tablero.map((carta, i) => (
              <Pressable 
                key={carta.id} 
                style={[styles.carta, (carta.volteada || carta.encontrada) && styles.cartaActiva]} 
                onPress={() => manejarClick(i)}
              >
                <Text style={styles.textoCarta}>{carta.volteada || carta.encontrada ? carta.contenido : "?"}</Text>
              </Pressable>
            ))}
          </View>
        );
      })()}
    </View>
  );
}

