## PABI (SupaBase-Augmented Bridge Intelligence) v2.2.3

> **Modern NLIDB Interface: Natural Language to Cloud Database with Local LLM Privacy.**

[](https://opensource.org/licenses/MIT)
[](https://nodejs.org/)
[](https://ollama.com/)

**PABI** is a sophisticated CLI-based Natural Language Interface to Database (NLIDB). It allows developers and data analysts to interact with **Supabase** using human language. Unlike traditional tools that send raw SQL, PABI uses the **BLINC Protocol** to ensure query safety, prevent SQL injection, and maintain data integrity.

-----

### Key Features

  - **Local Intelligence**: Powered by **Llama 3.1 8B** via Ollama. Your queries are processed locally for maximum privacy.
  - **BLINC Protocol**: Uses a custom intermediate language (Bridged Language Interface for Native Context) to prevent hallucination.
  - **Interactive Setup**: Built-in **Setup Wizard**—no manual `.env` configuration required.
  - **Safety First**: Automated guards for destructive operations (`DROP`, `DELETE`) with user confirmation.
  - **Beautiful UI**: Clean, minimalist terminal interface with high-fidelity table rendering.

-----

### Technical Architecture

PABI doesn't just "guess" SQL. It follows a rigorous compilation pipeline:

1.  **Schema Injection**: PABI reads your Supabase schema and feeds it into the LLM context.
2.  **BLINC Translation**: The LLM translates natural language into **BLINC Syntax**.
3.  **AST Parsing**: PABI's internal Lexer & Parser convert BLINC into an **Abstract Syntax Tree**.
4.  **SDK Execution**: The Generator transforms the AST into optimized **Supabase JS SDK** calls.

-----

### Getting Started

#### 📄 Prerequisites

  - **Node.js** v20.x or higher.
  - **Ollama Desktop** installed and running.
  - **Model**: Run `ollama pull llama3.1:8b`.
  - **Supabase Account**: An active project with API credentials.

#### ⚙️ Installation

> for detailed explanation [GUIDE](GUIDE.md)

```bash
# Clone the repository
git clone https://github.com/haerunnas/nlidb.git
cd nlidb

# Install dependencies & Build
npm install
npm run build

# Link globally
npm link
```

#### 🛠️ Initial Setup

Simply type `pabi` in your terminal. The **Interactive Wizard** will guide you through entering your `SUPABASE_URL` and `SERVICE_ROLE_KEY`.

-----

### Usage Examples

Once installed, just type `pabi` from any folder.

**Querying Data:**

> `USER ❯ Tampilkan 5 mahasiswa dengan IPK tertinggi.`

**Managing Schema:**

> `USER ❯ Tabel apa saja yang tersedia saat ini?`

**Safety Guard in Action:**

> `USER ❯ Hapus tabel portofolio.`
> `PERINGATAN! Operasi DROP_TABLE terdeteksi. Konfirmasi eksekusi? (y/n)`

-----

### 📁 Project Structure

```text
nlidb/
├── src/
│   ├── main.ts         # Entry point & Setup Wizard
│   ├── core/           # AI Engine, Lexer, Parser, & Generator
│   ├── net/            # Supabase & Network configuration
│   └── utils/          # Formatting & UI helpers
├── dist/               # Compiled JavaScript (Production)
└── package.json        # Dependencies & CLI Binary config
```

-----

### 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.