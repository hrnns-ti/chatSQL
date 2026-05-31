import { queryAST } from "./types.js";
import { rules } from "./grammar.js";

export class SemanticRules {
  private tokens: any[];
  private ast: queryAST;

  constructor(tokens: any[]) {
    this.tokens = tokens;
    // Inisialisasi kerangka AST
    this.ast = {
      operation: null,
      columns: [],
      table: null,
      limit: undefined,
      orderBy: undefined,
      where: [],
      joins: [],
      definitions: []
    };
  }

  public parser(): queryAST {
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      
      // Cek token saat ini adalah "Trigger" dari aturan Grammar
      const rule = rules.find(r => r.trigger.includes(token.type));

      if (rule) {
        // Eksekusi rule dan perbarui pointer 'i' agar melompat sesuai instruksi rule
        i = rule.handler(this.tokens, i, this.ast);
      } 
      
      // 2. Tangkap "*" (Mengambil semua kolom)
      else if (token.type === "TKN_STAR") {
        this.ast.columns = ["*"];
      }
      
      // Tangkap Nama Kolom yang mau diambil (SELECT ... FROM)
      // Logika: Jika token adalah IDENTIFIER, operasinya sudah terdeteksi SELECT,
      // dan kita BELUM bertemu tabel target, maka token ini PASTI nama kolom.
      else if (
        token.type === "TKN_IDENTIFIER" && 
        this.ast.operation === "SELECT" && 
        !this.ast.table
      ) {
        this.ast.columns.push(token.value);
      }
    }
    return this.ast;
  }
}