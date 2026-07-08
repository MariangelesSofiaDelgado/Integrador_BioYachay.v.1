import { StyleSheet } from "react-native";

const COLOR = "#e67e22";

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  // ─ Zona superior: GIF del ejercicio ───────────────────────────────────────
  zonaGif: {
    flex: 0.58,
    backgroundColor: "#fff8f0",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  marcoGif: {
    width: 260,
    height: 260,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: COLOR + "33",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 4,
    shadowColor: COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  gif: {
    width: "100%",
    height: "100%",
  },

  // ─ Cronómetro flotante sobre el GIF ───────────────────────────────────────
  cronometroBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: COLOR,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    elevation: 3,
  },
  cronometroTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  // ─ Indicador de progreso (ejercicio X de Y) ───────────────────────────────
  progresoTexto: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#a85a12",
  },

  // ─ Tarjeta blanca inferior ─────────────────────────────────────────────────
  tarjeta: {
    flex: 0.42,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: "space-between",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nombreEjercicio: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  instruccionBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  instruccionTexto: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },

  // ─ Botón único de Iniciar ──────────────────────────────────────────────────
  botonIniciar: {
    backgroundColor: COLOR,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  botonDeshabilitado: {
    backgroundColor: COLOR + "55",
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  // ─ Pantalla de finalización ────────────────────────────────────────────────
  finContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f0f0f0",
  },
  finEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  finTitulo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#a85a12",
    textAlign: "center",
    marginBottom: 8,
  },
  finTexto: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 28,
  },
});