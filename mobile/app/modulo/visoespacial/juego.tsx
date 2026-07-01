import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import styles from "../visoespacial/styles/stylesjuego";

const { width: SW } = Dimensions.get("window");

type ShapeType = "triangulo" | "circulo" | "rombo" | "rectangulo" | "hexagono" | "manzana" | "uva";
const FORMAS: ShapeType[] = ["triangulo", "circulo", "rombo", "rectangulo", "hexagono", "manzana", "uva"];
const COLORES: Record<ShapeType, string> = {
  triangulo:  "#e53e3e",
  circulo:    "#3182ce",
  rombo:      "#805ad5",
  rectangulo: "#d69e2e",
  hexagono:   "#e67e22",
  manzana:    "#27ae60",
  uva:        "#8e44ad",
};

function RenderFigura({ tipo, size = 62 }: { tipo: ShapeType; size?: number }) {
  const color = COLORES[tipo];
  if (tipo === "triangulo") return (
    <View style={{ width: 0, height: 0,
      borderLeftWidth: size/2, borderRightWidth: size/2, borderBottomWidth: size,
      borderLeftColor: "transparent", borderRightColor: "transparent",
      borderBottomColor: color }} />
  );
  if (tipo === "circulo") return (
    <View style={{ width: size, height: size, borderRadius: size/2, backgroundColor: color }} />
  );
  if (tipo === "rombo") return (
    <View style={{ width: size, height: size, backgroundColor: color,
      borderRadius: 4, transform: [{ rotate: "45deg" }] }} />
  );
  if (tipo === "rectangulo") return (
    <View style={{ width: size * 1.5, height: size * 0.65, backgroundColor: color, borderRadius: 8 }} />
  );
  if (tipo === "hexagono") return (
    <View style={{ width: size, height: size * 0.87, backgroundColor: color, borderRadius: size * 0.25 }} />
  );
  if (tipo === "manzana") return (
    <Text style={{ fontSize: size, lineHeight: size + 4 }}>🍎</Text>
  );
  return <Text style={{ fontSize: size, lineHeight: size + 4 }}>🍇</Text>;
}

function RenderMolde({ tipo, size = 66 }: { tipo: ShapeType; size?: number }) {
  const base = {
    backgroundColor: "rgba(150,150,150,0.15)",
    borderWidth: 2, borderColor: "#bbb", borderStyle: "dashed" as const,
  };
  if (tipo === "triangulo") return (
    <View style={{ alignItems: "center", justifyContent: "center", width: size+12, height: size+12 }}>
      <View style={{ width: 0, height: 0,
        borderLeftWidth: (size+4)/2, borderRightWidth: (size+4)/2,
        borderBottomWidth: size+4, borderLeftColor: "transparent",
        borderRightColor: "transparent", borderBottomColor: "rgba(150,150,150,0.3)" }} />
    </View>
  );
  if (tipo === "circulo") return (
    <View style={[base, { width: size+12, height: size+12, borderRadius: (size+12)/2 }]} />
  );
  if (tipo === "rombo") return (
    <View style={[base, { width: size+8, height: size+8, borderRadius: 4,
      transform: [{ rotate: "45deg" }] }]} />
  );
  if (tipo === "rectangulo") return (
    <View style={[base, { width: size*1.5+12, height: size*0.65+12, borderRadius: 10 }]} />
  );
  if (tipo === "hexagono") return (
    <View style={[base, { width: size+12, height: size*0.87+12, borderRadius: size*0.25 }]} />
  );
  if (tipo === "manzana") return (
    <View style={[base, { width: size+12, height: size+12, borderRadius: (size+12)/2,
      alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ fontSize: size - 8, opacity: 0.18 }}>🍎</Text>
    </View>
  );
  return (
    <View style={[base, { width: size+12, height: size+12, borderRadius: (size+12)/2,
      alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ fontSize: size - 8, opacity: 0.18 }}>🍇</Text>
    </View>
  );
}

interface Figura {
  id: number;
  tipo: ShapeType;
  pan: Animated.ValueXY;
  inicioX: number;
  inicioY: number;
  encajada: boolean;
  tieneMolde: boolean;
}
interface Molde {
  id: number;
  tipo: ShapeType;
  ocupado: boolean;
  cx: number;
  cy: number;
}

// Estado de feedback visual por figura: null | "acierto" | "fallo"
type FeedbackState = "acierto" | "fallo" | null;

let uid = 1;
const nid = () => uid++;

function getDificultad(aciertos: number) {
  if (aciertos >= 15) return { nFigs: 7, nMoldes: 5, label: "🔥 Difícil" };
  if (aciertos >= 7)  return { nFigs: 5, nMoldes: 3, label: "⚡ Medio" };
  return { nFigs: 3, nMoldes: 3, label: "🌱 Fácil" };
}

function generarRonda(aciertos: number) {
  const { nFigs, nMoldes } = getDificultad(aciertos);
  const pool = [...FORMAS].sort(() => Math.random() - 0.5);
  const formasMoldes = pool.slice(0, nMoldes);
  const moldes: Molde[] = formasMoldes.map(tipo => ({
    id: nid(), tipo, ocupado: false, cx: 0, cy: 0,
  }));

  const tiposConMolde = new Set(formasMoldes);
  const tiposTrampa = FORMAS.filter(f => !tiposConMolde.has(f));

  const items: { tipo: ShapeType; tieneMolde: boolean }[] = [
    ...formasMoldes.map(t => ({ tipo: t, tieneMolde: true })),
  ];
  const trampasUsadas = new Set<ShapeType>(formasMoldes);
  for (let i = formasMoldes.length; i < nFigs; i++) {
    const disponible = tiposTrampa.find(t => !trampasUsadas.has(t));
    if (disponible) {
      trampasUsadas.add(disponible);
      items.push({ tipo: disponible, tieneMolde: false });
    }
  }
  items.sort(() => Math.random() - 0.5);

  const cols = Math.min(nFigs, 3);
  const figuras: Figura[] = items.map((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = (SW / (cols + 1)) * (col + 1) - 28;
    const y = 55 + row * 105;
    return {
      id: nid(), tipo: item.tipo, tieneMolde: item.tieneMolde,
      pan: new Animated.ValueXY({ x, y }),
      inicioX: x, inicioY: y, encajada: false,
    };
  });

  return { figuras, moldes };
}

// ── Componente figura arrastrable con feedback visual ─────────────────────────
function FiguraArrastrable({
  fig,
  panHandlers,
  feedback,
}: {
  fig: Figura;
  panHandlers: any;
  feedback: FeedbackState;
}) {
  const escala     = useRef(new Animated.Value(1)).current;
  const bordeOp    = useRef(new Animated.Value(0)).current;
  const bordeColor = useRef(new Animated.Value(0)).current; // 0=verde 1=rojo
  const prevFeedback = useRef<FeedbackState>(null);

  useEffect(() => {
    if (feedback === prevFeedback.current) return;
    prevFeedback.current = feedback;

    if (feedback === "acierto") {
      bordeColor.setValue(0); // verde
      // Pulso: crece y encoge
      Animated.sequence([
        Animated.parallel([
          Animated.timing(escala,  { toValue: 1.35, duration: 120, useNativeDriver: true }),
          Animated.timing(bordeOp, { toValue: 1,    duration: 80,  useNativeDriver: true }),
        ]),
        Animated.timing(escala, { toValue: 0.9,  duration: 90,  useNativeDriver: true }),
        Animated.timing(escala, { toValue: 1.1,  duration: 80,  useNativeDriver: true }),
        Animated.timing(escala, { toValue: 1,    duration: 60,  useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(bordeOp, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }

    if (feedback === "fallo") {
      bordeColor.setValue(1); // rojo
      // Shake: izquierda-derecha rápido + borde rojo
      Animated.sequence([
        Animated.timing(bordeOp, { toValue: 1,    duration: 60,  useNativeDriver: true }),
        Animated.timing(escala,  { toValue: 0.88, duration: 60,  useNativeDriver: true }),
        Animated.timing(escala,  { toValue: 1.08, duration: 60,  useNativeDriver: true }),
        Animated.timing(escala,  { toValue: 0.94, duration: 50,  useNativeDriver: true }),
        Animated.timing(escala,  { toValue: 1,    duration: 50,  useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(bordeOp, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [feedback]);

  // Color del borde interpolado
  const borderColorInterp = bordeColor.interpolate({
    inputRange:  [0, 1],
    outputRange: ["#22c55e", "#ef4444"],
  });

  return (
    <Animated.View
      {...panHandlers}
      style={{
        position: "absolute",
        left: fig.pan.x,
        top:  fig.pan.y,
        zIndex: 999,
        opacity: fig.encajada ? 0 : 1,
        padding: 8,
        transform: [{ scale: escala }],
      }}
    >
      {/* Borde de feedback que aparece y desaparece */}
      <Animated.View style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: borderColorInterp,
        opacity: bordeOp,
      }} />
      <RenderFigura tipo={fig.tipo} size={48} />
    </Animated.View>
  );
}

export default function JuegoFiguras() {
  const router = useRouter();
  const [aciertos,  setAciertos]  = useState(0);
  const [fallos,    setFallos]    = useState(0);
  const [tiempo,    setTiempo]    = useState(60);
  const [terminado, setTerminado] = useState(false);
  const [figuras,   setFiguras]   = useState<Figura[]>([]);
  const [moldes,    setMoldes]    = useState<Molde[]>([]);

  // feedback por figura id
  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackState>>({});

  const aciertosRef = useRef(0);
  const figurasRef  = useRef<Figura[]>([]);
  const moldesRef   = useRef<Molde[]>([]);
  const prs         = useRef<{ [id: number]: any }>({});
  const moldesOffsetY = useRef(0);

  useEffect(() => { aciertosRef.current = aciertos; }, [aciertos]);
  useEffect(() => { figurasRef.current  = figuras;  }, [figuras]);
  useEffect(() => { moldesRef.current   = moldes;   }, [moldes]);

  useEffect(() => {
    if (terminado) return;
    if (tiempo <= 0) { setTerminado(true); return; }
    const t = setInterval(() => {
      setTiempo(s => {
        if (s <= 1) { setTerminado(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [terminado]);

  const iniciarRonda = useCallback((ac: number) => {
    prs.current = {};
    const { figuras: f, moldes: m } = generarRonda(ac);
    figurasRef.current = f;
    moldesRef.current  = m;
    setFiguras([...f]);
    setMoldes([...m]);
    setFeedbacks({});
  }, []);

  useEffect(() => { iniciarRonda(0); }, []);

  const verificarFin = useCallback(() => {
    if (figurasRef.current.filter(f => f.tieneMolde).every(f => f.encajada)) {
      iniciarRonda(aciertosRef.current);
    }
  }, [iniciarRonda]);

  // Disparar feedback y limpiarlo después de la animación
  const dispararFeedback = useCallback((figId: number, tipo: FeedbackState) => {
    setFeedbacks(prev => ({ ...prev, [figId]: tipo }));
    setTimeout(() => {
      setFeedbacks(prev => ({ ...prev, [figId]: null }));
    }, 600);
  }, []);

  const crearPR = useCallback((figId: number) => {
    const base = { x: 0, y: 0 };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;
        base.x = (fig.pan.x as any)._value ?? fig.inicioX;
        base.y = (fig.pan.y as any)._value ?? fig.inicioY;
      },
      onPanResponderMove: (_, gs) => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;
        fig.pan.setValue({
          x: Math.max(0, Math.min(SW - 64, base.x + gs.dx)),
          y: Math.max(0, base.y + gs.dy),
        });
      },
      onPanResponderRelease: (_, gs) => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;

        const fx = base.x + gs.dx + 39;
        const fy = base.y + gs.dy + 39;
        const SNAP = 65;

        let mejor: Molde | null = null;
        let menorDist = Infinity;
        for (const m of moldesRef.current) {
          if (m.ocupado || m.cx === 0) continue;
          const dist = Math.sqrt((fx - m.cx) ** 2 + (fy - m.cy) ** 2);
          if (dist < menorDist) { menorDist = dist; mejor = m; }
        }

        if (mejor && menorDist < SNAP) {
          if (fig.tipo === mejor.tipo) {
            // ✅ Acierto
            fig.encajada = true;
            mejor.ocupado = true;
            dispararFeedback(figId, "acierto");
            Animated.spring(fig.pan, {
              toValue: { x: mejor.cx - 39, y: mejor.cy - 39 },
              useNativeDriver: false, speed: 25, bounciness: 8,
            }).start();
            setAciertos(a => { aciertosRef.current = a + 1; return a + 1; });
            setMoldes([...moldesRef.current]);
            setFiguras([...figurasRef.current]);
            setTimeout(verificarFin, 300);
          } else {
            // ❌ Fallo en molde equivocado
            dispararFeedback(figId, "fallo");
            setFallos(f => f + 1);
            Animated.spring(fig.pan, {
              toValue: { x: fig.inicioX, y: fig.inicioY },
              useNativeDriver: false, speed: 14,
            }).start();
          }
        } else {
          // Soltó lejos de cualquier molde — vuelve sin feedback
          Animated.spring(fig.pan, {
            toValue: { x: fig.inicioX, y: fig.inicioY },
            useNativeDriver: false, speed: 14,
          }).start();
        }
      },
    });
  }, [verificarFin, dispararFeedback]);

  useEffect(() => {
    figuras.forEach(f => {
      if (!prs.current[f.id]) prs.current[f.id] = crearPR(f.id);
    });
  }, [figuras]);

  if (terminado) {
    const prec = aciertos + fallos > 0 ? Math.round(aciertos / (aciertos + fallos) * 100) : 0;
    return (
      <View style={styles.finContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.finTitulo}>⏱️ ¡Tiempo!</Text>
        <Text style={styles.finStat}>✅ Aciertos: {aciertos}</Text>
        <Text style={styles.finStat}>❌ Fallos: {fallos}</Text>
        <Text style={styles.finStat}>🎯 Precisión: {prec}%</Text>
        <Text style={styles.finBoton} onPress={() => router.back()}>Volver</Text>
      </View>
    );
  }

  const { label } = getDificultad(aciertos);

  return (
    <View style={styles.page}>
      <Stack.Screen options={{
        headerTitle: () => (
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>⏱️ {tiempo}s</Text>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>✅ {aciertos}</Text>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>❌ {fallos}</Text>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{label}</Text>
          </View>
        ),
        headerStyle: { backgroundColor: "#2b6cb0" },
        headerShadowVisible: false,
      }} />

      <View
        style={styles.zonaFiguras}
        onLayout={e => {
          moldesOffsetY.current = e.nativeEvent.layout.y + e.nativeEvent.layout.height + 3;
        }}
      >
        <Text style={styles.instruccion}>Arrastra cada figura a su molde</Text>
      </View>

      <View style={styles.divisor} />

      <View style={styles.zonaMoldes}>
        <Text style={styles.instruccionMolde}>
          {figuras.filter(f => !f.tieneMolde).length > 0
            ? "⚠️ No todas las figuras encajan"
            : "Encaja las figuras correctas"}
        </Text>
        <View style={styles.moldesRow}>
          {moldes.map(molde => (
            <View
              key={molde.id}
              style={[styles.moldeWrapper, molde.ocupado && styles.moldeOcupado]}
              onLayout={e => {
                const { x, y, width, height } = e.nativeEvent.layout;
                const labelH   = 34;
                const paddingTop = 16;
                const paddingH = 12;
                const rowWidth = moldes.length * (72 + 20) - 20;
                const rowOffsetX = (SW - rowWidth) / 2;
                molde.cx = rowOffsetX + paddingH + x + width / 2;
                molde.cy = moldesOffsetY.current + paddingTop + labelH + y + height / 2;
              }}
            >
              {molde.ocupado
                ? <Text style={{ fontSize: 30 }}>✨</Text>
                : <RenderMolde tipo={molde.tipo} size={64} />}
            </View>
          ))}
        </View>
      </View>

      {/* Figuras arrastrables con feedback */}
      {figuras.map(fig => {
        const pr = prs.current[fig.id];
        return (
          <FiguraArrastrable
            key={fig.id}
            fig={fig}
            panHandlers={pr ? pr.panHandlers : {}}
            feedback={feedbacks[fig.id] ?? null}
          />
        );
      })}
    </View>
  );
}
