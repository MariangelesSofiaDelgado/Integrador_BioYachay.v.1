import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, PanResponder, Pressable, Text, View } from "react-native";
import styles from "../visoespacial/styles/stylestutorial";

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
    indicacion: "🎯 Ya estás listo para poner a prueba tu percepción espacial con diferentes figuras, velocidades and desafíos. ¡A ganar!",
    boton: "Finalizar",
  },
};

export default function TutorialVisoespacial() {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [haMovidoPaso1, setHaMovidoPaso1] = useState(false);
  const [figuraEncajada, setFiguraEncajada] = useState(false);

  const limites = useRef({ ancho: 0, alto: 0 });

  const panTriangulo = useRef(new Animated.ValueXY({ x: 40, y: 120 })).current;
  const panCirculo = useRef(new Animated.ValueXY({ x: 180, y: 120 })).current;

  const ultimaPosTriangulo = useRef({ x: 40, y: 120 });
  const ultimaPosCirculo = useRef({ x: 180, y: 120 });
  const inicioGestoTriangulo = useRef({ x: 40, y: 120 });
  const inicioGestoCirculo = useRef({ x: 180, y: 120 });

  const medirContenedorGris = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    limites.current = { ancho: width, alto: height };
  };

  useEffect(() => {
    if (paso === 2) {
      const xCentro = limites.current.ancho / 2 - TAMANO_TRIANGULO / 2 || 140;
      const posInicial = { x: xCentro, y: 30 };
      panTriangulo.setValue(posInicial);
      // Sincronizamos TODAS las refs con la nueva posición para evitar teleportación
      ultimaPosTriangulo.current = { ...posInicial };
      inicioGestoTriangulo.current = { ...posInicial };
      setFiguraEncajada(false);
    }
  }, [paso]);

  const obtenerPosicionRestringida = (dx: number, dy: number, posInicial: { x: number, y: number }, esTriangulo: boolean) => {
    let nuevoX = posInicial.x + dx;
    let nuevoY = posInicial.y + dy;

    const tamano = esTriangulo ? TAMANO_TRIANGULO : TAMANO_CIRCULO;

    if (nuevoX < 0) nuevoX = 0;
    if (nuevoX > limites.current.ancho - tamano) nuevoX = limites.current.ancho - tamano;
    if (nuevoY < -90) nuevoY = -90;
    if (nuevoY > limites.current.alto - tamano) nuevoY = limites.current.alto - tamano;

    return { x: nuevoX, y: nuevoY };
  };

  const figuraEncajadaRef = useRef(false);
  const pasoRef = useRef<1 | 2 | 3>(1);

  useEffect(() => {
    figuraEncajadaRef.current = figuraEncajada;
  }, [figuraEncajada]);

  useEffect(() => {
    pasoRef.current = paso;
  }, [paso]);

  const panResponderTriangulo = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !figuraEncajadaRef.current,
      onMoveShouldSetPanResponder: () => !figuraEncajadaRef.current,
      onPanResponderGrant: () => {
        // Leemos la posición animada real en este momento exacto y la guardamos
        const x = (panTriangulo.x as any)._value ?? ultimaPosTriangulo.current.x;
        const y = (panTriangulo.y as any)._value ?? ultimaPosTriangulo.current.y;
        ultimaPosTriangulo.current = { x, y };
        inicioGestoTriangulo.current = { x, y };
      },
      onPanResponderMove: (_, gestureState) => {
        if (pasoRef.current === 1) {
          setHaMovidoPaso1(true);
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, inicioGestoTriangulo.current, true);
          panTriangulo.setValue(posSegura);
        } else if (pasoRef.current === 2) {
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, inicioGestoTriangulo.current, true);
          panTriangulo.setValue(posSegura);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (pasoRef.current === 1) {
          const posFinal = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, inicioGestoTriangulo.current, true);
          ultimaPosTriangulo.current = posFinal;
        } else if (pasoRef.current === 2) {
          const xCentro = limites.current.ancho / 2 - TAMANO_TRIANGULO / 2 || 140;

          // Posición absoluta real donde quedó el triángulo al soltar
          const posActualY = inicioGestoTriangulo.current.y + gestureState.dy;
          const posActualX = inicioGestoTriangulo.current.x + gestureState.dx;

          const MOLDE_Y = 145;
          const TOLERANCIA_Y = 40;
          const TOLERANCIA_X = 40;

          if (
            posActualY >= MOLDE_Y - TOLERANCIA_Y && posActualY <= MOLDE_Y + TOLERANCIA_Y &&
            posActualX >= xCentro - TOLERANCIA_X && posActualX <= xCentro + TOLERANCIA_X
          ) {
            // Encaja con efecto imán en la posición exacta del molde
            Animated.spring(panTriangulo, {
              toValue: { x: xCentro, y: MOLDE_Y },
              useNativeDriver: false,
            }).start();
            ultimaPosTriangulo.current = { x: xCentro, y: MOLDE_Y };
            setFiguraEncajada(true);
            figuraEncajadaRef.current = true;
          } else {
            // No llegó al molde, regresa arriba suavemente
            Animated.spring(panTriangulo, {
              toValue: { x: xCentro, y: 30 },
              useNativeDriver: false,
            }).start();
            ultimaPosTriangulo.current = { x: xCentro, y: 30 };
          }
        }
      },
    })
  ).current;

  const panResponderCirculo = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => pasoRef.current === 1,
      onMoveShouldSetPanResponder: () => pasoRef.current === 1,
      onPanResponderGrant: () => {
        inicioGestoCirculo.current = { ...ultimaPosCirculo.current };
      },
      onPanResponderMove: (_, gestureState) => {
        if (pasoRef.current === 1) {
          setHaMovidoPaso1(true);
          const posSegura = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, inicioGestoCirculo.current, false);
          panCirculo.setValue(posSegura);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (pasoRef.current === 1) {
          const posFinal = obtenerPosicionRestringida(gestureState.dx, gestureState.dy, inicioGestoCirculo.current, false);
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
        
        <View style={[styles.espacioGrisLibre, { zIndex: 10 }]} onLayout={medirContenedorGris}>
          
          {/* TRIÁNGULO ANIMADO */}
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
                display: paso === 3 ? "none" : "flex", 
              }
            ]}
          />

          {/* CÍRCULO PASO 1 */}
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

          {/* MOLDE PASO 2 Y 3 */}
          {(paso === 2 || paso === 3) && (
            <View style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center" }}>
              {figuraEncajada ? (
                <Text style={{ fontSize: 45, zIndex: 40, position: "absolute", top: 145 }}>✨</Text>
              ) : (
                <View style={{ 
                  width: 65, 
                  height: 65, 
                  borderWidth: 2, 
                  borderColor: "#999", 
                  borderStyle: "dashed", 
                  borderRadius: 12, 
                  position: "absolute", 
                  top: 145, 
                  justifyContent: "center", 
                  alignItems: "center", 
                  zIndex: 5 
                }}>
                  <View style={{ 
                    width: 0, 
                    height: 0, 
                    backgroundColor: "transparent", 
                    borderStyle: "solid", 
                    borderLeftWidth: 51 / 2, 
                    borderRightWidth: 51 / 2, 
                    borderBottomWidth: 51, 
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