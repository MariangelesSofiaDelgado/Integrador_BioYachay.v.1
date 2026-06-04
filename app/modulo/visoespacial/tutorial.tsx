import { useRouter, Stack } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { Text, View, Pressable, PanResponder, Animated, LayoutChangeEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../visoespacial/styles/stylestutorial";

// --- TAMAÑOS REALES Y EXACTOS EN PÍXELES ---
const TAMANO_TRIANGULO = 55; 
const TAMANO_CIRCULO = 45;   

const PASOS_TUTORIAL = {
  1: {
    titulo: "Paso 1 de 3",
    descripcion: "Prueba moviendo las figuras libres.",
    indicacion: "👆 Mantén presionado el triángulo 🔺 o el círculo 🔵 con tu dedo y arrástralos libremente por el espacio gris sin que se salgan.",
    boton: "Siguiente",
  },
  2: {
    titulo: "Paso 2 de 3",
    descripcion: "Ahora, intenta encajar la figura.",
    indicacion: "🎯 Arrastra el triángulo 🔺 hacia abajo y colócalo justo dentro de su molde punteado para lograr encajarlo.",
    boton: "Continuar",
  },
  3: {
    titulo: "¡Excelente!",
    descripcion: "Has aprendido a encajar las formas perfectamente.",
    indicacion: "🎯 Ya estás listo para poner a prueba tu percepción espacial con diferentes figuras, velocidades y desafíos. ¡A ganar!",
    boton: "Finalizar",
  },
};

export default function TutorialVisoespacial() {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [haMovidoPaso1, setHaMovidoPaso1] = useState(false);
  const [figuraEncajada, setFiguraEncajada] = useState(false);

  // --- MEDIDAS RESPONSIVAS DEL CONTENEDOR GRIS ---
  const limites = useRef({ ancho: 0, alto: 0 });

  // --- POSICIONES ANIMADAS NATIVAS ABSOLUTAS ---
  const panTriangulo = useRef(new Animated.ValueXY({ x: 40, y: 120 })).current;
  const panCirculo = useRef(new Animated.ValueXY({ x: 180, y: 120 })).current;

  const ultimaPosTriangulo = useRef({ x: 40, y: 120 });
  const ultimaPosCirculo = useRef({ x: 180, y: 120 });

  const medirContenedorGris = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    limites.current = { ancho: width, alto: height };
  };

  // --- REPOSICIONAR TRIÁNGULO AL ENTRAR AL PASO 2 ---
  useEffect(() => {
    if (paso === 2) {
      // Centramos el triángulo en X y lo ponemos arriba en Y listo para bajar
      const posXInicial = limites.current.ancho / 2 - TAMANO_TRIANGULO / 2 || 140;
      const posYInicial = 40; 
      
      panTriangulo.setValue({ x: posXInicial, y: posYInicial });
      ultimaPosTriangulo.current = { x: posXInicial, y: posYInicial };
    }
  }, [paso]);

  // --- TRATAMIENTO DE BORDES MATEMÁTICOS PERFECTOS ---
  const obtenerPosicionRestringida = (dx: number, dy: number, posInicial: { x: number, y: number }, esTriangulo: boolean) => {
    let nuevoX = posInicial.x + dx;
    let nuevoY = posInicial.y + dy;

    const tamano = esTriangulo ? TAMANO_TRIANGULO : TAMANO_CIRCULO;

    // Límites Horizontales
    if (nuevoX < 0) nuevoX = 0;
    if (nuevoX > limites.current.ancho - tamano) nuevoX = limites.current.ancho - tamano;

    // Límite Superior de -90 que te funcionó impecable
    if (nuevoY < -90) nuevoY = -90;
    if (nuevoY > limites.current.alto - tamano) nuevoY = limites.current.alto - tamano;

    return { x: nuevoX, y: nuevoY };
  };

  // --- PANRESPONDER ÚNICO DEL TRIÁNGULO ---
  const panResponderTriangulo = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !figuraEncajada,
      onMoveShouldSetPanResponder: () => !figuraEncajada,
      onPanResponderMove: (_, gestureState) => {
        if (paso === 1) {
          setHaMovidoPaso1(true);
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosTriangulo.current, true);
          panTriangulo.setValue(posSegura);
        } else if (paso === 2) {
          // En el paso 2 usamos el mismo movimiento absoluto controlado
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosTriangulo.current, true);
          
          // Bloqueamos el movimiento horizontal en paso 2 para que baje derecho (Opcional, si quieres libertad quita la línea de abajo)
          posSegura.x = limites.current.ancho / 2 - TAMANO_TRIANGULO / 2;

          panTriangulo.setValue(posSegura);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (paso === 1) {
          const posFinal = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosTriangulo.current, true);
          ultimaPosTriangulo.current = posFinal;
        } else if (paso === 2) {
          // 1. Obtenemos la posición exacta a donde el usuario llevó la figura
          const posFinal = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosTriangulo.current, true);
          
          // 2. Coordenadas aproximadas del centro del molde punteado gris en pantalla
          const centroMoldeX = limites.current.ancho / 2 - TAMANO_TRIANGULO / 2;
          const centroMoldeY = 145; // Calibrado al ojo con tu layout actual

          // 3. Margen de tolerancia generoso (Efecto Imán)
          // Si el triángulo está a menos de 55px en vertical y 45px en horizontal, se auto-acomoda solo
          const cercaEnX = Math.abs(posFinal.x - centroMoldeX) < 45;
          const cercaEnY = Math.abs(posFinal.y - centroMoldeY) < 55;

          if (cercaEnX && cercaEnY) {
            // Animación magnética: Succiona la figura y la clava perfectamente centrada en el molde
            Animated.spring(panTriangulo, {
              toValue: { x: centroMoldeX, y: centroMoldeY - 3 }, // Ajuste de -3px para que tape la silueta gris interna
              useNativeDriver: false
            }).start();
            
            setFiguraEncajada(true);
          } else {
            // Si lo suelta lejos de la zona del molde, regresa arriba con resorte
            Animated.spring(panTriangulo, {
              toValue: { x: centroMoldeX, y: 40 },
              useNativeDriver: false
            }).start();
            ultimaPosTriangulo.current = { x: centroMoldeX, y: 40 };
          }
        }
      },
    })
  ).current;

  // --- PANRESPONDER DEL CÍRCULO ---
  const panResponderCirculo = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => paso === 1,
      onMoveShouldSetPanResponder: () => paso === 1,
      onPanResponderMove: (_, gestureState) => {
        if (paso === 1) {
          setHaMovidoPaso1(true);
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosCirculo.current, false);
          panCirculo.setValue(posSegura);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (paso === 1) {
          const posFinal = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, ultimaPosCirculo.current, false);
          ultimaPosCirculo.current = posFinal;
        }
      },
    })
  ).current;

  const avanzarPaso = () => {
    if (paso === 1 && haMovidoPaso1) {
      setPaso(2);
    } else if (paso === 2 && figuraEncajada) {
      setPaso(3);
    } else if (paso === 3) {
      router.back();
    }
  };

  const infoPaso = PASOS_TUTORIAL[paso];
  const botonDeshabilitado = (paso === 1 && !haMovidoPaso1) || (paso === 2 && !figuraEncajada);

  return (
    <View style={styles.page}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#2b6cb0" }, 
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.zonaSuperior}>
        <View style={{ zIndex: 1 }}>
          <Text style={styles.titulo}>Módulo Tutorial</Text>
          <View style={styles.tituloLinea} />
        </View>
        
        {/* Espacio gris libre limpio */}
        <View style={[styles.espacioGrisLibre, { zIndex: 10 }]} onLayout={medirContenedorGris}>
          
          {/* EL TRIÁNGULO AHORA EXISTE EN EL PLANO ABSOLUTO EN AMBOS PASOS */}
          {(paso === 1 || paso === 2 || paso === 3) && (
            <Animated.View
              {...panResponderTriangulo.panHandlers}
              style={[
                {
                  position: "absolute",
                  left: panTriangulo.x,
                  top: panTriangulo.y,
                  zIndex: 30,
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  borderStyle: "solid",
                  borderLeftWidth: TAMANO_TRIANGULO / 2,
                  borderRightWidth: TAMANO_TRIANGULO / 2,
                  borderBottomWidth: TAMANO_TRIANGULO,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderBottomColor: "#d53f8c",
                  display: (paso === 2 && figuraEncajada) || paso === 3 ? "none" : "flex", // Oculta si ya encajó
                }
              ]}
            />
          )}

          {/* Círculo del Paso 1 */}
          {paso === 1 && (
            <Animated.View
              {...panResponderCirculo.panHandlers}
              style={[
                {
                  position: "absolute",
                  left: panCirculo.x,
                  top: panCirculo.y,
                  zIndex: 19,
                  width: TAMANO_CIRCULO,
                  height: TAMANO_CIRCULO,
                  borderRadius: TAMANO_CIRCULO / 2,
                  backgroundColor: "#3182ce",
                }
              ]}
            />
          )}

          {/* EFECTO DE ÉXITO O MOLDE EN PASO 2 Y 3 */}
          {(paso === 2 || paso === 3) && (
            <View style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center" }}>
              {figuraEncajada ? (
                // Destellos de éxito en la posición exacta del molde
                <Text style={{ fontSize: 45, zIndex: 40, position: "absolute", top: 145 }}>✨</Text>
              ) : (
                /* El molde punteado fijo abajo con top corregido a 145 */
                <View style={{ width: 65, height: 65, borderWidth: 2, borderColor: "#999", borderStyle: "dashed", borderRadius: 12, position: "absolute", top: 145, justifyContent: "center", alignItems: "center", zIndex: 5 }}>
                  <View style={{ 
                    width: 0, 
                    height: 0, 
                    backgroundColor: "transparent", 
                    borderStyle: "solid", 
                    borderLeftWidth: 51 / 2,  // 👈 Escalado a 51 para hacer match perfecto
                    borderRightWidth: 51 / 2, // 👈 Escalado a 51
                    borderBottomWidth: 51,    // 👈 Escalado a 51
                    borderLeftColor: "transparent", 
                    borderRightColor: "transparent", 
                    borderBottomColor: "#ccc", 
                    opacity: 0.35 
                  }} />
                </View>
              )}
            </View>
          )}

        </View>
      </View>

      <View style={styles.contenedor}>
        <View style={styles.headerRow}>
          <View style={styles.pasoContenedor}>
            <Text style={styles.pasoTitulo}>{infoPaso.titulo}</Text>
          </View>
          <Ionicons name="school" size={30} color="#faa638" />
        </View>
        
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>{infoPaso.descripcion}</Text>
        </View>

        <View style={styles.indicaciones}>
          <Text style={styles.indicacion}>{infoPaso.indicacion}</Text>
        </View>

        <View style={styles.filaBotones}>
          <View style={styles.botonBaseIniciar}>
            <Pressable 
              style={[styles.botonIniciar, botonDeshabilitado && { backgroundColor: "#ccc" }]} 
              onPress={avanzarPaso}
              disabled={botonDeshabilitado}
            >
              <Text style={styles.textoBoton}>{infoPaso.boton}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}