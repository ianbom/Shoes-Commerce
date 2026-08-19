# Desain Import Produk Yupoo dan KicksDB

## Ringkasan

Fitur ini menambahkan halaman admin untuk mengimpor banyak produk dari kategori Yupoo. Sistem mengambil harga dan SKU dari judul album Yupoo, mencari metadata produk melalui Standard API KicksDB/StockX, menampilkan hasil sementara untuk diperiksa, lalu menyimpan produk terpilih ke katalog lokal.

Pemrosesan dilakukan sebagai batch persisten melalui queue agar impor kategori besar tidak bergantung pada durasi satu request HTTP. Hasil, progres, kandidat serupa, kegagalan, dan status penyimpanan tetap tersedia setelah halaman dimuat ulang.

## Keputusan Produk

- Admin memasukkan URL kategori Yupoo.
- Sistem mengikuti seluruh pagination kategori tersebut.
- Judul seperti `【 420¥】 【 GX】 【 HQ7978-001】 AJ5圣诞节` menghasilkan harga CNY `420` dan SKU `HQ7978-001`.
- KicksDB menggunakan endpoint resmi dan API key dari `.env`.
- Produk yang cocok ditampilkan sebagai card dan memiliki modal detail.
- Produk dapat disimpan satu per satu atau seluruh produk valid sekaligus.
- SKU yang tidak ditemukan ditampilkan dalam daftar terpisah bersama kandidat serupa.
- Admin dapat memilih kandidat serupa; data kandidat digunakan sebagai data produk, tetapi harga tetap berasal dari harga Yupoo.
- Produk baru berstatus `draft`.
- Nama produk memakai `title` KicksDB.
- Kategori dibuat otomatis dari `category` KicksDB bila slug belum tersedia.
- Semua URL unik dari `image` dan `gallery` KicksDB disimpan langsung; gambar utama ditandai `is_primary`.
- Setiap ukuran KicksDB menghasilkan satu `ProductVariant` berformat `US M 4 / UK 3.5 / CM 23` dan stok awal `10`.
- SKU yang sudah ada di database dilewati dan dilaporkan; produk existing tidak diperbarui.
- Metadata Yupoo selain SKU dan harga tidak disimpan pada produk final.

## Arsitektur

### Modul Yupoo

`YupooScraper` menerima URL kategori tervalidasi dan mengembalikan kumpulan item sumber yang dinormalisasi. Modul ini bertanggung jawab atas:

- Validasi scheme HTTPS dan host yang berakhiran `.x.yupoo.com`.
- Pengambilan HTML dengan timeout, retry, user agent eksplisit, dan pembatasan ukuran respons.
- Penemuan pagination pada host dan path kategori yang sama.
- Deduplicasi halaman dan album.
- Ekstraksi judul album, URL album, dan thumbnail bila tersedia.
- Parsing harga CNY dan SKU tanpa bergantung pada spasi atau jenis bracket secara kaku.

Crawler tidak mengikuti URL arbitrer dari halaman. Semua URL pagination harus mempertahankan host Yupoo awal dan pola path kategori untuk mencegah SSRF serta crawl tanpa batas.

### Modul KicksDB

`KicksDbClient` menggunakan Laravel HTTP client dengan base URL konfigurasi dan bearer token dari `KICKSDB_API_KEY`. Pencarian awal menggunakan:

`GET /v3/stockx/products?query={sku}`

Kecocokan exact hanya diterima jika SKU respons yang telah dinormalisasi sama dengan SKU Yupoo. Jika exact ditemukan, detail produk diambil melalui ID atau slug dengan `display[variants]=true`.

Jika exact tidak ditemukan, beberapa hasil pencarian teratas menjadi kandidat serupa. Kandidat hanya dapat disimpan setelah dipilih admin. Pemilihan kandidat memicu pengambilan detail beserta variants bila detail belum tersimpan.

Client menerapkan connect timeout, request timeout, retry dengan exponential backoff, penanganan status `401`, `403`, `404`, `422`, dan `429`, serta cache per SKU. API key tidak pernah dikirim ke frontend, log, database, atau flash session.

### Orkestrasi Queue

Satu batch impor memiliki job koordinator yang:

1. Menandai batch `scraping`.
2. Mengambil semua halaman Yupoo dan membuat item unik.
3. Menandai batch `matching`.
4. Mengirim lookup KicksDB dalam concurrency terbatas.
5. Menghitung jumlah matched, unmatched, duplicate, failed, dan ready.
6. Menandai batch `ready`, `partially_failed`, atau `failed`.

Lookup aman dijalankan ulang. Item memiliki identitas unik per batch dan SKU/album. Job queue memakai retry/backoff dan middleware rate limiting. Kegagalan satu SKU tidak menggagalkan seluruh batch.

## Model Data Sementara

### `product_import_batches`

- `id`
- `user_id`
- `source_url`
- `status`: `pending`, `scraping`, `matching`, `ready`, `partially_failed`, `failed`, `completed`
- counter: `discovered_count`, `matched_count`, `unmatched_count`, `duplicate_count`, `failed_count`, `saved_count`
- `error_message` nullable
- `started_at`, `finished_at`, timestamps

### `product_import_items`

- `id`
- `product_import_batch_id`
- `source_album_url`
- `source_title`
- `source_sku`
- `price_cny` decimal
- `price_idr` decimal
- `status`: `pending`, `matched`, `unmatched`, `duplicate`, `failed`, `ready`, `saving`, `saved`
- `matched_kicksdb_id` nullable
- `selected_kicksdb_id` nullable
- `product_payload` JSON nullable
- `candidate_payload` JSON nullable
- `error_message` nullable
- `saved_product_id` nullable
- timestamps

Index dan constraint mencakup batch/status, source SKU, saved product, serta uniqueness item sumber dalam batch. Payload hanya memuat field yang diperlukan UI dan persistensi; `gallery_360`, market prices, statistik, sales history, link affiliate, dan metadata lain tidak disimpan.

## Konfigurasi

`.env.example` mendapat `KICKSDB_API_KEY=`. `config/services.php` memetakan key dan base URL KicksDB. Secret hanya dibaca melalui `config()`.

`site_settings` mendapat key `cny_to_idr_rate`, value `2644.40`, type `decimal`. Seeder memakai upsert agar aman dijalankan ulang. Konversi menggunakan arithmetic decimal dan pembulatan ke dua desimal:

`price_idr = round(price_cny × cny_to_idr_rate, 2)`

Nilai rate disalin ke setiap item saat batch diproses sehingga preview dan hasil simpan tetap konsisten walaupun setting berubah sesudahnya.

## Mapping Katalog

### Product

- `name` ← `title`
- `slug` ← slug unik berbasis title
- `sku` ← SKU exact KicksDB atau SKU kandidat terpilih
- `brand_name` ← `brand`
- `price` ← `price_idr`
- `description` ← `description`
- `status` ← `draft`
- flag katalog ← `false`

Data dimensi dan berat tetap memakai default model/database karena KicksDB tidak menyediakan data pengiriman yang dapat diandalkan pada payload contoh.

### Category dan Pivot

Nama kategori berasal dari `category` KicksDB. Sistem membuat slug, mencari category existing berdasarkan slug, lalu membuat category aktif jika belum ada. Produk dilampirkan melalui relasi `categories()` tanpa duplikasi pivot.

Jika kategori kosong, produk tetap dapat disimpan tanpa category dan hasil simpan memberi peringatan nonfatal.

### ProductImage

Gabungkan `image` dan seluruh `gallery`, buang URL kosong serta duplikat dengan urutan stabil. URL pertama menjadi primary. `alt_text` memakai nama produk dan `sort_order` mengikuti urutan.

### ProductVariant

Untuk setiap variant KicksDB, pilih tepat satu ukuran bertipe US, UK, dan CM dari array `sizes`. Format label menggabungkan ukuran yang tersedia dalam urutan US, UK, CM dengan separator ` / `. Variant tanpa salah satu format masih dapat disimpan bila sedikitnya satu dari tiga ukuran tersedia. Variant dengan label yang sama dideduplicasi.

- `size` ← label gabungan
- `price` ← harga produk hasil konversi
- `stock` ← `10`
- `reserved_stock` ← `0`
- `is_active` ← `true`

Jika produk KicksDB tidak memiliki variant yang dapat dipakai, item tidak dapat disimpan dan ditandai gagal validasi.

## Persistensi Produk

Penyimpanan per item berjalan dalam transaksi database dan mengunci item impor. Sistem memeriksa ulang SKU product sebelum menulis untuk menangani race condition antara tombol per-card dan simpan-semua.

Urutan tulis:

1. Ubah item menjadi `saving`.
2. Periksa ulang duplicate SKU.
3. Validasi payload pilihan dan variant.
4. Temukan/buat category.
5. Buat product draft.
6. Buat pivot category.
7. Buat seluruh ProductImage.
8. Buat seluruh ProductVariant.
9. Tandai item `saved` dan simpan `saved_product_id`.
10. Perbarui counter batch.

Simpan-semua mengantre penyimpanan item ready secara terpisah agar satu kegagalan tidak me-rollback semua produk. Tombol dinonaktifkan untuk item duplicate, failed, unresolved, saving, atau saved.

## Antarmuka Admin

Halaman baru berada pada modul katalog admin dan ditambahkan ke navigasi admin.

### Kondisi awal

- Input URL Yupoo.
- Tombol mulai impor.
- Pesan validasi URL dan konfigurasi API.

### Kondisi berjalan

- Ringkasan status dan progress counters.
- Polling Inertia selama status batch belum terminal.
- Daftar card skeleton atau hasil parsial.

### Kondisi siap

- Filter/tab: semua, siap, tidak ditemukan, duplicate, gagal, tersimpan.
- Card menampilkan gambar, title, SKU sumber, SKU cocok, harga CNY, harga IDR, jumlah variant, status.
- Modal menampilkan field Product, Category, gallery, serta seluruh label ukuran yang akan disimpan.
- Tombol `Simpan` per card.
- Tombol `Simpan Semua Produk Valid`.
- Bagian SKU tidak ditemukan menampilkan source SKU dan kandidat serupa.
- Kandidat menampilkan title, SKU, brand, image; pilihan kandidat memuat detail lalu mengubah item menjadi ready.
- Ringkasan akhir melaporkan saved, duplicate, failed, dan unresolved.

Semua request frontend memakai route Wayfinder, state loading eksplisit, dialog aksesibel, dan pola komponen admin yang sudah ada.

## Routes dan Otorisasi

Semua route berada dalam group `auth`, `admin`, dan `admin.activity`:

- `GET /admin/product-imports`
- `POST /admin/product-imports`
- `GET /admin/product-imports/{productImportBatch}`
- `POST /admin/product-imports/{batch}/items/{item}/candidate`
- `POST /admin/product-imports/{batch}/items/{item}/save`
- `POST /admin/product-imports/{batch}/save-all`

Route binding item harus scoped terhadap batch. Form Request menangani validasi. Controller tetap tipis dan mendelegasikan orkestrasi pada service/action.

## Error Handling

- URL tidak valid atau host bukan Yupoo: ditolak sebelum job dibuat.
- Halaman kosong/struktur berubah: batch gagal dengan pesan yang aman untuk admin.
- Judul tanpa harga/SKU: item gagal parsing dan dihitung, tanpa menghentikan batch.
- KicksDB unauthorized: batch dihentikan sebagai konfigurasi gagal.
- KicksDB rate-limited/transient: retry/backoff; setelah batas retry item ditandai gagal.
- Exact SKU tidak ditemukan: item `unmatched`, kandidat tetap ditampilkan.
- Product SKU existing: item `duplicate`; tidak ada update.
- Category kosong: warning nonfatal.
- Variant tidak valid: item tidak dapat disimpan.
- Gambar eksternal rusak: URL tetap tersimpan; UI memakai fallback gambar existing.

Log memakai batch ID, item ID, SKU, status HTTP, dan exception class; tidak merekam bearer token atau full payload sensitif.

## Pengujian

### Unit

- Parser judul Yupoo dengan variasi spasi, bracket, simbol Yuan, SKU, dan input malformed.
- Normalisasi SKU dan exact-match selection.
- Pembentukan label US/UK/CM dan deduplicasi variant.
- Deduplicasi image URL.
- Konversi CNY ke IDR.

### Feature

- Admin dapat membuka halaman dan membuat batch; customer ditolak.
- URL non-Yupoo dan URL berisiko SSRF ditolak.
- Job mengikuti pagination terbatas pada host/path valid.
- HTTP fake KicksDB memverifikasi bearer auth, exact matching, kandidat, variants, retry, dan 429.
- Halaman menampilkan progress, matched, unmatched, duplicate, dan failed.
- Kandidat dapat dipilih.
- Simpan per item membuat Product, Category, pivot, semua images, dan variants sesuai mapping.
- Simpan semua memproses item valid serta melewati duplicate/unresolved.
- Race duplicate SKU tidak membuat produk ganda.
- API key tidak muncul pada response atau payload database.

### Verifikasi Akhir

- `composer test`
- `npm run lint:check`
- `npm run format:check`
- `npm run types:check`
- `npm run build`

## Batasan

- Parser bergantung pada struktur HTML Yupoo dan perlu disesuaikan bila markup berubah.
- Kuota KicksDB membatasi jumlah SKU yang dapat diproses; cache mengurangi request berulang tetapi tidak menghilangkan kebutuhan kuota.
- Tidak ada update/sinkronisasi produk setelah impor.
- Gambar tetap bergantung pada URL eksternal KicksDB.
- Tidak ada editor data produk dalam preview; perubahan dilakukan melalui halaman edit produk setelah disimpan.
