// live-test-expert.ts

import { tokenize } from "./src/core/lexer"; 
import { SemanticRules } from "./src/core/parser"; 
import { executeNLIDB } from "./src/core/generator"; 

async function runExpertTest() {
  console.log("🚀 MEMULAI EXPERT LEVEL QUERY TEST...\n");

  const tests = [
    {
      name: "1. 🔗 THE JOIN TEST (Mengambil data mahasiswa + nama jurusannya)",
      bbn: "AMBIL nama, ipk TABEL mahasiswa GABUNG_TABEL jurusan FILTER ipk LEBIH_BESAR 3.0"
    },
    {
      name: "2. 📦 THE ARRAY IN TEST (Mencari beberapa nama sekaligus)",
      bbn: "AMBIL nama TABEL mahasiswa FILTER nama TERMASUK_DALAM 'Haerunnas, Budi Santoso, Siti'"
    },
    {
      name: "3. 🕳️ THE IS NULL TEST (Mencari mahasiswa yang belum punya jurusan)",
      bbn: "AMBIL nama TABEL mahasiswa FILTER id_jurusan ADALAH_KOSONG"
    },
    {
      name: "4. 🧮 THE COUNT TEST (Menghitung total data dengan EXACT COUNT)",
      bbn: "AMBIL SEMUA TABEL mahasiswa FILTER ipk LEBIH_BESAR_SAMA 3.5 HITUNG_TOTAL"
    },
    {
      name: "5. 🔀 MULTI-FILTER & PAGINATION (AND clause + Range)",
      bbn: "AMBIL nama, ipk TABEL mahasiswa FILTER ipk LEBIH_BESAR 3.0 DAN ipk LEBIH_KECIL_SAMA 4.0 URUTKAN ipk TURUN RENTANG 0 4"
    }
  ];

  for (const test of tests) {
    console.log(`==================================================`);
    console.log(`${test.name}`);
    console.log(`⚙️ BBN: ${test.bbn}`);
    
    try {
      const tokens = tokenize(test.bbn);
      const parser = new SemanticRules(tokens);
      const ast = parser.parser();
      
      const result = await executeNLIDB(ast);
      
      // Khusus untuk COUNT, responnya kadang dibungkus berbeda oleh Supabase
      console.log(`✅ BERHASIL DIEKSEKUSI!`);
      console.log(`📄 Response:`, JSON.stringify(result, null, 2));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      console.error(`❌ GAGAL PADA TEST INI:`);
      // Menampilkan detail error dari Supabase agar mudah di-debug
      console.error(error.message || error);
      break; 
    }
    console.log(`\n`);
  }
  
  console.log("🏁 EXPERT TEST SELESAI!");
}

runExpertTest();