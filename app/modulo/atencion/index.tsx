import { StyleSheet, Text, View } from "react-native";

export default function ModuloAtencion() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>ATENCION</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Atencion.</Text>
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
