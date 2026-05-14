import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles/stylesindex';

export default function InicioSuma() {
  const router = useRouter();

  const iniciar = () => router.push({ pathname: '/modulo/razonamiento/juego' });

  return (
    <View style={styles.page}>
      <Text style={styles.titulo}>Suma Números</Text>
      <View style={styles.tituloLinea} />

      {/* Imagen/preview del juego agrandada */}
      <View style={styles.espacioJuego}>
        <View style={styles.iconContainer}>
          <View style={styles.miniGrid}>
            <Text style={styles.miniNum}>6</Text>
            <Text style={[styles.miniNum, styles.blueBox]}>5</Text>
            <Text style={[styles.miniNum, styles.blueBox]}>3</Text>
            <Text style={styles.miniNum}>2</Text>
            <Text style={styles.miniNum}>4</Text>
            <Text style={[styles.miniNum, styles.blueBox]}>7</Text>
            <Text style={styles.miniNum}>8</Text>
            <Text style={[styles.miniNum, styles.blueBox]}>9</Text>
            <Text style={styles.miniNum}>1</Text>
          </View>
        </View>
      </View>

      <View style={styles.contenedor}>
        <View style={styles.headerRow}>
          <View style={styles.objetivoContenedor}>
            <Text style={styles.objetivoTitulo}>Objetivo</Text>
          </View>
          <MaterialCommunityIcons name="puzzle" size={30} color="#f1c40f" />
        </View>
        <View style={styles.objectContenedor}>
          <Text style={styles.objetivoDescripcion}>Resolver sumas rápidas</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.instruccionesContenedor}>
            <Text style={styles.instruccionesTitulo}>Instrucciones</Text>
          </View>
        </View>
        <View style={styles.indicaciones}>
          <Text style={styles.indicacion}>Suma los números que aparecen hasta alcanzar el objetivo.</Text>
          <Text style={styles.indicacion}>Aumenta la dificultad con cada acierto.</Text>
        </View>

        <View style={styles.botonBase}>
          <Pressable style={styles.botonIniciar} onPress={iniciar}>
            <Text style={styles.textoBoton}>Iniciar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}