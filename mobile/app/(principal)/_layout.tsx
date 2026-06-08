import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3178b2",
        },
        headerTintColor: "#ffffff",
        tabBarActiveTintColor: "#3178b2",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Juego",
          headerTitle: "",
          tabBarIcon: ({color,size}) => <Ionicons name="home" color={color} size={size}></Ionicons>
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          headerTitle: "",
          tabBarIcon: ({color, size}) => <Ionicons name="person" color={color} size={size}></Ionicons>,
        }}
      />
    </Tabs>
  );
}
