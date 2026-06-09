import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import styles from './styles/stylesjuego';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Carta {
  id: number;
  contenido: string;
  volteada: boolean;
  encontrada: boolean;
}

// ─── Configuración de niveles ─────────────────────────────────────────────────
// Cada nivel tiene más pares y menos tiempo de memorización
const NIVELES: { pares: number; tiempoMemo: number; label: string }[] = [
  { pares: 3, tiempoMemo: 10, label: "Nivel 1" }, // 6 cartas
  { pares: 4, tiempoMemo: 9,  label: "Nivel 2" }, // 8 cartas
  { pares: 5, tiempoMemo: 8,  label: "Nivel 3" }, // 10 cartas
  { pares: 6, tiempoMemo: 7,  label: "Nivel 4" }, // 12 cartas
  { pares: 8, tiempoMemo: 6,  label: "Nivel 5" }, // 16 cartas
];

const FRUTAS = ["🍎","🍌","🍇","🍊","🍓","🍍","🥥","🥝","🍉","🍒","🫐","🍑"];

// ─── Utilidad: barajar array ──────────────────────────────────────────────────
function barajar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Componente: Carta animada ────────────────────────────────────────────────
interface CartaAnimadaProps {
  carta: Carta;
  onPress: () => void;
  animarError: boolean;
  entradaDelay: number; // ms de delay para animación de entrada escalonada
}

function CartaAnimada({ carta, onPress, animarError, entradaDelay }: CartaAnimadaProps) {
  const flipAnim    = useRef(new Animated.Value(carta.volteada ? 1 : 0)).current;
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0)).current; // empieza en 0 para entrada
  const prevVolt    = useRef(carta.volteada);
  const prevEnc     = useRef(carta.encontrada);
  const entradaHecha = useRef(false);

  // Animación de entrada (aparece con bounce al barajar)
  useEffect(() => {
    if (!entradaHecha.current) {
      entradaHecha.current = true;
      setTimeout(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }, entradaDelay);
    }
  }, []);

  // Volteo
  useEffect(() => {
    const debe = carta.volteada || carta.encontrada;
    const estaba = prevVolt.current || prevEnc.current;
    if (debe !== estaba) {
      prevVolt.current = carta.volteada;
      prevEnc.current  = carta.encontrada;
      Animated.spring(flipAnim, {
        toValue: debe ? 1 : 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [carta.volteada, carta.encontrada]);

  // Bounce al encontrar
  useEffect(() => {
    if (carta.encontrada) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.25, friction: 3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1,    friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [carta.encontrada]);

  // Shake en error
  useEffect(() => {
    if (animarError) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue:  9, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  9, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  0, duration: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [animarError]);

  const frontRot = flipAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','180deg'] });
  const backRot  = flipAnim.interpolate({ inputRange:[0,1], outputRange:['180deg','360deg'] });

  const cartaStyle = styles.carta as any;
  const W = cartaStyle?.width  ?? 60;
  const H = cartaStyle?.height ?? 60;
  const M = cartaStyle?.margin ?? 4;

  return (
    <Pressable onPress={onPress} style={{ width: W, height: H, margin: M }}>
      <Animated.View style={{ width: W, height: H,
        transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>

        {/* Cara trasera */}
        <Animated.View style={[styles.carta, {
          position:'absolute', top:0, left:0,
          backfaceVisibility:'hidden',
          transform:[{ rotateY: frontRot }],
        }]}>
          <Text style={styles.textoCarta}>?</Text>
        </Animated.View>

        {/* Cara delantera */}
        <Animated.View style={[styles.carta, carta.encontrada && styles.cartaActiva, {
          position:'absolute', top:0, left:0,
          backfaceVisibility:'hidden',
          transform:[{ rotateY: backRot }],
        }]}>
          <Text style={styles.textoCarta}>{carta.contenido}</Text>
        </Animated.View>

      </Animated.View>
    </Pressable>
  );
}

// ─── Componente: Puntaje animado ──────────────────────────────────────────────
interface PuntajeAnimadoProps {
  valor: number;
  label: string;
  esAcierto: boolean;
  ultimoCambio: number;
}

function PuntajeAnimado({ valor, label, esAcierto, ultimoCambio }: PuntajeAnimadoProps) {
  const translateY    = useRef(new Animated.Value(0)).current;
  const opacidadDelta = useRef(new Animated.Value(0)).current;
  const scaleStat     = useRef(new Animated.Value(1)).current;
  const prevValor     = useRef(valor);

  useEffect(() => {
    if (prevValor.current !== valor) {
      prevValor.current = valor;
      opacidadDelta.setValue(1);
      translateY.setValue(0);
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, { toValue: esAcierto ? -30 : 30, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 1, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacidadDelta, { toValue: 1,   duration: 100, useNativeDriver: true }),
          Animated.timing(opacidadDelta, { toValue: 0,   duration: 500, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.spring(scaleStat, { toValue: 1.4, friction: 3, useNativeDriver: true }),
          Animated.spring(scaleStat, { toValue: 1,   friction: 4, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [ultimoCambio]);

  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={{ alignItems:'center' }}>
        <Animated.Text style={[styles.statValue, { transform:[{ scale: scaleStat }] }]}>
          {valor}
        </Animated.Text>
        <Animated.Text style={{
          position:'absolute', top:0, fontSize:16, fontWeight:'bold',
          color: esAcierto ? '#4ade80' : '#f87171',
          opacity: opacidadDelta,
          transform:[{ translateY }],
        }}>
          {esAcierto ? '+1' : '-1'}
        </Animated.Text>
      </View>
    </View>
  );
}

// ─── Componente: Pantalla de resultados con estrellas ─────────────────────────
interface ResultadosProps {
  nivelAlcanzado: number;   // índice 0-based del último nivel completado
  aciertos: number;
  fallos: number;
  onReintentar: () => void;
  onMenu: () => void;
}

function PantallaResultados({ nivelAlcanzado, aciertos, fallos, onReintentar, onMenu }: ResultadosProps) {
  const total    = aciertos + fallos;
  const precision = total > 0 ? Math.round((aciertos / total) * 100) : 0;

  // Estrellas: 3 si precisión ≥ 80%, 2 si ≥ 50%, 1 si algo hiciste, 0 si nada
  const estrellas = precision >= 80 ? 3 : precision >= 50 ? 2 : aciertos > 0 ? 1 : 0;

  const scaleEstrellas = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const slideUp = useRef(new Animated.Value(60)).current;
  const fadeIn  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide up del panel
    Animated.parallel([
      Animated.timing(slideUp, { toValue: 0,  duration: 400, useNativeDriver: true }),
      Animated.timing(fadeIn,  { toValue: 1,  duration: 400, useNativeDriver: true }),
    ]).start();

    // Estrellas aparecen una a una
    scaleEstrellas.forEach((anim, i) => {
      setTimeout(() => {
        Animated.spring(anim, {
          toValue: i < estrellas ? 1 : 0.4,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }, 400 + i * 200);
    });
  }, []);

  const mensajes = [
    "¡Sigue intentando! 💪",
    "¡Buen comienzo! 😊",
    "¡Muy bien! 🎉",
    "¡Memoria perfecta! 🏆🐘",
  ];

  return (
    <Animated.View style={[resStyles.overlay, { opacity: fadeIn, transform:[{ translateY: slideUp }] }]}>
      <View style={resStyles.card}>
        <Text style={resStyles.titulo}>¡JUEGO TERMINADO!</Text>
        <Text style={resStyles.nivelTexto}>
          Llegaste al {NIVELES[Math.min(nivelAlcanzado, NIVELES.length - 1)].label}
        </Text>

        {/* Estrellas */}
        <View style={resStyles.estrellasRow}>
          {scaleEstrellas.map((anim, i) => (
            <Animated.Text key={i} style={[resStyles.estrella, { transform:[{ scale: anim }] }]}>
              {i < estrellas ? '⭐' : '☆'}
            </Animated.Text>
          ))}
        </View>

        <Text style={resStyles.mensaje}>{mensajes[estrellas]}</Text>

        {/* Stats */}
        <View style={resStyles.statsRow}>
          <View style={resStyles.statItem}>
            <Text style={resStyles.statNum}>{aciertos}</Text>
            <Text style={resStyles.statLbl}>Aciertos</Text>
          </View>
          <View style={resStyles.statItem}>
            <Text style={resStyles.statNum}>{fallos}</Text>
            <Text style={resStyles.statLbl}>Fallos</Text>
          </View>
          <View style={resStyles.statItem}>
            <Text style={resStyles.statNum}>{precision}%</Text>
            <Text style={resStyles.statLbl}>Precisión</Text>
          </View>
        </View>

        {/* Botones */}
        <Pressable style={resStyles.btnPrimario} onPress={onReintentar}>
          <Text style={resStyles.btnTexto}>🔄 REINTENTAR</Text>
        </Pressable>
        <Pressable style={resStyles.btnSecundario} onPress={onMenu}>
          <Text style={[resStyles.btnTexto, { color:'#555' }]}>← MENÚ</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const resStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  titulo: { fontSize: 22, fontWeight: '900', color: '#222', marginBottom: 4 },
  nivelTexto: { fontSize: 15, color: '#666', marginBottom: 16 },
  estrellasRow: { flexDirection: 'row', marginBottom: 8 },
  estrella: { fontSize: 42, marginHorizontal: 6 },
  mensaje: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 20 },
  statsRow: { flexDirection: 'row', marginBottom: 24, gap: 20 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '900', color: '#222' },
  statLbl: { fontSize: 12, color: '#888', marginTop: 2 },
  btnPrimario: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnSecundario: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  btnTexto: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

// ─── Componente: Banner de nivel superado ─────────────────────────────────────
interface BannerNivelProps {
  nivelLabel: string;
  visible: boolean;
}

function BannerNivelSuperado({ nivelLabel, visible }: BannerNivelProps) {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale,   { toValue: 1,   friction: 5, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1,   duration: 200, useNativeDriver: true }),
        ]),
        Animated.delay(900),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible, nivelLabel]);

  if (!visible) return null;

  return (
    <Animated.View style={[bannerStyles.container, { opacity, transform:[{ scale }] }]}>
      <Text style={bannerStyles.texto}>🎉 ¡{nivelLabel} superado!</Text>
    </Animated.View>
  );
}

const bannerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 50,
    zIndex: 50,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  texto: { color: '#fff', fontSize: 20, fontWeight: '900' },
});

// ─── Pantalla principal ────────────────────────────────────────────────────────
export default function PantallaJuego() {
  const { tiempo } = useLocalSearchParams();
  const router = useRouter();

  const tiempoTotal = Number(tiempo) || 90;

  // Estado del nivel
  const [nivelIdx, setNivelIdx]             = useState(0);
  const [mostrarBanner, setMostrarBanner]   = useState(false);
  const [bannerLabel, setBannerLabel]       = useState('');
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // Estado del tablero
  const [tablero, setTablero]         = useState<Carta[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [memorizando, setMemorizando] = useState(true);
  const [contadorMemo, setContadorMemo] = useState(NIVELES[0].tiempoMemo);
  const [segundos, setSegundos]       = useState(tiempoTotal);
  const [cartasError, setCartasError] = useState<number[]>([]);

  // Puntaje acumulado toda la partida
  const [aciertos, setAciertos]         = useState(0);
  const [fallos, setFallos]             = useState(0);
  const [ultimoAcierto, setUltimoAcierto] = useState(0);
  const [ultimoFallo, setUltimoFallo]   = useState(0);

  // Refs para acceder en callbacks sin stale closures
  const aciertosRef   = useRef(0);
  const fallosRef     = useRef(0);
  const nivelIdxRef   = useRef(0);
  const transicionando = useRef(false);

  useEffect(() => { aciertosRef.current = aciertos; },  [aciertos]);
  useEffect(() => { fallosRef.current   = fallos; },    [fallos]);
  useEffect(() => { nivelIdxRef.current = nivelIdx; },  [nivelIdx]);

  // ── Generar tablero para un nivel dado ──────────────────────────────────────
  const generarTablero = useCallback((idx: number) => {
    const cfg    = NIVELES[idx];
    const frutas = barajar([...FRUTAS.slice(0, cfg.pares), ...FRUTAS.slice(0, cfg.pares)]);
    const nuevo  = frutas.map(f => ({
      id: Math.random(),
      contenido: f,
      volteada: true,
      encontrada: false,
    }));
    setTablero(nuevo);
    setMemorizando(true);
    setContadorMemo(cfg.tiempoMemo);
    setSeleccionadas([]);
    setCartasError([]);
    transicionando.current = false;
  }, []);

  // Inicio
  useEffect(() => { generarTablero(0); }, []);

  // ── Cronómetro memorización ──────────────────────────────────────────────────
  useEffect(() => {
    let t: any;
    if (memorizando && contadorMemo > 0) {
      t = setInterval(() => setContadorMemo(c => c - 1), 1000);
    } else if (contadorMemo === 0 && memorizando) {
      setTablero(prev => prev.map(c => ({ ...c, volteada: false })));
      setMemorizando(false);
    }
    return () => clearInterval(t);
  }, [memorizando, contadorMemo]);

  // ── Cronómetro principal ─────────────────────────────────────────────────────
  useEffect(() => {
    let t: any;
    if (!memorizando && segundos > 0 && !juegoTerminado) {
      t = setInterval(() => {
        setSegundos(s => {
          if (s <= 1) {
            clearInterval(t);
            setJuegoTerminado(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [memorizando, segundos, juegoTerminado]);

  // ── Click en carta ────────────────────────────────────────────────────────────
  const manejarClick = (index: number) => {
    if (
      memorizando ||
      segundos === 0 ||
      tablero[index].volteada ||
      tablero[index].encontrada ||
      seleccionadas.length === 2 ||
      transicionando.current
    ) return;

    const n = [...tablero];
    n[index] = { ...n[index], volteada: true };
    setTablero(n);
    setSeleccionadas(prev => [...prev, index]);
  };

  // ── Comprobar pares ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (seleccionadas.length !== 2) return;
    const [p, s] = seleccionadas;

    if (tablero[p].contenido === tablero[s].contenido) {
      // ✅ Acierto
      setAciertos(a => a + 1);
      setUltimoAcierto(Date.now());
      setTablero(prev => {
        const n = [...prev];
        n[p] = { ...n[p], encontrada: true };
        n[s] = { ...n[s], encontrada: true };
        return n;
      });
      setSeleccionadas([]);
    } else {
      // ❌ Fallo
      setFallos(f => f + 1);
      setUltimoFallo(Date.now());
      setCartasError([p, s]);
      setTimeout(() => {
        setTablero(prev => {
          const n = [...prev];
          n[p] = { ...n[p], volteada: false };
          n[s] = { ...n[s], volteada: false };
          return n;
        });
        setSeleccionadas([]);
        setCartasError([]);
      }, 800);
    }
  }, [seleccionadas]);

  // ── Detectar tablero completo → avanzar nivel ─────────────────────────────────
  useEffect(() => {
    if (tablero.length === 0 || !tablero.every(c => c.encontrada)) return;
    if (transicionando.current) return;
    transicionando.current = true;

    const idx = nivelIdxRef.current;
    const labelActual = NIVELES[idx].label;

    // Mostrar banner de nivel superado
    setBannerLabel(labelActual);
    setMostrarBanner(true);
setTimeout(() => {
  setMostrarBanner(false);
  const siguiente = idx + 1;

  if (siguiente >= NIVELES.length) {
    setJuegoTerminado(true);
  } else {
    setNivelIdx(siguiente);

    // Reiniciar tiempo al pasar de nivel
    setSegundos(prev => prev + (20 * siguiente));

    generarTablero(siguiente);
  }
}, 1500);
  }, [tablero]);

  // ── Reiniciar todo ────────────────────────────────────────────────────────────
  const reiniciar = () => {
    setNivelIdx(0);
    setAciertos(0);
    setFallos(0);
    setSegundos(tiempoTotal);
    setJuegoTerminado(false);
    aciertosRef.current = 0;
    fallosRef.current   = 0;
    generarTablero(0);
  };

  // ── Layout del grid ───────────────────────────────────────────────────────────
  const totalCards = tablero.length || 8;
  const columns    = Math.min(5, Math.max(2, Math.ceil(Math.sqrt(totalCards))));
  const cartaStyle = styles.carta as any;
  const cartaW     = (cartaStyle?.width  ?? 60) + (cartaStyle?.margin ?? 4) * 2;
  const gridWidth  = columns * cartaW;

  return (
    <View style={[styles.container, { position: 'relative' }]}>
      {/* Header */}
      <Text style={styles.tituloGrande}>¡ENCUENTRA LOS PARES!</Text>

      {/* Nivel actual */}
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#6C63FF', marginBottom: 4 }}>
        {NIVELES[Math.min(nivelIdx, NIVELES.length - 1)].label}
        {' · '}
        {NIVELES[Math.min(nivelIdx, NIVELES.length - 1)].pares * 2} cartas
      </Text>

      {/* Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIEMPO</Text>
          <Text style={styles.statValue}>{segundos}s</Text>
        </View>
        <PuntajeAnimado valor={aciertos} label="ACIERTOS" esAcierto={true}  ultimoCambio={ultimoAcierto} />
        <PuntajeAnimado valor={fallos}   label="FALLOS"   esAcierto={false} ultimoCambio={ultimoFallo}   />
      </View>

      {/* Banner de memorización */}
      {memorizando && (
        <View style={styles.bannerMemo}>
          <Text style={styles.textoBanner}>Memoriza en: {contadorMemo}s</Text>
        </View>
      )}

      {/* Tablero */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <View style={[styles.grid, { width: gridWidth, marginTop: 12, flexWrap: 'wrap', flexDirection: 'row' }]}>
          {tablero.map((carta, i) => (
            <CartaAnimada
              key={carta.id}
              carta={carta}
              onPress={() => manejarClick(i)}
              animarError={cartasError.includes(i)}
              entradaDelay={i * 40}
            />
          ))}
        </View>
      </ScrollView>

      {/* Banner nivel superado */}
      <BannerNivelSuperado nivelLabel={bannerLabel} visible={mostrarBanner} />

      {/* Pantalla de resultados final */}
      {juegoTerminado && (
        <PantallaResultados
          nivelAlcanzado={nivelIdx}
          aciertos={aciertos}
          fallos={fallos}
          onReintentar={reiniciar}
          onMenu={() => router.back()}
        />
      )}
    </View>
  );
}