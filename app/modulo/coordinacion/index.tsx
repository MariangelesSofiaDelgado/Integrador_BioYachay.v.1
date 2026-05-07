import { StyleSheet, Text, View } from "react-native";

export default function ModuloCoordinacion() {
  return (
    <View style={styles.contenedor}>
<<<<<<< Updated upstream:app/modulo/coordinacion/index.tsx
      <Text style={styles.titulo}>COORDINACION</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Coordinacion.</Text>

      {/*
        Imagen del juego de Coordinacion (se agregara despues)
        <Image source={require("../../assets/images/coordinacion-juego.png")} style={styles.imagenModulo} />
      */}
=======
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

export default function ModuloAtencion() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>ATENCION</Text>
      <Text style={styles.descripcion}>Aqui ira el juego propio del modulo de Atencion.</Text>
>>>>>>> Stashed changes:app/modulo/atencion.tsx
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