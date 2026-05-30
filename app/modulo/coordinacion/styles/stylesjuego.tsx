import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const ALTO_TARJETA = SCREEN_HEIGHT * 0.40;

export default StyleSheet.create({
  page: { flex: 1, backgroundColor: "#ededed", overflow: "hidden" },
  
  zonaJuego: {
    flex: 0.60,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  
  // Canasta (Exactamente la misma lógica del tutorial)
  canasta: {
    fontSize: 50,
    position: "absolute",
    bottom: 20,
    zIndex: 10,
  },
  
  // Frutas que caerán
  fruta: {
    fontSize: 40,
    position: "absolute",
    zIndex: 5,
  },

  // Tarjeta de puntuación (Reemplaza la de indicaciones del tutorial)
  contenedorInfo: {
    flex: 0.40,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
  },
  textoPuntaje: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#337ab7",
  }
});