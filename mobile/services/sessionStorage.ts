
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "./authService";

const KEY = "bioyachay_session";

export async function guardarSesion(usuario: AuthUser): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(usuario));
}

export async function obtenerSesion(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function cerrarSesion(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
