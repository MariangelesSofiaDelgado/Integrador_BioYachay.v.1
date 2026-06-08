import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function JuegoVisoespacial() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      {/* Hereda automáticamente el header azul de tu layout principal */}
      <Stack.Screen options={{ title: "Juego" }} />

      <View style={styles.contenedorCentral}>
        <Text style={styles.textoModulo}>Módulo Juego</Text>
        <Text style={styles.subtexto}>Aquí irá la lógica para arrastrar y encajar las figuras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorCentral: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textoModulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7dc123", // Verde característico del botón iniciar de tu diseño
    marginBottom: 10,
  },
  subtexto: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});