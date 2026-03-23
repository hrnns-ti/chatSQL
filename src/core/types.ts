export interface grammarRules {
  name: string
  trigger: string[]
  handler: (tokens: any[], index: number, ast: any) => number
}

export interface queryAST {
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "CREATE" | "DROP" | null
  columns: string[]
  table: string | null

  distinct?: boolean
  
  orderBy?: {
    column: string
    mode: 'ASC' | 'DESC'
  }
  
  limit?: number

  where?: {
    column: string 
    operator: string 
    value: string
    connector: "AND" | "OR"
  }[]

  joins?: {
    type: "INNER" | "LEFT" | "RIGHT"
    targetTable: string
    on: string
  }[]

  definitions?: {
    columnName: string
    dataType: string
  }[]
}