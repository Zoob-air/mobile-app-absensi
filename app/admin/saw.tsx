import { router } from "expo-router";
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

import { generateSAW, getSAW } from "../../src/services/sawService";

import { SawItem } from "../../src/types/saw";

export default function SawScreen() {
  const bulan = new Date().toISOString().slice(0, 7);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState<SawItem[]>([]);

  const loadData = async () => {
    try {
      const result = await getSAW(bulan);

      if (result.success) {
        setData(result.data);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal mengambil data",
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

  const handleGenerate = async () => {
    try {
      const result = await generateSAW(bulan);

      if (result.success) {
        Alert.alert("Berhasil", result.message);

        loadData();
      }
    } catch (error: any) {
      console.log("SAW GENERATE ERROR:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Generate gagal");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading text="Memuat Penilaian SAW..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Penilaian SAW" subtitle={bulan} />

      <Button title="Generate SAW" onPress={handleGenerate} />

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          let medal = "";

          if (index === 0) medal = "🥇";
          else if (index === 1) medal = "🥈";
          else if (index === 2) medal = "🥉";

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/admin/detail-saw?id=${item.id}`)}
            >
              <Text style={styles.rank}>
                {medal} #{item.ranking}
              </Text>

              <Text style={styles.nama}>{item.nama}</Text>

              <Text style={styles.jabatan}>{item.jabatan}</Text>

              <Text style={styles.score}>{item.skor_akhir}</Text>

              <Text style={styles.kategori}>{item.kategori}</Text>
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

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginTop: 15,
    elevation: 4,
  },

  rank: {
    fontWeight: "bold",
    fontSize: 16,
  },

  nama: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },

  jabatan: {
    color: "#64748b",
    marginTop: 3,
  },

  score: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 10,
  },

  kategori: {
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 5,
  },
});
