import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ececec",
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2f5279",
    textAlign: "center",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 17,
    color: "#4b4b4b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  espacioJuego: {
    borderWidth: 1,
    borderColor: "#c9c9c9",
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 20,
  },
  grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  width: 210, // ancho exacto para 3 cartas
  justifyContent: "center",
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
  indicaciones: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  indicacion: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
  },
  opcion: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  picker: {
    height: 40,
    width: 200,
  },
  tiempoInfo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f5279",
    textAlign: "center",
    marginVertical: 10,
  },
  botonIniciar: {
    alignSelf: "center",
    backgroundColor: "#2f5279",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
