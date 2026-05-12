import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylesindex";

const frutas = ["🍎","🍊","🍌","🍇","🍐","🍉","🍓","🥝","🍍"];

export default function ModuloAtencion() {
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>ATENCIÓN</Text>
      <Text style={styles.descripcion}>
        Aquí podrás iniciar el juego del módulo de Atención.
      </Text>

      {/* Espacio de juego previo con 9 cartas */}
      <View style={styles.espacioJuego}>
        <View style={styles.grid}>
          {frutas.map((fruta, index) => (
            <View key={index} style={styles.carta}>
              <Text style={styles.simbolo}>{fruta}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Indicaciones simples */}
      <View style={styles.indicaciones}>
        <Text style={styles.indicacion}>👉 Debes encontrar la fruta indicada.</Text>
        <Text style={styles.indicacion}>👉 Concéntrate y recuerda bien su posición.</Text>
        <Text style={styles.indicacion}>👉 Tienes un tiempo limitado para responder.</Text>
      </View>

      {/* Botón iniciar */}
      <Pressable
        style={styles.botonIniciar}
        onPress={() => router.push("/modulo/atencion/juego")}
      >
        <Text style={styles.textoBoton}>Iniciar</Text>
      </Pressable>
    </View>
  );
}
