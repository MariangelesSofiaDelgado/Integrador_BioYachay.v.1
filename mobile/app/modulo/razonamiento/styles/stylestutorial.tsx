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

  /* --- CÍRCULO OBJETIVO --- */
  circuloObjetivo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f39c12",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 4,
  },
  circuloObjetivoInterno: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textoObjetivo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#b7770d",
  },

  /* --- FICHAS --- */
  tablero: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 220,
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  ficha: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#f39c12",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  fichaSeleccionada: {
    backgroundColor: "#f39c12",
  },
  textoFicha: {
    fontSize: 22,
    fontWeight: "900",
    color: "#b7770d",
  },
  textoFichaSeleccionada: {
    color: "#fff",
  },

  /* Suma actual */
  sumaActual: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#b7770d",
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