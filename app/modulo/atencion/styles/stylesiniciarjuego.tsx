// stylesjuego.tsx
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ececec",
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2f5279",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  carta: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  simbolo: {
    fontSize: 28,
  },
  mensaje: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  botonIniciar: {
    alignSelf: "center",
    backgroundColor: "#2f5279",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
