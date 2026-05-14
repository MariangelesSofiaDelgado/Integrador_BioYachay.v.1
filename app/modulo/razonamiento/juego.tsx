import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
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

  // Valores de Animación
  const scaleTarget = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const animTargetStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scaleTarget.value) }],
  }));

  const animContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const generarNuevaRonda = () => {
  // 1. Primero generamos y ordenamos los números
  const nuevosNumeros = generarNumeros().sort((a, b) => a - b);
  
  // 2. Elegimos 2 o 3 números ALEATORIOS de esa lista para crear el objetivo
  // Esto garantiza que la suma SIEMPRE exista en el tablero
  const indice1 = Math.floor(Math.random() * nuevosNumeros.length);
  let indice2 = Math.floor(Math.random() * nuevosNumeros.length);
  while (indice2 === indice1) indice2 = Math.floor(Math.random() * nuevosNumeros.length);
  
  let sumaSegura = nuevosNumeros[indice1] + nuevosNumeros[indice2];
  
  // Opcional: sumar un tercero para variar
  if (Math.random() > 0.5) {
    let indice3 = Math.floor(Math.random() * nuevosNumeros.length);
    if (indice3 !== indice1 && indice3 !== indice2) {
      sumaSegura += nuevosNumeros[indice3];
    }
  }

  setNumbers(nuevosNumeros);
  setTarget(sumaSegura); // Ahora el target siempre es una combinación posible
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
      setTimeout(generarNuevaRonda, 300); // Pequeño delay para ver la suma
      return;
    }

    if (newSum > target) {
      // Animación de ERROR (Vibración)
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      
      setErrores((prev) => prev + 1);
      setSelectedIndices([]);
      setCurrentSum(0);
      return;
    }
  };

  // Pantalla de resultados (Mantén tu código actual aquí...)
  if (juegoTerminado) {
    return (
      <View style={styles.contenedor}>
         <Text style={[styles.titulo, { color: "#2f5279" }]}>JUEGO TERMINADO</Text>
         {/* ... Resto de tu vista de resultados ... */}
         <Pressable style={styles.botonVolver} onPress={() => router.replace("/modulo/razonamiento") }>
           <Text style={styles.textoBoton}>Volver</Text>
         </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, animContainerStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Suma Números</Text>
        </View>

        <View style={styles.targetContainer}>
          <Animated.View style={[styles.outerCircle, animTargetStyle]}>
            <View style={styles.innerCircle}>
              <Text style={styles.targetText}>{target}</Text>
            </View>
          </Animated.View>
          {/* Muestra la suma actual debajo del círculo */}
          <Text style={{fontSize: 20, color: '#3D7EB7', marginTop: 10, fontWeight: 'bold'}}>
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

// Componente para la ficha con animación individual
function FichaAnimada({ num, seleccionado, onPress }: any) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = seleccionado ? withSpring(0.9) : withSpring(1);
  }, [seleccionado]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(seleccionado ? 0.7 : 1),
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Animated.View style={[
        styles.carta, 
        seleccionado && styles.selectedBox,
        animatedStyle
      ]}>
        <Text style={[styles.simbolo, seleccionado && {color: 'white'}]}>{num}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}