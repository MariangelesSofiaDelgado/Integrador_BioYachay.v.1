import { StyleSheet, Text, View } from "react-native";

export default function ModuloVisoespacial() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>VISOESPACIAL</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Visoespacial.</Text>
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
  },
});

export default function ModuloVisoespacial() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>VISOESPACIAL</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Visoespacial.</Text>

      {/*
        Imagen del juego de Visoespacial (se agregara despues)
        <Image source={require("../../assets/images/visoespacial-juego.png")} style={styles.imagenModulo} />
      */}
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
  },
});