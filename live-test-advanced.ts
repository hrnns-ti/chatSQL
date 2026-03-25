// live-test-advanced.ts

import { tokenize } from "./src/core/lexer"; 
import { SemanticRules } from "./src/core/parser"; 
import { executeNLIDB } from "./src/core/generator"; 

async function runFullCycleTest() {
  console.log("🚀 MEMULAI FULL CYCLE STRESS TEST KE SUPABASE...\n");

  const tests = [
    {
      name: "1. 🟢 INSERT (Tambah Data Pertama)",
      bbn: "TAMBAH TABEL portofolio NILAI id '11111111-1111-1111-1111-111111111111', judul 'Aplikasi E-Commerce', deskripsi 'Dibuat dengan Next.js'"
    },
    {
      name: "2. 🟢 INSERT (Tambah Data Kedua)",
      bbn: "TAMBAH TABEL portofolio NILAI id '22222222-2222-2222-2222-222222222222', judul 'Sistem Keamanan Siber', deskripsi 'Firewall kustom'"
    },
    {
      name: "3. 🟡 SELECT DENGAN ILIKE (Cari teks 'Keamanan')",
      bbn: "AMBIL * TABEL portofolio FILTER judul MENGANDUNG 'Keamanan'"
    },
    {
      name: "4. 🟠 UPDATE (Ubah deskripsi)",
      bbn: "UBAH TABEL portofolio NILAI deskripsi 'Firewall v2.0 Terupdate' FILTER id SAMA_DENGAN '22222222-2222-2222-2222-222222222222'"
    },
    {
      name: "5. 🟣 ADVANCED SELECT (Pagination & Order)",
      // Mengambil judul saja, diurutkan turun, batas dari index 0 sampai 5
      bbn: "AMBIL judul TABEL portofolio URUTKAN judul TURUN RENTANG 0 5"
    },
    {
      name: "6. 🔴 DELETE (Hapus Data Pertama)",
      bbn: "HAPUS TABEL portofolio FILTER judul SAMA_DENGAN 'Aplikasi E-Commerce'"
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
      
      console.log(`✅ BERHASIL! Response Data:`, result || "Sukses (Tanpa return data)");
      
      // Delay sedikit agar log terminal lebih enak dibaca dan tidak membanjiri API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ GAGAL PADA TEST INI:`);
      console.error(error);
      break; // Hentikan test beruntun jika ada satu yang gagal
    }
    console.log(`\n`);
  }
  
  console.log("🏁 STRESS TEST SELESAI!");
}

runFullCycleTest();