import { tokenize } from "./core/lexer";
import { SemanticRules } from "./core/parser";

function test(query: string) {
    console.log(`\n--- INPUT: "${query}" ---`);
    try {
        const tokens = tokenize(query);
        const parser = new SemanticRules(tokens);
        const ast = parser.parser();
        console.log("AST Result:", JSON.stringify(ast, null, 2));
    } catch (e: any) {
        console.log("ERROR:", e.message);
    }
}

// --- FINAL STRESS TEST ---

// 1. Tes Operator Majemuk & Desimal (Memastikan combination logic di grammar.ts)
test("tampilkan nama dari mahasiswa yang ipk lebih kecil sama dengan 3.5");

// 2. Tes Multiple Where dengan Connector (Memastikan trigger TKN_AND/TKN_OR di WhereRule)
test("ambil nama dari user yang umur lebih besar dari 20 dan status sama dengan aktif");

// 3. Tes Star Column (Memastikan logic TKN_STAR di parser.ts)
test("ambil semua dari tabel dosen");

// 4. Tes Order By & Limit (Memastikan OrderRule & LimitRule di grammar.ts)
test("cari nama dari mahasiswa urutkan berdasarkan nama desc batasi 10");

// 5. Tes Join (Memastikan JoinRule)
test("tampilkan nama dari mahasiswa gabung hobi");