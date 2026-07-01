import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getMe } from "../src/services/authService";
import { getToken, removeToken } from "../src/storage/token";

export default function Index() {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const result = await getMe();

        if (!result.success) {
          await removeToken();
          router.replace("/login");
          return;
        }

        if (result.user?.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/auth/dashboard");
        }
      } catch (error) {
        await removeToken();
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.text}>Memuat aplikasi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    color: "#64748b",
    fontWeight: "600",
  },
});
