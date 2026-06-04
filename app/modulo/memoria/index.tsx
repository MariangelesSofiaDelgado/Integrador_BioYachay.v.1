import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Frutas para la demo ──────────────────────────────────────────────────────
const FRUTAS_GRID = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🍎", "🍌", "🍇", "🍊", "🍓", "🍍"];

// ─── Carta del paso 1 y 2 ────────────────────────────────────────────────────
function CartaMini({
  emoji,
  revealed,
  delay,
  onPress,
  encontrada,
  error,
}: {
  emoji: string;
  revealed: boolean;
  delay: number;
  onPress?: () => void;
  encontrada?: boolean;
  error?: boolean;
}) {
  const flip  = useRef(new Animated.Value(revealed ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const prevRevealed = useRef(revealed);

  // Entrada con bounce
  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }, delay);
  }, []);

  // Volteo
  useEffect(() => {
    if (prevRevealed.current !== revealed) {
      prevRevealed.current = revealed;
      Animated.spring(flip, { toValue: revealed ? 1 : 0, friction: 8, tension: 10, useNativeDriver: true }).start();
    }
  }, [revealed]);

  // Bounce al encontrar
  useEffect(() => {
    if (encontrada) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1,   friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [encontrada]);

  // Shake en error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shake, { toValue:  8, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue:  8, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue:  0, duration: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const frontRot = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRot  = flip.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  return (
    <Pressable onPress={onPress} style={Sc.cartaWrapper}>
      <Animated.View style={{ transform: [{ scale }, { translateX: shake }] }}>
        {/* Cara oculta */}
        <Animated.View style={[Sc.cartaFace, Sc.cartaBack, { transform: [{ rotateY: frontRot }] }]}>
          <Text style={Sc.cartaQ}>?</Text>
        </Animated.View>
        {/* Cara fruta */}
        <Animated.View style={[Sc.cartaFace, Sc.cartaFront, encontrada && Sc.cartaEncontrada, { transform: [{ rotateY: backRot }] }]}>
          <Text style={Sc.cartaEmoji}>{emoji}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── PASO 1: Demo de memorización ─────────────────────────────────────────────
function Paso1Demo() {
  const [revealed, setRevealed] = useState(true);
  const [ciclo, setCiclo] = useState(0);
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ciclo: mostrar 2.5s → ocultar 2.5s → repetir
    const t = setInterval(() => setCiclo(c => c + 1), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setRevealed(c => !c as any);
  }, [ciclo]);

  // Pulso en la etiqueta
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={Sc.demoWrap}>
      <Animated.View style={[Sc.labelBadge, { transform: [{ scale: pulso }] }]}>
        <Text style={Sc.labelBadgeText}>
          {revealed ? "👁 Memoriza las posiciones..." : "🫣 ¿Las recuerdas?"}
        </Text>
      </Animated.View>
      <View style={Sc.gridDemo}>
        {FRUTAS_GRID.map((fruta, i) => (
          <CartaMini
            key={i}
            emoji={fruta}
            revealed={!!revealed}
            delay={i * 50}
          />
        ))}
      </View>
    </View>
  );
}

// ─── PASO 2: Demo interactiva – toca pares ─────────────────────────────────────
const CARTAS_PASO2 = ["🍎", "🍇", "🍎", "🍌", "🍇", "🍌"];

function Paso2Demo({ onParEncontrado }: { onParEncontrado: () => void }) {
  const [tablero, setTablero] = useState(
    CARTAS_PASO2.map((c, i) => ({ id: i, emoji: c, volteada: false, encontrada: false }))
  );
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [errores, setErrores] = useState<number[]>([]);
  const paresTotales = CARTAS_PASO2.length / 2;
  const paresEncontrados = tablero.filter(c => c.encontrada).length / 2;
  const parNotifY = useRef(new Animated.Value(0)).current;
  const parNotifO = useRef(new Animated.Value(0)).current;
  const [notifVisible, setNotifVisible] = useState(false);

  const mostrarNotif = () => {
    setNotifVisible(true);
    parNotifO.setValue(1);
    parNotifY.setValue(0);
    Animated.sequence([
      Animated.timing(parNotifY, { toValue: -20, duration: 500, useNativeDriver: true }),
      Animated.timing(parNotifO, { toValue: 0,   duration: 400, useNativeDriver: true }),
    ]).start(() => setNotifVisible(false));
  };

  const tocarCarta = (idx: number) => {
    if (tablero[idx].volteada || tablero[idx].encontrada || seleccionadas.length === 2) return;

    const nuevo = [...tablero];
    nuevo[idx] = { ...nuevo[idx], volteada: true };
    setTablero(nuevo);
    const nuevasSel = [...seleccionadas, idx];
    setSeleccionadas(nuevasSel);

    if (nuevasSel.length === 2) {
      const [a, b] = nuevasSel;
      if (nuevo[a].emoji === nuevo[b].emoji) {
        // Acierto
        setTimeout(() => {
          setTablero(prev => {
            const n = [...prev];
            n[a] = { ...n[a], encontrada: true };
            n[b] = { ...n[b], encontrada: true };
            return n;
          });
          setSeleccionadas([]);
          mostrarNotif();
          if (paresEncontrados + 1 >= paresTotales) {
            setTimeout(() => onParEncontrado(), 400);
          }
        }, 300);
      } else {
        // Error
        setErrores([a, b]);
        setTimeout(() => {
          setTablero(prev => {
            const n = [...prev];
            n[a] = { ...n[a], volteada: false };
            n[b] = { ...n[b], volteada: false };
            return n;
          });
          setSeleccionadas([]);
          setErrores([]);
        }, 800);
      }
    }
  };

  // Notificar cuando se completa
  useEffect(() => {
    const encontradas = tablero.filter(c => c.encontrada).length / 2;
    if (encontradas >= paresTotales && paresTotales > 0) {
      onParEncontrado();
    }
  }, [tablero]);

  return (
    <View style={Sc.demoWrap}>
      <View style={Sc.labelBadge}>
        <Text style={Sc.labelBadgeText}>
          Pares: {tablero.filter(c => c.encontrada).length / 2} / {paresTotales}
        </Text>
      </View>
      <View style={[Sc.gridDemo, { maxWidth: 240 }]}>
        {tablero.map((carta, i) => (
          <CartaMini
            key={carta.id}
            emoji={carta.emoji}
            revealed={carta.volteada || carta.encontrada}
            delay={i * 60}
            onPress={() => tocarCarta(i)}
            encontrada={carta.encontrada}
            error={errores.includes(i)}
          />
        ))}
      </View>
      {notifVisible && (
        <Animated.Text style={[Sc.notifPar, { opacity: parNotifO, transform: [{ translateY: parNotifY }] }]}>
          ✅ ¡Par encontrado!
        </Animated.Text>
      )}
    </View>
  );
}

// ─── PASO 3: Resumen de niveles ───────────────────────────────────────────────
function Paso3Demo() {
  const niveles = [
    { label: "Nivel 1", cartas: 6,  color: "#4ade80" },
    { label: "Nivel 2", cartas: 8,  color: "#60a5fa" },
    { label: "Nivel 3", cartas: 10, color: "#a78bfa" },
    { label: "Nivel 4", cartas: 12, color: "#f472b6" },
    { label: "Nivel 5", cartas: 16, color: "#fb923c" },
  ];
  const scales = niveles.map((_, i) => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    niveles.forEach((_, i) => {
      setTimeout(() => {
        Animated.spring(scales[i], { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }, i * 150);
    });
  }, []);

  return (
    <View style={Sc.demoWrap}>
      <Text style={Sc.paso3Titulo}>5 niveles de dificultad</Text>
      {niveles.map((n, i) => (
        <Animated.View key={i} style={[Sc.nivelRow, { transform: [{ scale: scales[i] }] }]}>
          <View style={[Sc.nivelDot, { backgroundColor: n.color }]} />
          <Text style={Sc.nivelLabel}>{n.label}</Text>
          <View style={Sc.nivelBarWrap}>
            <View style={[Sc.nivelBar, { width: `${(n.cartas / 16) * 100}%` as any, backgroundColor: n.color }]} />
          </View>
          <Text style={Sc.nivelCartas}>{n.cartas} 🃏</Text>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TutorialMemoria() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [paso2Completo, setPaso2Completo] = useState(false);

  const obtenerTextosPaso = () => {
    switch (paso) {
      case 1:
        return {
          titulo: "Paso 1 de 3",
          descripcion: "Las cartas se muestran boca arriba por unos segundos. ¡Memoriza dónde está cada fruta!",
          indicacion: "👆 Observa el tablero arriba. Las cartas se voltean y vuelven solas.",
          boton: "¡Lo tengo! 👍",
          disabled: false,
        };
      case 2:
        return {
          titulo: "Paso 2 de 3",
          descripcion: paso2Completo
            ? "🎉 ¡Perfecto! Encontraste todos los pares."
            : "Toca dos cartas para voltearlas. Si tienen la misma fruta, ¡encontraste un par! Si no, se vuelven a ocultar.",
          indicacion: paso2Completo
            ? "👉 Presiona Siguiente para ver cómo funcionan los niveles."
            : "🃏 ¡Inténtalo! Toca las cartas de arriba para encontrar los pares.",
          boton: paso2Completo ? "Siguiente ➡️" : "Encuentra todos los pares... 🃏",
          disabled: !paso2Completo,
        };
      case 3:
        return {
          titulo: "Paso 3 de 3",
          descripcion: "Cada nivel tiene más cartas y menos tiempo de memorización. Supera todos para ganar. ¡Ganas tiempo extra al completar cada nivel!",
          indicacion: "🏆 ¿Listo para poner a prueba tu memoria?",
          boton: "¡A jugar! 🧠",
          disabled: false,
        };
      default:
        return { titulo: "", descripcion: "", indicacion: "", boton: "", disabled: false };
    }
  };

  const avanzarPaso = () => {
    if (paso < 3) {
      setPaso(paso + 1);
    } else {
      router.push("/modulo/memoria");
    }
  };

  const infoPaso = obtenerTextosPaso();

  return (
    <View style={Ss.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#869ee6" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      {/* Zona superior interactiva */}
      <View style={Ss.zonaSuperior}>
        <Text style={Ss.titulo}>Tutorial de Memoria</Text>
        <View style={Ss.tituloLinea} />

        {paso === 1 && <Paso1Demo />}
        {paso === 2 && <Paso2Demo onParEncontrado={() => setPaso2Completo(true)} />}
        {paso === 3 && <Paso3Demo />}
      </View>

      {/* Tarjeta inferior */}
      <View style={Ss.contenedor}>
        <View style={Ss.headerRow}>
          <View style={Ss.pasoContenedor}>
            <Text style={Ss.pasoTitulo}>{infoPaso.titulo}</Text>
          </View>
          <Ionicons name="school" size={30} color="#6C63FF" />
        </View>

        <View style={Ss.objectContenedor}>
          <Text style={Ss.objetivoDescripcion}>{infoPaso.descripcion}</Text>
        </View>

        <View style={Ss.indicaciones}>
          <Text style={Ss.indicacion}>{infoPaso.indicacion}</Text>
        </View>

        <View style={Ss.filaBotones}>
          <View style={Ss.botonBaseIniciar}>
            <Pressable
              style={[Ss.botonIniciar, infoPaso.disabled && Ss.botonDeshabilitado]}
              onPress={avanzarPaso}
              disabled={infoPaso.disabled}
            >
              <Text style={Ss.textoBoton}>{infoPaso.boton}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos carta mini ────────────────────────────────────────────────────────
const PURPLE = "#6C63FF";
const CARTA_SIZE = 54;

const Sc = StyleSheet.create({
  cartaWrapper: {
    width: CARTA_SIZE,
    height: CARTA_SIZE,
    margin: 5,
  },
  cartaFace: {
    position: "absolute",
    width: CARTA_SIZE,
    height: CARTA_SIZE,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cartaBack: {
    backgroundColor: PURPLE,
    shadowColor: PURPLE,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  cartaFront: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#DDD8FF",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cartaEncontrada: {
    borderColor: "#4ade80",
    backgroundColor: "#f0fdf4",
  },
  cartaQ:     { fontSize: 22, color: "#fff", fontWeight: "900" },
  cartaEmoji: { fontSize: 26 },

  demoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  gridDemo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 280,
  },
  labelBadge: {
    backgroundColor: "rgba(108,99,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  labelBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: PURPLE,
  },
  notifPar: {
    position: "absolute",
    bottom: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#16a34a",
  },

  // Paso 3
  paso3Titulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1033",
    marginBottom: 14,
  },
  nivelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
    width: Math.min(SCREEN_WIDTH - 48, 320),
  },
  nivelDot: { width: 10, height: 10, borderRadius: 5 },
  nivelLabel: { fontSize: 12, fontWeight: "700", color: "#444", width: 52 },
  nivelBarWrap: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
  },
  nivelBar: { height: 10, borderRadius: 5 },
  nivelCartas: { fontSize: 12, color: "#777", width: 44, textAlign: "right" },
});

// ─── Estilos pantalla (igual estructura al tutorial de coordinación) ────────────
const Ss = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F4F2FF",
  },
  zonaSuperior: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1033",
    textAlign: "center",
    marginBottom: 6,
  },
  tituloLinea: {
    height: 3,
    backgroundColor: PURPLE,
    borderRadius: 2,
    marginBottom: 12,
    marginHorizontal: 40,
    opacity: 0.4,
  },
  contenedor: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pasoContenedor: {},
  pasoTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: PURPLE,
  },
  objectContenedor: {
    marginBottom: 10,
  },
  objetivoDescripcion: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  indicaciones: {
    backgroundColor: "#F4F2FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  indicacion: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  filaBotones: {
    alignItems: "center",
  },
  botonBaseIniciar: {
    width: "100%",
  },
  botonIniciar: {
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: PURPLE,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  botonDeshabilitado: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});