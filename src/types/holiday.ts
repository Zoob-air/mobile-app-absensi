export type HolidayType = "tanggal_merah" | "cuti_bersama";

export type Holiday = {
  id: number;
  tanggal: string;
  keterangan: string;
  tipe: HolidayType;
};
