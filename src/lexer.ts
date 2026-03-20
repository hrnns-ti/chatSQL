const keywords: Record<string, string> = {
  // Manipulasi Data (DML)
  "CARI": "TKN_SELECT",
  "TAMBAH": "TKN_INSERT",
  "UBAH": "TKN_UPDATE",
  "HAPUS": "TKN_DELETE",
  "AMBIL": "TKN_SELECT",

  // Definisi Data (DDL)
  "BUAT": "TKN_CREATE",
  "BUANG": "TKN_DROP",
  "DATABASE": "TKN_DATABASE",
  "TABEL": "TKN_TABLE",
  "KOLOM": "TKN_COLUMN",

  // Klausa & Penghubung
  "DARI": "TKN_FROM",
  "DI": "TKN_FROM",
  "KE": "TKN_INTO",
  "YANG": "TKN_WHERE",
  "DENGAN": "TKN_SET",
  "ISI": "TKN_VALUES",
  "URUTKAN": "TKN_ORDER_BY",
  "BATASI": "TKN_LIMIT",
  "GABUNG": "TKN_JOIN",

  // Logic operator
  "DAN": "TKN_AND",
  "ATAU": "TKN_OR",
  "BUKAN": "TKN_NOT",

  // Agregasi
  "HITUNG": "TKN_COUNT",
  "RATA": "TKN_AVG",
  "TOTAL": "TKN_SUM"
};

function getTokenType(word: string) {

  let state = 0
  const input = word.toUpperCase()

  for (let i = 0; i < word.length; i++) {
    const char = input[i]

    switch (state) {
      case 0: // Entry point
        if (/[A-Z]/.test(char)) state = 100; else if (/[0-9]/.test(char)) state = 200; else state = -1; break;
      case 100: // Identifier keyword
        if (/[A-Z0-9_]/.test(char)) state = 100; else state = -1; break;
      case 200: // numerik
        if (/[0-9]/.test(char)) state = 200; else state = -1; break;

    }

    if (state === 100) {
      const keywordToken = keywords[input]
      if (keywordToken) return keywordToken
      
      return "TKN_IDENTIFIER"
    }

    if (state === 200) return "TKN_NUMBER"

    return "TKN_UNKNOWN"

  }
}

function tokenize(sentence: string) {

  const words = sentence.split(/\s+/)

  const tokens = words.map(word => {
    return {
      value: word, type: getTokenType(word)
    }
  })

  return tokens

}


const hasil = tokenize("cari maba di tabel akademik")
console.log(hasil);