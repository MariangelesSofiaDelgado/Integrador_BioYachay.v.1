import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";

const T = 55; // tamaño triángulo
const C = 45; // tamaño círculo

interface MensajeFlotante { id: number; texto: string; color: string; }
let mensajeId = 0;

export default function TutorialVisoespacial() {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);

  // Paso 1
  const [haMovidoPaso1, setHaMovidoPaso1] = useState(false);

  // Paso 2
  const [trianguloEncajado, setTrianguloEncajado] = useState(false);

  // Paso 3: dos figuras independientes
  const [trianguloEncajadoP3, setTrianguloEncajadoP3] = useState(false);
  const [circuloEncajadoP3,   setCirculoEncajadoP3]   = useState(false);

  const [mensajes, setMensajes] = useState<MensajeFlotante[]>([]);

  const limites = useRef({ ancho: 0, alto: 0 });

  // ── Posiciones animadas ───────────────────────────────────────────────
  const panT  = useRef(new Animated.ValueXY({ x: 40,  y: 200 })).current; // triángulo paso 1/2
  const panC  = useRef(new Animated.ValueXY({ x: 220, y: 200 })).current; // círculo paso 1
  const panT3 = useRef(new Animated.ValueXY({ x: 60,  y: 160 })).current; // triángulo paso 3
  const panC3 = useRef(new Animated.ValueXY({ x: 220, y: 160 })).current; // círculo paso 3

  const uT  = useRef({ x: 40,  y: 200 });
  const uC  = useRef({ x: 220, y: 200 });
  const uT3 = useRef({ x: 60,  y: 160 });
  const uC3 = useRef({ x: 220, y: 160 });
  const iT  = useRef({ x: 40,  y: 200 });
  const iC  = useRef({ x: 220, y: 200 });
  const iT3 = useRef({ x: 60,  y: 160 });
  const iC3 = useRef({ x: 220, y: 160 });

  // ── Animaciones ───────────────────────────────────────────────────────
  const moldePulso  = useRef(new Animated.Value(1)).current;
  const moldeBrillo = useRef(new Animated.Value(0.35)).current;
  const escalaT     = useRef(new Animated.Value(1)).current;
  const estEsc      = useRef(new Animated.Value(0)).current;
  const estOp       = useRef(new Animated.Value(0)).current;
  const flechaPulso = useRef(new Animated.Value(1)).current;
  const moldeBorde  = useRef(new Animated.Value(0)).current;
  // paso 3
  const escalaT3    = useRef(new Animated.Value(1)).current;
  const escalaC3    = useRef(new Animated.Value(1)).current;
  const estEscT3    = useRef(new Animated.Value(0)).current;
  const estOpT3     = useRef(new Animated.Value(0)).current;
  const estEscC3    = useRef(new Animated.Value(0)).current;
  const estOpC3     = useRef(new Animated.Value(0)).current;
  const moldeT3Borde = useRef(new Animated.Value(0)).current;
  const moldeC3Borde = useRef(new Animated.Value(0)).current;
  const moldeT3Pulso = useRef(new Animated.Value(1)).current;
  const moldeC3Pulso = useRef(new Animated.Value(1)).current;

  // refs para PanResponder
  const pasoRef             = useRef<1 | 2 | 3>(1);
  const trianguloEncajadoRef = useRef(false);
  const trianguloP3Ref      = useRef(false);
  const circuloP3Ref        = useRef(false);

  useEffect(() => { pasoRef.current = paso; }, [paso]);
  useEffect(() => { trianguloEncajadoRef.current = trianguloEncajado; }, [trianguloEncajado]);
  useEffect(() => { trianguloP3Ref.current = trianguloEncajadoP3; }, [trianguloEncajadoP3]);
  useEffect(() => { circuloP3Ref.current   = circuloEncajadoP3; },   [circuloEncajadoP3]);

  // ── Pulso molde paso 2 ────────────────────────────────────────────────
  useEffect(() => {
    if (paso !== 2) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(moldePulso,  { toValue: 1.1,  duration: 700, useNativeDriver: true }),
        Animated.timing(moldeBrillo, { toValue: 0.75, duration: 700, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(moldePulso,  { toValue: 1,    duration: 700, useNativeDriver: true }),
        Animated.timing(moldeBrillo, { toValue: 0.35, duration: 700, useNativeDriver: false }),
      ]),
    ]));
    loop.start();
    return () => loop.stop();
  }, [paso]);

  // ── Pulso moldes paso 3 ───────────────────────────────────────────────
  useEffect(() => {
    if (paso !== 3) return;
    const pulsar = (anim: Animated.Value) =>
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 1.1, duration: 650, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 650, useNativeDriver: true }),
      ]));
    const loopT = pulsar(moldeT3Pulso);
    const loopC = pulsar(moldeC3Pulso);
    loopT.start(); loopC.start();
    return () => { loopT.stop(); loopC.stop(); };
  }, [paso]);

  // ── Pulso flecha paso 1 ───────────────────────────────────────────────
  useEffect(() => {
    if (paso !== 1 || haMovidoPaso1) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(flechaPulso, { toValue: 1.35, duration: 500, useNativeDriver: true }),
      Animated.timing(flechaPulso, { toValue: 1,    duration: 500, useNativeDriver: true }),
    ]));
    loop.start();
    return () => { loop.stop(); flechaPulso.setValue(1); };
  }, [paso, haMovidoPaso1]);

  // ── Reset al cambiar de paso ──────────────────────────────────────────
  useEffect(() => {
    if (paso === 2) {
      const xC = limites.current.ancho / 2 - T / 2 || 140;
      const pos = { x: xC, y: 80 };
      panT.setValue(pos); uT.current = { ...pos }; iT.current = { ...pos };
      setTrianguloEncajado(false);
      trianguloEncajadoRef.current = false;
      moldeBorde.setValue(0); estEsc.setValue(0); estOp.setValue(0);
    }
    if (paso === 3) {
      const { ancho, alto } = limites.current;
      const posT3 = { x: (ancho / 4) - T / 2 || 60,  y: alto * 0.2 || 120 };
      const posC3 = { x: (ancho * 3 / 4) - C / 2 || 220, y: alto * 0.2 || 120 };
      panT3.setValue(posT3); uT3.current = { ...posT3 }; iT3.current = { ...posT3 };
      panC3.setValue(posC3); uC3.current = { ...posC3 }; iC3.current = { ...posC3 };
      setTrianguloEncajadoP3(false); setCirculoEncajadoP3(false);
      trianguloP3Ref.current = false; circuloP3Ref.current = false;
      estEscT3.setValue(0); estOpT3.setValue(0);
      estEscC3.setValue(0); estOpC3.setValue(0);
      moldeT3Borde.setValue(0); moldeC3Borde.setValue(0);
    }
  }, [paso]);

  // ── Auto-navegar al juego cuando ambas encajan en paso 3 ─────────────
  useEffect(() => {
    if (trianguloEncajadoP3 && circuloEncajadoP3) {
      mostrarMensaje("🚀 ¡Al juego!", "#2b6cb0");
      setTimeout(() => router.replace("/modulo/visoespacial/juego"), 1800);
    }
  }, [trianguloEncajadoP3, circuloEncajadoP3]);

  // ── Mensajes automáticos por paso ────────────────────────────────────
  useEffect(() => {
    const cola = ({
      1: [
        ["👆 Presiona y arrastra las figuras", "#2b6cb0", 400],
        ["🔺 Triángulo  •  🔵 Círculo",        "#444",    2600],
      ],
      2: [
        ["🎯 Arrastra el triángulo al molde",  "#c05621", 400],
        ["⬇️ Suéltalo dentro del molde",       "#c05621", 2800],
      ],
      3: [
        ["💪 ¡Ahora es tu turno!",             "#2b6cb0", 300],
        ["🎯 Encaja las 2 figuras en su molde", "#444",   2000],
      ],
    } as Record<number, Array<[string, string, number]>>)[paso] ?? [];

    const timers = cola.map(([txt, col, delay]) =>
      setTimeout(() => mostrarMensaje(txt, col), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [paso]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const mostrarMensaje = (texto: string, color: string) => {
    const id = ++mensajeId;
    setMensajes((p) => [...p, { id, texto, color }]);
    setTimeout(() => setMensajes((p) => p.filter((m) => m.id !== id)), 1700);
  };

  const clamp = (dx: number, dy: number, ini: { x: number; y: number }, tam: number) => ({
    x: Math.max(0, Math.min(limites.current.ancho - tam, ini.x + dx)),
    y: Math.max(0, Math.min(limites.current.alto  - tam, ini.y + dy)),
  });

  const animarEncajeGenerico = (escala: Animated.Value, escEst: Animated.Value, opEst: Animated.Value) => {
    Animated.sequence([
      Animated.timing(escala, { toValue: 1.4,  duration: 130, useNativeDriver: true }),
      Animated.timing(escala, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.timing(escala, { toValue: 1.08, duration: 90,  useNativeDriver: true }),
      Animated.timing(escala, { toValue: 1,    duration: 70,  useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(escEst, { toValue: 1.5, duration: 260, useNativeDriver: true }),
        Animated.timing(opEst,  { toValue: 1,   duration: 200, useNativeDriver: true }),
      ]),
      Animated.timing(escEst, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const medirArea = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    limites.current = { ancho: width, alto: height };
  };

  const _w = limites.current.ancho || 380;
  const _h = limites.current.alto  || 600;
  const MOLDE2_Y  = _h / 2 + 20;
  const MOLDE2_X  = _w / 2 - T / 2;
  const MOLDE3_TY = _h / 2 + 30;
  const MOLDE3_TX = _w / 4 - T / 2;
  const MOLDE3_CY = _h / 2 + 30;
  const MOLDE3_CX = _w * 3 / 4 - C / 2;

  // ── PanResponders ─────────────────────────────────────────────────────

  // Triángulo paso 1 & 2
  const panRT = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => pasoRef.current <= 2 && !trianguloEncajadoRef.current,
    onMoveShouldSetPanResponder:  () => pasoRef.current <= 2 && !trianguloEncajadoRef.current,
    onPanResponderGrant: () => {
      const x = (panT.x as any)._value ?? uT.current.x;
      const y = (panT.y as any)._value ?? uT.current.y;
      uT.current = iT.current = { x, y };
    },
    onPanResponderMove: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iT.current, T);
      panT.setValue(pos);
      if (pasoRef.current === 1) setHaMovidoPaso1(true);
      if (pasoRef.current === 2) {
        // Calcular molde en vivo con las dimensiones reales
        const mX = limites.current.ancho / 2 - T / 2;
        const mY = limites.current.alto  / 2 + 20;
        const cerca = Math.abs(pos.x - mX) < 65 && Math.abs(pos.y - mY) < 65;
        Animated.timing(moldeBorde, { toValue: cerca ? 1 : 0, duration: 150, useNativeDriver: false }).start();
      }
    },
    onPanResponderRelease: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iT.current, T);
      if (pasoRef.current === 1) { uT.current = pos; return; }
      if (pasoRef.current === 2) {
        moldeBorde.setValue(0);
        // Siempre leer limites en el momento del release
        const mX  = limites.current.ancho / 2 - T / 2;
        const mY  = limites.current.alto  / 2 + 20;
        const TOL = 50;
        if (Math.abs(pos.x - mX) < TOL && Math.abs(pos.y - mY) < TOL) {
          Animated.spring(panT, { toValue: { x: mX, y: mY }, useNativeDriver: false }).start();
          uT.current = { x: mX, y: mY };
          setTrianguloEncajado(true); trianguloEncajadoRef.current = true;
          animarEncajeGenerico(escalaT, estEsc, estOp);
          mostrarMensaje("¡Encajaste! 🎯 ¡Perfecto!", "#22863a");
        } else {
          // Volver exactamente a donde estaba antes de agarrarlo
          const vuelta = { ...iT.current };
          Animated.spring(panT, { toValue: vuelta, useNativeDriver: false }).start();
          uT.current = vuelta;
          mostrarMensaje("¡Casi! Ponlo más cerca 🎯", "#c05621");
        }
      }
    },
  })).current;

  // Círculo paso 1
  const panRC = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => pasoRef.current === 1,
    onMoveShouldSetPanResponder:  () => pasoRef.current === 1,
    onPanResponderGrant: () => { iC.current = { ...uC.current }; },
    onPanResponderMove: (_, gs) => {
      if (pasoRef.current === 1) {
        setHaMovidoPaso1(true);
        panC.setValue(clamp(gs.dx, gs.dy, iC.current, C));
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (pasoRef.current === 1)
        uC.current = clamp(gs.dx, gs.dy, iC.current, C);
    },
  })).current;

  // Triángulo paso 3
  const panRT3 = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => pasoRef.current === 3 && !trianguloP3Ref.current,
    onMoveShouldSetPanResponder:  () => pasoRef.current === 3 && !trianguloP3Ref.current,
    onPanResponderGrant: () => {
      const x = (panT3.x as any)._value ?? uT3.current.x;
      const y = (panT3.y as any)._value ?? uT3.current.y;
      uT3.current = iT3.current = { x, y };
    },
    onPanResponderMove: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iT3.current, T);
      panT3.setValue(pos);
      const mX = limites.current.ancho / 4 - T / 2;
      const mY = limites.current.alto  / 2 + 30;
      const cerca = Math.abs(pos.x - mX) < 70 && Math.abs(pos.y - mY) < 70;
      Animated.timing(moldeT3Borde, { toValue: cerca ? 1 : 0, duration: 120, useNativeDriver: false }).start();
    },
    onPanResponderRelease: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iT3.current, T);
      moldeT3Borde.setValue(0);
      const mX  = limites.current.ancho / 4 - T / 2;
      const mY  = limites.current.alto  / 2 + 30;
      const TOL = 60;
      if (Math.abs(pos.x - mX) < TOL && Math.abs(pos.y - mY) < TOL) {
        Animated.spring(panT3, { toValue: { x: mX, y: mY }, useNativeDriver: false }).start();
        uT3.current = { x: mX, y: mY };
        setTrianguloEncajadoP3(true); trianguloP3Ref.current = true;
        animarEncajeGenerico(escalaT3, estEscT3, estOpT3);
        mostrarMensaje("¡Triángulo encajado! 🔺", "#22863a");
      } else {
        // Volver exactamente a donde estaba antes de agarrarlo
        const vuelta = { ...iT3.current };
        Animated.spring(panT3, { toValue: vuelta, useNativeDriver: false }).start();
        uT3.current = vuelta;
        mostrarMensaje("¡Casi! Inténtalo de nuevo 🎯", "#c05621");
      }
    },
  })).current;

  // Círculo paso 3
  const panRC3 = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => pasoRef.current === 3 && !circuloP3Ref.current,
    onMoveShouldSetPanResponder:  () => pasoRef.current === 3 && !circuloP3Ref.current,
    onPanResponderGrant: () => {
      const x = (panC3.x as any)._value ?? uC3.current.x;
      const y = (panC3.y as any)._value ?? uC3.current.y;
      uC3.current = iC3.current = { x, y };
    },
    onPanResponderMove: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iC3.current, C);
      panC3.setValue(pos);
      const mX = limites.current.ancho * 3 / 4 - C / 2;
      const mY = limites.current.alto  / 2 + 30;
      const cerca = Math.abs(pos.x - mX) < 70 && Math.abs(pos.y - mY) < 70;
      Animated.timing(moldeC3Borde, { toValue: cerca ? 1 : 0, duration: 120, useNativeDriver: false }).start();
    },
    onPanResponderRelease: (_, gs) => {
      const pos = clamp(gs.dx, gs.dy, iC3.current, C);
      moldeC3Borde.setValue(0);
      const mX  = limites.current.ancho * 3 / 4 - C / 2;
      const mY  = limites.current.alto  / 2 + 30;
      const TOL = 60;
      if (Math.abs(pos.x - mX) < TOL && Math.abs(pos.y - mY) < TOL) {
        Animated.spring(panC3, { toValue: { x: mX, y: mY }, useNativeDriver: false }).start();
        uC3.current = { x: mX, y: mY };
        setCirculoEncajadoP3(true); circuloP3Ref.current = true;
        animarEncajeGenerico(escalaC3, estEscC3, estOpC3);
        mostrarMensaje("¡Círculo encajado! 🔵", "#22863a");
      } else {
        // Volver exactamente a donde estaba antes de agarrarlo
        const vuelta = { ...iC3.current };
        Animated.spring(panC3, { toValue: vuelta, useNativeDriver: false }).start();
        uC3.current = vuelta;
        mostrarMensaje("¡Casi! Inténtalo de nuevo 🎯", "#c05621");
      }
    },
  })).current;

  // ── Avanzar paso manualmente (pasos 1 y 2) ───────────────────────────
  const avanzarPaso = () => {
    if (paso === 1 && haMovidoPaso1) setPaso(2);
    else if (paso === 2 && trianguloEncajado) setPaso(3);
  };

  const botonDeshabilitado =
    (paso === 1 && !haMovidoPaso1) ||
    (paso === 2 && !trianguloEncajado);

  // Interpolaciones borde molde
  const moldeBordeColor   = moldeBorde.interpolate({ inputRange: [0,1], outputRange: ["#999","#22c55e"] });
  const moldeT3BordeColor = moldeT3Borde.interpolate({ inputRange: [0,1], outputRange: ["#999","#22c55e"] });
  const moldeC3BordeColor = moldeC3Borde.interpolate({ inputRange: [0,1], outputRange: ["#999","#22c55e"] });

  const labelPaso  = { 1: "Paso 1 de 3", 2: "Paso 2 de 3", 3: "Paso 3 de 3 🎯" }[paso];

  return (
    <View style={{ flex: 1, backgroundColor: "#ededed" }}>
      <Stack.Screen options={{
        headerShown: true, headerTitle: "",
        headerStyle: { backgroundColor: "#2b6cb0" },
        headerTintColor: "#ffffff", headerShadowVisible: false,
      }} />

      <View style={{ flex: 1 }} onLayout={medirArea}>

        {/* Etiqueta paso */}
        <View style={{
          position: "absolute", top: 16, left: 16, zIndex: 50,
          backgroundColor: paso === 3 ? "#7c3aed" : "#faa638",
          paddingHorizontal: 14, paddingVertical: 6,
          borderRadius: 10, elevation: 4,
        }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{labelPaso}</Text>
        </View>

        {/* Progreso */}
        <View style={{ position: "absolute", top: 22, right: 16, zIndex: 50, flexDirection: "row", gap: 6 }}>
          {([1,2,3] as const).map((p) => (
            <View key={p} style={{
              width: paso >= p ? 20 : 8, height: 8, borderRadius: 4,
              backgroundColor: paso >= p ? "#2b6cb0" : "#ccc",
            }} />
          ))}
        </View>

        {/* Flecha pulsante paso 1 */}
        {paso === 1 && !haMovidoPaso1 && (
          <Animated.Text style={{
            position: "absolute", left: 30, top: 190, fontSize: 32, zIndex: 50,
            transform: [{ scale: flechaPulso }],
          }}>👆</Animated.Text>
        )}

        {/* ══ PASO 1 & 2: triángulo ══ */}
        {paso <= 2 && (
          <Animated.View {...panRT.panHandlers} style={{
            position: "absolute", left: panT.x, top: panT.y, zIndex: 30,
            transform: [{ scale: escalaT }],
          }}>
            <View style={{
              width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid",
              borderLeftWidth: T/2, borderRightWidth: T/2, borderBottomWidth: T,
              borderLeftColor: "transparent", borderRightColor: "transparent",
              borderBottomColor: "#d53f8c",
            }} />
          </Animated.View>
        )}

        {/* Círculo paso 1 */}
        {paso === 1 && (
          <Animated.View {...panRC.panHandlers} style={{
            position: "absolute", left: panC.x, top: panC.y, zIndex: 19,
            width: C, height: C, borderRadius: C/2,
            backgroundColor: "#3182ce", elevation: 4,
          }} />
        )}

        {/* ══ PASO 2: molde triángulo ══ */}
        {paso === 2 && (
          <View style={{ position: "absolute", width: "100%", height: "100%", alignItems: "center" }}>
            {trianguloEncajado ? (
              <Animated.Text style={{
                fontSize: 50, position: "absolute", top: MOLDE2_Y - 8, zIndex: 40,
                transform: [{ scale: estEsc }], opacity: estOp,
              }}>✨</Animated.Text>
            ) : (
              <>
                <Animated.View style={{
                  position: "absolute", top: MOLDE2_Y, width: 70, height: 70,
                  borderRadius: 12, borderStyle: "dashed", borderWidth: 2,
                  borderColor: moldeBordeColor, justifyContent: "center",
                  alignItems: "center", zIndex: 5, transform: [{ scale: moldePulso }],
                }}>
                  <Animated.View style={{
                    width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid",
                    borderLeftWidth: 51/2, borderRightWidth: 51/2, borderBottomWidth: 51,
                    borderLeftColor: "transparent", borderRightColor: "transparent",
                    borderBottomColor: moldeBordeColor as any, opacity: moldeBrillo,
                  }} />
                </Animated.View>
                <Text style={{ position: "absolute", top: MOLDE2_Y + 78, fontSize: 13, color: "#888", fontWeight: "600" }}>
                  ⬆️ Suelta aquí
                </Text>
              </>
            )}
          </View>
        )}

        {/* ══ PASO 3: dos figuras + dos moldes ══ */}
        {paso === 3 && (
          <>
            {/* Triángulo paso 3 */}
            {!trianguloEncajadoP3 && (
              <Animated.View {...panRT3.panHandlers} style={{
                position: "absolute", left: panT3.x, top: panT3.y, zIndex: 30,
                transform: [{ scale: escalaT3 }],
              }}>
                <View style={{
                  width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid",
                  borderLeftWidth: T/2, borderRightWidth: T/2, borderBottomWidth: T,
                  borderLeftColor: "transparent", borderRightColor: "transparent",
                  borderBottomColor: "#d53f8c",
                }} />
              </Animated.View>
            )}

            {/* Círculo paso 3 */}
            {!circuloEncajadoP3 && (
              <Animated.View {...panRC3.panHandlers} style={{
                position: "absolute", left: panC3.x, top: panC3.y, zIndex: 29,
                width: C, height: C, borderRadius: C/2,
                backgroundColor: "#3182ce", elevation: 4,
                transform: [{ scale: escalaC3 }],
              }} />
            )}

            {/* Molde triángulo izquierda */}
            {trianguloEncajadoP3 ? (
              <Animated.Text style={{
                position: "absolute", left: MOLDE3_TX - 4, top: MOLDE3_TY - 8,
                fontSize: 46, zIndex: 40,
                transform: [{ scale: estEscT3 }], opacity: estOpT3,
              }}>✨</Animated.Text>
            ) : (
              <Animated.View style={{
                position: "absolute", left: MOLDE3_TX - 8, top: MOLDE3_TY,
                width: 72, height: 72, borderRadius: 12,
                borderStyle: "dashed", borderWidth: 2,
                borderColor: moldeT3BordeColor,
                justifyContent: "center", alignItems: "center", zIndex: 5,
                transform: [{ scale: moldeT3Pulso }],
              }}>
                <View style={{
                  width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid",
                  borderLeftWidth: 48/2, borderRightWidth: 48/2, borderBottomWidth: 48,
                  borderLeftColor: "transparent", borderRightColor: "transparent",
                  borderBottomColor: "#d53f8c", opacity: 0.3,
                }} />
              </Animated.View>
            )}

            {/* Molde círculo derecha */}
            {circuloEncajadoP3 ? (
              <Animated.Text style={{
                position: "absolute", left: MOLDE3_CX - 4, top: MOLDE3_CY - 8,
                fontSize: 46, zIndex: 40,
                transform: [{ scale: estEscC3 }], opacity: estOpC3,
              }}>✨</Animated.Text>
            ) : (
              <Animated.View style={{
                position: "absolute", left: MOLDE3_CX - 4, top: MOLDE3_CY,
                width: C + 12, height: C + 12, borderRadius: (C + 12) / 2,
                borderStyle: "dashed", borderWidth: 2,
                borderColor: moldeC3BordeColor,
                justifyContent: "center", alignItems: "center", zIndex: 5,
                transform: [{ scale: moldeC3Pulso }],
              }}>
                <View style={{
                  width: C - 8, height: C - 8, borderRadius: (C - 8) / 2,
                  backgroundColor: "#3182ce", opacity: 0.2,
                }} />
              </Animated.View>
            )}

            {/* Etiquetas bajo moldes */}
            {!trianguloEncajadoP3 && (
              <Text style={{
                position: "absolute", left: MOLDE3_TX - 8, top: MOLDE3_TY + 80,
                fontSize: 12, color: "#888", fontWeight: "600",
              }}>🔺 aquí</Text>
            )}
            {!circuloEncajadoP3 && (
              <Text style={{
                position: "absolute", left: MOLDE3_CX - 4, top: MOLDE3_CY + 68,
                fontSize: 12, color: "#888", fontWeight: "600",
              }}>🔵 aquí</Text>
            )}
          </>
        )}

        {/* Mensajes flotantes */}
        {mensajes.map((m) => (
          <MensajeAnimado key={m.id} texto={m.texto} color={m.color} />
        ))}

        {/* Botón flotante — solo pasos 1 y 2 */}
        {paso < 3 && (
          <View style={{
            position: "absolute", bottom: 30, left: 0, right: 0,
            alignItems: "center", zIndex: 60,
          }}>
            <View style={{
              backgroundColor: botonDeshabilitado ? "#aaa" : "#538214",
              borderRadius: 20, paddingVertical: 2, width: "80%",
            }}>
              <Pressable
                onPress={avanzarPaso}
                disabled={botonDeshabilitado}
                style={{
                  backgroundColor: botonDeshabilitado ? "#ccc" : "#7dc123",
                  paddingVertical: 14, borderRadius: 20,
                  alignItems: "center", position: "relative", top: -5, elevation: 3,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                  {paso === 1 ? "Siguiente" : "Continuar"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

      </View>
    </View>
  );
}

function MensajeAnimado({ texto, color }: { texto: string; color: string }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(op, { toValue: 1,  duration: 220, useNativeDriver: true }),
        Animated.timing(ty, { toValue: 0,  duration: 280, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.timing(op, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{
      position: "absolute", top: 80, left: 0, right: 0,
      alignItems: "center", zIndex: 100,
      opacity: op, transform: [{ translateY: ty }],
    }}>
      <View style={{
        backgroundColor: color,
        paddingHorizontal: 22, paddingVertical: 11,
        borderRadius: 22, elevation: 6,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, shadowRadius: 4,
      }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 17 }}>{texto}</Text>
      </View>
    </Animated.View>
  );
}
