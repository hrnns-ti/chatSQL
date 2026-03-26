import { queryAST } from "./types";
import { supabase } from "../lib/supabase";

export async function executeNLIDB(ast: queryAST) {
  
  // 1. TAHAP DDL (CREATE/DROP TABLE) & RPC
  
  // DDL membutuhkan raw SQL execution via RPC (karena PostgREST tidak support DDL native)
  if (ast.operation === "CREATE_TABLE") {
    let sql = `CREATE TABLE ${ast.table} (`;
    const colDefs = ast.definitions.map(d => {
      let def = `${d.columnName} ${d.dataType}`;
      if (d.isPrimary) def += " PRIMARY KEY";
      if (d.references) def += ` REFERENCES ${d.references}`;
      return def;
    });
    sql += colDefs.join(", ") + ");";
    
    // Asumsi: Kamu sudah membuat fungsi 'execute_sql' di Supabase Database-mu
    return await supabase.rpc('execute_sql', { query_text: sql });
  }

  if (ast.operation === "DROP_TABLE") {
    return await supabase.rpc('execute_sql', { query_text: `DROP TABLE ${ast.table};` });
  }

  if (ast.operation === "RPC") {
    if (!ast.functionName) throw new Error("FUNCTION_NAME_NOT_FOUND");
    return await supabase.rpc(ast.functionName, ast.payload || {});
  }

  // 2. INISIALISASI ENTITAS (Tabel Target)
  if (!ast.table) throw new Error("TABLE_NOT_FOUND");
  let query: any = supabase.from(ast.table.trim());

  // 3. TAHAP OPERASI INTI (CRUD)
  switch (ast.operation) {
    case "SELECT":
      let selectStr = ast.columns.length > 0 ? ast.columns.join(", ") : "*";
      // Inject DISTINCT jika diminta
      if (ast.distinct) selectStr = selectStr.replace(ast.columns[0], `DISTINCT ${ast.columns[0]}`);
      
      // Inject RELASI (Joins)
      if (ast.joins && ast.joins.length > 0) {
        ast.joins.forEach((j: any) => { selectStr += `, ${j.targetTable}(*)`; });
      }
      
      if (ast.modifiers?.includes("count")) {
        query = query.select(selectStr, { count: 'exact' });
      } else {
        query = query.select(selectStr);
      }
      break;

    case "INSERT":
      query = query.insert(ast.payload);
      break;

    case "UPDATE":
      query = query.update(ast.payload);
      break;

    case "DELETE":
      query = query.delete();
      break;

    case "UPSERT":
      query = query.upsert(ast.payload);
      break;
  }

  // 4. TAHAP FILTERING (WHERE CLAUSE)
  if (ast.where && ast.where.length > 0) {
    ast.where.forEach((filter) => {
      switch (filter.operator) {
        case "=": query = query.eq(filter.column, filter.value); break;
        case ">": query = query.gt(filter.column, filter.value); break;
        case "<": query = query.lt(filter.column, filter.value); break;
        case ">=": query = query.gte(filter.column, filter.value); break;
        case "<=": query = query.lte(filter.column, filter.value); break;
        case "!=": query = query.neq(filter.column, filter.value); break;
        case "is": query = query.is(filter.column, filter.value); break;
        
        // AUTO-WILDCARD untuk teks
        case "ilike": query = query.ilike(filter.column, `%${filter.value}%`); break;
        case "like": query = query.like(filter.column, `%${filter.value}%`); break;
        
        // ARRAY OPERATORS
        case "in": 
          // Memecah string 'ilkom, mesin' menjadi array ['ilkom', 'mesin']
          const inArr = String(filter.value).split(',').map(s => s.trim());
          query = query.in(filter.column, inArr); 
          break;
        case "not.in":
          const notInArr = String(filter.value).split(',').map(s => s.trim());
          query = query.notIn(filter.column, notInArr);
          break;
        case "cs":
          const csArr = String(filter.value).split(',').map(s => s.trim());
          query = query.contains(filter.column, csArr);
          break;
      }
    });
  }

  // 5. TAHAP MODIFIERS (Order, Limit, Range, dll)
  if (ast.orderBy) {
    query = query.order(ast.orderBy.column, { ascending: ast.orderBy.mode === "ASC" });
  }

  if (ast.limit) query = query.limit(ast.limit);
  
  if (ast.range) query = query.range(ast.range.from, ast.range.to);

  if (ast.modifiers) {
    if (ast.modifiers.includes("single")) query = query.single();
    if (ast.modifiers.includes("maybeSingle")) query = query.maybeSingle();
  }

  // 6. EKSEKUSI FINAL
  const { data, error, count } = await query;

  if (error) throw error;

  if (ast.modifiers?.includes('count')) return {data, total_count: count}

  return data;
}