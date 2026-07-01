import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../storage/token";

const getAuthHeader = async () => {
  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminDashboard = async () => {
  const config = await getAuthHeader();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/dashboard`,
    config,
  );

  return response.data;
};

export const getAdminUsers = async () => {
  const config = await getAuthHeader();

  const response = await axios.get(`${API_BASE_URL}/api/admin/users`, config);

  return response.data;
};

export const addAdminUser = async (payload: any) => {
  const config = await getAuthHeader();

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/users`,
    payload,
    config,
  );

  return response.data;
};

export const updateAdminUser = async (id: number, payload: any) => {
  const config = await getAuthHeader();

  const response = await axios.put(
    `${API_BASE_URL}/api/admin/users/${id}`,
    payload,
    config,
  );

  return response.data;
};

export const deleteAdminUser = async (id: number) => {
  const config = await getAuthHeader();

  const response = await axios.delete(
    `${API_BASE_URL}/api/admin/users/${id}`,
    config,
  );

  return response.data;
};

export const resetAdminUserPassword = async (
  id: number,
  password: string = "123456",
) => {
  const config = await getAuthHeader();

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/users/${id}/reset-password`,
    { password },
    config,
  );

  return response.data;
};

export const getAdminRiwayat = async (params?: {
  bulan?: string;
  nama?: string;
  jabatan?: string;
}) => {
  const config = await getAuthHeader();

  const query = new URLSearchParams();

  if (params?.bulan) query.append("bulan", params.bulan);
  if (params?.nama) query.append("nama", params.nama);
  if (params?.jabatan) query.append("jabatan", params.jabatan);

  const url = query.toString()
    ? `${API_BASE_URL}/api/admin/riwayat?${query.toString()}`
    : `${API_BASE_URL}/api/admin/riwayat`;

  const response = await axios.get(url, config);

  return response.data;
};

export const getAdminRiwayatDetail = async (id: string | number) => {
  const config = await getAuthHeader();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/riwayat/${id}`,
    config,
  );

  return response.data;
};
