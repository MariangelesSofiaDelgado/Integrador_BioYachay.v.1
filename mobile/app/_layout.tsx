import React from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function LayoutContent() {
  const router = useRouter();
  const segments = useSegments();
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario === undefined) return; // Todavía cargando

    const enAuth = segments[0] === "auth";

    if (!usuario && !enAuth) {
      router.replace("/auth/login");
    } else if (usuario && enAuth) {
      router.replace("/(principal)");
    }
  }, [usuario, segments]);

  if (usuario === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#6d67cf" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#6d67cf" },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen name="(principal)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="modulo/memoria/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/memoria/juego" options={{ title: "" }} />
      <Stack.Screen name="modulo/atencion/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/atencion/juego" options={{ title: "" }} />
      <Stack.Screen name="modulo/coordinacion/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/coordinacion/juego" options={{ title: "" }} />
      <Stack.Screen name="modulo/razonamiento/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/razonamiento/juego" options={{ title: "" }} />
      <Stack.Screen name="modulo/visoespacial/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/visoespacial/juego" options={{ title: "" }} />
      <Stack.Screen name="modulo/cognitivas/index" options={{ title: "" }} />
      <Stack.Screen name="modulo/cognitivas/juego" options={{ title: "" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}