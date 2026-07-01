import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import Button from "../../src/components/Button";
import Header from "../../src/components/Header";
import Input from "../../src/components/Input";
import { changePassword } from "../../src/services/profileService";

export default function ChangePasswordScreen() {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
      return Alert.alert("Validasi", "Semua field wajib diisi");
    }

    if (passwordBaru !== konfirmasiPassword) {
      return Alert.alert("Validasi", "Konfirmasi password tidak sama");
    }

    try {
      setLoading(true);

      const result = await changePassword({
        password_lama: passwordLama,
        password_baru: passwordBaru,
        konfirmasi_password: konfirmasiPassword,
      });

      if (result.success) {
        Alert.alert("Berhasil", "Password berhasil diubah");
        router.back();
      } else {
        Alert.alert("Gagal", result.message || "Gagal mengubah password");
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Gagal mengubah password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ganti Password" subtitle="Ubah password akun Anda" />

      <Input
        placeholder="Password lama"
        value={passwordLama}
        onChangeText={setPasswordLama}
        secureTextEntry
      />

      <Input
        placeholder="Password baru"
        value={passwordBaru}
        onChangeText={setPasswordBaru}
        secureTextEntry
      />

      <Input
        placeholder="Konfirmasi password baru"
        value={konfirmasiPassword}
        onChangeText={setKonfirmasiPassword}
        secureTextEntry
      />

      <Button
        title="Simpan Password"
        onPress={handleSubmit}
        loading={loading}
      />

      <Button
        title="Kembali"
        onPress={() => router.back()}
        variant="secondary"
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
});
