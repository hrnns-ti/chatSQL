
## PABI: Supabase-Augmented Bridge Intelligence

**PABI** is a high-performance **NLIDB** (Natural Language Interface to Database) system designed to bridge the gap between human intuition and structured data environments. It leverages a custom intermediate language, **BLINC**, to ensure precise, secure, and context-aware database interactions.

### Key Milestones
* **Dynamic Schema Introspection**: PABI automatically synchronizes with your live PostgreSQL environment via Supabase RPC, fetching real-time table and column metadata.
* **Contextual AI Translation**: Utilizes local LLMs (Llama 3.1 8B via Ollama) injected with active database schemas to eliminate identifier hallucinations.
* **Hybrid Compiler Stack**:
    * **Lexer**: Sophisticated tokenization of Indonesian/English natural language commands into BLINC tokens.
    * **Parser (AST)**: Constructs an Abstract Syntax Tree to validate query logic and semantics before reaching the execution layer.
* **Automated Relational Logic**: Support for `JOIN` operations (e.g., `GABUNG_TABEL`) based on linguistic context and foreign key detection.
* **Operational Safeguards**: Integrated "Destructive Operation" warnings for `DELETE` and `DROP_TABLE` commands, requiring manual user confirmation.

### The BLINC Protocol
**BLINC** (*Bridged Language Interface for Native Context*) serves as the system's intermediate representation. Unlike direct Text-to-SQL approaches, BLINC allows for:
1.  **Safety**: Decouples user intent from raw SQL execution.
2.  **Validation**: Enables strict syntax checking through the internal compiler.
3.  **Portability**: Acts as a universal bridge that can be mapped to various database providers.

### Tech Stack
* **Runtime**: Node.js / TypeScript.
* **Intelligence**: Ollama (Llama 3.1:8b).
* **Infrastructure**: Supabase (PostgreSQL).
* **CLI Interface**: Chalk, Ora, Figlet, and Cli-table3 for a terminal-inspired UX.

### Capability Matrix
| Feature | Status | Description |
| :--- | :--- | :--- |
| **Full CRUD** | ✅ Complete | Create, Read, Update, and Delete data via natural language. |
| **Semantic Filtering** | ✅ Complete | Complex conditions (Equality, Contains, Greater Than, etc.). |
| **Auto-Joins** | ✅ Complete | Seamlessly merges related tables (e.g., Students & Departments). |
| **Live Introspection** | ✅ Complete | AI awareness of new tables/columns added to the DB. |
| **Explainable Errors** | ✅ Complete | AI-driven analysis of database errors in plain language. |
