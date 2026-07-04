export interface SawItem {
  id: number;

  nik: string;
  nama: string;
  jabatan: string;

  bulan: string;

  c1_kehadiran: number;
  c2_tepat_waktu: number;
  c3_clockout: number;
  c4_selfie: number;

  skor_akhir: number;
  ranking: number;

  kategori: string;
}
