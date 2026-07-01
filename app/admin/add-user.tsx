import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { addAdminUser } from "../../src/services/adminService";

type FormState = {
  nik: string;
  nama: string;
  email: string;
  no_hp: string;
  jabatan: string;
  password: string;
  role: "admin" | "pekerja";
  status: "aktif" | "nonaktif";
};

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
};

type OptionProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export default function AddUserScreen() {
  const [form, setForm] = useState<FormState>({
    nik: "",
    nama: "",
    email: "",
    no_hp: "",
    jabatan: "",
    password: "123456",
    role: "pekerja",
    status: "aktif",
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.email || !form.password) {
      return Alert.alert("Validasi", "Nama, email, dan password wajib diisi");
    }

    try {
      const result = await addAdminUser(form);

      if (result.success) {
        Alert.alert("Berhasil", "User berhasil ditambahkan");
        router.replace("/admin/users");
      } else {
        Alert.alert("Gagal", result.message || "Gagal tambah user");
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Gagal tambah user",
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tambah User</Text>
      <Text style={styles.subtitle}>Tambah data karyawan baru</Text>

      <Text style={styles.label}>NIK</Text>
      <Input
        label="NIK"
        value={form.nik}
        onChangeText={(value) => setField("nik", value)}
      />

      <Text style={styles.label}>Nama</Text>
      <Input
        label="Nama"
        value={form.nama}
        onChangeText={(value) => setField("nama", value)}
      />

      <Text style={styles.label}>Email</Text>
      <Input
        label="Email"
        value={form.email}
        onChangeText={(value) => setField("email", value)}
      />

      <Text style={styles.label}>No HP</Text>
      <Input
        label="No HP"
        value={form.no_hp}
        onChangeText={(value) => setField("no_hp", value)}
      />

      <Text style={styles.label}>Jabatan</Text>
      <Input
        label="Jabatan"
        value={form.jabatan}
        onChangeText={(value) => setField("jabatan", value)}
      />

      <Text style={styles.label}>Password</Text>
      <Input
        label="Password"
        value={form.password}
        onChangeText={(value) => setField("password", value)}
        secureTextEntry
      />

      <Text style={styles.label}>Role</Text>
      <ViewRow>
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
      </ViewRow>

      <Text style={styles.label}>Status</Text>
      <ViewRow>
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
      </ViewRow>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>

      <Text style={{ height: 80 }} />
    </ScrollView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      secureTextEntry={secureTextEntry}
    />
  );
}

function Option({ label, active, onPress }: OptionProps) {
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

function ViewRow({ children }: { children: React.ReactNode }) {
  return <Text style={styles.optionRow as any}>{children}</Text>;
}

const styles = StyleSheet.create({
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
  label: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
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
