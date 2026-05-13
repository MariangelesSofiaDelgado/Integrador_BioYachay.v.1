import { StyleSheet } from "react-native";

export default StyleSheet.create({
    contenedor: { 
        flex: 1, 
        backgroundColor: '#ececec', 
        padding: 20, 
        justifyContent: 'flex-start' 
    },
    container: { 
        flex: 1, 
        backgroundColor: '#ececec' 
    },
    titulo: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#2f5279', 
        textAlign: 'center', 
        marginBottom: 10 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        alignItems: 'center' 
    },
    headerText: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    targetContainer: { 
        alignItems: 'center', 
        marginVertical: 50 
    },
    outerCircle: { 
        width: 180, 
        height: 180, 
        borderRadius: 90, 
        backgroundColor: '#7B92FF', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    innerCircle: { 
        width: 140, 
        height: 140, 
        borderRadius: 70, 
        backgroundColor: '#4A90E2', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 5, 
        borderColor: '#81D4FA' 
    },
    targetText: { 
        fontSize: 60, 
        color: 'white', 
        fontWeight: 'bold' 
    },
    grid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
         gap: 15, padding: 20 
        },
    carta: { 
        width: 80,
        height: 80, 
        backgroundColor: 'white', 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 5 
    },
    selectedBox: { 
        backgroundColor: '#4A90E2' 
    },
    simbolo: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    marcador: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#2f5279', 
        textAlign: 'center', 
        marginTop: 10 
    },
    botonIniciar: { 
        alignSelf: 'center', 
        backgroundColor: '#4A90E2', 
        paddingHorizontal: 28, 
        paddingVertical: 12, 
        borderRadius: 10 
    },
    textoBoton: { 
        color: '#ffffff', 
        fontSize: 16, 
        fontWeight: '700' 
    },
    botonVolver: { 
        alignSelf: 'center', 
        backgroundColor: '#666', 
        paddingHorizontal: 28, 
        paddingVertical: 12, 
        borderRadius: 10, 
        marginTop: 20 
    },
    resumenContainer: { 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        padding: 20, 
        marginVertical: 20, 
        alignItems: 'center'
    },
    resumenTexto: { 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#333', 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    resumenNumero: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#2f5279' 
    },
});
