import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { getRiwayatPekerja } from "../../src/services/pekerjaService";

type RiwayatItem = {
  id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar: string;
  lokasi_masuk?: string;
  lokasi_keluar?: string;
  keterangan_masuk?: string;
  keterangan_keluar?: string;
};

export default function RiwayatScreen() {
  const [data, setData] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [bulan, setBulan] = useState<string>("");
  const [filterAktif, setFilterAktif] = useState<string>("Semua");

  const loadRiwayat = async (bulanFilter?: string) => {
    try {
      const result = await getRiwayatPekerja(bulanFilter);

      if (result.success) {
        setData(result.data || []);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil riwayat");
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
    await loadRiwayat(bulan || undefined);
  };

  const filterBulanIni = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const value = `${year}-${month}`;

    setBulan(value);
    setFilterAktif("Bulan Ini");
    setLoading(true);
    loadRiwayat(value);
  };

  const filterSemua = () => {
    setBulan("");
    setFilterAktif("Semua");
    setLoading(true);
    loadRiwayat();
  };

  useEffect(() => {
    loadRiwayat();
  }, []);

  const renderItem = ({ item }: { item: RiwayatItem }) => {
    const selesai = item.jam_keluar && item.jam_keluar !== "-";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.date}>{item.tanggal}</Text>
            <Text style={styles.location}>
              {item.lokasi_masuk || "Lokasi tidak tersedia"}
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

        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Clock In</Text>
            <Text style={styles.timeValue}>{item.jam_masuk || "-"}</Text>
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>{item.jam_keluar || "-"}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Keterangan Masuk</Text>
          <Text style={styles.detailText}>{item.keterangan_masuk || "-"}</Text>

          <Text style={styles.detailLabel}>Keterangan Keluar</Text>
          <Text style={styles.detailText}>{item.keterangan_keluar || "-"}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat riwayat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Absensi</Text>
      <Text style={styles.subtitle}>Daftar absensi pekerja</Text>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterAktif === "Semua" && styles.filterActive,
          ]}
          onPress={filterSemua}
        >
          <Text
            style={[
              styles.filterText,
              filterAktif === "Semua" && styles.filterTextActive,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterAktif === "Bulan Ini" && styles.filterActive,
          ]}
          onPress={filterBulanIni}
        >
          <Text
            style={[
              styles.filterText,
              filterAktif === "Bulan Ini" && styles.filterTextActive,
            ]}
          >
            Bulan Ini
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Belum ada riwayat absensi</Text>
            <Text style={styles.emptyText}>
              Data absensi akan muncul setelah Clock In.
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 90,
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
  loadingText: {
    marginTop: 10,
    color: "#64748b",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 18,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  filterActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterText: {
    color: "#334155",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  location: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 12,
    maxWidth: 230,
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
    gap: 12,
    marginTop: 16,
  },
  timeBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
  },
  timeLabel: {
    color: "#64748b",
    fontSize: 12,
  },
  timeValue: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
  },
  detailBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  detailLabel: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 6,
  },
  detailText: {
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
    marginTop: 12,
  },
  emptyText: {
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },
});
