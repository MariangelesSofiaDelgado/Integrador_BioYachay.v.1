import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
  },

  /* --- ÁREA DEL JUEGO --- */
  zonaSuperior: {
    flex: 0.60,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  titulo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#e93232",
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
  },
  tituloLinea: {
    width: 200,
    height: 3,
    backgroundColor: "#e93232",
    borderRadius: 999,
    alignSelf: "center",
  },

  /* --- TABLERO MINI DEL TUTORIAL --- */
  tablero: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 200,
    justifyContent: "center",
    marginTop: 24,
  },
  carta: {
    width: 56,
    height: 56,
    margin: 6,
    borderRadius: 10,
    backgroundColor: "#337ab7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  cartaEncontrada: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#7dc123",
  },
  textoCarta: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "900",
  },

  /* Indicador de racha de aciertos */
  rachaFila: {
    position: "absolute",
    top: 8,
    right: 16,
    flexDirection: "row",
    gap: 4,
  },

  /* --- TARJETA BLANCA --- */
  contenedor: {
    flex: 0.40,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "space-between",
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
});