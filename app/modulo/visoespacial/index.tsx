import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import styles from "../visoespacial/styles/stylesindex";

export default function MenuVisoespacial() {
  const router = useRouter();

  // --- ANIMACIÓN DEL TRIÁNGULO ---
  const animacionTrianguloY = useRef(new Animated.Value(0)).current;
  const opacidadTriangulo = useRef(new Animated.Value(1)).current;

  // --- ANIMACIÓN DEL CÍRCULO ---
  const animacionCirculoY = useRef(new Animated.Value(0)).current;
  const opacidadCirculo = useRef(new Animated.Value(1)).current;

 useEffect(() => {
    const bucleTutorial = Animated.loop(
      Animated.parallel([
        
        // --- SECUENCIA DEL TRIÁNGULO ---
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(animacionTrianguloY, {
            toValue: 58, // 👈 Ajustado de 65 a 53 para que frene exacto en el centro
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.delay(600),
          Animated.timing(opacidadTriangulo, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(animacionTrianguloY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacidadTriangulo, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),

        // --- SECUENCIA DEL CÍRCULO ---
        Animated.sequence([
          Animated.delay(1100),
          Animated.timing(animacionCirculoY, {
            toValue: 58, // 👈 Ajustado de 65 a 53 también
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.delay(600),
          Animated.timing(opacidadCirculo, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(animacionCirculoY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacidadCirculo, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])

      ])
    );

    bucleTutorial.start();
    return () => bucleTutorial.stop();
  }, [animacionTrianguloY, opacidadTriangulo, animacionCirculoY, opacidadCirculo]);

  return (
    <View style={styles.page}>
      <Stack.Screen options={{}} />

      {/* --- INTERFAZ SUPERIOR (ZONA GRIS) --- */}
      <View style={styles.zonaSuperior}>
        <Text style={styles.titulo}>Encaja las Formas</Text>
        <View style={styles.tituloLinea} />

      {/* Contenedor de la Previsualización de Guía */}
        <View style={styles.espacioGrisLibre}>
          <View style={{ flexDirection: "row", gap: 65, justifyContent: "center", alignItems: "center" }}>
            
            {/* Ejemplo 1: Triángulo */}
            <View style={{ alignItems: "center", height: 130, justifyContent: "flex-start" }}>
              <Animated.Text 
                style={{ 
                  fontSize: 40,
                  transform: [{ translateY: animacionTrianguloY }],
                  opacity: opacidadTriangulo,
                  zIndex: 5,
                  height: 45,
                  top: -20,
                }}
              >
                🔺
              </Animated.Text>
              
              <View style={{ width: 52, height: 52, borderWidth: 2, borderColor: "#999", borderStyle: "dashed", borderRadius: 12, marginTop: -3, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, opacity: 0.12 }}>🔺</Text>
              </View>
            </View>

            {/* Ejemplo 2: Círculo */}
            <View style={{ alignItems: "center", height: 130, justifyContent: "flex-start" }}>
              <Animated.Text 
                style={{ 
                  fontSize: 40,
                  transform: [{ translateY: animacionCirculoY }],
                  opacity: opacidadCirculo,
                  zIndex: 5,
                  height: 45,
                  top: -20,
                }}
              >
                🔵
              </Animated.Text>
              
              <View style={{ width: 52, height: 52, borderWidth: 2, borderColor: "#999", borderStyle: "dashed", borderRadius: 12, marginTop: -3, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, opacity: 0.12 }}>🔵</Text>
              </View>
            </View>

          </View>
        </View>
      </View>

      {/* --- TARJETA BLANCA RESPONSIVA --- */}
      <View style={styles.contenedor}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Fila Objetivo */}
          <View style={styles.headerRow}>
            <View style={styles.objetivoContenedor}>
              <Text style={styles.objetivoTitulo}>Objetivo</Text>
            </View>
          </View>
          
          <View style={styles.objectContenedor}>
            <Text style={styles.objetivoDescripcion}>
              Fortalecer la percepción y orientación espacial
            </Text>
          </View>

          {/* Fila Instrucciones */}
          <View style={styles.headerRow}>
            <View style={styles.instruccionesContenedor}>
              <Text style={styles.instruccionesTitulo}>Instrucciones</Text>
            </View>
          </View>
          
          <View style={styles.indicaciones}>
            <Text style={styles.indicacion}>🧩 Observa las figuras de colores en la parte superior.</Text>
            <Text style={styles.indicacion}>👆 Arrastra cada figura libremente por la pantalla.</Text>
            <Text style={styles.indicacion}>🎯 Suéltala sobre su silueta punteada para encajarla.</Text>
          </View>

          {/* --- FILA DE BOTONES DE ACCIÓN --- */}
          <View style={styles.filaBotones}>
            
            {/* Botón Tutorial */}
            <View style={styles.botonBaseTutorial}>
              <Pressable 
                style={styles.botonTutorial}
                onPress={() => router.push("/modulo/visoespacial/tutorial")} // 👈 Ruta absoluta corregida
              >
                <Text style={styles.textoBoton}>Tutorial</Text>
              </Pressable>
            </View>

            {/* Botón Iniciar */}
            <View style={styles.botonBaseIniciar}>
              <Pressable 
                style={styles.botonIniciar}
                onPress={() => router.push("/modulo/visoespacial/juego")} // 👈 Ruta absoluta corregida
              >
                <Text style={styles.textoBoton}>Iniciar</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </View>

    </View>
  );
}