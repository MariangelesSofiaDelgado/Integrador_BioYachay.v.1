import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface Carta {
  id: number;
  contenido: string;
  volteada: boolean;
  encontrada: boolean;
}

export default function PantallaJuego() {
  const { nivel, mazo, tiempo } = useLocalSearchParams();
  const router = useRouter();
  
  const [tablero, setTablero] = useState<Carta[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [memorizando, setMemorizando] = useState(true);
  const [contadorMemo, setContadorMemo] = useState(5);
  const [segundos, setSegundos] = useState(Number(tiempo) || 60);
  
  // Estos NO se reinician al completar el tablero, solo al dar "Reintentar"
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);

  const aciertosRef = useRef(0);
  const fallosRef = useRef(0);

  useEffect(() => { aciertosRef.current = aciertos; }, [aciertos]);
  useEffect(() => { fallosRef.current = fallos; }, [fallos]);

  // --- FUNCIÓN SOLO PARA GENERAR NUEVO TABLERO (Sin tocar marcador) ---
  const mezclarYGenerarTablero = useCallback((mazoJson: string) => {
    const frutas = JSON.parse(mazoJson);
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
  }, []);

  // --- AL INICIAR POR PRIMERA VEZ ---
  useEffect(() => {
    if (mazo) mezclarYGenerarTablero(mazo as string);
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

  // --- CAMBIO AQUÍ: Al completar ronda, NO reinicia aciertos/fallos ---
  useEffect(() => {
    if (tablero.length > 0 && tablero.every(c => c.encontrada)) {
      setTimeout(() => { 
        if (mazo) mezclarYGenerarTablero(mazo as string); 
      }, 800);
    }
  }, [tablero, mazo, mezclarYGenerarTablero]);

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
      <View style={[styles.grid, { width: nivel === 'dificil' ? 350 : 280 }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ececec", alignItems: 'center', paddingTop: 40 },
  tituloGrande: { fontSize: 24, fontWeight: "900", color: "#2f5279", marginBottom: 20, textAlign: 'center' },
  headerStats: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 20, elevation: 5 },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#7f8c8d' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#2f5279' },
  bannerMemo: { backgroundColor: '#e67e22', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, marginBottom: 15 },
  textoBanner: { color: '#fff', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  carta: { width: 55, height: 75, margin: 5, backgroundColor: "#2f5279", justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  cartaActiva: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#2f5279" },
  textoCarta: { fontSize: 28 }
});