import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken, removeToken, saveToken } from "../storage/token";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/login`, {
    email,
    password,
  });

  const data = response.data;

  if (data.success && data.token) {
    await saveToken(data.token);
  }

  return data;
};

export const getMe = async () => {
  const token = await getToken();

  const response = await axios.get(`${API_BASE_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const logout = async () => {
  await removeToken();
};

export const getProfile = async () => {
  const token = await getToken();

  const response = await axios.get(`${API_BASE_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (payload: any) => {
  const token = await getToken();

  const response = await axios.put(`${API_BASE_URL}/api/profile`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const changePassword = async (payload: {
  password_lama: string;
  password_baru: string;
  konfirmasi_password: string;
}) => {
  const token = await getToken();

  const response = await axios.put(
    `${API_BASE_URL}/api/profile/password`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
