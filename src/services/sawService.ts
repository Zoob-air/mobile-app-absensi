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

export const generateSAW = async (bulan: string) => {
  const config = await getConfig();

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/saw/generate`,
    {
      bulan,
    },
    config,
  );

  return response.data;
};

export const getSAW = async (bulan: string) => {
  const config = await getConfig();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/saw?bulan=${bulan}`,
    config,
  );

  return response.data;
};

export const getSawDetail = async (id: number | string) => {
  const config = await getConfig();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/saw/${id}`,
    config,
  );

  return response.data;
};
