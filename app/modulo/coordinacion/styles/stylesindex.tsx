import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  
  /* --- CAPA ABSOLUTA DE ANIMACIÓN --- */
  capaAnimacionGlobal: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  frutaAnimada: {
    fontSize: 32,
    position: "absolute",
  },

  /* --- SECCIÓN SUPERIOR (60% DEL ALTO) --- */
  zonaSuperior: {
    flex: 1,
    justifyContent: "flex-start",
    zIndex: 2,
  },
  titulo: {
    fontSize: 38,
    fontWeight: "700",
    color: "#e93232",
    textAlign: "center",
    marginTop: 35,
    marginBottom: 4,
  },
  tituloLinea: {
    width: 230,
    height: 3,
    backgroundColor: "#e93232",
    alignSelf: "center",
    borderRadius: 999,
    marginTop: 3,
    marginBottom: 5,
  },
  espacioGrisLibre: {
    flex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: 25, 
  },
  canastaAnimada: {
    fontSize: 46,
    position: "absolute",
    bottom: 20, 
    // Quitamos cualquier valor horizontal fijo aquí para que dependa 100% de la animación
  },

  /* --- TARJETA BLANCA (40% DEL ALTO REAL) --- */
  contenedor: {
    height: SCREEN_HEIGHT * 0.40, 
    backgroundColor: "#ffffff",
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: "space-between", 
    
    zIndex: 10,
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
  },
  objectContenedor: {
    alignSelf: "flex-start",
    width: "75%",
    backgroundColor: "#f6f6f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 5,
    top: -10, 
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
    fontSize: 18, // Ajustado a 18
    fontWeight: "600",
    color: "#fff",
  },
  objetivoDescripcion: {
    fontSize: 18, // Ajustado a 18
    color: "#333",
  },
  instruccionesContenedor: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#549be5",
    elevation: 1,
    marginTop: -5,
  },
  instruccionesTitulo: {
    fontSize: 18, // Ajustado a 18
    fontWeight: "600",
    color: "#fff",
  },
  indicaciones: {
    marginVertical: 2,
    paddingHorizontal: 5,
  },
  indicacion: {
    fontSize: 18, // Ajustado a 18 para máxima legibilidad de niños y abuelos
    marginBottom: 5,
    color: "#444",
    fontWeight: "500",
  },

  /* --- NUEVA FILA DE BOTONES --- */
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 5,
  },

  /* --- ESTILOS BOTÓN TUTORIAL (ROJO) --- */
  botonBaseTutorial: {
    flex: 1,
    backgroundColor: "#b31d1d", // Sombra roja oscura
    borderRadius: 20,
    paddingVertical: 2,
    marginRight: 10, // Separación con el botón de Iniciar
  },
  botonTutorial: {
    alignItems: "center",
    backgroundColor: "#e93232", // Rojo vibrante del tema
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
    elevation: 3,
  },

  /* --- ESTILOS BOTÓN INICIAR (NARANJA) --- */
  botonBaseIniciar: {
    flex: 1,
    backgroundColor: "#ce540e", // Sombra naranja oscura
    borderRadius: 20,
    paddingVertical: 2,
    marginLeft: 10, // Separación con el botón de Tutorial
  },
  botonIniciar: {
    alignItems: "center",
    backgroundColor: "#faa638", // Naranja brillante
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
    elevation: 3,
  },

  /* --- TEXTO DE AMBOS BOTONES --- */
  textoBoton: {
    color: "#fff",
    fontSize: 18, // Tamaño unificado de 18 para mantener consistencia
    fontWeight: "600",
    textAlign: "center",
  },
});