import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zonaJuego: {
    flex: 1,
    position: 'relative', // Vital para el posicionamiento absoluto
    overflow: 'hidden',   // Vital para que las frutas desaparezcan al salir
  },
  fruta: {
    position: 'absolute',
    fontSize: 45, // Aumentado de 35 a 45 para que se vea más grande
  },
  canasta: {
  position: 'absolute',
  bottom: 40,
  left: 0, // <--- AGREGA ESTO
  fontSize: 70,
  zIndex: 10, // <--- Asegura que la canasta esté siempre encima de las frutas
},
  contenedorInfo: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  textoPuntaje: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;