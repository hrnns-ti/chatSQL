// ==========================================
// 1. KAMUS ALIAS (LEXICON)
// ==========================================
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


// ==========================================
// 2. PANDUAN AI (NATURAL LANGUAGE RULES)
// ==========================================
export const aiPromptRules = `
⚠️ BUKU PANDUAN SINTAKS BBN (WAJIB DIIKUTI 100%):

1. ATURAN OPERASI DASAR:
   - AMBIL (Select): AMBIL nama_kolom TABEL nama_tabel
   - TAMBAH (Insert): TAMBAH TABEL nama_tabel
   - UBAH (Update): UBAH TABEL nama_tabel
   - HAPUS (Delete): HAPUS TABEL nama_tabel
   - Jika ingin semua kolom gunakan: AMBIL SEMUA TABEL nama_tabel

2. ATURAN ISI DATA (KHUSUS TAMBAH & UBAH):
   - Gunakan kata kunci NILAI (bukan KOLOM).
   - Format: NILAI nama_kolom 'nilai_teks', nama_kolom2 'nilai_teks2'
   - DILARANG KERAS menggunakan tanda kurung siku untuk nama kolom atau nilai.

3. ATURAN FILTER:
   - Format: FILTER nama_kolom SAMA_DENGAN 'nilai_teks'
   - Jika banyak kondisi: FILTER kolom1 SAMA_DENGAN 'x' DAN kolom2 LEBIH_BESAR 'y'
   - Khusus ADALAH_KOSONG, jangan beri nilai di belakangnya: FILTER nama_kolom ADALAH_KOSONG

4. ATURAN RELASI:
   - Format: GABUNG_TABEL nama_tabel_target
   - JANGAN tambahkan kata TABEL lagi setelah kata GABUNG_TABEL.

5. ATURAN PENGURUTAN & BATASAN:
   - Urutkan: URUTKAN nama_kolom NAIK / TURUN
   - Batasi jumlah: BATASI angka_jumlah
   - Rentang data: RENTANG angka_awal angka_akhir

6. ATURAN MODIFIER & FUNGSI:
   - Tambahan di akhir: SATU_SAJA, MUNGKIN_SATU, HITUNG_TOTAL, UNIK.
   - Eksekusi Fungsi (RPC): JALANKAN_FUNGSI nama_fungsi

7. ATURAN DDL / BIKIN TABEL:
   - Bikin Tabel: BUAT_TABEL nama_tabel KOLOM nama_kolom tipe_data
   - WAJIB gunakan tipe data SQL asli. Jika user bilang "angka" jadikan 'int'. Jika user bilang "teks/text" jadikan 'text.
   - Opsi tambahan kolom: KUNCI_UTAMA, MERUJUK_KE tabel_target
   - Hapus Tabel: HAPUS_TABEL nama_tabel

⚠️ ATURAN MUTLAK (JIKA DILANGGAR, SISTEM HANCUR):
- DILARANG KERAS menggunakan bahasa SQL (SELECT, INSERT, UPDATE, =, ;, dll).
- Nilai teks/string WAJIB diapit kutip tunggal: 'nilai'.
- WAJIB BUNGKUS HASIL AKHIR HANYA DENGAN TAG [BBN] ... [/BBN]. DILARANG menggunakan tag lain.
- Semua nama tabel dan nama kolom WAJIB ditulis dengan huruf kecil (lowercase) dan tanpa spasi (gunakan underscore).
`;