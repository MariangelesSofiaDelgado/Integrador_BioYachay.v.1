import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import styles from "../visoespacial/styles/stylesjuego";

const { width: SW, height: SH } = Dimensions.get("window");

// ─── FORMAS ────────────────────────────────────────────────────────────────
type ShapeType = "triangulo" | "circulo" | "cuadrado" | "rombo" | "estrella";
const FORMAS: ShapeType[] = ["triangulo", "circulo", "cuadrado", "rombo", "estrella"];
const COLORES_FIGURA = ["#e53e3e", "#3182ce", "#d69e2e", "#805ad5", "#38a169"];

function RenderFigura({ tipo, color, size = 48 }: { tipo: ShapeType; color: string; size?: number }) {
  if (tipo === "triangulo") {
    return (
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomWidth: size,
        borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: color,
      }} />
    );
  }
  if (tipo === "circulo") {
    return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
  }
  if (tipo === "cuadrado") {
    return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 6 }} />;
  }
  if (tipo === "rombo") {
    return (
      <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 4, transform: [{ rotate: "45deg" }] }} />
    );
  }
  return <Text style={{ fontSize: size - 4, lineHeight: size, color }}>★</Text>;
}

function RenderMolde({ tipo, size = 56 }: { tipo: ShapeType; size?: number }) {
  if (tipo === "triangulo") {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", width: size + 10, height: size + 10 }}>
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: (size + 4) / 2, borderRightWidth: (size + 4) / 2, borderBottomWidth: size + 4,
          borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "rgba(150,150,150,0.35)",
        }} />
      </View>
    );
  }
  if (tipo === "circulo") {
    return (
      <View style={{
        width: size + 8, height: size + 8, borderRadius: (size + 8) / 2,
        backgroundColor: "rgba(150,150,150,0.2)", borderWidth: 2, borderColor: "#aaa", borderStyle: "dashed",
      }} />
    );
  }
  if (tipo === "cuadrado") {
    return (
      <View style={{
        width: size + 8, height: size + 8, borderRadius: 8,
        backgroundColor: "rgba(150,150,150,0.2)", borderWidth: 2, borderColor: "#aaa", borderStyle: "dashed",
      }} />
    );
  }
  if (tipo === "rombo") {
    return (
      <View style={{
        width: size + 8, height: size + 8,
        backgroundColor: "rgba(150,150,150,0.2)", borderWidth: 2, borderColor: "#aaa", borderStyle: "dashed",
        borderRadius: 4, transform: [{ rotate: "45deg" }],
      }} />
    );
  }
  return (
    <View style={{
      width: size + 8, height: size + 8, borderRadius: (size + 8) / 2,
      backgroundColor: "rgba(150,150,150,0.15)", borderWidth: 2, borderColor: "#aaa", borderStyle: "dashed",
      alignItems: "center", justifyContent: "center",
    }}>
      <Text style={{ fontSize: size - 4, color: "rgba(150,150,150,0.5)" }}>★</Text>
    </View>
  );
}

// ─── TIPOS ─────────────────────────────────────────────────────────────────
interface Figura {
  id: number;
  tipo: ShapeType;
  color: string;
  pan: Animated.ValueXY;
  posInicio: { x: number; y: number };
  posActual: { x: number; y: number };
  encajada: boolean;
  moldeIdx: number;
}

interface Molde {
  id: number;
  tipo: ShapeType;
  ocupado: boolean;
}

let idCounter = 1;
const nextId = () => idCounter++;

function getDificultad(aciertos: number) {
  if (aciertos >= 15) return { nFiguras: 7, nMoldes: 5, label: "🔥 Difícil" };
  if (aciertos >= 7)  return { nFiguras: 5, nMoldes: 3, label: "⚡ Medio" };
  return { nFiguras: 3, nMoldes: 3, label: "🌱 Fácil" };
}

function generarRonda(aciertos: number): { figuras: Figura[]; moldes: Molde[] } {
  const { nFiguras, nMoldes } = getDificultad(aciertos);

  const formasPool = [...FORMAS].sort(() => Math.random() - 0.5);
  const formasElegidas = formasPool.slice(0, nMoldes);

  const moldes: Molde[] = formasElegidas.map((tipo) => ({
    id: nextId(),
    tipo,
    ocupado: false,
  }));

  const asignaciones: { tipo: ShapeType; moldeIdx: number }[] = moldes.map((m, i) => ({
    tipo: m.tipo,
    moldeIdx: i,
  }));

  // Figuras extra: tipos que NO tienen molde (el jugador debe ignorarlas)
  const tiposConMolde = new Set(moldes.map(m => m.tipo));
  const tiposSinMolde = FORMAS.filter(f => !tiposConMolde.has(f));
  let extraIdx = 0;
  for (let i = asignaciones.length; i < nFiguras; i++) {
    // Usamos tipos que no tienen molde para que sean figuras trampa únicas
    const tipoExtra = tiposSinMolde[extraIdx % tiposSinMolde.length];
    extraIdx++;
    asignaciones.push({ tipo: tipoExtra, moldeIdx: -1 });
  }

  asignaciones.sort(() => Math.random() - 0.5);

  const cols = Math.min(nFiguras, 3);
  const figuras: Figura[] = asignaciones.map((a, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cellW = SW / cols;
    const startX = cellW * col + cellW / 2 - 28;
    const startY = 60 + row * 110;
    return {
      id: nextId(),
      tipo: a.tipo,
      color: COLORES_FIGURA[FORMAS.indexOf(a.tipo)],
      pan: new Animated.ValueXY({ x: startX, y: startY }),
      posInicio: { x: startX, y: startY },
      posActual: { x: startX, y: startY },
      encajada: false,
      moldeIdx: a.moldeIdx,
    };
  });

  return { figuras, moldes };
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
export default function JuegoFiguras() {
  const router = useRouter();
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos]     = useState(0);
  const [tiempo, setTiempo]     = useState(60);
  const [terminado, setTerminado] = useState(false);
  const [figuras, setFiguras]   = useState<Figura[]>([]);
  const [moldes, setMoldes]     = useState<Molde[]>([]);

  const aciertosRef  = useRef(0);
  const figurasRef   = useRef<Figura[]>([]);
  const moldesRef    = useRef<Molde[]>([]);
  const moldeLayouts = useRef<{ [id: number]: { x: number; y: number; w: number; h: number } }>({});
  const moldeRefs = useRef<{ [id: number]: any }>({});
  const pageOffsetY = useRef(0); // offset Y de la página completa (para corregir pageY del measure)
  const panResponders = useRef<{ [id: number]: any }>({});

  useEffect(() => { aciertosRef.current = aciertos; }, [aciertos]);
  useEffect(() => { figurasRef.current = figuras; }, [figuras]);
  useEffect(() => { moldesRef.current = moldes; }, [moldes]);

  // Cronómetro
  useEffect(() => {
    if (terminado) return;
    if (tiempo <= 0) { setTerminado(true); return; }
    const t = setInterval(() => setTiempo(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [tiempo, terminado]);

  const iniciarRonda = useCallback((ac: number) => {
    moldeLayouts.current = {};
    panResponders.current = {};
    const { figuras: newFigs, moldes: newMoldes } = generarRonda(ac);
    figurasRef.current = newFigs;
    moldesRef.current  = newMoldes;
    setFiguras([...newFigs]);
    setMoldes([...newMoldes]);
  }, []);

  // Primera ronda
  useEffect(() => { iniciarRonda(0); }, []);

  const verificarFinRonda = useCallback(() => {
    const todasEncajadas = figurasRef.current.every(f => f.encajada);
    if (todasEncajadas) {
      setTimeout(() => iniciarRonda(aciertosRef.current), 700);
    }
  }, [iniciarRonda]);

  const crearPanResponder = useCallback((figId: number) => {
    const inicio = { x: 0, y: 0 };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: () => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;
        const x = (fig.pan.x as any)._value ?? fig.posActual.x;
        const y = (fig.pan.y as any)._value ?? fig.posActual.y;
        fig.posActual = { x, y };
        inicio.x = x;
        inicio.y = y;
      },

      onPanResponderMove: (_, gs) => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;
        const newX = Math.max(0, Math.min(SW - 60, inicio.x + gs.dx));
        const newY = Math.max(0, inicio.y + gs.dy);
        fig.pan.setValue({ x: newX, y: newY });
      },

      onPanResponderRelease: (_, gs) => {
        const fig = figurasRef.current.find(f => f.id === figId);
        if (!fig || fig.encajada) return;

        const finalX = inicio.x + gs.dx + 28; // centro de la figura
        const finalY = inicio.y + gs.dy + 28;
        fig.posActual = { x: inicio.x + gs.dx, y: inicio.y + gs.dy };

        const TOLERANCIA = 48;
        let accion: "acierto" | "fallo" | "ninguno" = "ninguno";
        let moldeTarget: Molde | null = null;

        for (const molde of moldesRef.current) {
          if (molde.ocupado) continue;
          const layout = moldeLayouts.current[molde.id];
          if (!layout) continue;

          const centraMoldeX = layout.x + layout.w / 2;
          const centraMoldeY = layout.y + layout.h / 2;
          const dist = Math.sqrt(
            Math.pow(finalX - centraMoldeX, 2) +
            Math.pow(finalY - centraMoldeY, 2)
          );

          if (dist < TOLERANCIA) {
            moldeTarget = molde;
            accion = fig.tipo === molde.tipo ? "acierto" : "fallo";
            break;
          }
        }

        if (accion === "acierto" && moldeTarget) {
          const layout = moldeLayouts.current[moldeTarget.id];
          fig.encajada = true;
          moldeTarget.ocupado = true;

          Animated.spring(fig.pan, {
            toValue: { x: layout.x + layout.w / 2 - 28, y: layout.y + layout.h / 2 - 28 },
            useNativeDriver: false,
            speed: 20,
          }).start();

          setAciertos(a => { aciertosRef.current = a + 1; return a + 1; });
          setMoldes([...moldesRef.current]);
          setFiguras([...figurasRef.current]);
          setTimeout(verificarFinRonda, 300);

        } else {
          if (accion === "fallo") {
            setFallos(f => f + 1);
          }
          // Regresar a posición original
          Animated.spring(fig.pan, {
            toValue: fig.posInicio,
            useNativeDriver: false,
            speed: 12,
          }).start();
          fig.posActual = { ...fig.posInicio };
        }
      },
    });
  }, [verificarFinRonda]);

  // Crear panResponders cuando cambian las figuras
  useEffect(() => {
    figuras.forEach(fig => {
      if (!panResponders.current[fig.id]) {
        panResponders.current[fig.id] = crearPanResponder(fig.id);
      }
    });
  }, [figuras, crearPanResponder]);

  if (terminado) {
    const precision = aciertos + fallos > 0
      ? Math.round((aciertos / (aciertos + fallos)) * 100)
      : 0;
    return (
      <View style={styles.finContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.finTitulo}>⏱️ ¡Tiempo!</Text>
        <Text style={styles.finStat}>✅ Aciertos: {aciertos}</Text>
        <Text style={styles.finStat}>❌ Fallos: {fallos}</Text>
        <Text style={styles.finStat}>🎯 Precisión: {precision}%</Text>
        <Text style={styles.finBoton} onPress={() => router.back()}>Volver</Text>
      </View>
    );
  }

  const { nFiguras, nMoldes, label } = getDificultad(aciertos);

  return (
    <View
      style={[styles.page, { position: "relative" }]}
      onLayout={e => {
        e.currentTarget.measure((_fx, _fy, _w, _h, _px, py) => {
          pageOffsetY.current = py;
        });
      }}
    >
      <Stack.Screen options={{
        headerTitle: () => (
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Text style={{ color: "#2b6cb0", fontWeight: "bold", fontSize: 17 }}>⏱️ {tiempo}s</Text>
            <Text style={{ color: "green",   fontWeight: "bold", fontSize: 17 }}>✅ {aciertos}</Text>
            <Text style={{ color: "red",     fontWeight: "bold", fontSize: 17 }}>❌ {fallos}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>{label}</Text>
          </View>
        ),
        headerStyle: { backgroundColor: "#ebf8ff" },
        headerShadowVisible: false,
      }} />

      {/* ZONA FIGURAS - solo el fondo y el label */}
      <View style={styles.zonaFiguras}>
        <Text style={styles.instruccion}>Arrastra cada figura a su molde</Text>
      </View>

      {/* FIGURAS: fuera de zonaFiguras para que no las corte overflow:hidden y pasen por encima de los moldes */}
      {figuras.map(fig => {
        const pr = panResponders.current[fig.id];
        if (!pr) return null;
        return (
          <Animated.View
            key={fig.id}
            {...pr.panHandlers}
            style={{
              position: "absolute",
              left: fig.pan.x,
              top: fig.pan.y,
              zIndex: 999,
              opacity: fig.encajada ? 0 : 1,
              padding: 8,
            }}
          >
            <RenderFigura tipo={fig.tipo} color={fig.color} size={48} />
          </Animated.View>
        );
      })}

      <View style={styles.divisor} />

      {/* ZONA MOLDES */}
      <View style={styles.zonaMoldes}>
        <Text style={styles.instruccionMolde}>
          {nFiguras > nMoldes
            ? `⚠️ Hay ${nFiguras} figuras pero solo ${nMoldes} moldes`
            : "Encaja las figuras correctas"}
        </Text>
        <View style={styles.moldesRow}>
          {moldes.map(molde => (
            <View
              key={molde.id}
              ref={ref => { moldeRefs.current[molde.id] = ref; }}
              style={[styles.moldeWrapper, molde.ocupado && styles.moldeOcupado]}
              onLayout={() => {
                setTimeout(() => {
                  const ref = moldeRefs.current[molde.id];
                  if (ref && ref.measure) {
                    ref.measure((_fx: number, _fy: number, width: number, height: number, pageX: number, pageY: number) => {
                      // Restamos el offset de la página para que coincida con el sistema de coordenadas de las figuras
                      moldeLayouts.current[molde.id] = { x: pageX, y: pageY - pageOffsetY.current, w: width, h: height };
                    });
                  }
                }, 100);
              }}
            >
              {molde.ocupado
                ? <Text style={{ fontSize: 28 }}>✨</Text>
                : <RenderMolde tipo={molde.tipo} size={50} />
              }
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
