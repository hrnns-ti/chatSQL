import { PabiAI } from "./core/ai-engine";
import { tokenize } from "./core/lexer";
import { SemanticRules } from "./core/parser";
import { executeNLIDB } from "./core/generator";

import Table from 'cli-table3'
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const BOLD = "\x1b[1m";


const rl = readline.createInterface({ input, output });

async function runNLIDB(userInput: string) {

  try {
    // 1. TAHAP TRANSLASI (AI ENGINE)
    process.stdout.write(`${CYAN}LOG:${RESET} Pabi sedang berpikir... `);
    const { reply, bbn } = await PabiAI.process(userInput);
    process.stdout.write(`${GREEN}DONE${RESET}\n`);

    // console.log(`\nPABI: ${reply}`);
    
    if (!bbn) {
      if (reply) {
        console.log(`\n${MAGENTA}PABI:${RESET} ${reply.trim()}`);
      } else {
        console.log(`\n${RED}ERROR:${RESET} Pabi bingung mau jawab apa.`);
      }
      console.log(`${CYAN}--------------------------------------------------${RESET}\n`);
      return;
    }

    // console.log(`${YELLOW}BBN:${RESET} ${bbn}`)
    
    // console.log(`⚙️  BBN : ${bbn}`);

    // 2. TAHAP KOMPILASI (LEXER & PARSER)
    // console.log(`\n... ⏳ Mesin Lexer & Parser sedang membedah sintaks ...`);
    const tokens = tokenize(bbn);
    const semantic = new SemanticRules(tokens);
    const ast = semantic.parser();

    // Validasi singkat AST
    if (!ast.operation || !ast.table) {
      throw new Error("Syntax Error: AST gagal terbentuk sempurna. Operasi atau Tabel tidak ditemukan.");
    }

    const destructiveOps = ['DELETE', 'DROP_TABLE'];
    if (destructiveOps.includes(ast.operation)) {
      console.log(`\n${RED}${BOLD}PERINGATAN:${RESET} Operasi ${YELLOW}${ast.operation}${RESET} pada tabel ${YELLOW}${ast.table}${RESET} terdeteksi.`);
      const answer = await rl.question(`${BOLD}Konfirmasi eksekusi? (y/n): ${RESET}`);
      
      if (answer.toLowerCase() !== 'y') {
        console.log(`${MAGENTA}INFO: Operasi dibatalkan oleh pengguna.${RESET}\n`);
        return; 
      }
    }

    // console.log(`📦 AST TERBENTUK:`);
    // console.log(`   - Operasi : ${ast.operation}`);
    // console.log(`   - Tabel   : ${ast.table}`);
    // if (ast.columns && ast.columns.length > 0) console.log(`   - Kolom   : ${JSON.stringify(ast.columns)}`);

    // 3. TAHAP EKSEKUSI (GENERATOR & SUPABASE)
    process.stdout.write(`${CYAN}LOG:${RESET} Menghubungi database... `);
    const result = await executeNLIDB(ast);
    process.stdout.write(`${GREEN}SUCCESS${RESET}\n`);

    if (Array.isArray(result) && result.length > 0) {
      // Ambil header dari key object pertama
      const headers = Object.keys(result[0]);
      const table = new Table({
        head: headers.map(h => `${YELLOW}${BOLD}${h.toUpperCase()}${RESET}`),
        style: { head: [], border: [] }
      });

      // Isi data ke tabel
      result.forEach((row: any) => {
        table.push(Object.values(row).map(v => v === null ? '-' : String(v)));
      });

      console.log(`\n${GREEN}${BOLD}HASIL DATA:${RESET}`);
      console.log(table.toString()); 
    } else if (result === null || (Array.isArray(result) && result.length === 0)) {
        console.log(`\n${YELLOW}INFO: Tidak ada data yang ditemukan atau operasi berhasil dilakukan.${RESET}`);
    } else {
        console.log(`\n${GREEN}${BOLD}HASIL DATA:${RESET}`);
        console.dir(result, { depth: null, colors: true });
    }

    // if (reply) {
    //     console.log(`\n${MAGENTA}PABI:${RESET} ${reply.split('\n')[0-1]}`); // Ambil kalimat pertama aja biar gak kepanjangan
    // }

    // console.log(`\n${GREEN}${BOLD}HASIL DATA:${RESET}`);
    // console.dir(result, { depth: null, colors: true });

    const shortReply = reply.split('\n')[0];
    if (reply) {
        console.log(`\n${MAGENTA}PABI:${RESET} ${shortReply}`);
    }

  } catch (error: any) {
    // 4. TAHAP ERROR HANDLING (PABI EXPLAINER)
    const rawError = error.message || String(error);
    console.log(`\n${RED}${BOLD}ERROR SYSTEM:${RESET} ${rawError}`);
    
    process.stdout.write(`${CYAN}LOG:${RESET} Menganalisis penyebab... `);
    // console.log(`... ⏳ Pabi menganalisis error ...`);
    const explanation = await PabiAI.explainError(userInput, rawError);
    process.stdout.write(`${GREEN}OK${RESET}\n`);

    
    console.log(`\n${MAGENTA}PABI:${RESET} ${explanation}\n`);
  }
  console.log(`${CYAN}--------------------------------------------------${RESET}\n`);
}


async function start() {
  process.stdout.write('\x1Bc');
  // console.log("🚀 MEMULAI ULTIMATE STRESS TEST (MENGUJI SELURUH KITAB BBN)...\n");

  console.log(`${CYAN}${BOLD}NLIDB ENGINE v1.0.0${RESET}`);
  console.log(`${CYAN}Ketik perintah dalam bahasa indonesia (atau 'exit' untuk keluar)${RESET}`);
  console.log(`${CYAN}--------------------------------------------------${RESET}\n`);

  // const stressTests = [
    // // 🧪 TEST 1: ATURAN 1 & 4 (AMBIL KOLOM SPESIFIK & RELASI)
    // "Bro, AMBIL kolom nama sama nim dari TABEL mahasiswa dan jurusan ya",

    // // 🧪 TEST 2: ATURAN 2 (TAMBAH DATA DENGAN NILAI)
    // "Tolong TAMBAH TABEL portofolio dong, kasih NILAI judulnya 'Terminal Cyber', deskripsi 'Portofolio ala hacker UI', kasih id nya 33333333-2222-2222-2222-222222222222",

    // // 🧪 TEST 3: ATURAN 3 (FILTER KOMPLEKS: MENGANDUNG, ATAU, LEBIH_BESAR_SAMA)
    // "Cariin di TABEL mahasiswa, FILTER yang namanya MENGANDUNG 'Haerunnas' ATAU ipknya LEBIH_BESAR_SAMA '3.8'",

    // // 🧪 TEST 4: ATURAN 5 (PENGURUTAN & RENTANG DATA)
    // "AMBIL SEMUA data dari TABEL portofolio, URUTKAN judul NAIK, terus kasih RENTANG dari 0 sampai 5 aja bro",

    // // 🧪 TEST 5: ATURAN 1 & 6 (HAPUS DATA & MODIFIER SATU SAJA)
    // // Kita tes apakah dia bisa nangkep kata modifier di akhir
    // "AMBIL TABEL mahasiswa, FILTER nim SAMA_DENGAN '11223344', ambil SATU_SAJA",

    // // 🧪 TEST 6: ATURAN 7 (DDL: BUAT TABEL & KUNCI UTAMA)
    // // Skenario: Lo bikin tabel buat divisi cyber GDGoC
    // "Bantuin BUAT_TABEL divisi_cyber dong bro, KOLOM id int KUNCI_UTAMA, terus kolom nama varchar",

    // // 🧪 TEST 7: ATURAN 6 & 7 (RPC & DROP TABLE)
    // "HAPUS_TABEL divisi_cyber dong bro, udah nggak kepake"

    // "Bro, bikinin tabel baru dong namanya jadwal, isinya id tipe angka sebagai primary key, terus nama_matkul pakai text, dan waktu pakai tanggal ya.",

    // 🧪 TEST 7: ATURAN 6 & 7 (DROP TABLE) - VERSI TONGKRONGAN
    // Persiapan buat fitur "Konfirmasi" yang bakal lo bangun nanti.
    // "Bro, tolong hapus tabel portofolio dong."

    // "Bro, tolong dong ubah ipk si Haerunnas jadi 3.95, dia itu mahasiswa yang nim nya 11223344 di tabel mahasiswa"
  // ];

  // for (let i = 0; i < stressTests.length; i++) {
  //   console.log(`\n🔥 STRESS TEST #${i + 1}`);
  //   await runNLIDB(stressTests[i]);
    
    // Jeda 4 detik biar Llama gak ngos-ngosan dan API aman
    // await new Promise(resolve => setTimeout(resolve, 4000)); 
  // }

  while (true) {
    const userInput = await rl.question(`\n${GREEN}${BOLD}USER > ${RESET}`);

    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log(`\n${YELLOW}Mematikan sistem... Sampai jumpa, bro.${RESET}`);
      rl.close();
      break;
    }

    if (!userInput.trim()) continue;

    await runNLIDB(userInput);
  }
}

start();