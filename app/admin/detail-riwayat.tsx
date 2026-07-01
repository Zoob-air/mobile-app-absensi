import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "../../src/components/Button";
import { API_BASE_URL } from "../../src/config/api";
import { getAdminRiwayatDetail } from "../../src/services/adminService";
import { openGoogleMaps } from "../../src/utils/maps";

export default function DetailRiwayatScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const loadDetail = async (detailId: string) => {
    try {
      setLoading(true);
      setData(null);

      const result = await getAdminRiwayatDetail(detailId);

      if (result.success) {
        setData(result.data);
      } else {
        setData(null);
      }
    } catch (err) {
      console.log(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      loadDetail(id);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat detail...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Data tidak ditemukan</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fotoMasukUrl = data.foto_masuk
    ? `${API_BASE_URL}${data.foto_masuk}`
    : null;

  const fotoKeluarUrl = data.foto_keluar
    ? `${API_BASE_URL}${data.foto_keluar}`
    : null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detail Riwayat</Text>
      <Text style={styles.subtitle}>Informasi lengkap absensi</Text>

      <View style={styles.card}>
        <Info label="Nama" value={data.nama} />
        <Info label="NIK" value={data.nik} />
        <Info label="Jabatan" value={data.jabatan} />
        <Info label="Tanggal" value={data.tanggal} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clock In</Text>

        <Info label="Jam Masuk" value={data.jam_masuk} />
        <Info label="Latitude" value={data.latitude_masuk} />
        <Info label="Longitude" value={data.longitude_masuk} />
        <Info label="Alamat" value={data.lokasi_masuk} />
        <Info label="Keterangan" value={data.keterangan_masuk} />

        <Text style={styles.photoTitle}>Foto Clock In</Text>

        {fotoMasukUrl ? (
          <Image source={{ uri: fotoMasukUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyText}>
              Foto Clock In tidak tersedia
            </Text>
          </View>
        )}

        <Button
          title="Buka Maps Clock In"
          onPress={() =>
            openGoogleMaps(data.latitude_masuk, data.longitude_masuk)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clock Out</Text>

        <Info label="Jam Keluar" value={data.jam_keluar} />
        <Info label="Latitude" value={data.latitude_keluar} />
        <Info label="Longitude" value={data.longitude_keluar} />
        <Info label="Alamat" value={data.lokasi_keluar} />
        <Info label="Keterangan" value={data.keterangan_keluar} />

        <Text style={styles.photoTitle}>Foto Clock Out</Text>

        {fotoKeluarUrl ? (
          <Image source={{ uri: fotoKeluarUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyText}>
              Foto Clock Out tidak tersedia
            </Text>
          </View>
        )}

        <Button
          title="Buka Maps Clock Out"
          onPress={() =>
            openGoogleMaps(data.latitude_keluar, data.longitude_keluar)
          }
          variant="warning"
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  infoBox: {
    marginBottom: 12,
  },
  label: {
    color: "#64748b",
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 3,
  },
  photoTitle: {
    color: "#111827",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  photo: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: "#f1f5f9",
  },
  photoEmpty: {
    height: 180,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  photoEmptyText: {
    color: "#64748b",
    fontWeight: "600",
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
