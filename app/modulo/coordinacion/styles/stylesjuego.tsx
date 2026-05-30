import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed", // Mismo gris claro de fondo
  },
  zonaSuperior: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 2,
  },
  titulo: {
    fontSize: 38,
    fontWeight: "700",
    color: "#e93232", // El mismo rojo vibrante de "Atrapa las frutas"
    textAlign: "center",
    marginTop: 35, // Margen exacto del index
    marginBottom: 4,
  },
  tituloLinea: {
    width: 230,
    height: 3,
    backgroundColor: "#e93232", // Línea roja idéntica
    alignSelf: "center",
    borderRadius: 999,
    marginTop: 3,
    marginBottom: 5,
  },
});