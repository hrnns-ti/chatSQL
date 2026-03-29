

## PABI (SupaBase-Augmented Bridge Intelligence) v2.2.3
### *Professional Installation Guide: Bridging Natural Language to Cloud Databases*

**PABI** acts as a sophisticated translation layer between natural language inputs and the Supabase ecosystem. It leverages a three-tier architecture—**The Brain (Local LLM)**, **The Bridge (PABI Logic)**, and **The Muscle (Cloud Database)**—to ensure data privacy and seamless execution.

---

###  System Architecture (High-Level)
PABI operates within a secure environment where natural language is parsed locally before interacting with your cloud infrastructure. This ensures that your database schema and sensitive queries remain under your control.

### Phase 1: Prerequisites
Before initiating the installation, ensure your environment meets the following requirements:

#### 1. AI Engine: Ollama (Required)
PABI utilizes **Llama 3.1 8B** locally to maintain maximum data privacy.
* **Download:** [ollama.com](https://ollama.com)
* **Model Initialization:** Execute the following in your terminal:
    ```bash
    ollama pull llama3.1:8b
    ```
* *Note: Ensure the Ollama daemon is active in your system tray.*

#### 2. Runtime: Node.js
* **Requirement:** v20.x (LTS) or higher.
* **Verification:** Run `node -v` to confirm your version.

#### 3. Database: Supabase
* Create a project at [supabase.com](https://supabase.com).
* Navigate to **Project Settings > API** to retrieve your `Project URL` and `Service Role Key`.

---

### Phase 2: Core Installation
Follow these steps to deploy PABI on your local machine:

#### 1. Clone the Repository
```bash
git clone https://github.com/haerunnas/nlidb.git
cd nlidb
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build the Project
PABI is written in **TypeScript**. Compile the source code into executable JavaScript:
```bash
npm run build
```

#### 4. Global Linkage
Enable the `pabi` command globally across your system:
```bash
npm link
```
> **Windows Tip:** If you encounter permission errors, please execute your terminal as an **Administrator**.

---

### Phase 3: Initial Configuration
PABI features an **Interactive Setup Wizard**. You do not need to manually create `.env` files.

1.  **Initialize the application:**
    ```bash
    pabi
    ```
2.  **Follow the Prompts:** The wizard will detect missing configurations and request your:
    * `Supabase URL`
    * `Service Role Key`
3.  **Auto-Generation:** PABI will automatically generate the `.env` file and secure it.
4.  **Finalize:** Restart by typing `pabi` again. You are now ready to query your database using natural language.

---

### Troubleshooting & FAQ
| Error Message | Root Cause | Resolution |
| :--- | :--- | :--- |
| `fetch failed (Ollama)` | Ollama service is offline. | Start the Ollama application. |
| `Model not found` | Missing Llama 3.1 weight. | Run `ollama pull llama3.1:8b`. |
| `pabi is not recognized` | `npm link` failed or path issue. | Re-run `npm link` or check NPM Environment Paths. |
| `Syntax Error: AST failed` | Query complexity is too high. | Simplify the request (e.g., "Show all students"). |

---

### 📄 License
This project is licensed under the **MIT License**. Feel free to use, modify, and distribute as per the license terms.
