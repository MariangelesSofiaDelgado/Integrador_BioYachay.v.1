import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ededed",
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
});