import * as readline from "readline";
import { tokenize } from "./core/lexer";
import { SemanticRules } from "./core/parser";
import { executeNLIDB } from "./core/generator";

const COLORS = {
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    BG_BLUE: "\x1b[44m\x1b[37m",
    BG_RED: "\x1b[41m\x1b[37m"
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${COLORS.GREEN}${COLORS.BOLD}NLIDB_SQL> ${COLORS.RESET}`
});

async function processQuery(query: string) {
    if (!query.trim()) return;

    console.log(`\n${COLORS.CYAN}${"-".repeat(60)}${COLORS.RESET}`);
    
    // Simpan AST di scope luar try agar catch bisa mengakses ast.table
    let currentTable = "";

    try {
        // 1. Lexer Phase
        const tokens = tokenize(query);
        
        // 2. Parser Phase
        const parser = new SemanticRules(tokens);
        const ast = parser.parser();
        console.log(`${COLORS.YELLOW}${COLORS.BOLD}[DEBUG AST]${COLORS.RESET}`);
        console.log(`- Table:  "${ast.table}"`);
        console.log(`- Columns:`, ast.columns);
        console.log(`- Where:  `, JSON.stringify(ast.where));
        console.log(`- Limit:  `, ast.limit);
        currentTable = ast.table || "";
        
        console.log(`${COLORS.MAGENTA}${COLORS.BOLD}[PARSER]${COLORS.RESET} AST Created ${COLORS.WHITE}(Op: ${ast.operation})${COLORS.RESET}`);
        
        // 3. Generator & Database Phase
        console.log(`${COLORS.BLUE}${COLORS.BOLD}[DATABASE]${COLORS.RESET} Fetching from Supabase...`);
        const data = await executeNLIDB(ast);

        // 4. Output Phase
        if (Array.isArray(data) && data.length > 0) {
            console.log(`${COLORS.GREEN}${COLORS.BOLD}[SUCCESS]${COLORS.RESET} Menemukan ${data.length} data:`);
            
            // Mapping untuk handle relasi (Join) jika ada
            const displayData = data.map(item => {
                const flatItem = { ...item };
                // Contoh jika ada join ke tabel jurusan
                if (item.jurusan && typeof item.jurusan === 'object') {
                    flatItem.jurusan = item.jurusan.nama_jurusan; 
                }
                return flatItem;
            });
            
            console.table(displayData);
        } else {
            console.log(`${COLORS.YELLOW}${COLORS.BOLD}[INFO]${COLORS.RESET} Data tidak ditemukan atau tabel kosong.`);
        }

    } catch (e: any) {
        console.log(`${COLORS.BG_RED}${COLORS.BOLD} ERROR DETECTED ${COLORS.RESET}`);
        
        // 1. Error Internal (Tabel belum disebut)
        if (e.message === "TABLE_NOT_FOUND") {
            console.log(`${COLORS.RED}Format salah! Kamu belum menyebutkan nama tabel.${COLORS.RESET}`);
        } 
        // 2. Error PostgREST (Tabel benar-benar tidak ada)
        else if (e.code === "PGRST116") {
            console.log(`${COLORS.RED}Tabel "${COLORS.BOLD}${currentTable}${COLORS.RESET}${COLORS.RED}" tidak ditemukan di database.${COLORS.RESET}`);
        }
        // 3. FALLBACK: Tampilkan pesan asli Supabase
        else {
            console.log(`${COLORS.RED}${COLORS.BOLD}Pesan Database:${COLORS.RESET} ${COLORS.YELLOW}${e.message}${COLORS.RESET}`);
            if (e.hint) console.log(`${COLORS.WHITE}Hint: ${e.hint}${COLORS.RESET}`);
            if (e.details) console.log(`${COLORS.WHITE}Detail: ${e.details}${COLORS.RESET}`);
        }
    }
    
    console.log(`${COLORS.CYAN}${"-".repeat(60)}${COLORS.RESET}\n`);
}

// UI Initial Start
console.clear();
console.log(`${COLORS.BG_BLUE}${COLORS.BOLD}  NLIDB INTERACTIVE CLI v1.0  ${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Build by Haerunnas${COLORS.RESET}`);
console.log(`${COLORS.WHITE}\nKetik query kamu (Contoh: "tampilkan nama dari mahasiswa")`);
console.log(`Ketik ${COLORS.RED}"keluar"${COLORS.WHITE} untuk menutup program.${COLORS.RESET}\n`);

rl.prompt();

rl.on('line', async (line) => {
    const input = line.trim().toLowerCase();
    
    if (input === 'keluar' || input === 'exit' || input === 'quit') {
        console.log(`\n${COLORS.YELLOW}Sampai jumpa, Nas! Happy Coding.${COLORS.RESET}`);
        process.exit(0);
    }

    await processQuery(line);
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});