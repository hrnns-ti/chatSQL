
# Dokumentasi Proyek: NLIDB Engine (Protokol BBN)

**NLIDB (Natural Language Interface to Database)** adalah sebuah sistem antarmuka berbasis bahasa alami yang memungkinkan manipulasi data pada **Supabase** menggunakan input teks bahasa Indonesia. Sistem ini menjembatani celah antara pengguna non-teknis dengan kompleksitas *query* database melalui lapisan abstraksi **BBN (Bahasa Baku Nasional)**.

## Arsitektur Utama (Data Pipeline)
Proses pengolahan data dalam sistem ini mengikuti alur kerja sebagai berikut:
1.  **Translasi Linguistik (AI Engine)**: Mengonversi input teks bebas dari pengguna menjadi format instruksi BBN yang terstandarisasi menggunakan model Llama 3.1 8B.
2.  **Analisis Leksikal (Lexer)**: Melakukan tokenisasi pada string BBN untuk diidentifikasi berdasarkan kategori *keyword* legal.
3.  **Analisis Semantik (Parser)**: Memvalidasi susunan token dan membentuk struktur **AST (Abstract Syntax Tree)** untuk memastikan integritas logika perintah.
4.  **Eksekusi (Generator)**: Mentransformasi AST menjadi pemanggilan fungsi *native* pada SDK Supabase untuk berinteraksi dengan PostgreSQL di *cloud*.

## Fitur Teknis
* **Interceptor Operasi Destruktif**: Menyediakan lapisan keamanan tambahan yang menghentikan eksekusi secara otomatis pada operasi `DELETE` atau `DROP_TABLE` untuk meminta konfirmasi manual dari pengguna.
* **Pemisah Logika Percakapan**: Dilengkapi dengan algoritma pendeteksi konteks yang mampu membedakan antara interaksi sosial (chatting) dengan instruksi database, sehingga mencegah terjadinya kesalahan sintaks pada input non-perintah.
* **Pemetaan Tipe Data Otomatis**: Secara dinamis menerjemahkan referensi tipe data bahasa umum (seperti "angka" atau "tanggal") menjadi tipe data SQL yang valid (`int`, `date`, `text`).
* **Visualisasi Data Terstruktur**: Menyajikan hasil keluaran database dalam format tabel CLI yang bersih dan mudah dibaca, menggantikan format mentah JSON.

## Spesifikasi Protokol BBN
Sistem ini menggunakan sekumpulan kata kunci terbatas untuk memastikan akurasi hasil translasi AI:
* **Operasi**: `AMBIL`, `TAMBAH`, `UBAH`, `HAPUS`.
* **Klausul**: `TABEL`, `FILTER`, `NILAI`, `URUTKAN`, `GABUNG_TABEL`.
* **Operator**: `SAMA_DENGAN`, `LEBIH_BESAR`, `DAN`, `ATAU`.

## Persyaratan Sistem
* Ollama (Llama 3.1 8B).
* Node.js Runtime (TypeScript).
* Akses API Supabase.

---

**Status Proyek**: Unstable v2.0.0. 