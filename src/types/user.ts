export type UserRole = "admin" | "pekerja";
export type UserStatus = "aktif" | "nonaktif";

export type User = {
  id: number;
  nik: string;
  nama: string;
  email: string;
  no_hp?: string;
  jabatan?: string;
  role: UserRole;
  status: UserStatus;
};
