# BaliBites — MVP HTML5

Website katalog jajanan khas Bali dengan HTML5, CSS3, dan JavaScript. Antarmuka dapat dijalankan langsung di browser tanpa instalasi.

## Menjalankan versi statis
1. Ekstrak folder ZIP.
2. Buka `index.html` dengan browser modern.
3. Katalog, pencarian, filter, keranjang, checkout demo, dan rekomendasi lokal bisa dicoba langsung.

## Mengaktifkan endpoint AI opsional
Untuk menghubungkan asisten ke model OpenAI melalui backend Python:
1. Instal Python 3.10+.
2. Jalankan `pip install -r requirements.txt`.
3. Salin `.env.example` menjadi `.env` dan isi `OPENAI_API_KEY`.
4. Jalankan `python server.py`, lalu buka `http://127.0.0.1:5000`.

API key hanya boleh disimpan di backend, jangan pernah dimasukkan ke HTML atau JavaScript browser. Tanpa backend, AI menggunakan mode rekomendasi lokal berbasis aturan.

## Batasan MVP
- Produk dan pesanan demo disimpan di browser/session saja; belum ada database persisten.
- Checkout hanya menghasilkan ringkasan, bukan pembayaran atau pengiriman sungguhan.
- Harga dan ketersediaan adalah data contoh; sesuaikan sebelum dipakai untuk usaha nyata.
- Untuk produksi, tambahkan autentikasi admin, database, validasi server, proteksi CSRF, HTTPS, dan integrasi pembayaran/pengiriman yang resmi.
