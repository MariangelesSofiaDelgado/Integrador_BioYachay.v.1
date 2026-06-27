import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles/stylesjuego";

const CANTIDAD_NUMEROS = 6;
const TIEMPO_TOTAL = 60;

const generarNumeros = () =>
  Array.from({ length: CANTIDAD_NUMEROS }, () => Math.floor(Math.random() * 9) + 1);

const generarObjetivo = (numeros: number[]) => {
  const base = numeros[0] + numeros[1];
  const extra = numeros.length > 2 && Math.random() > 0.5 ? numeros[2] : 0;
  return base + extra;
};

export default function JuegoSuma() {
  const router = useRouter();

  // Estados
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(13);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentSum, setCurrentSum] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // Valores de Animación (Animated nativo en lugar de reanimated)
  const scaleTarget = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  const generarNuevaRonda = () => {
    // 1. genera y ordenamos los números
    const nuevosNumeros = generarNumeros().sort((a, b) => a - b);

    // 2. Elige 2 o 3 números ALEATORIOS de esa lista para crear el objetivo
    const indice1 = Math.floor(Math.random() * nuevosNumeros.length);
    let indice2 = Math.floor(Math.random() * nuevosNumeros.length);
    while (indice2 === indice1) indice2 = Math.floor(Math.random() * nuevosNumeros.length);

    let sumaSegura = nuevosNumeros[indice1] + nuevosNumeros[indice2];

    if (Math.random() > 0.5) {
      let indice3 = Math.floor(Math.random() * nuevosNumeros.length);
      if (indice3 !== indice1 && indice3 !== indice2) {
        sumaSegura += nuevosNumeros[indice3];
      }
    }

    setNumbers(nuevosNumeros);
    setTarget(sumaSegura);
    setSelectedIndices([]);
    setCurrentSum(0);
  };

  useEffect(() => { generarNuevaRonda(); }, []);

  useEffect(() => {
    if (juegoTerminado) return;
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJuegoTerminado(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [juegoTerminado]);

  const dispararShake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const dispararPulso = () => {
    Animated.spring(scaleTarget, { toValue: 1.15, useNativeDriver: true }).start(() => {
      Animated.spring(scaleTarget, { toValue: 1, useNativeDriver: true }).start();
    });
  };

  const handlePress = (index: number) => {
    if (juegoTerminado) return;

    if (selectedIndices.includes(index)) {
      setSelectedIndices((prev) => prev.filter((i) => i !== index));
      setCurrentSum((prev) => prev - numbers[index]);
      return;
    }

    const newSum = currentSum + numbers[index];
    const nuevosSeleccionados = [...selectedIndices, index];

    setSelectedIndices(nuevosSeleccionados);
    setCurrentSum(newSum);

    if (newSum === target) {
      setAciertos((prev) => prev + 1);
      dispararPulso();
      setTimeout(generarNuevaRonda, 300);
      return;
    }

    if (newSum > target) {
      dispararShake();
      setErrores((prev) => prev + 1);
      setSelectedIndices([]);
      setCurrentSum(0);
      return;
    }
  };

  if (juegoTerminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={[styles.titulo, { color: "#2f5279" }]}>JUEGO TERMINADO</Text>
        {/* ... Resto de tu vista de resultados ... */}
        <Pressable style={styles.botonVolver} onPress={() => router.replace("/modulo/razonamiento")}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { transform: [{ translateX: shakeX }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Suma Números</Text>
        </View>

        <View style={styles.targetContainer}>
          <Animated.View style={[styles.outerCircle, { transform: [{ scale: scaleTarget }] }]}>
            <View style={styles.innerCircle}>
              <Text style={styles.targetText}>{target}</Text>
            </View>
          </Animated.View>

          <Text style={{ fontSize: 20, color: '#3D7EB7', marginTop: 10, fontWeight: 'bold' }}>
            Suma actual: {currentSum}
          </Text>
        </View>

        <Text style={styles.marcador}>
          ✓ {aciertos} | ✗ {errores} | ⏱️ {tiempoRestante}s
        </Text>

        <View style={styles.grid}>
          {numbers.map((num, index) => {
            const seleccionado = selectedIndices.includes(index);
            return (
              <FichaAnimada
                key={index}
                num={num}
                seleccionado={seleccionado}
                onPress={() => handlePress(index)}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.botonIniciar} onPress={() => setJuegoTerminado(true)}>
          <Text style={styles.textoBoton}>Finalizar</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

function FichaAnimada({ num, seleccionado, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: seleccionado ? 0.9 : 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: seleccionado ? 0.7 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [seleccionado]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Animated.View style={[
        styles.carta,
        seleccionado && styles.selectedBox,
        { transform: [{ scale }], opacity },
      ]}>
        <Text style={[styles.simbolo, seleccionado && { color: 'white' }]}>{num}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}