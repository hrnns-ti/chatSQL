import { queryAST, grammarRules } from "./types";

export const rules: grammarRules[] = [
  // 1. ATURAN OPERASI
  {
    name: "CommandRule",
    trigger: ["TKN_SELECT", "TKN_INSERT", "TKN_UPDATE", "TKN_DELETE"],
    handler: (tokens, i, ast) => {
      ast.operation = tokens[i].type.replace("TKN_", "");
      return i;
    }
  },

  // 2. ATURAN TABEL
  {
    name: "EntityRule",
    trigger: ["TKN_FROM"],
    handler: (tokens, i, ast) => {
      let next = i + 1;
      // Skip filler words agar tidak dianggap nama tabel
      while (tokens[next] && (tokens[next].value === "tabel" || tokens[next].value === "daftar")) next++;
      if (tokens[next]) {
        ast.table = tokens[next].value;
        return next;
      }
      return i;
    }
  },

  // 3. ATURAN RELASI
  {
    name: "JoinRule",
    trigger: ["TKN_JOIN"], 
    handler: (tokens, i, ast) => {
      if (tokens[i + 1]) {
        ast.joins.push({
          type: "INNER",
          targetTable: tokens[i + 1].value,
          on: ""
        });
        return i + 1;
      }
      return i;
    }
  },

  // 4. ATURAN FILTER (WHERE) - FIXED LOGIC
  {
    name: "WhereRule",
    trigger: ["TKN_WHERE", "TKN_AND", "TKN_OR"], 
    handler: (tokens, i, ast) => {
      let curr = i;
      const connector = tokens[curr].type === "TKN_OR" ? "OR" : "AND";
      curr++; 

      if (!tokens[curr] || tokens[curr].type === "TKN_FROM") return i;

      const column = tokens[curr]?.value;
      curr++;

      let operator = "=";
      let opTokens: string[] = [];
      const compareTypes = [
        "TKN_LESS", "TKN_MORE", "TKN_SAME", "TKN_WITH", 
        "TKN_GT", "TKN_LT", "TKN_GTE", "TKN_LTE", "TKN_EQUALS", "TKN_NOT"
      ];

      while (tokens[curr] && (compareTypes.includes(tokens[curr].type) || tokens[curr].value === "dari")) {
        opTokens.push(tokens[curr].type);
        curr++;
      }

      const combination = opTokens.join(" ");
      
      // 1. Cek Kasus "Kecil/Kurang" Terlebih Dahulu (Agar tidak tertukar)
      if (combination.includes("TKN_LTE") || (combination.includes("TKN_LESS") && combination.includes("TKN_SAME"))) {
        operator = "<=";
      } 
      else if (combination.includes("TKN_GTE") || (combination.includes("TKN_MORE") && combination.includes("TKN_SAME"))) {
        operator = ">=";
      }
      else if (combination.includes("TKN_LESS") || combination.includes("TKN_LT")) {
        operator = "<";
      }
      else if (combination.includes("TKN_MORE") || combination.includes("TKN_GT")) {
        operator = ">";
      }
      else if (combination.includes("TKN_NOT")) {
        operator = "!=";
      }
      else {
        operator = "=";
      }

      let value = tokens[curr]?.value || "";
      if (tokens[curr + 1]?.type === "TKN_DOT") {
        value += "." + (tokens[curr + 2]?.value || "");
        curr += 2;
      }

      if (column && value && value !== "dari" && column !== "dari") {
        ast.where.push({ 
          column, 
          operator, 
          value: value.replace(/['"]/g, ""), 
          connector 
        });
      }

      return curr;
    }
  },

  // 5. ATURAN PENGURUTAN (ORDER BY) - FIXED POINTER
  {
    name: "OrderRule",
    // Pastikan Lexer menghasilkan TKN_ORDER_BY untuk kata "urutkan"
    trigger: ["TKN_ORDER", "TKN_ORDER_BY"],
    handler: (tokens, i, ast) => {
      let curr = i + 1;
      
      // Bersihkan filler "berdasarkan" agar tidak masuk ke ast.columns
      if (tokens[curr] && tokens[curr].value.toLowerCase() === "berdasarkan") {
        curr++;
      }
      
      if (tokens[curr]) {
        const col = tokens[curr].value;
        curr++;
        
        let mode: "ASC" | "DESC" = "ASC";
        // Cek jika ada mode pengurutan setelah nama kolom
        if (tokens[curr] && (tokens[curr].value.toLowerCase() === "desc" || tokens[curr].value.toLowerCase() === "turun")) {
          mode = "DESC";
          curr++;
        }
        
        ast.orderBy = { column: col, mode };
        return curr - 1; // Kembali ke index terakhir yang diproses
      }
      return i;
    }
  },

  // 6. ATURAN BATAS (LIMIT)
  {
    name: "LimitRule",
    trigger: ["TKN_LIMIT"],
    handler: (tokens, i, ast) => {
      // Menangani "batasi 10" atau "limit 10"
      if (tokens[i + 1]) {
        ast.limit = parseInt(tokens[i + 1].value);
        return i + 1;
      }
      return i;
    }
  },

  // 7. ATURAN DISTINCT
  {
    name: "DistinctRule",
    trigger: ["TKN_DISTINCT"],
    handler: (tokens, i, ast) => {
      ast.distinct = true;
      return i;
    }
  }
];