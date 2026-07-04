export interface RekapBulanan {
  id: number;

  nik: string;
  nama: string;
  jabatan: string;

  bulan: string;

  hari_kerja_efektif: number;

  hadir: number;
  tidak_hadir: number;

  tepat_waktu: number;
  terlambat: number;

  clockout_lengkap: number;
  clockout_belum: number;

  selfie_lengkap: number;
  selfie_belum: number;

  lembur: number;

  persentase: number;

  kategori: string;
}
