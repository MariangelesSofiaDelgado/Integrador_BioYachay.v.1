import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3178b2",
        },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen
        name="(principal)"
        options={{
          headerShown: false,
        }}
      />
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
