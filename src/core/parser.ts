import { queryAST, grammarRules } from "./types"
import { rules } from "./grammar"
import { keywords } from "../constants/aliases"

export class SemanticRules {
  private tokens: any[]
  private ast: queryAST

  constructor(tokens: any[]) {
    this.tokens = tokens
    this.ast = {
      operation: null, // SELECT, INSERT, dll
      columns: [],     // ['nama', 'nim']
      table: null,     // 'mahasiswa'
      
      // Tambahan untuk Supabase:
      limit: undefined,      // Untuk .limit(10)
      orderBy: undefined,    // { column: 'created_at', ascending: true }

      where: [],        // Filter (.eq, .gt, .lt, dll)
      joins: [],        // Untuk query tabel berelasi
      definitions: []   // Untuk CREATE TABLE (jarang lewat client, tapi oke untuk jaga-jaga)
    }
  }

  public parser(): queryAST {
    // Daftar token yang HARUS diabaikan oleh parser utama karena sudah dihandle oleh Rules
    const reservedTypes = [
      "TKN_WHERE", "TKN_AND", "TKN_OR", "TKN_FROM", "TKN_TABLE", 
      "TKN_ORDER_BY", "TKN_LIMIT", "TKN_WITH", "TKN_SELECT", "TKN_DOT"
    ];

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      const rule = rules.find(r => r.trigger.includes(token.type));

      if (rule) {
        i = rule.handler(this.tokens, i, this.ast);
      } 
      
      else if (token.type === "TKN_STAR") {
        this.ast.columns = ["*"];
      }
      
      // Modifikasi di sini: Cek apakah token bukan termasuk tipe cadangan
      else if ((token.type === "TKN_IDENTIFIER" || token.type === "TKN_SAME")) {
        const valueUpper = token.value.toUpperCase();
        
        // JANGAN masukkan jika itu kata kunci SQL atau instruksi
        if (!reservedTypes.includes(token.type) && valueUpper !== "DARI" && valueUpper !== "YANG") {
          this.ast.columns.push(token.value);
        }

      }
    }
    return this.ast;
  }
}