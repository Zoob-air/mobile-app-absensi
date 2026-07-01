import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AttendanceDonutChart from "../../src/components/AttendanceDonutChart";
import Button from "../../src/components/Button";
import ClockOutBarChart from "../../src/components/ClockOutBarChart";
import Header from "../../src/components/Header";
import Loading from "../../src/components/Loading";
import StatisticCard from "../../src/components/StatisticCard";
import { getAdminDashboard } from "../../src/services/adminService";
import { removeToken } from "../../src/storage/token";

type DashboardData = {
  totalPekerja: number;
  hadir: number;
  belumHadir: number;
  sudahClockOut: number;
  belumClockOut: number;
  persentase: string | number;
};

export default function AdminDashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const result = await getAdminDashboard();

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
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loading text="Memuat dashboard admin..." />;
  }

  const totalPekerja = data?.totalPekerja || 0;
  const hadir = data?.hadir || 0;
  const belumHadir = data?.belumHadir || 0;
  const sudahClockOut = data?.sudahClockOut || 0;
  const belumClockOut = data?.belumClockOut || 0;
  const persentase = data?.persentase || 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header title="Admin Dashboard" subtitle="Monitoring absensi karyawan" />

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>👋 Selamat Datang Admin</Text>
        <Text style={styles.welcomeSubText}>Statistik absensi hari ini</Text>
      </View>

      <View style={styles.grid}>
        <StatisticCard icon="👷" title="Total Pekerja" value={totalPekerja} />

        <StatisticCard icon="✅" title="Hadir" value={hadir} />

        <StatisticCard icon="❌" title="Belum Hadir" value={belumHadir} />

        <StatisticCard
          icon="🏠"
          title="Sudah Clock Out"
          value={sudahClockOut}
        />

        <StatisticCard
          icon="⌛"
          title="Belum Clock Out"
          value={belumClockOut}
        />

        <StatisticCard icon="📈" title="Persentase" value={`${persentase}%`} />
      </View>

      <AttendanceDonutChart
        hadir={hadir}
        belumHadir={belumHadir}
        persentase={persentase}
      />

      <ClockOutBarChart
        sudahClockOut={sudahClockOut}
        belumClockOut={belumClockOut}
      />

      <Button title="Refresh" onPress={loadDashboard} />

      <Button title="Logout" onPress={handleLogout} variant="danger" />

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    padding: 20,
    paddingTop: 60,
  },
  welcomeCard: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 4,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeSubText: {
    color: "#dbeafe",
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
});
