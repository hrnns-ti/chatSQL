export interface grammarRules {
  name: string;
  trigger: string[];
  handler: (tokens: any[], index: number, ast: queryAST) => number;
}

export interface queryAST {
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "CREATE_TABLE" | "DROP_TABLE" | "UPSERT" | "RPC" | null;
  table: string | null;
  columns: string[]; 
  payload?: Record<string, any>; 
  
  functionName?: string; // JANGAN LUPA INI (Untuk RPC)
  
  distinct?: boolean;
  limit?: number;
  orderBy?: {
    column: string;
    mode: "ASC" | "DESC";
  };
  
  range?: { // JANGAN LUPA INI (Untuk Pagination)
    from: number;
    to: number;
  };
  modifiers?: ("single" | "maybeSingle" | "count")[];

  where: {
    column: string; 
    operator: string; 
    value: any; // HARUS ANY (Supaya bisa nerima array untuk operasi IN)
    connector: "AND" | "OR";
  }[];

  joins: {
    type: "INNER" | "LEFT" | "RIGHT" | "RELATION";
    targetTable: string;
    on?: string; 
  }[];

  definitions: {
    columnName: string;
    dataType: string;
    isPrimary?: boolean; 
    references?: string; 
  }[];
}