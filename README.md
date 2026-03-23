[[PATCH v1.0]]

- **Date:** March 23, 2026

- **System Status:** Stable with Minor Edge-Case Bugs    
- **Main Focus:** Parser Refactoring, Pointer Safeguarding, and Grammar Evaluation.
    

### Current System Architecture

The system has successfully implemented a classic compiler flow with the following pipeline:

- **Lexer (`lexer.ts`):** Tokenizes sentences, utilizes a DFA (Deterministic Finite Automaton), removes Indonesian suffixes ("-nya"), and implements Fuzzy Search (Levenshtein Distance) to tolerate user typos.
    
- **Parser (`parser.ts`):** Acts as the "Conductor/Orchestrator". It uses a safe `while` loop to delegate token processing to a set of rules, including a fallback system to catch undefined column names.
    
- **Grammar Rules (`grammar.ts`):** A collection of semantic rules (Command, Column, Entity, Where, Order, Limit) that execute sequentially (relay-style) using a "Hand-over Pointer" system (`return curr - 1`).
    
- **Generator (`generator.ts`):** Converts the Abstract Syntax Tree (AST) into Supabase method chaining (`.select()`, `.eq()`, `.order()`, etc.).
    

### Achievements & Perfected Features

- **Fuzzy Logic & Typo Tolerance:** The system successfully understands misspelled words (e.g., `tampilkann`, `urutkn`) thanks to the Levenshtein distance algorithm.
    
- **Pointer Relay (The Hand-over):** The `return curr - 1` implementation successfully stopped token leakage. Rules can now chain smoothly (e.g., `WHERE` to `ORDER BY` to `LIMIT`) without consuming each other's tokens.
    
- **Stop Token Fences (`stopTokens`):** `ColumnRule` is no longer greedy. It automatically stops when it encounters other trigger keywords like "dari" (from), "yang" (where), or "urutkan" (order by).
    
- **Relational Database Schema:** The system has been adapted to read the schema:
    
    - `mahasiswa` table: `id`, `nama`, `nim`, `id_jurusan`, `ipk`
        
    - `jurusan` table: `id`, `nama_jurusan`, `fakultas`
        

### Bug List & Patch Plan (To-Do)

Based on the latest Extreme Stress Test, we discovered 4 edge-cases (traps) that will be patched tomorrow:

| **Case / Trap**                                               | **Error Symptom (Bug)**                                                                          | **Patch Plan (Solution)**                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spaced Strings**<br><br>  <br><br>`nama = 'Budi Santoso'`   | Only the word "Budi" is read as the value.                                                       | **In `WhereRule`:** Create a specific loop to detect opening and closing quotes, then concatenate the tokens inside them.                             |
| **Order Without Column**<br><br>  <br><br>`urutkan turun`     | The word "turun" (desc) is swallowed as a column name (`column mahasiswa.turun does not exist`). | **In `OrderRule`:** Check the first word after the trigger. If it is directly a mode keyword (desc/asc), halt the rule (do not fetch it as a column). |
| **Aggregation Functions**<br><br>  <br><br>`hitung jumlah...` | Parser fails to detect the Operation, making the table `null`.                                   | **In `CommandRule`:** Add `TKN_COUNT` to the trigger array and map it as a `SELECT` operation.                                                        |
| **Extreme Decimals**<br><br>  <br><br>`ipk > .5`              | Supabase rejects the `.` syntax as a real number.                                                | **In `WhereRule`:** Catch a standalone `TKN_DOT` token at the front, and concatenate it with a `0` prefix to become `0.x`.                            |

### Next Steps

1. Apply "The Grand Patch" for the 4 bugs mentioned above into `grammar.ts`.
    
2. Add `console.log` for `ast.orderBy` in `index.ts` to make debugging more visual.
    
3. Test table relations using the `JoinRule` ("gabung tabel jurusan").
    
