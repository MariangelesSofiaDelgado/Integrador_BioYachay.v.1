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

// ─── Fondo animado con emojis flotantes ──────────────────────────────────────
const BG_EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🥝", "🍑", "🍒", "🍌", "🍈"];

function FondoAnimado() {
  const items = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      emoji: BG_EMOJIS[i % BG_EMOJIS.length],
      x: Math.random() * (SCREEN_WIDTH - 40),
      anim: new Animated.Value(Math.random()),
      duracion: 4000 + Math.random() * 4000,
      delay: -Math.random() * 6000,
      size: 22 + Math.random() * 18,
      opacity: 0.10 + Math.random() * 0.12,
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
          delay: item.delay < 0 ? 0 : item.delay,
        }).start(loop);
      };
      // Arrancar desde posición aleatoria inicial
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

// ─── PASO 1: Muestra el emoji objetivo con pulso ──────────────────────────────
function Paso1Demo() {
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 1.0, duration: 700, useNativeDriver: true }),
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
      <Text style={localS.demoHint}>Este emoji aparece arriba en cada ronda</Text>
    </View>
  );
}

// ─── PASO 2: Interactivo – toca el emoji correcto ────────────────────────────
const EMOJIS_DEMO   = ["🍊", "🍌", "🍇", "🍓", "🍎", "🥝", "🍑", "🍒", "🍈"];
const OBJETIVO_DEMO = "🍎";

function Paso2Demo({ onCompleto }: { onCompleto: () => void }) {
  const [cartas, setCartas]     = useState(EMOJIS_DEMO);
  const [objetivo, setObjetivo] = useState(OBJETIVO_DEMO);
  const [estado, setEstado]     = useState<"jugando" | "ok" | "error">("jugando");
  const [aciertos, setAciertos] = useState(0);
  const shakeX = useRef(new Animated.Value(0)).current;
  const scales = useRef(EMOJIS_DEMO.map(() => new Animated.Value(0))).current;
  const yaGano = useRef(false);

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
      <View style={localS.objetivoRow}>
        <Text style={localS.labelObjetivo}>Encuentra: </Text>
        <Text style={localS.emojiObjetivoSm}>{objetivo}</Text>
        <Text style={localS.aciertosLabel}> ✓ {aciertos}/2</Text>
      </View>
      {estado === "ok"      && <Text style={localS.mensajeOk}>✅ ¡Correcto!</Text>}
      {estado === "error"   && <Text style={localS.mensajeError}>❌ ¡Ese no es!</Text>}
      {estado === "jugando" && <Text style={localS.demoHint}>Toca el emoji que coincida</Text>}
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
    { icono: "⚡", texto: "El tablero se baraja en cada acierto." },
    { icono: "📈", texto: "Más aciertos = tablero más grande." },
    { icono: "⏱️", texto: "Tienes 60 segundos para jugar." },
  ];
  const scales = useRef(
    [...niveles, ...reglas].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    scales.forEach((s, i) => {
      setTimeout(() => {
        Animated.spring(s, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }, i * 120);
    });
  }, [scales]);

  return (
    <View style={localS.demoWrap}>
      <Text style={localS.demoSubtitulo}>Niveles de dificultad</Text>
      {niveles.map((n, i) => (
        <Animated.View key={i} style={[localS.nivelRow, { transform: [{ scale: scales[i] }] }]}>
          <View style={[localS.nivelDot, { backgroundColor: n.color }]} />
          <Text style={[localS.nivelGrid, { color: n.color }]}>{n.grid}</Text>
          <Text style={localS.nivelLabel}>{n.label}</Text>
          <Text style={localS.nivelDesde}>{n.desde}</Text>
        </Animated.View>
      ))}
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


// ─── Pantalla del tutorial interactivo (3 pasos) ────────────────────────────
function PantallaTutorial({ onCerrar }: { onCerrar: () => void }) {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [paso2Completo, setPaso2Completo] = useState(false);

  const INFO = {
    1: {
      descripcion: "Encuentra el emoji objetivo en el tablero.",
      instrucciones: [
        "👁️ Memoriza el emoji que aparece arriba.",
        "🔍 Búscalo entre todos los del tablero.",
        "⚡ ¡Tócalo lo más rápido que puedas!",
      ],
    },
    2: {
      descripcion: "¡Practica tocando el emoji correcto!",
      instrucciones: [
        "🎯 Toca el emoji que coincida con el objetivo.",
        "❌ Si te equivocas, el tablero vibra.",
        "✅ Acierta 2 veces para continuar.",
      ],
    },
    3: {
      descripcion: "¡Listo para jugar de verdad!",
      instrucciones: [
        "📈 El tablero crece con cada acierto.",
        "⏱️ Tienes 60 segundos por partida.",
        "🏆 ¡Intenta superar tu récord!",
      ],
    },
  } as const;

  const info = INFO[paso as 1 | 2 | 3];
  const disabled = paso === 2 ? !paso2Completo : false;

  const avanzar = () => {
    if (paso < 3) setPaso(p => p + 1);
    else { onCerrar(); router.push("/modulo/atencion/juego"); }
  };

  return (
    <View style={S.page}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#e93232" },
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
          <Pressable style={S.botonRojo} onPress={onCerrar}>
            <Text style={S.textoBoton}>← Volver</Text>
          </Pressable>
          <Pressable
            style={[S.botonNaranja, disabled && S.botonDeshabilitado]}
            onPress={avanzar}
            disabled={disabled}
          >
            <Text style={S.textoBoton}>{paso < 3 ? "Siguiente ➡️" : "¡A jugar! 🎮"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla de inicio del módulo ───────────────────────────────────────────
export default function TutorialAtencion() {
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
        <Text style={S.titulo}>Juego de Atención</Text>
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
          <Text style={S.descripcionTexto}>Encuentra el emoji objetivo en el tablero.</Text>
        </View>

        <View style={S.instruccionesBadge}>
          <Text style={S.instruccionesBadgeTexto}>Instrucciones</Text>
        </View>

        <View style={S.listaInstrucciones}>
          <Text style={S.instruccionLinea}>👁️ Memoriza el emoji objetivo que aparece arriba.</Text>
          <Text style={S.instruccionLinea}>🔍 Búscalo rápido entre todos los del tablero.</Text>
          <Text style={S.instruccionLinea}>⚡ ¡Tócalo antes de que se acabe el tiempo!</Text>
        </View>

        <View style={S.filaBotones}>
          <Pressable style={S.botonRojo} onPress={() => setVerTutorial(true)}>
            <Text style={S.textoBoton}>Tutorial</Text>
          </Pressable>
          <Pressable
            style={S.botonNaranja}
            onPress={() => router.push("/modulo/atencion/juego")}
          >
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
    color: "#e93232",
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#faa638",
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
  botonRojo: {
    flex: 1,
    backgroundColor: "#e93232",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botonNaranja: {
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
    fontSize: 15,
    fontWeight: "700",
    color: "#337ab7",
    marginBottom: 8,
  },
  demoHint: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    fontWeight: "500",
  },
  objetivoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#337ab7",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 4,
  },
  labelObjetivo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#337ab7",
    marginBottom: 4,
  },
  emojiObjetivo: {
    fontSize: 54,
  },
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
  emojiObjetivoSm: { fontSize: 34 },
  aciertosLabel:   { fontSize: 15, fontWeight: "700", color: "#7dc123", marginLeft: 6 },
  mensajeOk:       { fontSize: 14, fontWeight: "700", color: "#7dc123", marginBottom: 4 },
  mensajeError:    { fontSize: 14, fontWeight: "700", color: "#e93232", marginBottom: 4 },
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
  nivelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
    width: Math.min(SCREEN_WIDTH - 48, 310),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  nivelDot:   { width: 10, height: 10, borderRadius: 5 },
  nivelGrid:  { fontSize: 16, fontWeight: "900", width: 38 },
  nivelLabel: { fontSize: 14, fontWeight: "700", color: "#444", flex: 1 },
  nivelDesde: { fontSize: 12, color: "#888" },
  reglaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
    width: Math.min(SCREEN_WIDTH - 48, 310),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  reglaIcono: { fontSize: 18 },
  reglaTexto: { flex: 1, fontSize: 14, color: "#444", fontWeight: "500", lineHeight: 20 },
});