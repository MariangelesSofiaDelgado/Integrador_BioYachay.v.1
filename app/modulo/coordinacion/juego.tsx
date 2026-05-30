import { Stack, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import styles from "./styles/stylesjuego";

export default function Juego() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      {/* Configuramos el Stack nativo para que pinte EXACTAMENTE 
        la misma barra azul del index, pero cambiando el texto a vacío 
        para que no estorbe. La flecha blanca aparece sola automáticamente.
      */}
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#337ab7" },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }} 
      />

      {/* --- INTERFAZ SUPERIOR (ZONA GRIS) REPLICADA DEL INDEX --- */}
      <View style={styles.zonaSuperior}>
        <Text style={styles.titulo}>Módulo Juego</Text>
        <View style={styles.tituloLinea} />
      </View>

    </View>
  );
}