import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import Button from "../../src/components/Button";
import Header from "../../src/components/Header";
import Loading from "../../src/components/Loading";
import {
    addHoliday,
    deleteHoliday,
    getHolidays,
    updateHoliday,
} from "../../src/services/holidayService";
import { Holiday, HolidayType } from "../../src/types/holiday";

export default function AdminHolidaysScreen() {
  const [data, setData] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tipe, setTipe] = useState<HolidayType>("tanggal_merah");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const result = await getHolidays();

      if (result.success) {
        setData(result.data || []);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil hari libur");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa mengambil hari libur",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTanggal("");
    setKeterangan("");
    setTipe("tanggal_merah");
  };

  const handleSubmit = async () => {
    if (!tanggal || !keterangan || !tipe) {
      return Alert.alert(
        "Validasi",
        "Tanggal, keterangan, dan tipe wajib diisi",
      );
    }

    try {
      setSaving(true);

      const payload = {
        tanggal,
        keterangan,
        tipe,
      };

      const result = editId
        ? await updateHoliday(editId, payload)
        : await addHoliday(payload);

      if (result.success) {
        Alert.alert(
          "Berhasil",
          editId
            ? "Hari libur berhasil diupdate"
            : "Hari libur berhasil ditambahkan",
        );
        resetForm();
        await loadData();
      } else {
        Alert.alert("Gagal", result.message || "Gagal menyimpan data");
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Gagal menyimpan hari libur",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Holiday) => {
    setEditId(item.id);
    setTanggal(item.tanggal);
    setKeterangan(item.keterangan);
    setTipe(item.tipe);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus Hari Libur", "Yakin ingin menghapus data ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await deleteHoliday(id);

            if (result.success) {
              Alert.alert("Berhasil", "Hari libur berhasil dihapus");
              await loadData();
            } else {
              Alert.alert("Gagal", result.message || "Gagal menghapus data");
            }
          } catch (error: any) {
            Alert.alert(
              "Gagal",
              error.response?.data?.message || "Gagal menghapus hari libur",
            );
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading text="Memuat hari libur..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Hari Libur"
        subtitle="Kelola tanggal merah dan cuti bersama"
      />

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editId ? "Edit Hari Libur" : "Tambah Hari Libur"}
        </Text>

        <Text style={styles.label}>Tanggal</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD, contoh 2026-07-17"
          value={tanggal}
          onChangeText={setTanggal}
        />

        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Hari Kemerdekaan"
          value={keterangan}
          onChangeText={setKeterangan}
        />

        <Text style={styles.label}>Tipe</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.option,
              tipe === "tanggal_merah" && styles.optionActive,
            ]}
            onPress={() => setTipe("tanggal_merah")}
          >
            <Text
              style={[
                styles.optionText,
                tipe === "tanggal_merah" && styles.optionTextActive,
              ]}
            >
              Tanggal Merah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              tipe === "cuti_bersama" && styles.optionActive,
            ]}
            onPress={() => setTipe("cuti_bersama")}
          >
            <Text
              style={[
                styles.optionText,
                tipe === "cuti_bersama" && styles.optionTextActive,
              ]}
            >
              Cuti Bersama
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={editId ? "Update Hari Libur" : "Simpan Hari Libur"}
          onPress={handleSubmit}
          loading={saving}
          variant={editId ? "warning" : "success"}
        />

        {editId && (
          <Button title="Batal Edit" onPress={resetForm} variant="secondary" />
        )}
      </View>

      <Text style={styles.listTitle}>Daftar Hari Libur</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada data hari libur</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemDate}>{item.tanggal}</Text>
              <Text style={styles.itemText}>{item.keterangan}</Text>

              <View
                style={[
                  styles.badge,
                  item.tipe === "tanggal_merah"
                    ? styles.badgeRed
                    : styles.badgeOrange,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.tipe === "tanggal_merah"
                    ? "Tanggal Merah"
                    : "Cuti Bersama"}
                </Text>
              </View>
            </View>

            <View style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    elevation: 4,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  label: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  option: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  optionText: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 12,
  },
  optionTextActive: {
    color: "#fff",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    gap: 12,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
  },
  itemText: {
    color: "#111827",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
  },
  badgeOrange: {
    backgroundColor: "#ffedd5",
  },
  badgeText: {
    fontSize: 12,
    color: "#7f1d1d",
    fontWeight: "bold",
  },
  actionColumn: {
    justifyContent: "center",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#f97316",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontWeight: "600",
  },
});
