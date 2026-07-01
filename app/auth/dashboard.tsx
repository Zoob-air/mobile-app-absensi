import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../../src/services/authService";
import { getDashboardPekerja } from "../../src/services/pekerjaService";

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const result = await getDashboardPekerja();

      if (result.success) {
        setData(result.data);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil data");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa terhubung ke server",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Pekerja</Text>
      <Text style={styles.subtitle}>Absensi Karyawan</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{data?.nama}</Text>

        <Text style={styles.label}>Jabatan</Text>
        <Text style={styles.value}>{data?.jabatan}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{data?.status}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.label}>Jam Masuk</Text>
          <Text style={styles.time}>{data?.jamMasuk}</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.label}>Jam Keluar</Text>
          <Text style={styles.time}>{data?.jamKeluar}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.absensiButton}
        onPress={() => router.push("/auth/absensi")}
      >
        <Text style={styles.buttonText}>Absensi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={loadDashboard}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    padding: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
  },
  label: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 8,
  },
  value: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  absensiButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
});
