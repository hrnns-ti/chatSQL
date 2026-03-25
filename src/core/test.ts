// test.ts
import { tokenize } from "./lexer";
import { SemanticRules } from "./parser";

const testSuite = [
  {
    name: "🟢 TEST 1: CRUD BASIC (SELECT & FILTER MAJEMUK)",
    input: "AMBIL nama, ipk TABEL mahasiswa FILTER ipk LEBIH_BESAR_SAMA 3.5 DAN jurusan MENGANDUNG 'cyber' URUTKAN ipk TURUN BATASI 5"
  },
  {
    name: "🟡 TEST 2: CRUD MUTATION (INSERT MULTI-VALUE)",
    input: "TAMBAH TABEL dosen NILAI nip '12345', nama 'Pak Budi', aktif 'true'"
  },
  {
    name: "🔴 TEST 3: CRUD DESTRUCTIVE (DELETE DENGAN IS NULL)",
    input: "HAPUS TABEL pendaftaran FILTER status ADALAH_KOSONG"
  },
  {
    name: "🟣 TEST 4: ADVANCED QUERY (IN, JOIN, PAGINATION, MODIFIERS)",
    input: "AMBIL UNIK jurusan TABEL mahasiswa GABUNG_TABEL fakultas FILTER jurusan TERMASUK_DALAM 'ilkom, mesin, sipil' RENTANG 0 19 HITUNG_TOTAL"
  },
  {
    name: "🛠️ TEST 5: DDL EXTREME (CREATE TABLE WITH PK & FK)",
    input: "BUAT_TABEL pendaftaran KOLOM id uuid KUNCI_UTAMA, mhs_id int4 MERUJUK_KE mahasiswa, tanggal text, status varchar"
  }
];

console.log("\n🚀 MEMULAI MASTER STRESS TEST NLIDB...\n");

testSuite.forEach((test, index) => {
  console.log(`==================================================`);
  console.log(`${test.name}`);
  console.log(`BBN Input : ${test.input}`);
  
  const tokens = tokenize(test.input);
  const parser = new SemanticRules(tokens);
  const ast = parser.parser();
  
  const cleanAST = Object.fromEntries(Object.entries(ast).filter(([_, v]) => 
    !(Array.isArray(v) && v.length === 0) && v !== null && v !== undefined
  ));

  console.dir(cleanAST, { depth: null, colors: true });
  console.log(`\n`);
});