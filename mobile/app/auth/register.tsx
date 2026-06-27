// app/auth/register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { registrar } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../services/stylesauth";

export default function RegisterScreen() {
  const router = useRouter();
  const {iniciarSesion} = useAuth();

  const [nombre,   setNombre]   = useState("");
  const [email,    setEmail]    = useState("");
  const [dni,      setDni]      = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState("");

  const validar = () => {
    if (!nombre.trim() || nombre.trim().length < 2)
      return "El nombre debe tener al menos 2 caracteres";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      return "Ingresa un email válido";
    if (!dni.trim() || !/^\d{8}$/.test(dni.trim()))
      return "El DNI debe tener exactamente 8 dígitos";
    if (!password || password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    if (password !== confirm)
      return "Las contraseñas no coinciden";
    return "";
  };

  const handleRegister = async () => {
    const err = validar();
    if (err) { setError(err); return; }

    setError("");
    setCargando(true);
    try {
      const usuario = await registrar({
        nombre: nombre.trim(),
        email:  email.trim().toLowerCase(),
        dni:    dni.trim(),
        password,
      });
      await iniciarSesion(usuario);
      router.replace("/(principal)");
    } catch (e: any) {
      setError(e.message || "Error al registrarse");
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo / Título */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>🧠</Text>
          <Text style={styles.logoTitulo}>BioYachay</Text>
          <Text style={styles.logoSub}>Crea tu cuenta gratis</Text>
        </View>

        {/* Tarjeta */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Registro</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#aaa"
            autoCapitalize="words"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>DNI (8 dígitos)</Text>
          <TextInput
            style={styles.input}
            placeholder="12345678"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            maxLength={8}
            value={dni}
            onChangeText={setDni}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite la contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Pressable
            style={[styles.botonPrimario, cargando && styles.botonDeshabilitado]}
            onPress={handleRegister}
            disabled={cargando}
          >
            {cargando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.textoBoton}>Crear cuenta</Text>
            }
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkTexto}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => router.push("/auth/login")}>
              <Text style={styles.link}>Inicia sesión</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
