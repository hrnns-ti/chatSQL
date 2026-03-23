import { tokenize } from "./core/lexer";
import { SemanticRules } from "./core/parser";
import { executeNLIDB } from "./core/generator";

/**
 * Fungsi pembantu untuk menjalankan proses NLIDB dari awal sampai akhir
 */
async function runNLIDB(input: string) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`🗣️  INPUT: "${input}"`);
  console.log(`${"=".repeat(50)}`);

  try {
    // 1. Tokenisasi (Lexer)
    const tokens = tokenize(input);
    
    // 2. Parsing (Ubah token menjadi AST)
    const semanticParser = new SemanticRules(tokens);
    const ast = semanticParser.parser();
    
    console.log("\n📦 Abstract Syntax Tree (AST):");
    console.log(JSON.stringify(ast, null, 2));

    // 3. Eksekusi (Generator & Supabase)
    console.log("\n🚀 Mengeksekusi query ke Supabase...");
    const data = await executeNLIDB(ast);

    // 4. Tampilkan Hasil
    console.log("\n✅ HASIL DARI DATABASE:");
    if (data && data.length > 0) {
      console.table(data);
    } else {
      console.log("Empty set (0 rows found).");
    }

  } catch (error: any) {
    console.error("\n❌ ERROR:", error.message);
  }
}

/**
 * Area Uji Coba
 */
async function main() {
  // Ganti 'mahasiswa' dengan nama tabel yang ada di dashboard Supabase kamu
  
  // Tes 1: Ambil semua data
  await runNLIDB("ambil semua dari tabel mahasiswa");

  // Tes 2: Filter dengan operator
  await runNLIDB("tampilkan nama dari mahasiswa yang ipk lebih besar dari 3.5");

  // Tes 3: Order by dan Limit
  await runNLIDB("cari nama dari mahasiswa urutkan berdasarkan nama desc batasi 2");
}

main();   