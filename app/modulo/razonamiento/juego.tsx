import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
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

  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(13);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentSum, setCurrentSum] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const generarNuevaRonda = () => {
    const nuevosNumeros = generarNumeros();
    setNumbers(nuevosNumeros);
    setTarget(generarObjetivo(nuevosNumeros));
    setSelectedIndices([]);
    setCurrentSum(0);
  };

  useEffect(() => {
    generarNuevaRonda();
  }, []);

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
      generarNuevaRonda();
      return;
    }

    if (newSum > target) {
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

        <View style={styles.resumenContainer}>
          <Text style={styles.resumenTexto}>
            Aciertos: <Text style={{ color: "#4CAF50", fontSize: 24, fontWeight: "bold" }}>{aciertos}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Errores: <Text style={{ color: "#F44336", fontSize: 24, fontWeight: "bold" }}>{errores}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Precisión: <Text style={{ color: "#2f5279", fontSize: 20, fontWeight: "bold" }}>
              {aciertos + errores > 0 ? Math.round((aciertos / (aciertos + errores)) * 100) : 0}%
            </Text>
          </Text>
        </View>

        <Pressable style={styles.botonVolver} onPress={() => router.replace("/modulo/razonamiento") }>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Suma Números</Text>
      </View>

      <View style={styles.targetContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.targetText}>{target}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.marcador}>
        ✓ {aciertos} | ✗ {errores} | ⏱️ {tiempoRestante}s
      </Text>

      <View style={styles.grid}>
        {numbers.map((num, index) => {
          const seleccionado = selectedIndices.includes(index);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.carta,
                seleccionado && styles.selectedBox,
              ]}
              onPress={() => handlePress(index)}
            >
              <Text style={styles.simbolo}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.botonIniciar} onPress={() => setJuegoTerminado(true)}>
        <Text style={styles.textoBoton}>Finalizar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}