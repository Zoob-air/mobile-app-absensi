import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../storage/token";
import { SelfiePhoto } from "../utils/camera";

const getAuthHeader = async () => {
  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getMultipartHeader = async () => {
  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
};

export const getDashboardPekerja = async () => {
  const config = await getAuthHeader();

  const response = await axios.get(
    `${API_BASE_URL}/api/pekerja/dashboard`,
    config,
  );

  return response.data;
};

export const getAbsensiToday = async () => {
  const config = await getAuthHeader();

  const response = await axios.get(
    `${API_BASE_URL}/api/pekerja/absensi/today`,
    config,
  );

  return response.data;
};

export const clockIn = async (
  latitude: number,
  longitude: number,
  keterangan: string,
  photo?: SelfiePhoto | null,
) => {
  const config = await getMultipartHeader();

  const formData = new FormData();

  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("keterangan", keterangan);

  if (photo?.uri) {
    formData.append("foto", {
      uri: photo.uri,
      name: photo.fileName || `clockin_${Date.now()}.jpg`,
      type: photo.mimeType || "image/jpeg",
    } as any);
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/pekerja/clockin`,
    formData,
    config,
  );

  return response.data;
};

export const clockOut = async (
  latitude: number,
  longitude: number,
  keterangan: string,
  photo?: SelfiePhoto | null,
) => {
  const config = await getMultipartHeader();

  const formData = new FormData();

  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("keterangan", keterangan);

  if (photo?.uri) {
    formData.append("foto", {
      uri: photo.uri,
      name: photo.fileName || `clockout_${Date.now()}.jpg`,
      type: photo.mimeType || "image/jpeg",
    } as any);
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/pekerja/clockout`,
    formData,
    config,
  );

  return response.data;
};

export const getRiwayatPekerja = async (bulan?: string) => {
  const config = await getAuthHeader();

  const url = bulan
    ? `${API_BASE_URL}/api/pekerja/riwayat?bulan=${bulan}`
    : `${API_BASE_URL}/api/pekerja/riwayat`;

  const response = await axios.get(url, config);

  return response.data;
};
