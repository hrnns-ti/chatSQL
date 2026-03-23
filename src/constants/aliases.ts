export const keywords: Record<string, string> = {
  // Manipulasi Data (DML)
  "CARI": "TKN_SELECT",
  "AMBIL": "TKN_SELECT",
  "LIHAT": "TKN_SELECT",
  "TAMPILKAN": "TKN_SELECT",
  "TAMPILIN": "TKN_SELECT", 
  "NYARI": "TKN_SELECT",
  "SELEKSI": "TKN_SELECT",
  "GET": "TKN_SELECT",

  "TAMBAH": "TKN_INSERT",
  "MASUKKAN": "TKN_INSERT",
  "MASUKIN": "TKN_INSERT",
  "INPUT": "TKN_INSERT",
  "SISIPKAN": "TKN_INSERT",
  "SISIPIN": "TKN_INSERT",
  "SELIPIN": "TKN_INSERT",
  "TARUH": "TKN_INSERT",

  "UBAH": "TKN_UPDATE",
  "GANTI": "TKN_UPDATE",
  "PERBARUI": "TKN_UPDATE",
  "UPDATE": "TKN_UPDATE",

  "HAPUS": "TKN_DELETE",
  "HILANGKAN": "TKN_DELETE",
  "BUANG": "TKN_DELETE",
  "APUS": "TKN_DELETE",  
  "BERSIHKAN": "TKN_DELETE",
  "DELETE": "TKN_DELETE",

  // Definisi Data
  "BUAT": "TKN_CREATE",
  "BIKIN": "TKN_CREATE",
  
  "DROP": "TKN_DROP",
  
  "DATABASE": "TKN_DATABASE",
  "BASISDATA": "TKN_DATABASE",
  
  "TABEL": "TKN_TABLE",
  "TABLE": "TKN_TABLE",

  "KOLOM": "TKN_COLUMN",
  "FIELD": "TKN_COLUMN",

  // Klausa dan Penghubung
  "DARI": "TKN_FROM",
  "PADA": "TKN_FROM",
  "DI": "TKN_FROM",

  "KE": "TKN_INTO",
  
  "YANG": "TKN_WHERE",
  "DIMANA": "TKN_WHERE",
  "KONDISI": "TKN_WHERE",
  "PAS": "TKN_WHERE",
  "KETIKA": "TKN_WHERE",
  
  "ISI": "TKN_VALUES",
  
  "URUTKAN": "TKN_ORDER_BY",
  "SUSUN": "TKN_ORDER_BY",
  "SORTIR": "TKN_ORDER_BY",
  
  "BATASI": "TKN_LIMIT",
  "SEBANYAK": "TKN_LIMIT",
  
  "GABUNG": "TKN_JOIN",

  // Neutral Language
  "DENGAN": "TKN_WITH", 
  "SAMA": "TKN_SAME",

  // Logic Operator
  "DAN": "TKN_AND",
  "SERTA": "TKN_AND",
  "ATAU": "TKN_OR",
  "BUKAN": "TKN_NOT",
  "KECUALI": "TKN_NOT",

  // Agregasi
  "HITUNG": "TKN_COUNT",
  "JUMLAH": "TKN_COUNT",
  "RATA": "TKN_AVG",
  "TOTAL": "TKN_SUM",
  "MINIMUM": "TKN_MIN",
  "TERKECIL": "TKN_MIN",
  "MAKSIMUM": "TKN_MAX",
  "TERBESAR": "TKN_MAX",

  // Perbandingan
  "KURANG": "TKN_LESS",
  "KECIL": "TKN_LESS",
  "LEBIH": "TKN_MORE",
  "BESAR": "TKN_MORE",

  "SEMUA": "TKN_STAR",
  "*": "TKN_STAR"
};

export const symbols: Record<string, string> = {
  ",": "TKN_COMMA", 
  ".": "TKN_DOT", 
  "=": "TKN_EQUALS", 
  ">": "TKN_GT",
  "<": "TKN_LT",
  ">=": "TKN_GTE",
  "<=": "TKN_LTE",
  "!=": "TKN_NEQ",
  "<>": "TKN_NEQ",
  "(": "TKN_LPAREN",
  ")": "TKN_RPAREN",
  "*": "TKN_STAR"
};