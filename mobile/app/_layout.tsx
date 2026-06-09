import React from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { obtenerSesion } from "../services/sessionStorage";
import type { AuthUser } from "../services/authService";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [usuario, setUsuario] = useState<AuthUser | null | undefined>(undefined);

  // Verificar sesión al arrancar
  useEffect(() => {
    obtenerSesion().then((sesion) => {
      setUsuario(sesion); // null = no logueado, AuthUser = logueado
    });
  }, []);

  // Redirigir según estado de sesión
  useEffect(() => {
    if (usuario === undefined) return; // Todavía cargando

    const enAuth = segments[0] === "auth";

    if (!usuario && !enAuth) {
      // No logueado y no está en auth → mandar al login
      router.replace("/auth/login");
    } else if (usuario && enAuth) {
      // Logueado y está en auth → mandar al principal
      router.replace("/(principal)");
    }
  }, [usuario, segments]);

  // Pantalla de carga mientras verifica sesión
  if (usuario === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#3178b2" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#3178b2" },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen name="(principal)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login"  options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="modulo/memoria/index"         options={{ title: "" }} />
      <Stack.Screen name="modulo/memoria/juego"         options={{ title: "" }} />
      <Stack.Screen name="modulo/atencion/index"        options={{ title: "" }} />
      <Stack.Screen name="modulo/atencion/juego"        options={{ title: "" }} />
      <Stack.Screen name="modulo/coordinacion/index"    options={{ title: "" }} />
      <Stack.Screen name="modulo/coordinacion/juego"    options={{ title: "" }} />
      <Stack.Screen name="modulo/razonamiento/index"    options={{ title: "" }} />
      <Stack.Screen name="modulo/razonamiento/juego"    options={{ title: "" }} />
      <Stack.Screen name="modulo/visoespacial/index"    options={{ title: "" }} />
      <Stack.Screen name="modulo/visoespacial/juego"    options={{ title: "" }} />
      <Stack.Screen name="modulo/cognitivas/index"      options={{ title: "" }} />
      <Stack.Screen name="modulo/cognitivas/juego"      options={{ title: "" }} />
    </Stack>
  );
}