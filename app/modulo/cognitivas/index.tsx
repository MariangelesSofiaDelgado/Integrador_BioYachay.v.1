import { StyleSheet, Text, View } from "react-native";

export default function ModuloCognitivas() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>COGNITIVAS</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Cognitivas.</Text>

      {/*
        Imagen del juego de Cognitivas (se agregara despues)
        <Image source={require("../../assets/images/cognitivas-juego.png")} style={styles.imagenModulo} />
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
