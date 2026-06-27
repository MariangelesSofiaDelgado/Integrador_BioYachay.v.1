import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, } from "react-native";
import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../services/stylesauth";

export default function LoginScreen() {
  const router = useRouter();
  const {iniciarSesion} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const validar = () => {
    if (!email.trim()) return "Ingresa tu email";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email no válido";
    if (!password.trim()) return "Ingresa tu contraseña";
    return "";
  };

  const handleLogin = async () => {
    const err = validar();
    if (err) { setError(err); return; }

    setError("");
    setCargando(true);
    try {
      const usuario = await login({ email: email.trim().toLowerCase(), password });
      await iniciarSesion(usuario);
      router.replace("/(principal)");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
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
          <Text style={styles.logoSub}>Entrena tu mente cada día</Text>
        </View>

        {/* Tarjeta */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Iniciar Sesión</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

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

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={[styles.botonPrimario, cargando && styles.botonDeshabilitado]}
            onPress={handleLogin}
            disabled={cargando}
          >
            {cargando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.textoBoton}>Entrar</Text>
            }
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkTexto}>¿No tienes cuenta? </Text>
            <Pressable onPress={() => router.push("/auth/register")}>
              <Text style={styles.link}>Regístrate</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
