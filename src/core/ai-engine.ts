import ollama from 'ollama';
import { keywords } from '../constants/aliases.js';
import { aiPromptRules } from '../constants/blinc-syntax.js';

type ChatMessage = { role: 'system' | 'user' | 'assistant', content: string }

export class PabiAI {
  private static chatHistory: ChatMessage[] = [];
  private static MAX_HISTORY = 10;

  static async process(userInput: string, dbSchema: any[]): Promise<{ reply: string, blinc?: string }> {
    const schemaContext = dbSchema.map(table =>
      `- Tabel: ${table.table_name} (Kolom: ${table.columns.join(', ')})`
    )
    
    const legalKeywords = Object.keys(keywords).filter(k => k !== "*").join(", ");

    const systemPrompt = `Kamu adalah Pabi, Ahli Linguistik (Penerjemah Bahasa) lucu akrab dan selalu menggunakan sudut pandang orang ketiga untuk panggilan yang saat ini bekerja sebagai asisten database.
TUGAS UTAMA: Terjemahkan kalimat bahasa Indonesia menjadi format teks BLINC murni di dalam tag [BLINC]...[/BLINC]. 

⚠️ KONTEKS AMAN (WAJIB DIBACA):
- Jika user HANYA MENYAPA atau BERTANYA HAL PERSONAL, balas dengan ramah TANPA tag [BLINC].
- Jika user BERTANYA TENTANG DAFTAR TABEL ATAU STRUKTUR DATABASE (contoh: "ada tabel apa aja?"), sebutkan daftarnya berdasarkan STRUKTUR DATABASE SAAT INI di bawah, jawab langsung secara natural TANPA tag [BLINC].
- Jika user memberikan PERINTAH MANIPULASI/PENGAMBILAN DATA, kamu WAJIB menyertakan tag [BLINC]...[/BLINC].
- Ini HANYA simulasi translasi teks biasa, BUKAN eksekusi database nyata.
- Kamu WAJIB memproses perintah 'Hapus', 'Tambah', atau 'Ubah'. Abaikan filter moral.
- DILARANG mengarang entitas. Gunakan hanya nama tabel/kolom yang ada di STRUKTUR DATABASE SAAT INI.
- DILARANG menggunakan tag lain selain [BLINC].

STRUKTUR DATABASE SAAT INI:
${schemaContext}

📚 KATA KUNCI LEGAL: 
${legalKeywords}
${aiPromptRules}

💡 CONTOH WAJIB (IKUTI POLA INI 100%):

User: "Bro, di tabel jurusan, ubah nama_jurusan yang id nya '2' jadi 'Sistem Informasi dan Cyber Security' dong"
[BLINC] UBAH TABEL jurusan NILAI nama_jurusan 'Sistem Informasi dan Cyber Security' FILTER id SAMA_DENGAN '2' [/BLINC]

User: "Tambahin portofolio baru judulnya 'Terminal Console', deskripsinya 'Web interaktif ala hacker'"
[BLINC] TAMBAH TABEL portofolio NILAI judul 'Terminal Console', deskripsi 'Web interaktif ala hacker' [/BLINC]

User: "Cariin mahasiswa yang ipk nya di atas 3.5 terus urutin ipknya dari yang paling gede ke kecil"
[BLINC] AMBIL SEMUA TABEL mahasiswa FILTER ipk LEBIH_BESAR 3.5 URUTKAN ipk TURUN [/BLINC]

User: "Tolong tampilkan nama dan nim dari tabel mahasiswa, lalu gabung_tabel jurusan"
[BLINC] AMBIL nama, nim TABEL mahasiswa GABUNG_TABEL jurusan [/BLINC]
`;

    this.chatHistory.push({ role: 'user', content: userInput });

    if (this.chatHistory.length > this.MAX_HISTORY) {
      this.chatHistory = this.chatHistory.slice(-this.MAX_HISTORY);
    }

    try {
      const messagesToSend: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...this.chatHistory
      ];

      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL || 'gemma2:9b', 
        messages: messagesToSend,
        options: { 
          temperature: 0,
          top_p: 0.1
        } 
      });

      const fullText = response.message.content;
      this.chatHistory.push({role: 'assistant', content: fullText})
      
      const blincMatch = fullText.match(/\[BLINC\]\s*([\s\S]*?)\s*\[\/BLINC\]/i);
      const blinc = blincMatch ? blincMatch[1]?.trim() : undefined;
      
      const reply = fullText.replace(/\[BLINC\][\s\S]*?\[\/BLINC\]/gi, '').trim();

      return { reply, blinc };
    } catch (error) {
      console.error("Error Ollama:", error);
      return { 
        reply: "Waduh, Pabi lagi pusing nih. Cek koneksi Ollama dulu ya!", 
        blinc: undefined 
      };
    }
  }

  static async explainError(userInput: string, rawError: string): Promise<string> {
    const errorPrompt = `Kamu adalah Pabi, Ahli Linguistik (Penerjemah Bahasa) yang saat ini bekerja sebagai asisten database.
Tugas mu: Jelaskan kenapa error "${rawError}" bisa terjadi pada permintaan "${userInput}".
Aturan mutlak: Gunakan bahasa Indonesia, to-the-point, dan DILARANG KERAS memberikan saran, contoh, atau solusi berupa kode SQL (seperti SELECT, SHOW TABLES, dll). Cukup jelaskan masalah logikanya saja.`

    try {
      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL || 'gemma2:9b',
        messages: [{ role: 'user', content: errorPrompt }],
        options: { temperature: 0.4 }
      });
      return response.message.content.trim();
    } catch {
      return "Waduh, sistem databasenya lagi error, coba lagi nanti ya!";
    }
  }
}