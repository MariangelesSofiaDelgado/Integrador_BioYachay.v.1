import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, ViewStyle } from "react-native";

interface TutorialBubbleProps {
  texto: string;
  emoji?: string;
  style?: ViewStyle;
}

export function TutorialBubble({ texto, emoji = "👉", style }: TutorialBubbleProps) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const traslado = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacidad.setValue(0);
    traslado.setValue(10);
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(traslado, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [texto]);

  return (
    <Animated.View
      style={[
        styles.burbuja,
        style,
        { opacity: opacidad, transform: [{ translateY: traslado }] },
      ]}
    >
      <Text style={styles.burbujaTexto}>
        {emoji} {texto}
      </Text>
      <View style={styles.colita} />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// WRAPPER DE SEÑALAMIENTO VISUAL (pulse + shake para inactividad)
// ─────────────────────────────────────────────────────────────
interface ResaltadoAyudaProps {
  /** Cuando es true, el contenido empieza a animarse (pulse + shake) */
  activo: boolean;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[]; 
}

/**
 * Envuelve cualquier botón/elemento interactivo. Cuando `activo` es true
 * (el usuario lleva 8s+ sin actuar), aplica:
 *  - Pulse: escala 1 -> 1.08 -> 1, en loop.
 *  - Shake: pequeño vaivén horizontal, en loop.
 * Ambas animaciones corren en paralelo para máxima llamada de atención
 * sin ser tan agresivas como para frustrar al usuario.
 */
export function ResaltadoAyuda({ activo, children, style }: ResaltadoAyudaProps) {
  const escala = useRef(new Animated.Value(1)).current;
  const vaiven = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (activo) {
      loopRef.current = Animated.loop(
        Animated.parallel([
          // Pulse
          Animated.sequence([
            Animated.timing(escala, { toValue: 1.08, duration: 450, useNativeDriver: true }),
            Animated.timing(escala, { toValue: 1, duration: 450, useNativeDriver: true }),
          ]),
          // Shake suave (vaivén lateral)
          Animated.sequence([
            Animated.timing(vaiven, { toValue: 6, duration: 120, useNativeDriver: true }),
            Animated.timing(vaiven, { toValue: -6, duration: 120, useNativeDriver: true }),
            Animated.timing(vaiven, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.delay(660), // pausa antes de repetir, para que no sea constante
          ]),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      escala.setValue(1);
      vaiven.setValue(0);
    }

    return () => loopRef.current?.stop();
  }, [activo]);

  return (
    <Animated.View
      style={[style, { transform: [{ scale: escala }, { translateX: vaiven }] }]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  burbuja: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: "90%",
    alignSelf: "center",
  },
  burbujaTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
  },
  colita: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "45deg" }],
  },
});