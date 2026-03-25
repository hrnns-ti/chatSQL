import { grammarRules, queryAST } from "./types";

export const rules: grammarRules[] = [
  {
    name: "CommandRule",
    trigger: ["TKN_SELECT", "TKN_INSERT", "TKN_UPDATE", "TKN_DELETE", "TKN_CREATE_TABLE", "TKN_DROP_TABLE", "TKN_UPSERT", "TKN_RPC"],
    // PERHATIKAN PENAMBAHAN TIPE DI SINI:
    handler: (tokens: any[], i: number, ast: queryAST) => {
      ast.operation = tokens[i].type.replace("TKN_", "") as any;
      return i;
    }
  },

  {
    name: "RpcRule",
    trigger: ["TKN_RPC"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (tokens[i + 1]) {
        ast.functionName = tokens[i + 1].value;
        return i + 1;
      }
      return i;
    }
  },

  {
    name: "EntityRule",
    trigger: ["TKN_TABLE", "TKN_FROM"], 
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (tokens[i + 1]) {
        ast.table = tokens[i + 1].value;
        return i + 1;
      }
      return i;
    }
  },

  {
    name: "DistinctRule",
    trigger: ["TKN_DISTINCT"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      ast.distinct = true;
      return i;
    }
  },

  {
    name: "PayloadRule",
    trigger: ["TKN_VALUES"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (!ast.payload) ast.payload = {};
      let curr = i + 1;
      const stopTokens = ["TKN_WHERE", "TKN_ORDER_BY", "TKN_LIMIT", "TKN_RANGE", "TKN_TABLE", "TKN_SINGLE"];
      
      while (tokens[curr] && !stopTokens.includes(tokens[curr].type)) {
        if (tokens[curr].type === "TKN_IDENTIFIER" && tokens[curr+1] && tokens[curr+1].type !== "TKN_COMMA") {
          const colName = tokens[curr].value;
          const valName = tokens[curr+1].value.replace(/['"]/g, "");
          ast.payload[colName] = valName;
          curr += 2; 
        } else {
          curr++;
        }
      }
      return curr - 1; 
    }
  },

  {
    name: "JoinRule",
    trigger: ["TKN_JOIN"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (tokens[i + 1]) {
        ast.joins.push({ type: "RELATION", targetTable: tokens[i + 1].value });
        return i + 1;
      }
      return i;
    }
  },

  {
    name: "WhereRule",
    trigger: ["TKN_WHERE", "TKN_AND", "TKN_OR"], 
    handler: (tokens: any[], i: number, ast: queryAST) => {
      const connector = tokens[i].type === "TKN_WHERE" ? "AND" : tokens[i].type.replace("TKN_", "") as "AND" | "OR";
      const columnToken = tokens[i + 1];
      const operatorToken = tokens[i + 2];
      const valueToken = tokens[i + 3];

      if (columnToken && operatorToken) {
        if (operatorToken.type === "TKN_IS_NULL") {
          ast.where.push({ column: columnToken.value, operator: "is", value: null, connector });
          return i + 2; 
        }

        if (valueToken) {
          let operator = "=";
          switch(operatorToken.type) {
            case "TKN_EQ": operator = "="; break;
            case "TKN_NEQ": operator = "!="; break;
            case "TKN_GT": operator = ">"; break;
            case "TKN_GTE": operator = ">="; break;
            case "TKN_LT": operator = "<"; break;
            case "TKN_LTE": operator = "<="; break;
            case "TKN_ILIKE": operator = "ilike"; break;
            case "TKN_LIKE": operator = "like"; break;
            case "TKN_TEXT_SEARCH": operator = "textSearch"; break;
            case "TKN_IN": operator = "in"; break;
            case "TKN_NOT_IN": operator = "not.in"; break;
            case "TKN_CONTAINS": operator = "cs"; break; 
          }

          ast.where.push({ 
            column: columnToken.value, 
            operator: operator, 
            value: valueToken.value.replace(/['"]/g, ""), 
            connector: connector 
          });
          return i + 3; 
        }
      }
      return i;
    }
  },

  {
    name: "OrderRule",
    trigger: ["TKN_ORDER_BY"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      const columnToken = tokens[i + 1];
      const modeToken = tokens[i + 2];
      if (columnToken) {
        let mode: "ASC" | "DESC" = "ASC";
        let jump = 1;
        if (modeToken && modeToken.type === "TKN_DESC") { mode = "DESC"; jump = 2; } 
        else if (modeToken && modeToken.type === "TKN_ASC") { jump = 2; }
        
        ast.orderBy = { column: columnToken.value, mode };
        return i + jump; 
      }
      return i;
    }
  },

  {
    name: "LimitRule",
    trigger: ["TKN_LIMIT"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (tokens[i + 1]) {
        ast.limit = parseInt(tokens[i + 1].value);
        return i + 1;
      }
      return i;
    }
  },

  {
    name: "RangeRule",
    trigger: ["TKN_RANGE"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      const fromToken = tokens[i + 1];
      const toToken = tokens[i + 2];
      if (fromToken && toToken) {
        ast.range = { from: parseInt(fromToken.value), to: parseInt(toToken.value) };
        return i + 2;
      }
      return i;
    }
  },

  {
    name: "ModifierRule",
    trigger: ["TKN_SINGLE", "TKN_MAYBE_SINGLE", "TKN_COUNT"],
    handler: (tokens: any[], i: number, ast: queryAST) => {
      if (!ast.modifiers) ast.modifiers = [];
      if (tokens[i].type === "TKN_SINGLE") ast.modifiers.push("single");
      if (tokens[i].type === "TKN_MAYBE_SINGLE") ast.modifiers.push("maybeSingle");
      if (tokens[i].type === "TKN_COUNT") ast.modifiers.push("count");
      return i; 
    }
  },

  {
    name: "DefinitionRule",
    trigger: ["TKN_COLUMN"], 
    handler: (tokens: any[], i: number, ast: queryAST) => {
      let curr = i + 1;
      while (tokens[curr]) {
        if (tokens[curr].type === "TKN_IDENTIFIER" && tokens[curr+1] && tokens[curr+1].type !== "TKN_COMMA") {
          const colDef: any = {
            columnName: tokens[curr].value,
            dataType: tokens[curr+1].value
          };
          curr += 2; 

          while (tokens[curr] && tokens[curr].type !== "TKN_COMMA") {
            if (tokens[curr].type === "TKN_PRIMARY_KEY") {
              colDef.isPrimary = true;
              curr++;
            } else if (tokens[curr].type === "TKN_REFERENCES") {
              if (tokens[curr+1]) {
                colDef.references = tokens[curr+1].value;
                curr += 2;
              } else {
                curr++;
              }
            } else {
              curr++; 
            }
          }
          ast.definitions.push(colDef);
        } else if (tokens[curr].type === "TKN_COMMA") {
          curr++; 
        } else {
          break; 
        }
      }
      return curr - 1; 
    }
  }
];