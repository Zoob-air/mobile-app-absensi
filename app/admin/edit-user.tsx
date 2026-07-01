import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getAdminUsers,
    updateAdminUser,
} from "../../src/services/adminService";

export default function EditUserScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    email: "",
    no_hp: "",
    jabatan: "",
    role: "pekerja",
    status: "aktif",
  });

  const setField = (key: string, value: string) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const loadUser = async () => {
    try {
      const result = await getAdminUsers();

      if (result.success) {
        const user = result.data.find(
          (item: any) => item.id.toString() === id?.toString(),
        );

        if (!user) {
          Alert.alert("Error", "User tidak ditemukan");
          router.back();
          return;
        }

        setForm({
          nik: user.nik || "",
          nama: user.nama || "",
          email: user.email || "",
          no_hp: user.no_hp || "",
          jabatan: user.jabatan || "",
          role: user.role || "pekerja",
          status: user.status || "aktif",
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal mengambil user",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.email) {
      return Alert.alert("Validasi", "Nama dan email wajib diisi");
    }

    try {
      const result = await updateAdminUser(Number(id), form);

      if (result.success) {
        Alert.alert("Berhasil", "User berhasil diupdate");
        router.replace("/admin/users");
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Gagal update user",
      );
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat user...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <Text style={styles.subtitle}>Ubah data karyawan</Text>

      <View style={styles.card}>
        <Input
          label="NIK"
          value={form.nik}
          onChangeText={(v: string) => setField("nik", v)}
        />
        <Input
          label="Nama"
          value={form.nama}
          onChangeText={(v: string) => setField("nama", v)}
        />
        <Input
          label="Email"
          value={form.email}
          onChangeText={(v: string) => setField("email", v)}
        />
        <Input
          label="No HP"
          value={form.no_hp}
          onChangeText={(v: string) => setField("no_hp", v)}
        />
        <Input
          label="Jabatan"
          value={form.jabatan}
          onChangeText={(v: string) => setField("jabatan", v)}
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.optionRow}>
          <Option
            label="pekerja"
            active={form.role === "pekerja"}
            onPress={() => setField("role", "pekerja")}
          />
          <Option
            label="admin"
            active={form.role === "admin"}
            onPress={() => setField("role", "admin")}
          />
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.optionRow}>
          <Option
            label="aktif"
            active={form.status === "aktif"}
            onPress={() => setField("status", "aktif")}
          />
          <Option
            label="nonaktif"
            active={form.status === "nonaktif"}
            onPress={() => setField("status", "nonaktif")}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

function Input({ label, value, onChangeText }: any) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
      />
    </>
  );
}

function Option({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.option, active && styles.optionActive]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 18,
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
    marginBottom: 8,
  },
  option: {
    flex: 1,
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
  },
  optionTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#64748b",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
