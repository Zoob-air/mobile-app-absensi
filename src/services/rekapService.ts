import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../storage/token";

const getConfig = async () => {
  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const generateRekap = async (bulan: string) => {
  const config = await getConfig();

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/rekap/generate`,
    {
      bulan,
    },
    config,
  );

  return response.data;
};

export const getRekap = async (bulan: string) => {
  const config = await getConfig();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/rekap?bulan=${bulan}`,
    config,
  );

  return response.data;
};
