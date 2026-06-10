import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const BLUE = "#337ab7";
const CARTA_SIZE = 54;

// ─── Fondo animado con números flotando ──────────────────────────────────────
const BG_NUMS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "🧮", "➕", "🎯"];

function FondoAnimado() {
  const items = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      symbol: BG_NUMS[i % BG_NUMS.length],
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
            {item.symbol}
          </Animated.Text>
        );
      })}
    </View>
  );
}

// ─── Ficha animada ────────────────────────────────────────────────────────────
function Ficha({
  numero,
  seleccionada,
  onPress,
  delay = 0,
}: {
  numero: number;
  seleccionada: boolean;
  onPress?: () => void;
  delay?: number;
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }, delay);
  }, []);

  useEffect(() => {
    Animated.spring(press, {
      toValue: seleccionada ? 0.88 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [seleccionada]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          Sc.ficha,
          seleccionada && Sc.fichaSeleccionada,
          { transform: [{ scale: Animated.multiply(scale, press) }] },
        ]}
      >
        <Text style={[Sc.fichaNum, seleccionada && { color: "#fff" }]}>
          {numero}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── PASO 1: Conoce el objetivo ───────────────────────────────────────────────
function Paso1Demo() {
  const pulso = useRef(new Animated.Value(1)).current;
  const flechaY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso,   { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulso,   { toValue: 1.0,  duration: 700, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(flechaY, { toValue: 8,  duration: 600, useNativeDriver: true }),
        Animated.timing(flechaY, { toValue: 0,  duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={Sc.demoWrap}>
      <Animated.View style={[Sc.labelBadge, { transform: [{ scale: pulso }] }]}>
        <Text style={Sc.labelBadgeText}>🎯 El número objetivo</Text>
      </Animated.View>

      <Animated.View style={[Sc.outerCircle, { transform: [{ scale: pulso }] }]}>
        <View style={Sc.innerCircle}>
          <Text style={Sc.targetNum}>13</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[Sc.flecha, { transform: [{ translateY: flechaY }] }]}>
        👆
      </Animated.Text>
      <Text style={Sc.demoHint}>Debes llegar exactamente a este número</Text>
    </View>
  );
}

// ─── PASO 2: Interactivo – toca fichas para sumar ────────────────────────────
const NUMEROS_PASO2  = [4, 6, 2, 7, 3, 5];
const OBJETIVO_PASO2 = 13;

function Paso2Demo({ onCompleto }: { onCompleto: () => void }) {
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [sumaActual, setSumaActual]       = useState(0);
  const [estado, setEstado]               = useState<"jugando" | "ok" | "error">("jugando");
  const shakeX  = useRef(new Animated.Value(0)).current;
  const yaGano  = useRef(false);

  const notifO = useRef(new Animated.Value(0)).current;
  const notifY = useRef(new Animated.Value(0)).current;
  const [notifVisible, setNotifVisible] = useState(false);

  const mostrarNotif = () => {
    setNotifVisible(true);
    notifO.setValue(1);
    notifY.setValue(0);
    Animated.sequence([
      Animated.timing(notifY, { toValue: -20, duration: 500, useNativeDriver: true }),
      Animated.timing(notifO, { toValue: 0,   duration: 400, useNativeDriver: true }),
    ]).start(() => setNotifVisible(false));
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:  10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:   0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const tocarFicha = (idx: number) => {
    if (estado !== "jugando") return;

    if (seleccionadas.includes(idx)) {
      const nuevas = seleccionadas.filter(i => i !== idx);
      setSeleccionadas(nuevas);
      setSumaActual(nuevas.reduce((a, i) => a + NUMEROS_PASO2[i], 0));
      return;
    }

    const nuevasSel = [...seleccionadas, idx];
    const nuevaSuma = nuevasSel.reduce((a, i) => a + NUMEROS_PASO2[i], 0);
    setSeleccionadas(nuevasSel);
    setSumaActual(nuevaSuma);

    if (nuevaSuma === OBJETIVO_PASO2) {
      if (!yaGano.current) {
        yaGano.current = true;
        setEstado("ok");
        mostrarNotif();
        setTimeout(() => onCompleto(), 800);
      }
    } else if (nuevaSuma > OBJETIVO_PASO2) {
      shake();
      setEstado("error");
      setTimeout(() => {
        setSeleccionadas([]);
        setSumaActual(0);
        setEstado("jugando");
      }, 700);
    }
  };

  return (
    <View style={Sc.demoWrap}>
      <View style={Sc.labelBadge}>
        <Text style={Sc.labelBadgeText}>
          {estado === "ok"
            ? "✅ ¡Par encontrado!"
            : estado === "error"
            ? "❌ ¡Te pasaste!"
            : sumaActual > 0
            ? `Suma: ${sumaActual} — faltan ${OBJETIVO_PASO2 - sumaActual}`
            : "🔢 Toca las fichas para sumar 13"}
        </Text>
      </View>

      <View style={Sc.filaSuma}>
        <View style={Sc.outerCircle}>
          <View style={Sc.innerCircle}>
            <Text style={Sc.targetNum}>{OBJETIVO_PASO2}</Text>
          </View>
        </View>
        <Text style={Sc.igualSigno}>=</Text>
        <View style={[
          Sc.sumaBox,
          sumaActual === OBJETIVO_PASO2 && { borderColor: "#7dc123", backgroundColor: "#f0fdf4" },
          sumaActual >  OBJETIVO_PASO2  && { borderColor: "#e93232", backgroundColor: "#fff0f0" },
        ]}>
          <Text style={[
            Sc.sumaNum,
            sumaActual === OBJETIVO_PASO2 && { color: "#7dc123" },
            sumaActual >  OBJETIVO_PASO2  && { color: "#e93232" },
          ]}>
            {sumaActual}
          </Text>
        </View>
      </View>

      <Animated.View style={[Sc.gridFichas, { transform: [{ translateX: shakeX }] }]}>
        {NUMEROS_PASO2.map((n, i) => (
          <Ficha
            key={i}
            numero={n}
            seleccionada={seleccionadas.includes(i)}
            onPress={() => tocarFicha(i)}
            delay={i * 60}
          />
        ))}
      </Animated.View>

      {notifVisible && (
        <Animated.Text style={[Sc.notifPar, { opacity: notifO, transform: [{ translateY: notifY }] }]}>
          ✅ ¡Correcto! {NUMEROS_PASO2.filter((_, i) => seleccionadas.includes(i)).join(" + ")} = {OBJETIVO_PASO2}
        </Animated.Text>
      )}
    </View>
  );
}

// ─── PASO 3: Reglas finales ───────────────────────────────────────────────────
function Paso3Demo() {
  const reglas = [
    { label: "Regla 1", texto: "Toca números que sumen el objetivo",  color: "#4ade80" },
    { label: "Regla 2", texto: "Deselecciona tocando de nuevo",        color: "#60a5fa" },
    { label: "Regla 3", texto: "Si te pasas, se reinicia la selección", color: "#a78bfa" },
    { label: "Regla 4", texto: "60 segundos. ¡Haz el mayor puntaje!",  color: "#fb923c" },
  ];
  const scales = reglas.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    reglas.forEach((_, i) => {
      setTimeout(() => {
        Animated.spring(scales[i], { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }, i * 150);
    });
  }, []);

  return (
    <View style={Sc.demoWrap}>
      <Text style={Sc.paso3Titulo}>Reglas del juego</Text>
      {reglas.map((r, i) => (
        <Animated.View key={i} style={[Sc.nivelRow, { transform: [{ scale: scales[i] }] }]}>
          <View style={[Sc.nivelDot, { backgroundColor: r.color }]} />
          <Text style={Sc.nivelLabel}>{r.label}</Text>
          <Text style={Sc.reglaTexto}>{r.texto}</Text>
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
      descripcion: "Verás un número objetivo. ¡Debes llegar exactamente a ese número!",
      instrucciones: [
        "🎯 El número objetivo aparece en el círculo.",
        "🔢 Selecciona fichas para ir sumando.",
        "✅ Llega exactamente al número para ganar.",
      ],
    },
    2: {
      descripcion: "Toca las fichas para ir sumando. Llega exactamente al número objetivo.",
      instrucciones: [
        "🃏 Toca una ficha para seleccionarla.",
        "↩️ Toca de nuevo para deseleccionarla.",
        "💥 Si te pasas, se reinicia la selección.",
      ],
    },
    3: {
      descripcion: "¡Supera los niveles sumando con rapidez!",
      instrucciones: [
        "⏱️ Tienes 60 segundos por partida.",
        "📈 El objetivo cambia en cada ronda.",
        "🏆 ¡Haz el mayor número de aciertos!",
      ],
    },
  } as const;

  const info     = INFO[paso as 1 | 2 | 3];
  const disabled = paso === 2 ? !paso2Completo : false;

  const avanzar = () => {
    if (paso < 3) setPaso(p => p + 1);
    else { onCerrar(); router.push("/modulo/razonamiento/juego"); }
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
        {paso === 2 && <Paso2Demo onCompleto={() => setPaso2Completo(true)} />}
        {paso === 3 && <Paso3Demo />}
      </View>

      <View style={S.contenedor}>
        <View style={S.headerRow}>
          <View style={S.pasoBadge}>
            <Text style={S.pasoBadgeTexto}>Paso {paso} de 3</Text>
          </View>
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
            <Text style={S.textoBoton}>{paso < 3 ? "Siguiente ➡️" : "¡A jugar! 🧮"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla de inicio del módulo ───────────────────────────────────────────
export default function TutorialSuma() {
  const router = useRouter();
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
        <Text style={S.titulo}>Juego de Suma</Text>
        <View style={S.tituloLinea} />
        <Paso1Demo />
      </View>

      <View style={S.contenedor}>
        <View style={S.headerRow}>
          <View style={S.pasoBadge}>
            <Text style={S.pasoBadgeTexto}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="puzzle" size={30} color="#f1c40f" />
        </View>

        <View style={S.descripcionBox}>
          <Text style={S.descripcionTexto}>Suma fichas hasta alcanzar el número objetivo.</Text>
        </View>

        <View style={S.instruccionesBadge}>
          <Text style={S.instruccionesBadgeTexto}>Instrucciones</Text>
        </View>

        <View style={S.listaInstrucciones}>
          <Text style={S.instruccionLinea}>🎯 Observa el número objetivo en el círculo.</Text>
          <Text style={S.instruccionLinea}>🔢 Toca fichas para sumar exactamente ese número.</Text>
          <Text style={S.instruccionLinea}>⏱️ ¡Haz el mayor número de aciertos a tiempo!</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable style={S.botonIzq} onPress={() => setVerTutorial(true)}>
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable style={S.botonDer} onPress={() => router.push("/modulo/razonamiento/juego")}>
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
    color: BLUE,
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#337ab7",
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

// ─── Estilos demos ────────────────────────────────────────────────────────────
const Sc = StyleSheet.create({
  demoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: "100%",
  },
  labelBadge: {
    backgroundColor: "rgba(51,122,183,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  labelBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
  },

  // Círculo objetivo
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: BLUE,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  innerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  targetNum: {
    fontSize: 30,
    fontWeight: "900",
    color: "#2f5279",
  },
  flecha: {
    fontSize: 28,
    marginTop: 4,
    marginBottom: 2,
  },
  demoHint: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    fontWeight: "500",
  },

  // Fila suma
  filaSuma: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  igualSigno: {
    fontSize: 24,
    fontWeight: "900",
    color: "#555",
  },
  sumaBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#ddd",
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
  },
  sumaNum: {
    fontSize: 26,
    fontWeight: "900",
    color: "#555",
  },

  // Grid fichas
  gridFichas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: SCREEN_WIDTH - 48,
    marginTop: 6,
  },
  ficha: {
    width: CARTA_SIZE,
    height: CARTA_SIZE,
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: BLUE,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fichaSeleccionada: {
    backgroundColor: BLUE,
    borderColor: "#2f5279",
  },
  fichaNum: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2f5279",
  },

  // Notificación
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
  nivelDot:  { width: 10, height: 10, borderRadius: 5 },
  nivelLabel: { fontSize: 12, fontWeight: "700", color: "#444", width: 52 },
  reglaTexto: { flex: 1, fontSize: 13, color: "#555", fontWeight: "500" },
});