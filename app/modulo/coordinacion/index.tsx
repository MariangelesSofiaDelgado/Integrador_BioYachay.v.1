import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ModuloCoordinacion() {
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>COORDINACION</Text>
      <Text style={styles.descripcion}>Aqui podras iniciar el juego del modulo de Coordinacion.</Text>

      <View style={styles.espacioJuego}>
        <Text style={styles.textoEspacio}>Espacio previo del juego.</Text>
      </View>

      <Pressable style={styles.botonIniciar} onPress={() => router.push("/modulo/coordinacion/juego")}>
        <Text style={styles.textoBoton}>Iniciar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ececec",
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2f5279",
    textAlign: "center",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 17,
    color: "#4b4b4b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  espacioJuego: {
    height: 180,
    borderWidth: 1,
    borderColor: "#c9c9c9",
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  textoEspacio: {
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  botonIniciar: {
    alignSelf: "center",
    backgroundColor: "#2f5279",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});