import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAdminRiwayat } from "../../src/services/adminService";

type RiwayatItem = {
  id: number;
  nik: string;
  nama: string;
  jabatan: string;

  tanggal: string;

  jam_masuk: string;
  jam_keluar: string;

  latitude_masuk?: string;
  longitude_masuk?: string;

  latitude_keluar?: string;
  longitude_keluar?: string;

  lokasi_masuk?: string;
  lokasi_keluar?: string;

  keterangan_masuk?: string;
  keterangan_keluar?: string;
};

export default function AdminRiwayatScreen() {
  const [data, setData] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");

  const loadData = async () => {
    try {
      const result = await getAdminRiwayat({
        nama,
        jabatan,
      });

      if (result.success) {
        setData(result.data || []);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil riwayat");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa mengambil riwayat",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleResetFilter = async () => {
    setNama("");
    setJabatan("");
    setLoading(true);

    try {
      const result = await getAdminRiwayat();

      if (result.success) {
        setData(result.data || []);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa mengambil riwayat",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat riwayat admin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Admin</Text>
      <Text style={styles.subtitle}>Riwayat absensi semua karyawan</Text>

      <View style={styles.filterCard}>
        <TextInput
          style={styles.input}
          placeholder="Cari nama..."
          value={nama}
          onChangeText={setNama}
        />

        <TextInput
          style={styles.input}
          placeholder="Cari jabatan..."
          value={jabatan}
          onChangeText={setJabatan}
        />

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton} onPress={loadData}>
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilter}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
          </View>
        }
        renderItem={({ item }) => {
          const selesai = item.jam_keluar && item.jam_keluar !== "-";

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/admin/detail-riwayat?id=${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.nama}</Text>
                  <Text style={styles.meta}>
                    {item.nik} • {item.jabatan}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    selesai ? styles.badgeDone : styles.badgeProgress,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {selesai ? "Selesai" : "Berjalan"}
                  </Text>
                </View>
              </View>

              <Text style={styles.date}>{item.tanggal}</Text>

              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>Masuk</Text>
                  <Text style={styles.timeValue}>{item.jam_masuk || "-"}</Text>
                </View>

                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>Keluar</Text>
                  <Text style={styles.timeValue}>{item.jam_keluar || "-"}</Text>
                </View>
              </View>

              <Text style={styles.infoTitle}>Keterangan Masuk</Text>
              <Text style={styles.infoText}>
                {item.keterangan_masuk || "-"}
              </Text>

              <Text style={styles.infoTitle}>Keterangan Keluar</Text>
              <Text style={styles.infoText}>
                {item.keterangan_keluar || "-"}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
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
    backgroundColor: "#eef4ff",
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
    marginBottom: 15,
  },
  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#64748b",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },
  meta: {
    color: "#64748b",
    marginTop: 3,
  },
  date: {
    color: "#1d4ed8",
    fontWeight: "bold",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    height: 30,
  },
  badgeDone: {
    backgroundColor: "#dcfce7",
  },
  badgeProgress: {
    backgroundColor: "#ffedd5",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
  },
  timeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  timeBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
  },
  timeLabel: {
    color: "#64748b",
    fontSize: 12,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2563eb",
  },
  infoTitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 8,
  },
  infoText: {
    color: "#111827",
    fontWeight: "600",
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 10,
  },
});
