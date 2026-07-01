import { Alert, Linking } from "react-native";

export const openGoogleMaps = async (
  latitude?: string | number | null,
  longitude?: string | number | null,
) => {
  if (!latitude || !longitude) {
    Alert.alert("Lokasi tidak tersedia", "Latitude atau longitude kosong");
    return;
  }

  const lat = String(latitude);
  const lng = String(longitude);

  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  await Linking.openURL(url);
};
