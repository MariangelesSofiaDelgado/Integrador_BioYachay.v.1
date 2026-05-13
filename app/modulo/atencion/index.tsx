import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import styles from "./styles/stylesindex";


export default function ModuloAtencion() {
  const router = useRouter();

  const iniciarJuego = () => {
    router.push({
      pathname: "/modulo/atencion/juego",
    });
  };

  const frutas = ["🍎", "🍊", "🍌", "🍇", "🍐", "🍉", "🍓", "🥝", "🍍"];

  return (
    <View style={styles.page}>
      <Text style={styles.titulo}>Memofruta</Text>
      <View style={styles.tituloLinea} />


      {/* Vista previa de cartas */}
      <View style={styles.espacioJuego}>
        <View style={styles.grid}>
          {frutas.map((fruta, index) => (
            <View key={index} style={styles.carta}>
              <Text style={styles.simbolo}>{fruta}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Objetivo */}
      <View style={styles.contenedor}>
        <View style={styles.headerRow}>
          <View style={styles.objetivoContenedor}>
            <Text style={styles.objetivoTitulo}>Objetivo</Text>
          </View>
          <Ionicons name="eye" size={30} color="#e93232" />
        </View>
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>
            Fortalecer retención visual
          </Text>
        </View>

        {/* Instrucciones */}
          <View style={styles.headerRow}>
            <View style={styles.instruccionesContenedor}>
              <Text style={styles.instruccionesTitulo}>Instrucciones</Text>
            </View>
          </View>
          <View style={styles.indicaciones}>
            <Text style={styles.indicacion}> Haz clic en el objeto que se te indique.</Text>
            <Text style={styles.indicacion}> La dificultad aumenta cada acierto tiempo.</Text>
            <Text style={styles.indicacion}> Sé rápido y preciso.</Text>
          </View>

        {/* Botón iniciar */}
        <View style={styles.botonBase}>
          <Pressable style={styles.botonIniciar} onPress={iniciarJuego}>
            <Text style={styles.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

