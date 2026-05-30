import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },

 /* --- ÁREA DEL JUEGO (Origen corregido al borde izquierdo real) --- */
  zonaSuperior: {
    flex: 0.60, 
    width: "100%",
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "flex-start", // CAMBIADO: Obliga a que el 0% de la animación sea el inicio izquierdo de la pantalla
    paddingTop: 20,
  },
  titulo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#e93232",
    width: "100%",        // Forzamos a que ocupe todo el ancho
    textAlign: "center",  // Centramos el texto dentro de su propio bloque
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#e93232",
    borderRadius: 999,
    alignSelf: "center",  // Mantiene la línea roja en el centro sin importar el contenedor de arriba
  },
  
  /* --- CANASTA RESPONSIVA --- */
  canastaAnimada: {
    fontSize: 50,
    position: "absolute",
    bottom: 15, // Siempre a 15px sobre la tarjeta blanca, sin importar el alto del fono
    width: 60,  // Ancho fijo declarado para el cálculo del 100% en el código
    textAlign: "center",
  },

  /* --- TARJETA BLANCA (Ocupa el 40% exacto de cualquier pantalla) --- */
  contenedor: {
    flex: 0.40, 
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "space-between", // Distribuye los elementos sin colapsar el botón
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
  },
  pasoContenedor: {
    backgroundColor: "#7dc123",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  pasoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  objectContenedor: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  objetivoDescripcion: {
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
  },
  indicaciones: {
    marginVertical: 2,
  },
  indicacion: {
    fontSize: 17,
    color: "#444",
    fontWeight: "500",
  },
  filaBotones: {
    width: "100%",
  },
  botonBaseIniciar: {
    backgroundColor: "#ce540e",
    borderRadius: 20,
    paddingVertical: 2,
  },
  botonIniciar: {
    alignItems: "center",
    backgroundColor: "#faa638",
    paddingVertical: 10,
    borderRadius: 20,
    position: "relative",
    top: -5,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  frutaAnimada: {
    position: "absolute",
    zIndex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});