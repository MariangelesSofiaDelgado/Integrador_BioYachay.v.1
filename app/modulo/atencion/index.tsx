import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylesindex";


export default function ModuloAtencion() {
  const router = useRouter();
  const [dificultad, setDificultad] = useState("normal");

  // Mapear dificultad a cuadrícula
  const getDificultadConfig = (diff: string) => {
    switch (diff) {
      case "facil":
        return "3x3";
      case "normal":
        return "4x4";
      case "dificil":
        return "5x5";
      default:
        return "3x3";
    }
  };

  const iniciarJuego = () => {
    router.push({
      pathname: "/modulo/atencion/juego",
      params: {
        dificultad,
        cuadricula: getDificultadConfig(dificultad),
      },
    });
  };

  const frutas = ["🍎", "🍊", "🍌", "🍇", "🍐", "🍉", "🍓", "🥝", "🍍"];

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>ATENCIÓN</Text>
      <Text style={styles.descripcion}>
        Escoge la dificultad y comienza. Tienes 60 segundos para acumular la mayor cantidad de aciertos.
      </Text>

      {/* Vista previa de cartas */}
      <View style={styles.espacioJuego}>
        <View style={styles.grid}>
          {frutas.map((fruta, index) => (
            <View key={index} style={styles.carta}>
              <Text style={styles.simbolo}>{fruta}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navbar con dificultad */}
      <View style={styles.navbar}>
        <View style={styles.opcion}>
          <Text style={styles.label}>Dificultad:</Text>
          <Picker
            selectedValue={dificultad}
            style={styles.picker}
            onValueChange={(value) => setDificultad(value)}
          >
            <Picker.Item label="Fácil (3x3)" value="facil" />
            <Picker.Item label="Normal (4x4)" value="normal" />
            <Picker.Item label="Difícil (5x5)" value="dificil" />
          </Picker>
        </View>
      </View>

      {/* Tiempo total */}
      <Text style={styles.tiempoInfo}>⏱️ Tiempo total: 60 segundos</Text>

      {/* Indicaciones */}
      <View style={styles.indicaciones}>
        <Text style={styles.indicacion}>👉 Haz clic en el objeto que se te indique.</Text>
        <Text style={styles.indicacion}>👉 Completa rondas en 60 segundos.</Text>
        <Text style={styles.indicacion}>👉 Sé rápido y preciso.</Text>
      </View>

      {/* Botón iniciar */}
      <Pressable style={styles.botonIniciar} onPress={iniciarJuego}>
        <Text style={styles.textoBoton}>Iniciar</Text>
      </Pressable>
    </View>
  );
}
