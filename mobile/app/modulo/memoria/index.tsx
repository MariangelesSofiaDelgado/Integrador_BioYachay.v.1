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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PURPLE = "#6C63FF";
const CARTA_SIZE = 54;

// ─── Fondo animado con emojis de frutas flotando ─────────────────────────────
const BG_EMOJIS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🃏", "🧠", "🍒", "🥝"];

function FondoAnimado() {
  const items = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      emoji: BG_EMOJIS[i % BG_EMOJIS.length],
      x: Math.random() * (SCREEN_WIDTH - 40),
      anim: new Animated.Value(Math.random()),
      duracion: 4000 + Math.random() * 4000,
      size: 20 + Math.random() * 16,
      opacity: 0.08 + Math.random() * 0.10,
    }))
  ).current;

  useEffect(() => {
    items.forEach((item) => {
      const loop = () => {
        item.anim.setValue(0);
        Animated.timing(item.anim, {
          toValue: 1,
          duration: item.duracion,
          useNativeDriver: true,
        }).start(loop);
      };
      item.anim.setValue(Math.random());
      Animated.timing(item.anim, {
        toValue: 1,
        duration: item.duracion,
        useNativeDriver: true,
      }).start(loop);
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {items.map((item, i) => {
        const translateY = item.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [SCREEN_HEIGHT * 0.6, -60],
        });
        return (
          <Animated.Text
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              fontSize: item.size,
              opacity: item.opacity,
              transform: [{ translateY }],
            }}
          >
            {item.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

// ─── Carta mini con flip ──────────────────────────────────────────────────────
function CartaMini({
  emoji, revealed, delay, onPress, encontrada, error,
}: {
  emoji: string; revealed: boolean; delay: number;
  onPress?: () => void; encontrada?: boolean; error?: boolean;
}) {
  const flip  = useRef(new Animated.Value(revealed ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const prevRevealed = useRef(revealed);

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }, delay);
  }, []);

  useEffect(() => {
    if (prevRevealed.current !== revealed) {
      prevRevealed.current = revealed;
      Animated.spring(flip, { toValue: revealed ? 1 : 0, friction: 8, tension: 10, useNativeDriver: true }).start();
    }
  }, [revealed]);

  useEffect(() => {
    if (encontrada) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1,   friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [encontrada]);

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

  const frontRot = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg",   "180deg"] });
  const backRot  = flip.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  return (
    <Pressable onPress={onPress} style={Sc.cartaWrapper}>
      <Animated.View style={{ transform: [{ scale }, { translateX: shake }] }}>
        <Animated.View style={[Sc.cartaFace, Sc.cartaBack,  { transform: [{ rotateY: frontRot }] }]}>
          <Text style={Sc.cartaQ}>?</Text>
        </Animated.View>
        <Animated.View style={[Sc.cartaFace, Sc.cartaFront, encontrada && Sc.cartaEncontrada, { transform: [{ rotateY: backRot }] }]}>
          <Text style={Sc.cartaEmoji}>{emoji}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── PASO 1: Demo de memorización ────────────────────────────────────────────
const FRUTAS_GRID = ["🍎","🍌","🍇","🍊","🍓","🍍","🍎","🍌","🍇","🍊","🍓","🍍"];

function Paso1Demo() {
  const [revealed, setRevealed] = useState(true);
  const [ciclo, setCiclo] = useState(0);
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => setCiclo(c => c + 1), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setRevealed(r => !r); }, [ciclo]);

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
          <CartaMini key={i} emoji={fruta} revealed={!!revealed} delay={i * 50} />
        ))}
      </View>
    </View>
  );
}

// ─── PASO 2: Demo interactiva – toca pares ───────────────────────────────────
const CARTAS_PASO2 = ["🍎","🍇","🍎","🍌","🍇","🍌"];

function Paso2Demo({ onParEncontrado }: { onParEncontrado: () => void }) {
  const [tablero, setTablero] = useState(
    CARTAS_PASO2.map((c, i) => ({ id: i, emoji: c, volteada: false, encontrada: false }))
  );
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [errores, setErrores]             = useState<number[]>([]);
  const paresTotales     = CARTAS_PASO2.length / 2;
  const parNotifY        = useRef(new Animated.Value(0)).current;
  const parNotifO        = useRef(new Animated.Value(0)).current;
  const [notifVisible, setNotifVisible] = useState(false);
  const yaGano = useRef(false);

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
        setTimeout(() => {
          setTablero(prev => {
            const n = [...prev];
            n[a] = { ...n[a], encontrada: true };
            n[b] = { ...n[b], encontrada: true };
            const paresAhora = n.filter(c => c.encontrada).length / 2;
            if (paresAhora >= paresTotales && !yaGano.current) {
              yaGano.current = true;
              setTimeout(() => onParEncontrado(), 400);
            }
            return n;
          });
          setSeleccionadas([]);
          mostrarNotif();
        }, 300);
      } else {
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
  const scales = niveles.map(() => useRef(new Animated.Value(0)).current);

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

// ─── Pantalla del tutorial interactivo (3 pasos) ──────────────────────────────
function PantallaTutorial({ onCerrar }: { onCerrar: () => void }) {
  const router = useRouter();
  const [paso, setPaso]                   = useState(1);
  const [paso2Completo, setPaso2Completo] = useState(false);

  const INFO = {
    1: {
      descripcion: "Memoriza dónde está cada fruta.",
      instrucciones: [
        "👁️ Las cartas se muestran boca arriba unos segundos.",
        "🧠 Memoriza la posición de cada fruta.",
        "🫣 Cuando se voltean, ¡recuerda dónde estaban!",
      ],
    },
    2: {
      descripcion: "Encuentra los pares tocando dos cartas.",
      instrucciones: [
        "🃏 Toca dos cartas para voltearlas.",
        "✅ Si tienen la misma fruta, es un par.",
        "❌ Si no coinciden, se vuelven a ocultar.",
      ],
    },
    3: {
      descripcion: "¡Supera los 5 niveles para ganar!",
      instrucciones: [
        "📈 Cada nivel tiene más cartas.",
        "⏱️ Menos tiempo de memorización en niveles altos.",
        "🏆 Ganas tiempo extra al completar cada nivel.",
      ],
    },
  } as const;

  const info     = INFO[paso as 1 | 2 | 3];
  const disabled = paso === 2 ? !paso2Completo : false;

  const avanzar = () => {
    if (paso < 3) setPaso(p => p + 1);
    else { onCerrar(); router.push("/modulo/memoria/juego"); }
  };

  return (
    <View style={S.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#337ab7" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      <View style={S.zonaSuperior}>
        <FondoAnimado />
        <Text style={S.titulo}>Módulo Tutorial</Text>
        <View style={S.tituloLinea} />
        {paso === 1 && <Paso1Demo />}
        {paso === 2 && <Paso2Demo onParEncontrado={() => setPaso2Completo(true)} />}
        {paso === 3 && <Paso3Demo />}
      </View>

      <View style={S.contenedor}>
        <View style={S.headerRow}>
          <View style={S.pasoBadge}>
            <Text style={S.pasoBadgeTexto}>Paso {paso} de 3</Text>
          </View>
          <Text style={S.ojoIcono}>👁️</Text>
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>{info.descripcion}</Text>
        </View>

        <View style={S.instruccionesBadge}>
          <Text style={S.instruccionesBadgeTexto}>Instrucciones</Text>
        </View>

        <View style={S.listaInstrucciones}>
          {info.instrucciones.map((linea, i) => (
            <Text key={i} style={S.instruccionLinea}>{linea}</Text>
          ))}
        </View>

        <View style={S.filaBotones}>
          <Pressable style={S.botonIzq} onPress={onCerrar}>
            <Text style={S.textoBoton}>← Volver</Text>
          </Pressable>
          <Pressable
            style={[S.botonDer, disabled && S.botonDeshabilitado]}
            onPress={avanzar}
            disabled={disabled}
          >
            <Text style={S.textoBoton}>{paso < 3 ? "Siguiente ➡️" : "¡A jugar! 🧠"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla de inicio del módulo ───────────────────────────────────────────
export default function TutorialMemoria() {
  const router    = useRouter();
  const [verTutorial, setVerTutorial] = useState(false);

  if (verTutorial) {
    return <PantallaTutorial onCerrar={() => setVerTutorial(false)} />;
  }

  return (
    <View style={S.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#337ab7" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />

      <View style={S.zonaSuperior}>
        <FondoAnimado />
        <Text style={S.titulo}>Juego de Memoria</Text>
        <View style={S.tituloLinea} />
        <Paso1Demo />
      </View>

      <View style={S.contenedor}>
        <View style={S.headerRow}>
          <View style={S.pasoBadge}>
            <Text style={S.pasoBadgeTexto}>Objetivo</Text>
          </View>
          <Text style={S.ojoIcono}>👁️</Text>
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>Encuentra todos los pares de frutas.</Text>
        </View>

        <View style={S.instruccionesBadge}>
          <Text style={S.instruccionesBadgeTexto}>Instrucciones</Text>
        </View>

        <View style={S.listaInstrucciones}>
          <Text style={S.instruccionLinea}>🧠 Memoriza dónde están las frutas.</Text>
          <Text style={S.instruccionLinea}>🃏 Toca dos cartas para encontrar un par.</Text>
          <Text style={S.instruccionLinea}>⏱️ ¡Completa todos los pares a tiempo!</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable style={S.botonIzq} onPress={() => setVerTutorial(true)}>
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable style={S.botonDer} onPress={() => router.push("/modulo/memoria/juego")}>
            <Text style={S.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos pantalla ─────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  zonaSuperior: {
    flex: 0.60,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 20,
    overflow: "hidden",
  },
  titulo: {
    fontSize: 36,
    fontWeight: "800",
    color: PURPLE,
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#dd2525",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 4,
  },
  contenedor: {
    flex: 0.40,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pasoBadge: {
    backgroundColor: "#7dc123",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  pasoBadgeTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  ojoIcono: {
    fontSize: 22,
  },
  descripcionBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  descripcionTexto: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  instruccionesBadge: {
    backgroundColor: "#337ab7",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  instruccionesBadgeTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  listaInstrucciones: {
    gap: 3,
    marginTop: -2,
  },
  instruccionLinea: {
    fontSize: 15,
    color: "#444444",
    fontWeight: "500",
  },
  filaBotones: {
    flexDirection: "row",
    gap: 12,
  },
  botonIzq: {
    flex: 1,
    backgroundColor: "#e93232",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botonDer: {
    flex: 1,
    backgroundColor: "#faa638",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botonDeshabilitado: {
    backgroundColor: "#cccccc",
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

// ─── Estilos carta mini ───────────────────────────────────────────────────────
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
    width: "100%",
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
  nivelDot:    { width: 10, height: 10, borderRadius: 5 },
  nivelLabel:  { fontSize: 12, fontWeight: "700", color: "#444", width: 52 },
  nivelBarWrap: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
  },
  nivelBar:    { height: 10, borderRadius: 5 },
  nivelCartas: { fontSize: 12, color: "#777", width: 44, textAlign: "right" },
});