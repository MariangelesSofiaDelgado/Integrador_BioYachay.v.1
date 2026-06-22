import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "bioyachay_tutorial_visto_";


export async function marcarTutorialVisto(moduloId: string): Promise<void> {
  await AsyncStorage.setItem(KEY + moduloId, "true");
}


export async function yaVioTutorial(moduloId: string): Promise<boolean> {
  try {
    const valor = await AsyncStorage.getItem(KEY + moduloId);
    return valor === "true";
  } catch {
    return false;
  }
}

export async function reiniciarTutorial(moduloId: string): Promise<void> {
  await AsyncStorage.removeItem(KEY + moduloId);
}