import { queryAST } from "./types";
import { supabase } from "../lib/supabase";

/**
 * Murni Logika Eksekusi Query ke Supabase.
 * Tidak ada console.log di sini agar tidak tumpang tindih dengan UI/CLI.
 */
export async function executeNLIDB(ast: queryAST) {
  // 1. Validasi Awal
  if (!ast.table) {
    throw new Error("TABLE_NOT_FOUND");
  }

  // 2. Inisialisasi Query Chaining
  // Menggunakan 'any' untuk fleksibilitas penumpukan method Supabase
  let query: any = supabase.from(ast.table.trim());

  // 3. Tahap SELECT
  if (ast.operation === "SELECT") {
    let selectStr = ast.columns.length > 0 ? ast.columns.join(", ") : "*";
    
    // Support untuk Joins (Relasi Antar Tabel)
    if (ast.joins && ast.joins.length > 0) {
      ast.joins.forEach((j: any) => {
        selectStr += `, ${j.targetTable}(*)`;
      });
    }
    
    query = query.select(selectStr);
  }

  // 4. Tahap WHERE (Filter) - Pastikan SEMUA eq, gt, neq masuk sini
  if (ast.where && ast.where.length > 0) {
    ast.where.forEach((filter) => {
      if (filter.operator === "=")  query = query.eq(filter.column, filter.value);
      if (filter.operator === ">")  query = query.gt(filter.column, filter.value);
      if (filter.operator === "<")  query = query.lt(filter.column, filter.value);
      if (filter.operator === ">=") query = query.gte(filter.column, filter.value);
      if (filter.operator === "<=") query = query.lte(filter.column, filter.value);
      if (filter.operator === "!=") query = query.neq(filter.column, filter.value);
    });
  }

  // 5. Tahap ORDER BY
  if (ast.orderBy) {
    query = query.order(ast.orderBy.column, {
      ascending: ast.orderBy.mode === "ASC",
    });
  }

  // 6. Tahap LIMIT (PENTING: Harus dipanggil di variabel 'query')
  if (ast.limit) {
    // Pastikan kamu tidak menulis: query.select('limit') atau semacamnya
    query = query.limit(ast.limit); 
  }

  // 7. EKSEKUSI FINAL
  // Hanya ada satu await di sini untuk mengirim seluruh rangkaian command.
  const { data, error } = await query;

  // 8. ERROR HANDLING
  // Kita lempar error agar ditangkap oleh catch block di index.ts
  if (error) {
    throw error;
  }

  return data;
}