import { StyleSheet } from "react-native";

export default StyleSheet.create({

  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#00000042",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#e93232",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  tituloLinea: {
    width: 250,
    height: 3,
    backgroundColor: "#e93232",
    alignSelf: "center",
    borderRadius: 999,
    marginTop: 3,
    marginBottom: 18,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  objectContenedor: {
    alignSelf: "flex-start",
    width: 240,
    backgroundColor: "#f6f6f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 12,
    top: -28,
  },
  objetivoContenedor: {
    alignSelf: "flex-start",
    width: 110,
    backgroundColor: "#7dc123",
    paddingVertical: 6,
    paddingBottom: 20,
    paddingHorizontal: 13,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 6,
    elevation: 5,
  },
  objetivoTitulo: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  objetivoDescripcion: {
    fontSize: 16,
    color: "#000000",
    margin: 2,
  },

  instruccionesContenedor: {
    alignSelf: "flex-start",
    width: 150,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 15,
    marginBottom:5,
    backgroundColor: "#549be5",
    elevation: 4,
  },
  instruccionesTitulo: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },

  botonBase: {
    alignSelf: "center",
    backgroundColor: "#ce540e",
    borderRadius: 20,
    marginTop: 40,
    paddingHorizontal: 0,
    paddingVertical: 3,
  },

  botonIniciar: {
    alignSelf: "center",
    backgroundColor: "#faa638",
    paddingHorizontal: 60,
    paddingVertical: 8,
    borderRadius: 20,
    position: "relative",
    top: -6,
    elevation: 4,
  },

  textoBoton: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  espacioJuego: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    marginBottom: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 210, 
    justifyContent: "center",
  },

  carta: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: "#ffffff",
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
});