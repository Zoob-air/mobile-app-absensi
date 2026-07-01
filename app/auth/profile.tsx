import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import Button from "../../src/components/Button";
import Card from "../../src/components/Card";
import Header from "../../src/components/Header";
import InfoItem from "../../src/components/InfoItem";
import Loading from "../../src/components/Loading";
import { getProfile } from "../../src/services/profileService";
import { removeToken } from "../../src/storage/token";
import { User } from "../../src/types/user";

export default function PekerjaProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const result = await getProfile();

      if (result.success) {
        setUser(result.data);
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengambil profile");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Tidak bisa mengambil profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <Loading text="Memuat profile..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" subtitle="Informasi akun pekerja" />

      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>{user?.nama?.charAt(0) || "U"}</Text>
      </View>

      <Card>
        <InfoItem label="Nama" value={user?.nama} />
        <InfoItem label="NIK" value={user?.nik} />
        <InfoItem label="Email" value={user?.email} />
        <InfoItem label="No HP" value={user?.no_hp} />
        <InfoItem label="Jabatan" value={user?.jabatan} />
        <InfoItem label="Role" value={user?.role} />
        <InfoItem label="Status" value={user?.status} />
      </Card>

      <Button title="Refresh Profile" onPress={loadProfile} />

      <Button
        title="Ganti Password"
        onPress={() => router.push("/auth/change-password")}
        variant="warning"
      />

      <Button title="Logout" onPress={handleLogout} variant="danger" />
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
  avatarBox: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#2563eb",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
  },
});
