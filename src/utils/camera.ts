import * as ImagePicker from "expo-image-picker";

export type SelfiePhoto = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string | null;
  mimeType?: string;
};

export async function takeSelfie(): Promise<SelfiePhoto | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Izin kamera ditolak");
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    cameraType: ImagePicker.CameraType.front,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}
