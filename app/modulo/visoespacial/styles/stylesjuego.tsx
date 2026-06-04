import { Dimensions, StyleSheet } from "react-native";

const { height: SH } = Dimensions.get("window");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zonaFiguras: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f0f8ff",
    minHeight: SH * 0.50,
  },
  instruccion: {
    textAlign: "center",
    color: "#4a5568",
    fontSize: 13,
    paddingTop: 10,
    paddingBottom: 4,
    fontWeight: "500",
  },
  divisor: {
    height: 3,
    backgroundColor: "#bee3f8",
  },
  zonaMoldes: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: SH * 0.22,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  instruccionMolde: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  moldesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  moldeWrapper: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  moldeOcupado: {
    backgroundColor: "#f0fff4",
    borderColor: "#9ae6b4",
  },
  finContainer: {
    flex: 1,
    backgroundColor: "#ebf8ff",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  finTitulo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginBottom: 10,
  },
  finStat: {
    fontSize: 22,
    color: "#2d3748",
    fontWeight: "600",
  },
  finBoton: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#3182ce",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
});

export default styles;
