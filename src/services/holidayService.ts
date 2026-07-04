import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../storage/token";
import { HolidayType } from "../types/holiday";

const getConfig = async () => {
  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getHolidays = async () => {
  const config = await getConfig();

  const response = await axios.get(
    `${API_BASE_URL}/api/admin/hari-libur`,
    config,
  );

  return response.data;
};

export const addHoliday = async (payload: {
  tanggal: string;
  keterangan: string;
  tipe: HolidayType;
}) => {
  const config = await getConfig();

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/hari-libur`,
    payload,
    config,
  );

  return response.data;
};

export const updateHoliday = async (
  id: number,
  payload: {
    tanggal: string;
    keterangan: string;
    tipe: HolidayType;
  },
) => {
  const config = await getConfig();

  const response = await axios.put(
    `${API_BASE_URL}/api/admin/hari-libur/${id}`,
    payload,
    config,
  );

  return response.data;
};

export const deleteHoliday = async (id: number) => {
  const config = await getConfig();

  const response = await axios.delete(
    `${API_BASE_URL}/api/admin/hari-libur/${id}`,
    config,
  );

  return response.data;
};
