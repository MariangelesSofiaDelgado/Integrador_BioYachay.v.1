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

// ─── PASO 1: Muestra el emoji objetivo con pulso ──────────────────────────────
function Paso1Demo() {
  const pulso  = useRef(new Animated.Value(1)).current;
  const flechaY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso,   { toValue: 1.2,  duration: 700, useNativeDriver: true }),
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
      <Text style={localS.demoSubtitulo}>El emoji objetivo</Text>

      <View style={localS.objetivoBox}>
        <Text style={localS.labelObjetivo}>Encuentra:</Text>
        <Animated.Text style={[localS.emojiObjetivo, { transform: [{ scale: pulso }] }]}>
          🍎
        </Animated.Text>
      </View>

      <Animated.Text style={[localS.flecha, { transform: [{ translateY: flechaY }] }]}>
        👆
      </Animated.Text>
      <Text style={localS.demoHint}>Este emoji aparece arriba en cada ronda</Text>
    </View>
  );
}

// ─── PASO 2: Interactivo – toca el emoji correcto ────────────────────────────
const EMOJIS_DEMO = ["🍊", "🍌", "🍇", "🍓", "🍎", "🥝", "🍑", "🍒", "🍈"];
const OBJETIVO_DEMO = "🍎";

function Paso2Demo({ onCompleto }: { onCompleto: () => void }) {
  const [cartas, setCartas]     = useState(EMOJIS_DEMO);
  const [objetivo, setObjetivo] = useState(OBJETIVO_DEMO);
  const [estado, setEstado]     = useState<"jugando" | "ok" | "error">("jugando");
  const [aciertos, setAciertos] = useState(0);
  const shakeX   = useRef(new Animated.Value(0)).current;
  const scales   = useRef(EMOJIS_DEMO.map(() => new Animated.Value(0))).current;
  const yaGano   = useRef(false);

  // Entrada escalonada
  useEffect(() => {
    scales.forEach((s, i) => {
      setTimeout(() => {
        Animated.spring(s, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }, i * 60);
    });
  }, [cartas]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:  10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:   0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const tocarCarta = (emoji: string) => {
    if (estado !== "jugando") return;

    if (emoji === objetivo) {
      const nuevosAciertos = aciertos + 1;
      setAciertos(nuevosAciertos);
      setEstado("ok");

      if (nuevosAciertos >= 2 && !yaGano.current) {
        yaGano.current = true;
        setTimeout(() => onCompleto(), 600);
        return;
      }

      // Nueva ronda: barajar y nuevo objetivo
      setTimeout(() => {
        const barajado = [...EMOJIS_DEMO].sort(() => Math.random() - 0.5);
        const nuevoObj = barajado[Math.floor(Math.random() * barajado.length)];
        scales.forEach(s => s.setValue(0));
        setCartas(barajado);
        setObjetivo(nuevoObj);
        setEstado("jugando");
        barajado.forEach((_, i) => {
          setTimeout(() => {
            Animated.spring(scales[i], { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
          }, i * 50);
        });
      }, 500);
    } else {
      shake();
      setEstado("error");
      setTimeout(() => setEstado("jugando"), 600);
    }
  };

  return (
    <View style={localS.demoWrap}>
      {/* Objetivo */}
      <View style={localS.objetivoRow}>
        <Text style={localS.labelObjetivo}>Encuentra: </Text>
        <Text style={localS.emojiObjetivoSm}>{objetivo}</Text>
        <Text style={localS.aciertosLabel}> ✓ {aciertos}/2</Text>
      </View>

      {estado === "ok"    && <Text style={localS.mensajeOk}>✅ ¡Correcto!</Text>}
      {estado === "error" && <Text style={localS.mensajeError}>❌ ¡Ese no es!</Text>}
      {estado === "jugando" && <Text style={localS.demoHint}>Toca el emoji que coincida</Text>}

      {/* Grid 3x3 */}
      <Animated.View style={[localS.grid, { transform: [{ translateX: shakeX }] }]}>
        {cartas.map((emoji, i) => (
          <Pressable key={i} onPress={() => tocarCarta(emoji)}>
            <Animated.View style={[localS.carta, { transform: [{ scale: scales[i] }] }]}>
              <Text style={localS.cartaEmoji}>{emoji}</Text>
            </Animated.View>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

// ─── PASO 3: Reglas y niveles ─────────────────────────────────────────────────
function Paso3Demo() {
  const niveles = [
    { grid: "3×3", label: "Fácil",   color: "#7dc123", desde: "0 aciertos" },
    { grid: "4×4", label: "Normal",  color: "#faa638", desde: "6 aciertos" },
    { grid: "5×5", label: "Difícil", color: "#e93232", desde: "9 aciertos" },
  ];
  const reglas = [
    { icono: "🎯", texto: "Toca el emoji que coincida con el objetivo." },
    { icono: "⚡", texto: "El tablero cambia en cada acierto." },
    { icono: "📈", texto: "Más aciertos = tablero más grande." },
    { icono: "⏱️", texto: "Tienes 60 segundos. ¡Haz el mayor puntaje!" },
  ];
  const scales = [...niveles, ...reglas].map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    scales.forEach((s, i) => {
      setTimeout(() => {
        Animated.spring(s, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }, i * 120);
    });
  }, []);

  return (
    <View style={localS.demoWrap}>
      {/* Niveles */}
      <Text style={localS.demoSubtitulo}>Niveles de dificultad</Text>
      {niveles.map((n, i) => (
        <Animated.View key={i} style={[localS.nivelRow, { transform: [{ scale: scales[i] }] }]}>
          <View style={[localS.nivelDot, { backgroundColor: n.color }]} />
          <Text style={[localS.nivelGrid, { color: n.color }]}>{n.grid}</Text>
          <Text style={localS.nivelLabel}>{n.label}</Text>
          <Text style={localS.nivelDesde}>{n.desde}</Text>
        </Animated.View>
      ))}

      {/* Reglas */}
      <Text style={[localS.demoSubtitulo, { marginTop: 8 }]}>Reglas</Text>
      {reglas.map((r, i) => (
        <Animated.View key={i} style={[localS.reglaRow, { transform: [{ scale: scales[niveles.length + i] }] }]}>
          <Text style={localS.reglaIcono}>{r.icono}</Text>
          <Text style={localS.reglaTexto}>{r.texto}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TutorialAtencion() {
  const router = useRouter();
  const [paso, setPaso]                   = useState(1);
  const [paso2Completo, setPaso2Completo] = useState(false);

  const obtenerTextosPaso = () => {
    switch (paso) {
      case 1:
        return {
          titulo: "Paso 1 de 3",
          descripcion: "En cada ronda verás un emoji objetivo. ¡Debes encontrarlo en el tablero lo más rápido posible!",
          indicacion: "👆 Observa el emoji de arriba. Ese es el que debes buscar.",
          boton: "Entendido 👍",
          disabled: false,
        };
      case 2:
        return {
          titulo: "Paso 2 de 3",
          descripcion: paso2Completo
            ? "🎉 ¡Excelente! Ya sabes cómo funciona el juego."
            : "Toca el emoji del tablero que coincida con el objetivo. ¡Cuidado con los que se parecen!",
          indicacion: paso2Completo
            ? "👉 Presiona Siguiente para ver los niveles y reglas."
            : "🔍 ¡Encuentra el emoji objetivo en el tablero de arriba!",
          boton: paso2Completo ? "Siguiente ➡️" : "Encuentra el emoji... 🔍",
          disabled: !paso2Completo,
        };
      case 3:
        return {
          titulo: "Paso 3 de 3",
          descripcion: "¡Tutorial completado! El tablero crece conforme vas acertando. ¡Pon a prueba tu atención!",
          indicacion: "🏆 ¿Listo para entrenar tu atención?",
          boton: "¡A jugar! 👁️",
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
      router.push("/modulo/atencion");
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
        <Text style={S.titulo}>Juego de Atención</Text>
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

// ─── Estilos pantalla (copia exacta de stylesindex) ───────────────────────────
const S = StyleSheet.create({
  page:         { flex: 1, backgroundColor: "#ededed" },
  zonaSuperior: { flex: 0.60, width: "100%", position: "relative", justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 20 },
  titulo:       { fontSize: 34, fontWeight: "700", color: "#e93232", width: "100%", textAlign: "center", marginBottom: 4 },
  tituloLinea:  { width: 200, height: 3, backgroundColor: "#e93232", borderRadius: 999, alignSelf: "center" },
  contenedor:   { flex: 0.40, backgroundColor: "#ffffff", borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingTop: 15, paddingHorizontal: 24, paddingBottom: 20, justifyContent: "space-between", elevation: 8, shadowColor: "#000000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.15, shadowRadius: 6 },
  headerRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pasoContenedor:     { backgroundColor: "#7dc123", paddingVertical: 5, paddingHorizontal: 14, borderRadius: 8 },
  pasoTitulo:         { fontSize: 18, fontWeight: "600", color: "#fff" },
  objectContenedor:   { backgroundColor: "#f6f6f6", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  objetivoDescripcion:{ fontSize: 17, color: "#333", fontWeight: "500" },
  indicaciones:       { marginVertical: 2 },
  indicacion:         { fontSize: 17, color: "#444", fontWeight: "500" },
  filaBotones:        { width: "100%" },
  botonBaseIniciar:   { backgroundColor: "#ce540e", borderRadius: 20, paddingVertical: 2 },
  botonIniciar:       { alignItems: "center", backgroundColor: "#faa638", paddingVertical: 10, borderRadius: 20, position: "relative", top: -5 },
  textoBoton:         { color: "#fff", fontSize: 18, fontWeight: "600" },
});

// ─── Estilos locales para las demos ──────────────────────────────────────────
const CARTA_SIZE = Math.floor((Math.min(SCREEN_WIDTH, 360) - 48) / 3) - 8;

const localS = StyleSheet.create({
  demoWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  demoSubtitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#337ab7",
    marginBottom: 8,
  },
  demoHint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },

  // Objetivo paso 1
  objetivoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#337ab7",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 6,
  },
  labelObjetivo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#337ab7",
    marginBottom: 4,
  },
  emojiObjetivo: {
    fontSize: 52,
  },
  flecha: {
    fontSize: 28,
    marginVertical: 2,
  },

  // Objetivo paso 2
  objetivoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  emojiObjetivoSm: { fontSize: 32 },
  aciertosLabel:   { fontSize: 14, fontWeight: "700", color: "#7dc123", marginLeft: 6 },
  mensajeOk:       { fontSize: 13, fontWeight: "700", color: "#7dc123", marginBottom: 4 },
  mensajeError:    { fontSize: 13, fontWeight: "700", color: "#e93232", marginBottom: 4 },

  // Grid cartas
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: CARTA_SIZE * 3 + 24,
    marginTop: 4,
  },
  carta: {
    width: CARTA_SIZE,
    height: CARTA_SIZE,
    margin: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  cartaEmoji: { fontSize: CARTA_SIZE * 0.5 },

  // Niveles paso 3
  nivelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
    width: Math.min(SCREEN_WIDTH - 48, 310),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  nivelDot:   { width: 10, height: 10, borderRadius: 5 },
  nivelGrid:  { fontSize: 15, fontWeight: "900", width: 36 },
  nivelLabel: { fontSize: 13, fontWeight: "700", color: "#444", flex: 1 },
  nivelDesde: { fontSize: 11, color: "#888" },

  // Reglas paso 3
  reglaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
    width: Math.min(SCREEN_WIDTH - 48, 310),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  reglaIcono: { fontSize: 18 },
  reglaTexto: { flex: 1, fontSize: 13, color: "#444", fontWeight: "500", lineHeight: 18 },
});