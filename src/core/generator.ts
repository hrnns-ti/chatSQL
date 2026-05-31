import type { queryAST } from "./types.js";
import { supabase } from "../net/supabase.js";

export async function executeNLIDB(ast: queryAST, dbSchema: any[] = []) {
  
  // TAHAP DDL (CREATE/DROP TABLE) & RPC
  if (ast.operation === "CREATE_TABLE") {
    let sql = `CREATE TABLE ${ast.table} (`;
    const colDefs = ast.definitions.map(d => {
      let def = `${d.columnName} ${d.dataType}`;
      if (d.isPrimary) def += " PRIMARY KEY";
      if (d.references) def += ` REFERENCES ${d.references}`;
      return def;
    });
    sql += colDefs.join(", ") + ");";
    
    return await supabase.rpc('execute_sql', { query_text: sql });
  }

  if (ast.operation === "DROP_TABLE") {
    return await supabase.rpc('execute_sql', { query_text: `DROP TABLE ${ast.table};` });
  }

  if (ast.operation === "RPC") {
    if (!ast.functionName) throw new Error("FUNCTION_NAME_NOT_FOUND");
    return await supabase.rpc(ast.functionName, ast.payload || {});
  }

  // INISIALISASI ENTITAS (Tabel Target)
  if (!ast.table) throw new Error("TABLE_NOT_FOUND");
  let query: any = supabase.from(ast.table.trim());

  // TAHAP OPERASI INTI (CRUD)
  switch (ast.operation) {
    case "SELECT":
      let selectStr = ast.columns.length > 0 ? ast.columns.join(", ") : "*";
      // Inject DISTINCT jika diminta
      if (ast.distinct && ast.columns && ast.columns[0]) {
        const firstCol = ast.columns[0];
        selectStr = selectStr.replace(firstCol, `DISTINCT ${firstCol}`);
      }

      // 🔥 2. SMART GRAPH-AWARE JOIN BUILDER
      if (ast.joins && ast.joins.length > 0) {
        const joinTables = ast.joins.map(j => j.targetTable);
        // Ambil struktur kolom dari tabel utama
        const baseColumns = dbSchema.find(t => t.table_name === ast.table)?.columns || [];
        
        const tree: Record<string, string[]> = {};
        const directJoins: string[] = [];
        const indirectJoins: string[] = [];
        
        // Tahap 1: Pisahkan mana yang direct dan indirect join
        joinTables.forEach(target => {
          // Cek apakah tabel target ada sebagai foreign key di tabel utama
          const hasDirectRelation = baseColumns.some((col: string) => col.includes(target));
          if (hasDirectRelation) {
            directJoins.push(target);
            tree[target] = [];
          } else {
            indirectJoins.push(target);
          }
        });

        // Tahap 2: Petakan indirect joins (nested) ke tabel perantara yang tepat
        indirectJoins.forEach(indirect => {
          let placed = false;
          for (const direct of directJoins) {
            const directCols = dbSchema.find(t => t.table_name === direct)?.columns || [];
            const canNest = directCols.some((col: string) => col.includes(indirect));
            if (canNest) {
              if (!tree[direct]) tree[direct] = []; 
              tree[direct].push(indirect);
              placed = true;
              break;
            }
          }
          if (!placed) {
            // Fallback jika tidak ketemu
            directJoins.push(indirect);
            tree[indirect] = [];
          }
        });

        // Tahap 3: Rangkai string select
        const joinStrings = directJoins.map(direct => {
          const nested = tree[direct];
          if (nested && nested.length > 0) {
            const nestedStr = nested.map(n => `${n}(*)`).join(", ");
            return `${direct}(*, ${nestedStr})`; // Hasilnya jadi: jurusan(*, fakultas(*))
          }
          return `${direct}(*)`;
        });

        selectStr += `, ${joinStrings.join(", ")}`;
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

  // TAHAP FILTERING (WHERE CLAUSE)
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
        
        case "ilike": query = query.ilike(filter.column, `%${filter.value}%`); break;
        case "like": query = query.like(filter.column, `%${filter.value}%`); break;
        
        case "in": 
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

  // TAHAP MODIFIERS (Order, Limit, Range, dll)
  if (ast.orderBy) {
    query = query.order(ast.orderBy.column, { ascending: ast.orderBy.mode === "ASC" });
  }

  if (ast.limit) query = query.limit(ast.limit);
  
  if (ast.range) query = query.range(ast.range.from, ast.range.to);

  if (ast.modifiers) {
    if (ast.modifiers.includes("single")) query = query.single();
    if (ast.modifiers.includes("maybeSingle")) query = query.maybeSingle();
  }

  // EKSEKUSI FINAL
  const { data, error, count } = await query;

  if (error) throw error;

  if (ast.modifiers?.includes('count')) return {data, total_count: count}

  return data;
}