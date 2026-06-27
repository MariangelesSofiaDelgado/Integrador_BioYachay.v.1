import React, { useEffect, useRef } from "react";
import { Animated, TextStyle } from "react-native";

interface FlechaIndicadoraProps {
  direccion: "izquierda" | "derecha" | null;
  style?: TextStyle;
}
export function FlechaIndicadora({ direccion, style }: FlechaIndicadoraProps) {
  const desplazamiento = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!direccion) {
      loopRef.current?.stop();
      desplazamiento.setValue(0);
      return;
    }

    const signo = direccion === "derecha" ? 1 : -1;

    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(desplazamiento, {
          toValue: 14 * signo,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(desplazamiento, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );
    loopRef.current.start();

    return () => loopRef.current?.stop();
  }, [direccion]);

  if (!direccion) return null;

  return (
    <Animated.Text
      style={[
        { fontSize: 46, transform: [{ translateX: desplazamiento }] },
        style,]}
    >
      {direccion === "derecha" ? "➡️" : "⬅️"}
    </Animated.Text>
  );
}