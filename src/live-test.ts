import { PabiAI } from "./core/ai-engine";
import { tokenize } from "./core/lexer";
import { SemanticRules } from "./core/parser";

async function diagnosticTest() {
  console.log("--------------------------------------------------");
  console.log("🛠️ PABI NLIDB - SEMANTIC PARSER DIAGNOSTIC");
  console.log("--------------------------------------------------");

  const inputs = [
    "Tampilkan nama dan nim dari tabel mahasiswa",
    "Tambahin dosen baru namanya 'Dr. Strange', nip '999'",
    "Ubah ipk mahasiswa yang nim nya '123' jadi 4.0",
    "Jalankan fungsi hitung_total_lulusan"
  ];

  for (const text of inputs) {
    console.log(`\n👤 User : ${text}`);
    
    const { bbn } = await PabiAI.process(text);
    console.log(`⚙️ BBN  : ${bbn}`);

    if (bbn) {
      const tokens = tokenize(bbn);
      const semantic = new SemanticRules(tokens);
      const ast = semantic.parser();

      console.log(`📦 AST DIAGNOSIS:`);
      console.log(`   - Op    : ${ast.operation}`);
      console.log(`   - Table : ${ast.table}`);
      console.log(`   - Col   : ${JSON.stringify(ast.columns)}`);
      console.log(`   - Payload: ${JSON.stringify(ast.payload)}`);
    }
    console.log("-".repeat(50));
  }
}

diagnosticTest();