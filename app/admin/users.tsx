import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    deleteAdminUser,
    getAdminUsers,
    resetAdminUserPassword,
} from "../../src/services/adminService";

type UserItem = {
  id: number;
  nik: string;
  nama: string;
  email: string;
  no_hp: string;
  jabatan: string;
  role: string;
  status: string;
};

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const result = await getAdminUsers();

      if (result.success) {
        setUsers(result.data || []);
        setFilteredUsers(result.data || []);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil users");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa mengambil users",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    const keyword = text.toLowerCase();

    const filtered = users.filter(
      (item) =>
        item.nama?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.jabatan?.toLowerCase().includes(keyword) ||
        item.nik?.toLowerCase().includes(keyword),
    );

    setFilteredUsers(filtered);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus User", "Yakin ingin menghapus user ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await deleteAdminUser(id);

            if (result.success) {
              Alert.alert("Berhasil", "User berhasil dihapus");
              loadUsers();
            }
          } catch (error: any) {
            Alert.alert(
              "Gagal",
              error.response?.data?.message || "Gagal hapus user",
            );
          }
        },
      },
    ]);
  };

  const handleResetPassword = (id: number) => {
    Alert.alert("Reset Password", "Password user akan direset menjadi 123456", [
      { text: "Batal", style: "cancel" },
      {
        text: "Reset",
        onPress: async () => {
          try {
            const result = await resetAdminUserPassword(id, "123456");

            if (result.success) {
              Alert.alert("Berhasil", "Password berhasil direset ke 123456");
            }
          } catch (error: any) {
            Alert.alert(
              "Gagal",
              error.response?.data?.message || "Gagal reset password",
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat data user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data User</Text>
      <Text style={styles.subtitle}>Kelola data karyawan</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/admin/add-user")}
      >
        <Text style={styles.buttonText}>+ Tambah User</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Cari nama, email, NIK, jabatan..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.nama}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              <View
                style={[
                  styles.badge,
                  item.status === "aktif"
                    ? styles.badgeActive
                    : styles.badgeInactive,
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.info}>NIK: {item.nik || "-"}</Text>
            <Text style={styles.info}>Jabatan: {item.jabatan || "-"}</Text>
            <Text style={styles.info}>Role: {item.role}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: "/admin/edit-user",
                    params: {
                      id: item.id.toString(),
                    },
                  })
                }
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => handleResetPassword(item.id)}
              >
                <Text style={styles.actionText}>Reset</Text>
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
  addButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
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
  email: {
    color: "#64748b",
    marginTop: 3,
  },
  info: {
    color: "#334155",
    marginTop: 4,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    height: 28,
  },
  badgeActive: {
    backgroundColor: "#dcfce7",
  },
  badgeInactive: {
    backgroundColor: "#fee2e2",
  },
  badgeText: {
    fontWeight: "bold",
    color: "#166534",
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f97316",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
