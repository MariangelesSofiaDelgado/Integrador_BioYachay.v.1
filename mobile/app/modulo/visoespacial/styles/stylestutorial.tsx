import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  zonaSuperior: {
    flex: 1,
    justifyContent: "flex-start",
    zIndex: 2,
    paddingTop: 15,
  },
  titulo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2b6cb0",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 4,
  },
  tituloLinea: {
    width: 230,
    height: 3,
    backgroundColor: "#2b6cb0",
    alignSelf: "center",
    borderRadius: 999,
    marginTop: 3,
    marginBottom: 5,
  },
  espacioGrisLibre: {
    flex: 1,
    width: "100%",
    position: "relative", // Igual que un position: relative en CSS web
    backgroundColor: "transparent", 
  },
  contenedor: {
    height: SCREEN_HEIGHT * 0.48, 
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 30,
    elevation: 8, 
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15, 
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 12,
  },
  pasoContenedor: {
    alignSelf: "flex-start",
    backgroundColor: "#faa638", 
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 1,
  },
  pasoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  objectContenedor: {
    alignSelf: "flex-start",
    width: "100%", 
    backgroundColor: "#f6f6f6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  objetivoDescripcion: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  indicaciones: {
    flex: 1,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  indicacion: {
    fontSize: 17, 
    color: "#555",
    lineHeight: 24,
  },
  filaBotones: {
    width: "100%",
    marginBottom: 10,
  },
  botonBaseIniciar: {
    backgroundColor: "#538214", 
    borderRadius: 20,
    paddingVertical: 2,
  },
  botonIniciar: {
    alignItems: "center",
    backgroundColor: "#7dc123", 
    paddingVertical: 12,
    borderRadius: 20,
    position: "relative",
    top: -5,
    elevation: 3,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18, 
    fontWeight: "600",
    textAlign: "center",
  },
});