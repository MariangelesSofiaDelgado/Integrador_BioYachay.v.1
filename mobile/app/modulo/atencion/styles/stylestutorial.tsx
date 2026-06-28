import { StyleSheet } from "react-native";

const AZUL = "#2563EB";
const AZUL_CLARO = "#DBEAFE";
const VERDE = "#16A34A";
const VERDE_CLARO = "#DCFCE7";
const ROJO = "#DC2626";
const ROJO_CLARO = "#FEE2E2";
const AMARILLO = "#F59E0B";
const AMARILLO_CLARO = "#FEF3C7";
const GRIS_FONDO = "#F0F4FF";
const BLANCO = "#FFFFFF";
const TEXTO_OSCURO = "#1E293B";
const TEXTO_MEDIO = "#475569";

const styles = StyleSheet.create({
  // ── Contenedor principal ──────────────────────────────────────────────
  contenedor: {
    flex: 1,
    backgroundColor: GRIS_FONDO,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  // ── Indicador de pasos (puntos arriba) ───────────────────────────────
  indicadorPasos: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  puntoPaso: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  puntoPasoActivo: {
    backgroundColor: AZUL,
    width: 36,
    borderRadius: 9,
  },
  puntoPasoCompletado: {
    backgroundColor: VERDE,
  },
  puntoPasoPendiente: {
    backgroundColor: "#CBD5E1",
  },

  // ── Textos de instrucción ─────────────────────────────────────────────
  instruccion: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXTO_OSCURO,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 34,
  },
  descripcion: {
    fontSize: 20,
    color: TEXTO_MEDIO,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 28,
    fontWeight: "500",
  },

  // ── Caja del objetivo ─────────────────────────────────────────────────
  objetivoContenedor: {
    backgroundColor: AMARILLO_CLARO,
    borderWidth: 3,
    borderColor: AMARILLO,
    borderRadius: 24,
    paddingHorizontal: 36,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: AMARILLO,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  etiquetaObjetivo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  objetivoEmoji: {
    fontSize: 72,
  },

  // ── Flecha animada ────────────────────────────────────────────────────
  flecha: {
    fontSize: 40,
    marginBottom: 4,
  },

  // ── Grid de cartas ────────────────────────────────────────────────────
  gridCartas: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Carta base ────────────────────────────────────────────────────────
  carta: {
    width: 100,
    height: 130,
    backgroundColor: BLANCO,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Carta resaltada (objetivo con flecha) ─────────────────────────────
  cartaResaltada: {
    width: 100,
    height: 130,
    backgroundColor: AZUL_CLARO,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: AZUL,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: AZUL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  // ── Carta correcta (seleccionada y acertada) ──────────────────────────
  cartaCorrecta: {
    width: 100,
    height: 130,
    backgroundColor: VERDE_CLARO,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: VERDE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: VERDE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  // ── Carta incorrecta (seleccionada y fallada) ─────────────────────────
  cartaIncorrecta: {
    width: 100,
    height: 130,
    backgroundColor: ROJO_CLARO,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: ROJO,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ROJO,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Wrapper de cada carta (deja espacio arriba para la flecha) ────────
  cartaWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    // altura fija = flecha (36) + carta (130)
    height: 166,
  },

  // ── Flecha flotante SOBRE la carta, apuntando hacia abajo ─────────────
  flechaFlotante: {
    fontSize: 30,
    // ocupa su espacio natural antes de la carta
    marginBottom: 4,
  },

  // ── Emoji dentro de la carta ──────────────────────────────────────────
  simboloCarta: {
    fontSize: 50,
  },

  // ── Etiqueta "¡Toca aquí!" pegada al fondo de la carta ───────────────
  etiquetaToca: {
    backgroundColor: AZUL,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  textoToca: {
    color: BLANCO,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  // ── Mensaje de resultado ──────────────────────────────────────────────
  mensajeContenedor: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  mensajeTexto: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  mensajeCorrecto: {
    color: VERDE,
    backgroundColor: VERDE_CLARO,
  },
  mensajeError: {
    color: ROJO,
    backgroundColor: ROJO_CLARO,
  },

  // ── Botón salir (secundario, discreto) ───────────────────────────────
  botonSalir: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#94A3B8",
  },
  textoBotonSalir: {
    color: TEXTO_MEDIO,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Pantalla de finalización ──────────────────────────────────────────
  emojiGrande: {
    fontSize: 90,
    marginBottom: 10,
  },
  tituloCompletado: {
    fontSize: 32,
    fontWeight: "900",
    color: TEXTO_OSCURO,
    textAlign: "center",
    marginBottom: 12,
  },
  subtituloCompletado: {
    fontSize: 22,
    color: TEXTO_MEDIO,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 36,
    fontWeight: "500",
  },
  botonJugar: {
    backgroundColor: VERDE,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 16,
    shadowColor: VERDE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  
  textoBotonJugar: {
    color: BLANCO,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  botonSecundario: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#94A3B8",
  },
  textoBotonSecundario: {
    color: TEXTO_MEDIO,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;