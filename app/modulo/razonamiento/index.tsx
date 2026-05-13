import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InicioSuma() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardMain}>
        <View style={styles.iconContainer}>
          <View style={styles.miniGrid}>
            <Text style={styles.miniNum}>6</Text><Text style={[styles.miniNum, styles.blueBox]}>5</Text>
            <Text style={[styles.miniNum, styles.blueBox]}>3</Text><Text style={styles.miniNum}>2</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Suma Números</Text>
        <Text style={styles.subtitle}>Razonamiento</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>38</Text>
            <Text style={styles.statLabel}>Última puntuación</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>🏆 38</Text>
            <Text style={styles.statLabel}>Mejor puntuación</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Instrucciones</Text>
          <Text style={styles.description}>Encuentra el resultado proporcionado sumando números</Text>
          
          <Text style={styles.sectionTitle}>Dificultad: <Text style={{color: '#E67E22'}}>Principiante ▲</Text></Text>
          
          <Text style={styles.sectionTitle}>Beneficios</Text>
          <View style={styles.tag}><Text style={styles.tagText}>Flexibilidad cognitiva</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Concentración</Text></View>
        </View>

        <Link href="/modulo/razonamiento/juego" asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E1F5FE', padding: 20 },
  cardMain: { flex: 1, backgroundColor: 'white', borderRadius: 30, padding: 20, alignItems: 'center' },
  iconContainer: { width: 100, height: 100, backgroundColor: '#F0F0F0', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  miniGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 60 },
  miniNum: { width: 30, height: 30, textAlign: 'center', borderWidth: 1, borderColor: '#DDD', fontSize: 18 },
  blueBox: { backgroundColor: '#4A90E2', color: 'white' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#4A90E2', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#888' },
  infoSection: { width: '100%', gap: 10 },
  sectionTitle: { fontWeight: 'bold', marginTop: 10 },
  tag: { backgroundColor: '#E1F5FE', padding: 8, borderRadius: 10, alignSelf: 'flex-start' },
  tagText: { color: '#4A90E2' },
  startButton: { backgroundColor: '#4A90E2', width: '100%', padding: 18, borderRadius: 20, marginTop: 'auto' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }
});