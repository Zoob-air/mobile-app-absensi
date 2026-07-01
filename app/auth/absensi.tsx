import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  clockIn,
  clockOut,
  getAbsensiToday,
} from "../../src/services/pekerjaService";

import { SelfiePhoto, takeSelfie } from "../../src/utils/camera";

export default function AbsensiScreen() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [photo, setPhoto] = useState<SelfiePhoto | null>(null);

  const [sudahClockIn, setSudahClockIn] = useState(false);
  const [sudahClockOut, setSudahClockOut] = useState(false);

  const [loading, setLoading] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadToday = async () => {
    try {
      const result = await getAbsensiToday();

      if (result.success) {
        setSudahClockIn(result.sudahClockIn);
        setSudahClockOut(result.sudahClockOut);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal memuat status absensi",
      );
    }
  };

  const getLocation = async () => {
    try {
      setGpsLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Izin GPS ditolak",
          "Aplikasi membutuhkan izin lokasi untuk melakukan absensi.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil lokasi GPS");
    } finally {
      setGpsLoading(false);
    }
  };

  const initPage = async () => {
    setLoading(true);
    await loadToday();
    await getLocation();
    setLoading(false);
  };

  const handleTakeSelfie = async () => {
    try {
      const selfie = await takeSelfie();

      if (selfie) {
        setPhoto(selfie);
      }
    } catch (error: any) {
      Alert.alert("Kamera Error", error.message || "Gagal membuka kamera");
    }
  };

  const handleClockIn = async () => {
    if (!latitude || !longitude) {
      return Alert.alert("GPS belum tersedia");
    }

    if (!keterangan.trim()) {
      return Alert.alert("Keterangan wajib diisi");
    }

    try {
      setSubmitLoading(true);

      const result = await clockIn(latitude, longitude, keterangan, photo);

      if (result.success) {
        Alert.alert("Berhasil", "Clock In berhasil");
        setKeterangan("");
        await loadToday();
      }
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Clock In gagal");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!latitude || !longitude) {
      return Alert.alert("GPS belum tersedia");
    }

    try {
      setSubmitLoading(true);

      const result = await clockOut(
        latitude,
        longitude,
        keterangan || "Pekerjaan selesai",
        photo,
      );

      if (result.success) {
        Alert.alert("Berhasil", "Clock Out berhasil");
        setKeterangan("");
        setPhoto(null);
        await loadToday();
      }
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Clock Out gagal");
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    initPage();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat absensi...</Text>
      </View>
    );
  }

  const statusText = sudahClockOut
    ? "Sudah Clock Out"
    : sudahClockIn
      ? "Sudah Clock In"
      : "Belum Clock In";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Absensi</Text>
      <Text style={styles.subtitle}>Clock In / Clock Out</Text>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Status Hari Ini</Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lokasi GPS</Text>

        <Text style={styles.label}>Latitude</Text>
        <Text style={styles.value}>{latitude || "-"}</Text>

        <Text style={styles.label}>Longitude</Text>
        <Text style={styles.value}>{longitude || "-"}</Text>

        <TouchableOpacity
          style={styles.refreshGpsButton}
          onPress={getLocation}
          disabled={gpsLoading}
        >
          <Text style={styles.buttonText}>
            {gpsLoading ? "Mengambil GPS..." : "Refresh GPS"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selfie Absensi</Text>

        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.selfiePreview} />
        ) : (
          <View style={styles.selfieEmpty}>
            <Text style={styles.selfieEmptyText}>Belum ada foto selfie</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.selfieButton}
          onPress={handleTakeSelfie}
          disabled={submitLoading}
        >
          <Text style={styles.buttonText}>
            {photo ? "Ambil Ulang Selfie" : "Ambil Selfie"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Keterangan</Text>

        <TextInput
          style={styles.textarea}
          placeholder={
            sudahClockIn && !sudahClockOut
              ? "Keterangan Clock Out"
              : "Keterangan pekerjaan"
          }
          value={keterangan}
          onChangeText={setKeterangan}
          multiline
          numberOfLines={4}
        />
      </View>

      {!sudahClockIn && (
        <TouchableOpacity
          style={styles.clockInButton}
          onPress={handleClockIn}
          disabled={submitLoading}
        >
          <Text style={styles.buttonText}>
            {submitLoading ? "Memproses..." : "Clock In"}
          </Text>
        </TouchableOpacity>
      )}

      {sudahClockIn && !sudahClockOut && (
        <TouchableOpacity
          style={styles.clockOutButton}
          onPress={handleClockOut}
          disabled={submitLoading}
        >
          <Text style={styles.buttonText}>
            {submitLoading ? "Memproses..." : "Clock Out"}
          </Text>
        </TouchableOpacity>
      )}

      {sudahClockOut && (
        <View style={styles.doneBox}>
          <Text style={styles.doneText}>Absensi hari ini sudah selesai</Text>
        </View>
      )}

      <View style={{ height: 100 }} />
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
  center: {
    flex: 1,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
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
  statusCard: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 5,
  },
  label: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },
  textarea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    backgroundColor: "#f8fafc",
  },
  refreshGpsButton: {
    backgroundColor: "#64748b",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  clockInButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  clockOutButton: {
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  doneBox: {
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },
  doneText: {
    color: "#166534",
    fontWeight: "bold",
    textAlign: "center",
  },
  selfiePreview: {
    width: 220,
    height: 220,
    borderRadius: 18,
    alignSelf: "center",
    marginBottom: 15,
  },
  selfieEmpty: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  selfieEmptyText: {
    color: "#64748b",
    fontWeight: "600",
  },
  selfieButton: {
    backgroundColor: "#2563eb",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
  },
});
