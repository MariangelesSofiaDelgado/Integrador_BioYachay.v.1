import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./../atencion/styles/stylesjuego";

export default function AtencionJuego() {
  const [cantidadObjetos, setCantidadObjetos] = useState(1);
  const [cuadricula, setCuadricula] = useState("3x3");
  const [tiempoMemorizar, setTiempoMemorizar] = useState(30);
  const [tiempoJuego, setTiempoJuego] = useState(60);
  const router = useRouter();

  // 🔹 Función que genera las cartas en blanco (solo "?")
  const generarCartas = () => {
    const size = parseInt(cuadricula[0]);
    const total = size * size;
    const cartas = [];
    for (let i = 0; i < total; i++) {
      cartas.push(
        <View key={i} style={styles.carta}>
          <Text style={styles.simbolo}>❓</Text>
        </View>
      );
    }
    return cartas;
  };

  // 🔹 Iniciar el juego - navega a iniciarjuego pasando parámetros
  const iniciarJuego = () => {
    router.push({
      pathname: "/modulo/atencion/iniciarjuego",
      params: {
        cantidadObjetos: cantidadObjetos.toString(),
        cuadricula,
        tiempoMemorizar: tiempoMemorizar.toString(),
        tiempoJuego: tiempoJuego.toString(),
      },
    });
  };

  // 🔹 Ancho dinámico del grid según columnas
  const size = parseInt(cuadricula[0]);
  const gridWidth = size * 70;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>JUEGO DE ATENCIÓN</Text>
      <Text style={styles.descripcion}>
        Configura las opciones antes de iniciar el juego.
      </Text>

      {/* Navbar con configuraciones */}
      <View style={styles.navbar}>
        <View style={styles.opcion}>
          <Text style={styles.label}>Objetos:</Text>
          <Picker
            selectedValue={cantidadObjetos}
            style={styles.picker}
            onValueChange={(value) => setCantidadObjetos(value)}
          >
            <Picker.Item label="1" value={1} />
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
          </Picker>
        </View>

        <View style={styles.opcion}>
          <Text style={styles.label}>Cuadrícula:</Text>
          <Picker
            selectedValue={cuadricula}
            style={styles.picker}
            onValueChange={(value) => setCuadricula(value)}
          >
            <Picker.Item label="3x3" value="3x3" />
            <Picker.Item label="4x4" value="4x4" />
            <Picker.Item label="5x5" value="5x5" />
          </Picker>
        </View>

        <View style={styles.opcion}>
          <Text style={styles.label}>Tiempo Memorizar:</Text>
          <Picker
            selectedValue={tiempoMemorizar}
            style={styles.picker}
            onValueChange={(value) => setTiempoMemorizar(value)}
          >
            <Picker.Item label="15 seg" value={15} />
            <Picker.Item label="30 seg" value={30} />
            <Picker.Item label="45 seg" value={45} />
          </Picker>
        </View>

        <View style={styles.opcion}>
          <Text style={styles.label}>Duración Juego:</Text>
          <Picker
            selectedValue={tiempoJuego}
            style={styles.picker}
            onValueChange={(value) => setTiempoJuego(value)}
          >
            <Picker.Item label="30 seg" value={30} />
            <Picker.Item label="60 seg" value={60} />
            <Picker.Item label="90 seg" value={90} />
          </Picker>
        </View>
      </View>

      {/* Cartas con símbolo de ? */}
      <View style={[styles.grid, { width: gridWidth }]}>
        {generarCartas()}
      </View>

      {/* Botón Iniciar Juego */}
      <Pressable style={styles.botonIniciar} onPress={iniciarJuego}>
        <Text style={styles.textoBoton}>Iniciar Juego</Text>
      </Pressable>
    </View>
  );
}
