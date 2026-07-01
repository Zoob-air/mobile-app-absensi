export type Attendance = {
  id: number;
  user_id?: number;
  nik?: string;
  nama?: string;
  jabatan?: string;

  tanggal: string;
  jam_masuk: string;
  jam_keluar: string;

  latitude_masuk?: string;
  longitude_masuk?: string;
  lokasi_masuk?: string;

  latitude_keluar?: string;
  longitude_keluar?: string;
  lokasi_keluar?: string;

  keterangan_masuk?: string;
  keterangan_keluar?: string;
};
