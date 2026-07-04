import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Button from "../../src/components/Button";
import Header from "../../src/components/Header";
import Loading from "../../src/components/Loading";

import { generateRekap, getRekap } from "../../src/services/rekapService";

import { RekapBulanan } from "../../src/types/rekap";

export default function RekapBulananScreen() {
  const bulan = new Date().toISOString().slice(0, 7);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState<RekapBulanan[]>([]);

  const loadData = async () => {
    try {
      const result = await getRekap(bulan);

      if (result.success) {
        setData(result.data);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal mengambil rekap",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const result = await generateRekap(bulan);

      if (result.success) {
        Alert.alert("Berhasil", result.message);

        loadData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Generate gagal");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading text="Memuat Rekap..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Rekap Bulanan" subtitle={bulan} />

      <Button title="Generate Rekap" onPress={handleGenerate} />

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.nama}>{item.nama}</Text>

            <Text style={styles.jabatan}>{item.jabatan}</Text>

            <Text style={styles.percent}>{item.persentase}%</Text>

            <Text style={styles.kategori}>{item.kategori}</Text>
          </TouchableOpacity>
        )}
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

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginTop: 15,
    elevation: 4,
  },

  nama: {
    fontWeight: "bold",
    fontSize: 18,
  },

  jabatan: {
    color: "#64748b",
    marginTop: 4,
  },

  percent: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 10,
  },

  kategori: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 15,
    color: "#16a34a",
  },
});
