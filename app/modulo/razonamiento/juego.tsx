import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JuegoSuma() {
  const [target, setTarget] = useState(13);
  const [numbers, setNumbers] = useState([8, 7, 9, 2, 5, 1]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentSum, setCurrentSum] = useState(0);

  const handlePress = (index: number) => {
    if (selectedIndices.includes(index)) {
      // Deseleccionar
      setSelectedIndices(prev => prev.filter(i => i !== index));
      setCurrentSum(prev => prev - numbers[index]);
    } else {
      // Seleccionar
      const newSum = currentSum + numbers[index];
      setSelectedIndices(prev => [...prev, index]);
      setCurrentSum(newSum);

      if (newSum === target) {
        alert("¡Correcto!");
        generateNewRound();
      } else if (newSum > target) {
        alert("Te pasaste, intenta de nuevo");
        setSelectedIndices([]);
        setCurrentSum(0);
      }
    }
  };

  const generateNewRound = () => {
    const newNums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10) + 1);
    setNumbers(newNums);
    const randomTarget = newNums[0] + newNums[1] + (Math.random() > 0.5 ? newNums[2] : 0);
    setTarget(randomTarget);
    setSelectedIndices([]);
    setCurrentSum(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Suma Números</Text>
        <TouchableOpacity style={styles.pauseBtn}><Text>⏸</Text></TouchableOpacity>
      </View>

      <View style={styles.targetContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.targetText}>{target}</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.numberBox,
              selectedIndices.includes(index) && styles.selectedBox
            ]}
            onPress={() => handlePress(index)}
          >
            <Text style={[styles.numText, selectedIndices.includes(index) && styles.selectedText]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E1F5FE' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  pauseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center' },
  targetContainer: { alignItems: 'center', marginVertical: 50 },
  outerCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#7B92FF', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#81D4FA' },
  targetText: { fontSize: 60, color: 'white', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, padding: 20 },
  numberBox: { width: 80, height: 80, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  selectedBox: { backgroundColor: '#4A90E2' },
  numText: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  selectedText: { color: 'white' }
});