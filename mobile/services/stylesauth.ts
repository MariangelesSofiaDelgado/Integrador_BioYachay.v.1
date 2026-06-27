// app/auth/styles/stylesauth.ts
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#3178b2",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  // ─── Logo ────────────────────────────────────────────────────────
  logoArea: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 6,
  },
  logoTitulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.80)",
    marginTop: 4,
  },

  // ─── Card ────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3178b2",
    marginBottom: 18,
    textAlign: "center",
  },

  // ─── Error ───────────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: "#fde8e8",
    color: "#c0392b",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f5c6c6",
  },

  // ─── Form ────────────────────────────────────────────────────────
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fafafa",
  },

  // ─── Botón principal ─────────────────────────────────────────────
  botonPrimario: {
    backgroundColor: "#3178b2",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    elevation: 3,
  },
  botonDeshabilitado: {
    backgroundColor: "#aac4e0",
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },

  // ─── Link ────────────────────────────────────────────────────────
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  linkTexto: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    fontSize: 14,
    color: "#3178b2",
    fontWeight: "700",
  },
});
