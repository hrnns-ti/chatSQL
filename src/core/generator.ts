import { queryAST } from "./types";
import { supabase } from "../lib/supabase";

export async function executeNLIDB(ast: queryAST) {
  if (!ast.table) {
    throw new Error("Target tabel tidak ditemukan. Pastikan kalimat mengandung 'dari tabel [nama_tabel]'.");
  }

  // SOLUSI: Tambahkan tipe ': any' di sini agar TS mengizinkan dynamic chaining
  let query: any = supabase.from(ast.table);

  // 1. Tentukan Operasi Utama
  if (ast.operation === "SELECT") {
    const selectStr = ast.columns.length > 0 ? ast.columns.join(", ") : "*";
    query = query.select(selectStr);
  } else if (ast.operation === "DELETE") {
    query = query.delete();
  } else {
    throw new Error(`Operasi ${ast.operation} belum didukung oleh Generator.`);
  }

  // 2. Proses Filter (WHERE)
  if (ast.where && ast.where.length > 0) {
    ast.where.forEach((filter) => {
      switch (filter.operator) {
        case "=":  query = query.eq(filter.column, filter.value); break;
        case ">":  query = query.gt(filter.column, filter.value); break;
        case "<":  query = query.lt(filter.column, filter.value); break;
        case ">=": query = query.gte(filter.column, filter.value); break;
        case "<=": query = query.lte(filter.column, filter.value); break;
        case "!=": query = query.neq(filter.column, filter.value); break;
      }
    });
  }

  // 3. Proses Pengurutan (ORDER BY)
  if (ast.orderBy) {
    query = query.order(ast.orderBy.column, {
      ascending: ast.orderBy.mode === "ASC",
    });
  }

  // 4. Proses Batasan Data (LIMIT)
  if (ast.limit) {
    query = query.limit(ast.limit);
  }

  // 5. Eksekusi
  // Karena 'query' adalah any, kita bisa langsung await
  const { data, error } = await query;

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return data;
}