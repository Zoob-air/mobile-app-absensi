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

export const getProfile = async () => {
  const config = await getAuthHeader();

  const response = await axios.get(`${API_BASE_URL}/api/profile`, config);

  return response.data;
};

export const updateProfile = async (payload: any) => {
  const config = await getAuthHeader();

  const response = await axios.put(
    `${API_BASE_URL}/api/profile`,
    payload,
    config,
  );

  return response.data;
};

export const changePassword = async (payload: {
  password_lama: string;
  password_baru: string;
  konfirmasi_password: string;
}) => {
  const config = await getAuthHeader();

  const response = await axios.put(
    `${API_BASE_URL}/api/profile/password`,
    payload,
    config,
  );

  return response.data;
};
