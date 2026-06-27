import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { obtenerSesion, guardarSesion as guardarSesionStorage, cerrarSesion as cerrarSesionStorage } from "../services/sessionStorage";
import type { AuthUser } from "../services/authService";

interface AuthContextType {
  usuario: AuthUser | null | undefined; // undefined = cargando, null = no logueado
  iniciarSesion: (usuario: AuthUser) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    obtenerSesion().then((sesion) => {
      setUsuario(sesion);
    });
  }, []);

  const iniciarSesion = async (nuevoUsuario: AuthUser) => {
    await guardarSesionStorage(nuevoUsuario);
    setUsuario(nuevoUsuario); // <- esto es lo que faltaba: actualizar el estado compartido
  };

  const cerrarSesion = async () => {
    await cerrarSesionStorage();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}