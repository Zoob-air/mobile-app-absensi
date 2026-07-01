import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "../src/services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin@absensi.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      console.log("Login ke:", email);

      setLoading(true);

      const result = await login(email, password);

      console.log("Response Login:", result);

      if (result.success) {
        if (result.user?.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/auth/dashboard");
        }
      } else {
        Alert.alert("Login gagal", result.message || "Login gagal");
      }
    } catch (error: any) {
      console.log("========== LOGIN ERROR ==========");
      console.log("MESSAGE :", error.message);
      console.log("CODE :", error.code);
      console.log("STATUS :", error.response?.status);
      console.log("DATA :", error.response?.data);
      console.log("CONFIG :", error.config?.url);

      Alert.alert(
        "Login Error",
        error.response?.data?.message ||
          error.message ||
          "Tidak bisa terhubung ke server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Absensi Karyawan</Text>
        <Text style={styles.subtitle}>PT Twink Indonesia</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d4ed8",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
