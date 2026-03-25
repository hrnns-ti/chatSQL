export const keywords: Record<string, string> = {
  // DDL & CRUD Inti
  "BUAT_TABEL": "TKN_CREATE_TABLE",
  "HAPUS_TABEL": "TKN_DROP_TABLE",
  "AMBIL": "TKN_SELECT",
  "TAMBAH": "TKN_INSERT",
  "UBAH": "TKN_UPDATE",
  "HAPUS": "TKN_DELETE",
  "KUNCI_UTAMA": "TKN_PRIMARY_KEY",
  "MERUJUK_KE": "TKN_REFERENCES",

  // Penunjuk Target
  "TABEL": "TKN_TABLE",
  "KOLOM": "TKN_COLUMN",
  "NILAI": "TKN_VALUES",
  "DARI": "TKN_FROM",

  // Filter & Kondisi
  "FILTER": "TKN_WHERE",
  "SAMA_DENGAN": "TKN_EQ",
  "TIDAK_SAMA": "TKN_NEQ",
  "LEBIH_BESAR": "TKN_GT",
  "LEBIH_BESAR_SAMA": "TKN_GTE",
  "LEBIH_KECIL": "TKN_LT",
  "LEBIH_KECIL_SAMA": "TKN_LTE",
  "MENGANDUNG": "TKN_ILIKE",
  "MIRIP": "TKN_LIKE",
  "CARI_TEKS": "TKN_TEXT_SEARCH",
  "TERMASUK_DALAM": "TKN_IN",
  "TIDAK_TERMASUK": "TKN_NOT_IN",
  "MEMUAT": "TKN_CONTAINS",
  "ADALAH_KOSONG": "TKN_IS_NULL",

  // Relasi & Logika
  "DAN": "TKN_AND",
  "ATAU": "TKN_OR",
  "GABUNG_TABEL": "TKN_JOIN",

  // Modifiers (Sorting & Pagination)
  "URUTKAN": "TKN_ORDER_BY",
  "NAIK": "TKN_ASC",
  "TURUN": "TKN_DESC",
  "BATASI": "TKN_LIMIT",
  "RENTANG": "TKN_RANGE",
  "SATU_SAJA": "TKN_SINGLE",
  "MUNGKIN_SATU": "TKN_MAYBE_SINGLE",
  "HITUNG_TOTAL": "TKN_COUNT",

  // Advanced
  "SIMPAN_TIMPA": "TKN_UPSERT",
  "JALANKAN_FUNGSI": "TKN_RPC",

  // General
  "SEMUA": "TKN_STAR",
  "UNIK": "TKN_DISTINCT",
  "*": "TKN_STAR"
};


export const symbols: Record<string, string> = {
  ",": "TKN_COMMA", 
  ".": "TKN_DOT", 
  "(": "TKN_LPAREN",
  ")": "TKN_RPAREN",
  "*": "TKN_STAR"
};