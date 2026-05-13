import { StyleSheet } from "react-native";

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#ededed",
    },
    contenedor: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 25,
        borderRadius: 20,
        shadowColor: "#00000042",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#e93232",
        textAlign: "center",
        marginTop: 12,
        marginBottom: 4,
    },
    tituloLinea: {
        width: 250,
        height: 3,
        backgroundColor: "#e93232",
        alignSelf: "center",
        borderRadius: 999,
        marginTop: 3,
        marginBottom: 18,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 12,
        marginBottom: 6,
    },

    objectContenedor: {
        alignSelf: "flex-start",
        width: 240,
        backgroundColor: "#f6f6f6",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginLeft: 12,
        top: -28,
    },
    objetivoContenedor: {
        alignSelf: "flex-start",
        width: 110,
        backgroundColor: "#7dc123",
        paddingVertical: 6,
        paddingBottom: 20,
        paddingHorizontal: 13,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 6,
        elevation: 5,
    },
    objetivoTitulo: {
        fontSize: 18,
        fontWeight: "500",
        color: "#fff",
    },
    objetivoDescripcion: {
        fontSize: 16,
        color: "#000000",
        margin: 2,
    },

    instruccionesContenedor: {
        alignSelf: "flex-start",
        width: 150,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: "#549be5",
        elevation: 4,
    },
    instruccionesTitulo: {
        fontSize: 18,
        fontWeight: "500",
        color: "#fff",
    },

    botonBase: {
        alignSelf: "center",
        backgroundColor: "#ce540e",
        borderRadius: 20,
        marginTop: 40,
        paddingHorizontal: 0,
        paddingVertical: 3,
    },

    botonIniciar: {
        alignSelf: "center",
        backgroundColor: "#faa638",
        paddingHorizontal: 60,
        paddingVertical: 8,
        borderRadius: 20,
        position: "relative",
        top: -6,
        elevation: 4,
    },

    textoBoton: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },

    espacioJuego: {
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        marginBottom: 22,
    },
    indicaciones: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    indicacion: {
        fontSize: 16,
        marginBottom: 6,
        color: "#333",
    },

    iconContainer: {
        width: 230,
        height: 230,
        backgroundColor: '#F0F0F0',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    miniGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 195, justifyContent: 'center' },
    miniNum: { width: 56, height: 56, textAlign: 'center', textAlignVertical: 'center', borderWidth: 1, borderColor: '#DDD', fontSize: 30, margin: 4, backgroundColor: '#ffffff' },
    blueBox: { backgroundColor: '#4A90E2', color: '#fff' },
});
