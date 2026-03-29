#!/usr/bin/env node

import { PabiAI } from "./core/ai-engine.js";
import { tokenize } from "./core/lexer.js";
import { SemanticRules } from "./core/parser.js";
import { executeNLIDB } from "./core/generator.js";

import Table from 'cli-table3';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

import chalk from 'chalk';
import ora from 'ora';
import { getSchema } from "./core/database.js";

const rl = readline.createInterface({ input, output });

// ==========================================
// THEME PALETTE (Sentralisasi Warna)
// ==========================================
const theme = {
  appTitle: chalk.cyanBright.bold,
  version: chalk.blueBright,
  separator: chalk.dim.cyan,
  userPrompt: chalk.greenBright.bold,
  aiLabel: chalk.magentaBright.bold,
  aiText: chalk.whiteBright,
  spinner: 'cyan',          
  success: chalk.greenBright,
  warningText: chalk.yellowBright,
  warningBg: chalk.bgYellow.black.bold,
  errorText: chalk.redBright,
  errorBg: chalk.bgRed.white.bold,
  tableHeader: chalk.cyanBright.bold,
  tableBorder: chalk.blue,
  infoLabel: chalk.blueBright.bold
};

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packagePath = join(__dirname, '../package.json'); 
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

async function runNLIDB(userInput: string) {
  const spinner = ora({
    text: theme.appTitle('Pabi sedang berpikir...'),
    color: theme.spinner as any
  }).start();

  try {
    // TRANSLASI (AI ENGINE)
    const currSchema = await getSchema()
    const { reply, bbn } = await PabiAI.process(userInput, currSchema);
    // console.log(chalk.yellow(`\n[DEBUG RAW BBN DARI AI]: ${bbn}`));
    
    if (!bbn) {
      spinner.stop();
      if (reply) {
        console.log(`\n${theme.aiLabel((' PABI ') + ('❯ '))} ${theme.aiText(reply.trim())}`);
      } else {
        console.log(`\n${theme.errorBg(' ERROR ')} ${theme.errorText('Pabi bingung mau jawab apa.')}`);
      }
      // console.log(theme.separator('--------------------------------------------------\n'));
      return;
    }

    // KOMPILASI (LEXER & PARSER)
    spinner.text = chalk.cyan('Menganalisis sintaks BLINC...');
    const tokens = tokenize(bbn);
    const semantic = new SemanticRules(tokens);
    const ast = semantic.parser();

    // Validasi singkat AST
    if (!ast.operation || !ast.table) {
      throw new Error("Syntax Error: AST gagal terbentuk sempurna. Operasi atau Tabel tidak ditemukan.");
    }

    const destructiveOps = ['DELETE', 'DROP_TABLE'];
    if (destructiveOps.includes(ast.operation)) {
      spinner.stop(); 
      console.log(`\n${theme.warningBg(' PERINGATAN ')} Operasi ${theme.warningText(ast.operation)} pada tabel ${theme.warningText(ast.table)} terdeteksi.`);
      
      const answer = await rl.question(chalk.bold('Konfirmasi eksekusi? (y/n): '));
      
      if (answer.toLowerCase() !== 'y') {
        console.log(theme.warningText('INFO: Operasi dibatalkan oleh pengguna.\n'));
        return; 
      }
      spinner.start('Melanjutkan eksekusi...');
    }

    // EKSEKUSI (GENERATOR & SUPABASE)
    spinner.text = chalk.cyan('Menghubungi database...');
    const result = await executeNLIDB(ast);
    spinner.succeed(theme.success('Operasi Selesai'));

    // Render Data
    if (Array.isArray(result) && result.length > 0) {

      const flatResult = result.map((row: any) => {
        const flatRow: any = {};
        
        for (const key in row) {
          const value = row[key];
          
          // Jika value adalah object relasi (hasil JOIN)
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Bongkar isi object-nya dan gabungkan ke luar
            for (const nestedKey in value) {
              // Format nama kolom: NAMA_TABEL_RELASI_NAMA_KOLOM (contoh: JURUSAN_NAMA_JURUSAN)
              const newColName = `${key.toUpperCase()}_${nestedKey.toUpperCase()}`;
              flatRow[newColName] = value[nestedKey];
            }
          } else {
            // Data normal biasa
            flatRow[key.toUpperCase()] = value;
          }
        }
        return flatRow;
      });

      const headers = Object.keys(flatResult[0]);
      
      const table = new Table({
        head: headers.map(h => theme.tableHeader(h.toUpperCase())),
        style: { 
          head: [], 
          border: [], 
        },
        chars: {
          'top': theme.tableBorder('─'), 'top-mid': theme.tableBorder('┬'), 'top-left': theme.tableBorder('┌'), 'top-right': theme.tableBorder('┐'),
          'bottom': theme.tableBorder('─'), 'bottom-mid': theme.tableBorder('┴'), 'bottom-left': theme.tableBorder('└'), 'bottom-right': theme.tableBorder('┘'),
          'left': theme.tableBorder('│'), 'left-mid': theme.tableBorder('├'), 'mid': theme.tableBorder('─'), 'mid-mid': theme.tableBorder('┼'),
          'right': theme.tableBorder('│'), 'right-mid': theme.tableBorder('┤'), 'middle': theme.tableBorder('│')
        }
      });

      flatResult.forEach((row: any) => {
        table.push(Object.values(row).map(v => v === null ? chalk.dim('-') : String(v)));
      });

      // result.forEach((row: any) => {
      //   table.push(Object.values(row).map(v => {
      //     if (v === null) return chalk.dim('-');
          
      //     if (typeof v === 'object' && !Array.isArray(v)) {
      //       return chalk.cyan(JSON.stringify(v).replace(/["{}]/g, '')); 
      //     }
          
      //     return String(v);
      //   }));
      // });

      console.log(`\n${theme.success.bold('HASIL DATA:')}`);
      console.log(table.toString()); 

    } else if (result === null || (Array.isArray(result) && result.length === 0)) {
        console.log(`\n${theme.infoLabel('INFO:')} ${chalk.white('Tidak ada data yang ditemukan atau operasi berhasil dilakukan.')}`);
    } else {
        console.log(`\n${theme.success.bold('HASIL DATA:')}`);
        console.dir(result, { depth: null, colors: true });
    }

    // Balasan Pabi
    const shortReply = reply;
    if (reply) {
        console.log(`\n${theme.aiLabel('PABI:')} ${theme.aiText(shortReply)}`);
    }

  } catch (error: any) {
    // ERROR HANDLING
    const rawError = error.message || String(error);
    spinner.fail(`${theme.errorBg(' ERROR SYSTEM ')} ${theme.errorText(rawError)}`);
    
    const explainSpinner = ora({ text: chalk.yellow('Menganalisis penyebab error...'), color: 'yellow' }).start();
    const explanation = await PabiAI.explainError(userInput, rawError);
    explainSpinner.succeed(theme.warningText('Analisis selesai'));

    console.log(`\n${theme.aiLabel('PABI:')} ${theme.aiText(explanation)}\n`);
  }
}

async function start() {
  process.stdout.write('\x1Bc');

  // Banner
  console.log('\n ' + chalk.bgBlue.white.bold(' PABI ') + chalk.bgWhite.black(' DATABASE ') + chalk.dim(` v${packageJson.version}`));
  console.log(chalk.blue(' ─── ') + chalk.dim('Supabase-Augmented Bridge Intelligence'));
  console.log(chalk.dim(' 💡 Hint: Ketik "Bantu saya" untuk melihat skema database\n\n'));

  while (true) {
    const input = await rl.question(chalk.cyan.bold(' USER ') + chalk.blue('❯ '));
    const cleanInput = input.trim();

    // 1. CEK APAKAH USER MAU KELUAR (Exit Logic)
    if (cleanInput.toLowerCase() === 'exit' || cleanInput.toLowerCase() === 'quit') {
      const spinner = ora({
        text: chalk.cyan('Pabi sedang merapikan catatan...'),
        color: 'cyan'
      }).start();

      await delay(2000)
      spinner.stop();

      console.log(`\n${chalk.yellow(' Pabi mau tidur... Tata!')}\n`);
      rl.close();
      break;
    }

    if (!cleanInput) continue;

    await runNLIDB(cleanInput);
    console.log(chalk.dim('\n'));
  }
}

start();