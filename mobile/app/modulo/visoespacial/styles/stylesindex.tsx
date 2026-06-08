import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },

  /* --- SECCIÓN SUPERIOR (ZONA GRIS) --- */
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
    justifyContent: "center", 
    alignItems: "center",
  },

  /* --- TARJETA BLANCA (48% DEL ALTO REAL) --- */
  contenedor: {
    height: SCREEN_HEIGHT * 0.48, 
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
    zIndex: 10,
    elevation: 8, 
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15, 
    shadowRadius: 6,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between", // Arreglado el typo de TypeScript
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  objectContenedor: {
    alignSelf: "flex-start",
    width: "85%", 
    backgroundColor: "#f6f6f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  objetivoContenedor: {
    alignSelf: "flex-start",
    backgroundColor: "#7dc123",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 1,
  },
  objetivoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  objetivoDescripcion: {
    fontSize: 18,
    color: "#333",
  },
  instruccionesContenedor: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#549be5",
    elevation: 1,
  },
  instruccionesTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  indicaciones: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  indicacion: {
    fontSize: 18, 
    marginBottom: 6,
    color: "#444",
    fontWeight: "500",
  },

  /* --- FILA DE BOTONES --- */
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },

  /* --- ESTILOS BOTÓN TUTORIAL (AZUL) --- */
  botonBaseTutorial: {
    flex: 1,
    backgroundColor: "#1a446c", 
    borderRadius: 20,
    paddingVertical: 2,
    marginRight: 8, 
  },
  botonTutorial: {
    alignItems: "center",
    backgroundColor: "#2b6cb0", 
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
    elevation: 3,
  },

  /* --- ESTILOS BOTÓN INICIAR (VERDE) --- */
  botonBaseIniciar: {
    flex: 1,
    backgroundColor: "#538214", 
    borderRadius: 20,
    paddingVertical: 2,
    marginLeft: 8, 
  },
  botonIniciar: {
    alignItems: "center",
    backgroundColor: "#7dc123", 
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
    elevation: 3,
  },

  /* --- TEXTO DE BOTONES --- */
  textoBoton: {
    color: "#fff",
    fontSize: 18, 
    fontWeight: "600",
    textAlign: "center",
  },
  textoBotonTutorial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  }
});