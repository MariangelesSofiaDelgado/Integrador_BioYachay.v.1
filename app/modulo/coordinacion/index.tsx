import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylesindex";

export default function ModuloCoordinacion() {
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      {/* Título arriba */}
      <Text style={styles.titulo}>ATRAPA LAS FRUTAS 🍓🍌🍇</Text>

      {/* Vista previa */}
      <View style={styles.espacioJuego}>
        <Text style={styles.textoEspacio}>Vista previa del juego</Text>
      </View>

      {/* Objetivo */}
      <View style={styles.cajaObjetivo}>
        <Text style={styles.subtitulo}>Objetivo</Text>
        <Text style={styles.textoCaja}>
          Mejorar la coordinación ojo‑mano atrapando frutas que caen.
        </Text>
      </View>

      {/* Instrucciones */}
      <View style={styles.cajaInstrucciones}>
        <Text style={styles.subtitulo}>Instrucciones</Text>
        <Text style={styles.textoCaja}>
          Mueve la canasta con tu dedo y atrapa las frutas. Evita que se caigan.
        </Text>
      </View>

      {/* Botón iniciar */}
      <Pressable
        style={styles.botonIniciar}
        onPress={() => router.push("../modulo/coordinacion/juego")}
      >
        <Text style={styles.textoBoton}>INICIAR</Text>
      </Pressable>
    </View>
  );
}
