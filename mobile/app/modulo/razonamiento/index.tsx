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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const scale   = useRef(new Animated.Value(0)).current;
  const press   = useRef(new Animated.Value(1)).current;

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
          localS.ficha,
          seleccionada && localS.fichaSeleccionada,
          { transform: [{ scale: Animated.multiply(scale, press) }] },
        ]}
      >
        <Text style={[localS.fichaNum, seleccionada && { color: "#fff" }]}>
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
    <View style={localS.demoWrap}>
      <Text style={localS.demoSubtitulo}>El número objetivo</Text>

      {/* Círculo objetivo igual al juego real */}
      <Animated.View style={[localS.outerCircle, { transform: [{ scale: pulso }] }]}>
        <View style={localS.innerCircle}>
          <Text style={localS.targetNum}>13</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[localS.flecha, { transform: [{ translateY: flechaY }] }]}>
        👆
      </Animated.Text>
      <Text style={localS.demoHint}>Debes llegar exactamente a este número</Text>
    </View>
  );
}

// ─── PASO 2: Interactivo – toca fichas para sumar ────────────────────────────
function Paso2Demo({ onCompleto }: { onCompleto: () => void }) {
  const NUMEROS  = [4, 6, 2, 7, 3, 5];
  const OBJETIVO = 13; // 4 + 2 + 7

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [sumaActual, setSumaActual]       = useState(0);
  const [estado, setEstado]               = useState<"jugando" | "ok" | "error">("jugando");
  const shakeX  = useRef(new Animated.Value(0)).current;
  const yaGano  = useRef(false);

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

    // Deseleccionar
    if (seleccionadas.includes(idx)) {
      const nuevas = seleccionadas.filter(i => i !== idx);
      setSeleccionadas(nuevas);
      setSumaActual(nuevas.reduce((a, i) => a + NUMEROS[i], 0));
      return;
    }

    const nuevasSel  = [...seleccionadas, idx];
    const nuevaSuma  = nuevasSel.reduce((a, i) => a + NUMEROS[i], 0);
    setSeleccionadas(nuevasSel);
    setSumaActual(nuevaSuma);

    if (nuevaSuma === OBJETIVO) {
      if (!yaGano.current) {
        yaGano.current = true;
        setEstado("ok");
        setTimeout(() => onCompleto(), 800);
      }
    } else if (nuevaSuma > OBJETIVO) {
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
    <View style={localS.demoWrap}>
      {/* Objetivo */}
      <View style={localS.filaSuma}>
        <View style={[localS.outerCircle, { width: 64, height: 64 }]}>
          <View style={[localS.innerCircle, { width: 52, height: 52, borderRadius: 26 }]}>
            <Text style={[localS.targetNum, { fontSize: 22 }]}>{OBJETIVO}</Text>
          </View>
        </View>
        <Text style={localS.igualSigno}>=</Text>
        <View style={[
          localS.sumaBox,
          sumaActual === OBJETIVO && { borderColor: "#7dc123", backgroundColor: "#f0fdf4" },
          sumaActual >  OBJETIVO && { borderColor: "#e93232", backgroundColor: "#fff0f0" },
        ]}>
          <Text style={[
            localS.sumaNum,
            sumaActual === OBJETIVO && { color: "#7dc123" },
            sumaActual >  OBJETIVO  && { color: "#e93232" },
          ]}>
            {sumaActual}
          </Text>
        </View>
      </View>

      {estado === "ok" && (
        <Text style={localS.mensajeOk}>🎉 ¡Correcto! {NUMEROS.filter((_, i) => seleccionadas.includes(i)).join(" + ")} = {OBJETIVO}</Text>
      )}
      {estado === "error" && (
        <Text style={localS.mensajeError}>❌ ¡Te pasaste! Intenta otra combinación</Text>
      )}
      {estado === "jugando" && sumaActual === 0 && (
        <Text style={localS.demoHint}>Toca las fichas para sumar</Text>
      )}
      {estado === "jugando" && sumaActual > 0 && sumaActual < OBJETIVO && (
        <Text style={localS.demoHint}>Suma: {sumaActual} — faltan {OBJETIVO - sumaActual}</Text>
      )}

      {/* Fichas */}
      <Animated.View style={[localS.gridFichas, { transform: [{ translateX: shakeX }] }]}>
        {NUMEROS.map((n, i) => (
          <Ficha
            key={i}
            numero={n}
            seleccionada={seleccionadas.includes(i)}
            onPress={() => tocarFicha(i)}
            delay={i * 60}
          />
        ))}
      </Animated.View>
    </View>
  );
}

// ─── PASO 3: Reglas finales ───────────────────────────────────────────────────
function Paso3Demo() {
  const reglas = [
    { icono: "🎯", texto: "Toca los números que sumen exactamente el objetivo." },
    { icono: "↩️", texto: "Toca una ficha ya seleccionada para deseleccionarla." },
    { icono: "💥", texto: "Si te pasas del objetivo, se reinician las selecciones." },
    { icono: "⏱️", texto: "Tienes 60 segundos. ¡Haz el mayor número de aciertos!" },
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
    <View style={localS.demoWrap}>
      <Text style={localS.demoSubtitulo}>Reglas del juego</Text>
      {reglas.map((r, i) => (
        <Animated.View key={i} style={[localS.reglaRow, { transform: [{ scale: scales[i] }] }]}>
          <Text style={localS.reglaIcono}>{r.icono}</Text>
          <Text style={localS.reglaTexto}>{r.texto}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TutorialSuma() {
  const router = useRouter();
  const [paso, setPaso]                   = useState(1);
  const [paso2Completo, setPaso2Completo] = useState(false);

  const obtenerTextosPaso = () => {
    switch (paso) {
      case 1:
        return {
          titulo: "Paso 1 de 3",
          descripcion: "Verás un número objetivo dentro de un círculo. ¡Debes llegar exactamente a ese número!",
          indicacion: "👆 Observa el círculo de arriba. Ese es tu objetivo en cada ronda.",
          boton: "Entendido 👍",
          disabled: false,
        };
      case 2:
        return {
          titulo: "Paso 2 de 3",
          descripcion: paso2Completo
            ? "🎉 ¡Perfecto! Eso es exactamente cómo se juega."
            : "Toca las fichas para ir sumando. Llega exactamente al número objetivo.",
          indicacion: paso2Completo
            ? "👉 Presiona Siguiente para ver las reglas finales."
            : "🔢 ¡Toca los números de arriba para sumar 13!",
          boton: paso2Completo ? "Siguiente ➡️" : "Encuentra la suma... 🔢",
          disabled: !paso2Completo,
        };
      case 3:
        return {
          titulo: "Paso 3 de 3",
          descripcion: "¡Has completado el tutorial! Ya sabes todo lo que necesitas para jugar.",
          indicacion: "🏆 ¿Listo para poner a prueba tu razonamiento?",
          boton: "¡A jugar! 🧮",
          disabled: false,
        };
      default:
        return { titulo: "", descripcion: "", indicacion: "", boton: "", disabled: false };
    }
  };

  const avanzarPaso = () => {
    if (paso === 1) {
      setPaso(2);
    } else if (paso === 2) {
      if (paso2Completo) setPaso(3);
    } else {
      router.push("/modulo/razonamiento");
    }
  };

  const infoPaso = obtenerTextosPaso();

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

      {/* ── Zona superior interactiva ── */}
      <View style={S.zonaSuperior}>
        <Text style={S.titulo}>Juego de Suma</Text>
        <View style={S.tituloLinea} />

        {paso === 1 && <Paso1Demo />}
        {paso === 2 && <Paso2Demo onCompleto={() => setPaso2Completo(true)} />}
        {paso === 3 && <Paso3Demo />}
      </View>

      {/* ── Tarjeta blanca inferior ── */}
      <View style={S.contenedor}>
        <View style={S.headerRow}>
          <View style={S.pasoContenedor}>
            <Text style={S.pasoTitulo}>{infoPaso.titulo}</Text>
          </View>
          <Ionicons name="school" size={30} color="#faa638" />
        </View>

        <View style={S.objectContenedor}>
          <Text style={S.objetivoDescripcion}>{infoPaso.descripcion}</Text>
        </View>

        <View style={S.indicaciones}>
          <Text style={S.indicacion}>{infoPaso.indicacion}</Text>
        </View>

        <View style={S.filaBotones}>
          <View style={[S.botonBaseIniciar, infoPaso.disabled && { backgroundColor: "#aaa" }]}>
            <Pressable
              style={[S.botonIniciar, infoPaso.disabled && { backgroundColor: "#ccc" }]}
              onPress={avanzarPaso}
              disabled={infoPaso.disabled}
            >
              <Text style={S.textoBoton}>{infoPaso.boton}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos de pantalla (copia exacta de stylesindex) ────────────────────────
const S = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  zonaSuperior: {
    flex: 0.60,
    width: "100%",
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 20,
  },
  titulo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#e93232",
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#e93232",
    borderRadius: 999,
    alignSelf: "center",
  },
  contenedor: {
    flex: 0.40,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pasoContenedor: {
    backgroundColor: "#7dc123",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  pasoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  objectContenedor: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  objetivoDescripcion: {
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
  },
  indicaciones: {
    marginVertical: 2,
  },
  indicacion: {
    fontSize: 17,
    color: "#444",
    fontWeight: "500",
  },
  filaBotones: {
    width: "100%",
  },
  botonBaseIniciar: {
    backgroundColor: "#ce540e",
    borderRadius: 20,
    paddingVertical: 2,
  },
  botonIniciar: {
    alignItems: "center",
    backgroundColor: "#faa638",
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

// ─── Estilos locales solo para las demos ──────────────────────────────────────
const localS = StyleSheet.create({
  demoWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  demoSubtitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#337ab7",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  demoHint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },

  // Círculo objetivo
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#337ab7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#337ab7",
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

  // Fila suma paso 2
  filaSuma: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
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
  mensajeOk: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7dc123",
    marginBottom: 4,
  },
  mensajeError: {
    fontSize: 13,
    fontWeight: "700",
    color: "#e93232",
    marginBottom: 4,
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
    width: 52,
    height: 52,
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#337ab7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#337ab7",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fichaSeleccionada: {
    backgroundColor: "#337ab7",
    borderColor: "#2f5279",
  },
  fichaNum: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2f5279",
  },

  // Reglas paso 3
  reglaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
    width: Math.min(SCREEN_WIDTH - 48, 320),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  reglaIcono: { fontSize: 20 },
  reglaTexto: { flex: 1, fontSize: 14, color: "#444", fontWeight: "500", lineHeight: 20 },
});