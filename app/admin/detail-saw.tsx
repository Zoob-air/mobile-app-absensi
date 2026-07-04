import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Header from "../../src/components/Header";
import { getSawDetail } from "../../src/services/sawService";

export default function DetailSawScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getSawDetail(id as string);

      if (result.success) {
        setData(result.data);
      } else {
        Alert.alert("Gagal", result.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal mengambil detail SAW",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat Detail SAW...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Detail Penilaian SAW" subtitle={data.bulan} />

      <View style={styles.card}>
        <Text style={styles.nama}>{data.nama}</Text>

        <Text style={styles.meta}>{data.nik}</Text>

        <Text style={styles.meta}>{data.jabatan}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Rekap Kehadiran</Text>

        <Item
          label="Hari Kerja Efektif"
          value={`${data.hari_kerja_efektif} Hari`}
        />

        <Item label="Hadir" value={`${data.hadir} Hari`} />

        <Item label="Tidak Hadir" value={`${data.tidak_hadir} Hari`} />

        <Item label="Lembur" value={`${data.lembur} Hari`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Kedisiplinan</Text>

        <Item label="Tepat Waktu" value={`${data.tepat_waktu} Hari`} />

        <Item label="Terlambat" value={`${data.terlambat} Hari`} />

        <Item
          label="Clock Out Lengkap"
          value={`${data.clockout_lengkap} Hari`}
        />

        <Item label="Belum Clock Out" value={`${data.clockout_belum} Hari`} />

        <Item label="Selfie Lengkap" value={`${data.selfie_lengkap} Hari`} />

        <Item
          label="Selfie Tidak Lengkap"
          value={`${data.selfie_belum} Hari`}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Nilai Kriteria</Text>

        <Item label="C1 Kehadiran" value={data.c1_kehadiran} />

        <Item label="C2 Tepat Waktu" value={data.c2_tepat_waktu} />

        <Item label="C3 Clock Out" value={data.c3_clockout} />

        <Item label="C4 Selfie" value={data.c4_selfie} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Hasil SAW</Text>

        <Item label="Skor Akhir" value={data.skor_akhir} />

        <Item label="Ranking" value={`#${data.ranking}`} />

        <Item label="Kategori" value={data.kategori} />
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  nama: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  meta: {
    color: "#64748b",
    marginTop: 4,
  },

  section: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 14,
    color: "#2563eb",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 7,
  },

  label: {
    color: "#64748b",
    fontSize: 15,
  },

  value: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 15,
  },
});
