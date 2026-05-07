import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C'];

const Razonamiento = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const startNewGame = () => {
    const firstStep = Math.floor(Math.random() * 4);
    setSequence([firstStep]);
    setUserSequence([]);
    playSequence([firstStep]);
  };

  const playSequence = async (targetSequence: number[]) => {
    setIsDisplaying(true);
    for (let i = 0; i < targetSequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveButton(targetSequence[i]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsDisplaying(false);
  };

  const handlePress = (index: number) => {
    if (isDisplaying) return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      Alert.alert('¡Error!', 'Secuencia incorrecta. Inténtalo de nuevo.', [
        { text: 'Reiniciar', onPress: startNewGame },
      ]);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      const nextStep = Math.floor(Math.random() * 4);
      const nextSequence = [...sequence, nextStep];
      setSequence(nextSequence);
      setUserSequence([]);
      setTimeout(() => playSequence(nextSequence), 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Razonamiento Lógico</Text>
      <Text style={styles.subtitle}>Nivel: {sequence.length}</Text>

      <View style={styles.grid}>
        {COLORS.map((color, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => handlePress(index)}
            style={[
              styles.card,
              {
                backgroundColor: activeButton === index ? '#FFFFFF' : color,
                opacity: isDisplaying ? 0.8 : 1,
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
        <Text style={styles.buttonText}>{sequence.length > 0 ? 'Reiniciar' : 'Empezar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F9FC' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#2D3436' },
  subtitle: { fontSize: 18, marginBottom: 30, color: '#636E72' },
  grid: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: 145, height: 145, borderRadius: 20, elevation: 5 },
  startButton: { marginTop: 40, backgroundColor: '#2D3436', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Razonamiento;
