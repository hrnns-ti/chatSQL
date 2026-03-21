interface queryAST {
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "CREATE" | "DROP" | null
  columns: string[]
  table: string | null

  where?: {
    column: string 
    operator: string 
    value: string
  }

  joins?: {
    type: "INNER" | "LEFT" | "RIGHT"
    targetTable: string
    on: string
  }

  definitions?: {
    columnName: string
    dataType: string
  }[]
}