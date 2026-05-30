import { Stack, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import styles from "./styles/stylestutorial";

export default function Tutorial() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      {/* Misma configuración del header nativo */}
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
        <Text style={styles.titulo}>Módulo Tutorial</Text>
        <View style={styles.tituloLinea} />
      </View>

    </View>
  );
}