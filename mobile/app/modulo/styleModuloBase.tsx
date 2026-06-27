
import { Dimensions, StyleSheet } from "react-native";
const { height: SH, width: SW } = Dimensions.get("window");


export const ZONA_SUPERIOR_FLEX = 0.52;
export const TARJETA_FLEX       = 0.48;

export const PREVIEW_SIZE = Math.min(SW * 0.72, 260);

export const FONT = {
  titulo: 32 as const,
  subtitulo: 16 as const,
  body: 15 as const,
  tag: 14 as const,
  boton: 17 as const,
};

export function crearEstilosModulo(color: string, colorOscuro: string) {
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: "#f0f0f0",
    },

    // ─ Zona superior (preview) ───────────────────────────────────────────────
    zonaSuperior: {
      flex: ZONA_SUPERIOR_FLEX,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 0,
      overflow: "hidden",
    },
    tituloWrapper: {
    backgroundColor: color,
      width: "100%",
      alignItems: "center",
      marginBottom: 8,
      padding: 22,
    },
    titulo: {
      fontSize: FONT.titulo,
      fontWeight: "800",
      color: "#ffff",
      textAlign: "center",
    },
    tituloLinea: {
      width: 200,
      height: 3,
      backgroundColor: color,
      borderRadius: 999,
      marginTop: 4,
    },

    // ─ Área de preview (captura estática del juego) ───────────────────────────
    previewContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    previewCard: {
      width: PREVIEW_SIZE,
      aspectRatio: 1,
      backgroundColor: "#ffffff",
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: color + "44",   // color con 27% opacidad
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      elevation: 3,
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
    },

    // ─ Tarjeta blanca inferior ────────────────────────────────────────────────
    tarjeta: {
      flex: TARJETA_FLEX,
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      justifyContent: "space-between",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
    },

    // ─ Fila objetivo ──────────────────────────────────────────────────────────
    filaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    tagObjetivo: {
      backgroundColor: color + "22",
      paddingVertical: 4,
      paddingHorizontal: 14,
      borderRadius: 999,
    },
    tagObjetivoTexto: {
      fontSize: FONT.tag,
      fontWeight: "700",
      color,
    },

    // ─ Descripción ────────────────────────────────────────────────────────────
    descripcionBox: {
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    descripcionTexto: {
      fontSize: FONT.body,
      color: "#444",
      fontWeight: "500",
    },

    // ─ Instrucciones ──────────────────────────────────────────────────────────
    instruccionesTag: {
      alignSelf: "flex-start",
      backgroundColor: "#948efd",
      paddingVertical: 4,
      paddingHorizontal: 14,
      borderRadius: 999,
      marginBottom: 6,
    },
    instruccionesTagTexto: {
      fontSize: 13,
      fontWeight: "700",
      color: "#fff",
    },
    instruccionesLista: {
      gap: 3,
    },
    instruccionLinea: {
      fontSize: FONT.body,
      color: "#555",
      fontWeight: "500",
    },

    // ─ Fila de botones ────────────────────────────────────────────────────────
    filaBotones: {
      flexDirection: "row",
      marginTop: 6,
      marginBottom: 20,
    },
    botonIniciar: {
      flex: 1,
      backgroundColor: color,
      borderRadius: 999,
      paddingVertical: 13,
      alignItems: "center",
      justifyContent: "center",
    },
    textoBoton: {
      color: "#fff",
      fontSize: FONT.boton,
      fontWeight: "700",
    },
  });
}