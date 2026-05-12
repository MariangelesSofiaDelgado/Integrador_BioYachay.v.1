import { StyleSheet, Text, View } from "react-native";

export default function CognitivasJuego() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>JUEGO DE COGNITIVAS</Text>
      <Text style={styles.descripcion}>Aqui se implementara el juego de Cognitivas.</Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#2f5279",
    textAlign: "center",
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: "#4b4b4b",
    textAlign: "center",
  },
});
