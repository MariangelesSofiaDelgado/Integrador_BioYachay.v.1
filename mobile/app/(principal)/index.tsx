import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Modulo = {
    id: string;
    nombre: string;
    color: string;
    icono: ComponentProps<typeof MaterialCommunityIcons>["name"];
    ruta: Href;
};

const MODULOS: Modulo[] = [
    { id: "memoria", nombre: "MEMORIA", color: "#3ba0dc", icono: "brain", ruta: "/modulo/memoria" },
    { id: "coordinacion", nombre: "COORDINACION", color: "#2ecc71", icono: "hand-pointing-up", ruta: "/modulo/coordinacion" },
    { id: "razonamiento", nombre: "RAZONAMIENTO", color: "#f1c40f", icono: "puzzle", ruta: "/modulo/razonamiento" },
    { id: "atencion", nombre: "ATENCION", color: "#e74c3c", icono: "eye-outline", ruta: "/modulo/atencion" },
    { id: "visoespacial", nombre: "VISOESPACIAL", color: "#9b59b6", icono: "map-marker-radius-outline", ruta: "/modulo/visoespacial" },
    { id: "cognitivas", nombre: "COGNITIVAS", color: "#e67e22", icono: "cogs", ruta: "/modulo/cognitivas" },
];

export default function Index() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.contenedor}>
            <View style={styles.bienvenida}>
                <Text style={styles.titulo}>!Bienvenido a BioYachay!</Text>
                <Text style={styles.subtitulo}>Selecciona un modulo para empezar:</Text>
            </View>

            <View style={styles.grid}>
                {MODULOS.map((modulo) => (
                    <Pressable
                        key={modulo.id}
                        style={styles.tarjeta}
                        onPress={() => router.push(modulo.ruta)}
                    >
                        <MaterialCommunityIcons name={modulo.icono} size={38} color={modulo.color} />
                        <Text style={styles.tarjetaTitulo}>{modulo.nombre}</Text>
                        <View style={[styles.lineaColor, { backgroundColor: modulo.color }]} />
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: "#ececec",
        paddingBottom: 20,
    },
    bienvenida: {
        backgroundColor: "#f4f4f4",
        paddingTop: 22,
        paddingBottom: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#dfdfdf",
        marginBottom: 8,
    },
    titulo: {
        textAlign: "center",
        fontSize: 30,
        color: "#35317d",
        fontWeight: "700",
        marginBottom: 10,
    },
    subtitulo: {
        textAlign: "center",
        fontSize: 22,
        color: "#666666",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingVertical: 30,
        paddingHorizontal: 25,
        rowGap: 17,
    },
    tarjeta: {
        width: "48%",
        minHeight: 160,
        backgroundColor: "#f2f2f2",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#d7d7d7",
        elevation: 4,
    },
    tarjetaTitulo: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: "700",
        color: "#343434",
    },
    lineaColor: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
    },
});