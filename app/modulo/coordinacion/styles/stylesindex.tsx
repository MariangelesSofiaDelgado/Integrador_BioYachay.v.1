import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ececec",
    padding: 20,
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2f5279",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  espacioJuego: {
    height: 200,
    borderWidth: 2,
    borderColor: "#c9c9c9",
    borderRadius: 14,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  textoEspacio: {
    fontSize: 20,
    color: "#666666",
    textAlign: "center",
  },
  cajaObjetivo: {
    backgroundColor: "#d9f9d9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  cajaInstrucciones: {
    backgroundColor: "#d9e9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#2f5279",
  },
  textoCaja: {
    fontSize: 20,
    textAlign: "center",
    color: "#333333",
  },
  botonIniciar: {
    alignSelf: "center",
    backgroundColor: "#2f5279",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
});
