import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { AuthUser } from "../../services/authService";
import { login, registrar } from "../../services/authService";
import { cerrarSesion, guardarSesion, obtenerSesion } from "../../services/sessionStorage";
import { styles as perfilStyles } from "./styles/stylesperfil";
import authStyles from "../../services/stylesauth";

function PantallaAuth({ onLogin }: { onLogin: (u: AuthUser) => void }) {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [emailR, setEmailR] = useState("");
  const [dni, setDni] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [confirm, setConfirm] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const validarLogin = () => {
    if (!email.trim()) return "Ingresa tu email";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email no válido";
    if (!password.trim()) return "Ingresa tu contraseña";
    return "";
  };

  const validarRegister = () => {
    if (!nombre.trim() || nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (!emailR.trim() || !/\S+@\S+\.\S+/.test(emailR)) return "Ingresa un email válido";
    if (!dni.trim() || !/^\d{8}$/.test(dni.trim())) return "El DNI debe tener exactamente 8 dígitos";
    if (!passwordR || passwordR.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (passwordR !== confirm) return "Las contraseñas no coinciden";
    return "";
  };

  const handleLogin = async () => {
    const err = validarLogin();
    if (err) { setError(err); return; }
    setError(""); setCargando(true);
    try {
      const usuario = await login({ email: email.trim().toLowerCase(), password });
      await guardarSesion(usuario);
      onLogin(usuario);
      router.replace("/(principal)");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
    } finally { setCargando(false); }
  };

  const handleRegister = async () => {
    const err = validarRegister();
    if (err) { setError(err); return; }
    setError(""); setCargando(true);
    try {
      const usuario = await registrar({
        nombre: nombre.trim(),
        email: emailR.trim().toLowerCase(),
        dni: dni.trim(),
        password: passwordR,
      });
      await guardarSesion(usuario);
      onLogin(usuario);
      router.replace("/(principal)");
    } catch (e: any) {
      setError(e.message || "Error al registrarse");
    } finally { setCargando(false); }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={authStyles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={authStyles.logoArea}>
          <Text style={authStyles.logoEmoji}>🧠</Text>
          <Text style={authStyles.logoTitulo}>BioYachay</Text>
          <Text style={authStyles.logoSub}>
            {modo === "login" ? "Entrena tu mente cada día" : "Crea tu cuenta gratis"}
          </Text>
        </View>

        {/* Tarjeta */}
        <View style={authStyles.card}>
          <Text style={authStyles.cardTitulo}>
            {modo === "login" ? "Iniciar Sesión" : "Registro"}
          </Text>

          {error ? <Text style={authStyles.errorBanner}>{error}</Text> : null}

          {/* ── LOGIN ── */}
          {modo === "login" && (
            <>
              <Text style={authStyles.label}>Correo electrónico</Text>
              <TextInput
                style={authStyles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Text style={authStyles.label}>Contraseña</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={[authStyles.botonPrimario, cargando && authStyles.botonDeshabilitado]}
                onPress={handleLogin}
                disabled={cargando}
              >
                {cargando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={authStyles.textoBoton}>Entrar</Text>
                }
              </Pressable>
              <View style={authStyles.linkRow}>
                <Text style={authStyles.linkTexto}>¿No tienes cuenta? </Text>
                <Pressable onPress={() => { setError(""); setModo("register"); }}>
                  <Text style={authStyles.link}>Regístrate</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ── REGISTRO ── */}
          {modo === "register" && (
            <>
              <Text style={authStyles.label}>Nombre completo</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
                value={nombre}
                onChangeText={setNombre}
              />
              <Text style={authStyles.label}>Correo electrónico</Text>
              <TextInput
                style={authStyles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailR}
                onChangeText={setEmailR}
              />
              <Text style={authStyles.label}>DNI (8 dígitos)</Text>
              <TextInput
                style={authStyles.input}
                placeholder="12345678"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={8}
                value={dni}
                onChangeText={setDni}
              />
              <Text style={authStyles.label}>Contraseña</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={passwordR}
                onChangeText={setPasswordR}
              />
              <Text style={authStyles.label}>Confirmar contraseña</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Repite la contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
              />
              <Pressable
                style={[authStyles.botonPrimario, cargando && authStyles.botonDeshabilitado]}
                onPress={handleRegister}
                disabled={cargando}
              >
                {cargando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={authStyles.textoBoton}>Crear cuenta</Text>
                }
              </Pressable>
              <View style={authStyles.linkRow}>
                <Text style={authStyles.linkTexto}>¿Ya tienes cuenta? </Text>
                <Pressable onPress={() => { setError(""); setModo("login"); }}>
                  <Text style={authStyles.link}>Inicia sesión</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Pantalla cuando SÍ hay sesión ───────────────────────────────────────────
function PantallaPerfil({ usuario, onLogout }: { usuario: AuthUser; onLogout: () => void }) {
  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmar = window.confirm("¿Deseas cerrar sesión?");
      if (confirmar) {
        cerrarSesion().then(() => onLogout());
      }
    } else {
      Alert.alert("Cerrar sesión", "¿Deseas salir de tu cuenta?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await cerrarSesion();
            onLogout();
          },
        },
      ]);
    }
  };

  const modulos = [
    { nombre: "Memoria", color: "#3ba0dc", icono: "brain" as const },
    { nombre: "Coordinación", color: "#2ecc71", icono: "hand-pointing-up" as const },
    { nombre: "Razonamiento", color: "#f1c40f", icono: "puzzle" as const },
    { nombre: "Atención", color: "#e74c3c", icono: "eye-outline" as const },
    { nombre: "Visoespacial", color: "#9b59b6", icono: "map-marker-radius-outline" as const },
    { nombre: "Cognitivas", color: "#e67e22", icono: "cogs" as const },
  ];

  return (
    <ScrollView contentContainerStyle={perfilStyles.page}>
      <View style={perfilStyles.container}>
        <View style={[perfilStyles.avatar, { backgroundColor: usuario.avatarColor ?? "#3178b2" }]}>
          <Ionicons name="person" size={78} color="#ffffff" />
        </View>
        <Text style={perfilStyles.nickname}>{usuario.nombre}</Text>
        <Text style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, marginBottom: 4 }}>
          {usuario.email}
        </Text>
        <Pressable
          onPress={handleLogout}
          style={{
            marginTop: 10,
            backgroundColor: "rgba(255,255,255,0.18)",
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            🚪 Cerrar sesión
          </Text>
        </Pressable>
      </View>

      <View style={perfilStyles.modulesGrid}>
        {modulos.map((m) => (
          <View key={m.nombre} style={perfilStyles.moduleCard}>
            <View style={[perfilStyles.moduleCircle, { backgroundColor: m.color }]}>
              <MaterialCommunityIcons name={m.icono} size={32} color="#ffffff" />
            </View>
            <Text style={perfilStyles.moduleName}>{m.nombre}</Text>
            <View style={perfilStyles.statusBorder}>
              <View style={perfilStyles.statusBarBg}>
                <View style={[perfilStyles.statusFill, { width: "0%", backgroundColor: m.color }]} />
              </View>
            </View>
            <Text style={perfilStyles.statusLabel}>0%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Perfil() {
  const [usuario, setUsuario] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    obtenerSesion().then(setUsuario);
  }, []);

  if (usuario === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ececec" }}>
        <ActivityIndicator size="large" color="#3178b2" />
      </View>
    );
  }

  if (!usuario) {
    return <PantallaAuth onLogin={(u) => setUsuario(u)} />;
  }

  return <PantallaPerfil usuario={usuario} onLogout={() => setUsuario(null)} />;
}