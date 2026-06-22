import { useEffect, useRef, useState, useCallback } from "react";
import * as Haptics from "expo-haptics";

const TIEMPO_INACTIVIDAD_MS = 8000; 

interface UseInactivityHelperParams {
  pasoActual: number | string;
  activo?: boolean;
}

interface UseInactivityHelperReturn {
  necesitaAyuda: boolean;
  registrarActividad: () => void;
}

/**
 * Hook que vigila la inactividad del usuario dentro de un paso del tutorial/juego.
 *
 * Cómo funciona:
 * - Arranca (o reinicia) un setTimeout de 8s cada vez que cambia `pasoActual`
 *   o cuando se llama a `registrarActividad()`.
 * - Si el timeout se completa sin que el usuario haya actuado, marca
 *   `necesitaAyuda = true` y dispara una vibración intermitente (patrón).
 * - El componente que use este hook debe leer `necesitaAyuda` para animar
 *   (pulse / shake) los elementos interactivos del paso actual.
 *
 * Uso típico:
 *   const { necesitaAyuda, registrarActividad } = useInactivityHelper({ pasoActual: paso });
 *   // en el handler de la acción correcta del usuario:
 *   registrarActividad();
 */
export function useInactivityHelper({
  pasoActual,
  activo = true,
}: UseInactivityHelperParams): UseInactivityHelperReturn {
  const [necesitaAyuda, setNecesitaAyuda] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vibracionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Dispara una vibración intermitente (no continua, para no ser molesta) ---
  const iniciarVibracionIntermitente = useCallback(() => {
    // Vibración inicial inmediata al detectar inactividad
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Luego repite una vibración suave cada 2.5s mientras siga inactivo
    vibracionIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 2500);
  }, []);

  const detenerVibracion = useCallback(() => {
    if (vibracionIntervalRef.current) {
      clearInterval(vibracionIntervalRef.current);
      vibracionIntervalRef.current = null;
    }
  }, []);

  // --- Reinicia el ciclo de espera de 8s ---
  const registrarActividad = useCallback(() => {
    // Si el usuario actúa, cancelamos cualquier ayuda visual/háptica en curso
    setNecesitaAyuda(false);
    detenerVibracion();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!activo) return;

    // 🔑 TIMER PRINCIPAL DE 8 SEGUNDOS
    // Si no hay otra llamada a registrarActividad() antes de que esto dispare,
    // se asume que el usuario está "perdido" y se activa la ayuda.
    timeoutRef.current = setTimeout(() => {
      setNecesitaAyuda(true);
      iniciarVibracionIntermitente();
    }, TIEMPO_INACTIVIDAD_MS);
  }, [activo, detenerVibracion, iniciarVibracionIntermitente]);

  // Cada vez que cambia el paso, reiniciamos el contador desde cero
  useEffect(() => {
    registrarActividad();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      detenerVibracion();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoActual, activo]);

  return { necesitaAyuda, registrarActividad };
}