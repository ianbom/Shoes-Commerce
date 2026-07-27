# PRD Website E-Commerce Toko Sepatu

**Nama Produk:** Toko Sepatu E-Commerce Website  
**Tipe Dokumen:** Product Requirements Document (PRD)  
**Versi:** 2.0  
**Tanggal:** 27 Juli 2026  
**Stack:** Laravel, Inertia.js, React, TypeScript, MySQL, Midtrans, Biteship  
**Target Platform:** Web desktop dan mobile responsive

---

## 1. Ringkasan Produk

Website e-commerce toko sepatu adalah platform penjualan online yang menyediakan berbagai jenis sepatu, seperti sneakers, running shoes, basketball shoes, training shoes, casual shoes, lifestyle shoes, dan sepatu anak.

Website dibangun untuk memberikan pengalaman berbelanja sepatu yang modern, cepat, aman, dan mudah digunakan. Customer dapat melihat katalog, memilih warna dan ukuran sepatu, memeriksa ketersediaan stok per kombinasi warna-ukuran, menambahkan produk ke keranjang, memilih jasa pengiriman, melakukan pembayaran, serta melacak pesanan.

Sistem menggunakan Laravel sebagai backend utama, Inertia.js sebagai penghubung backend dan frontend, React TypeScript sebagai frontend, MySQL sebagai database, Midtrans sebagai payment gateway, Biteship sebagai shipping aggregator, dan sistem stok lokal sebagai sumber utama pengelolaan stok.

Struktur produk disesuaikan untuk kebutuhan toko sepatu. Produk menyimpan informasi umum seperti nama model, merek, kategori, harga, deskripsi, berat, dimensi, dan status publikasi. Variasi stok disimpan pada `product_variants` berdasarkan kombinasi warna dan ukuran sepatu.

---

## 2. Tujuan Produk

Tujuan utama website ini adalah:

1. Menyediakan katalog sepatu yang rapi, modern, dan mudah dicari.
2. Memungkinkan customer membeli sepatu langsung melalui website.
3. Menampilkan pilihan ukuran dan warna secara jelas pada halaman produk.
4. Menampilkan ketersediaan stok yang akurat untuk setiap kombinasi warna dan ukuran.
5. Mengintegrasikan pembayaran online menggunakan Midtrans.
6. Mengintegrasikan pemeriksaan ongkir, pembuatan pengiriman, dan pelacakan menggunakan Biteship.
7. Menghindari overselling melalui mekanisme `reserved_stock` selama proses pembayaran.
8. Menyediakan admin panel untuk mengelola produk, kategori, koleksi, gambar, varian, stok, pesanan, pembayaran, pengiriman, voucher, banner, halaman statis, wishlist, dan review.
9. Menyediakan panduan ukuran agar customer dapat memilih ukuran sepatu dengan lebih tepat.
10. Menyediakan fondasi sistem yang sederhana, scalable, aman, dan mudah dikembangkan.

---

## 3. Latar Belakang

Penjualan sepatu secara online memiliki tantangan yang berbeda dari produk umum karena customer perlu memilih ukuran dan warna yang tepat. Satu model sepatu dapat memiliki banyak kombinasi variasi, sementara ketersediaan stok setiap kombinasi dapat berbeda.

Website resmi diperlukan untuk:

- Meningkatkan kredibilitas toko dan merek yang dijual.
- Menampilkan katalog sepatu dengan kontrol penuh.
- Memudahkan customer menemukan sepatu berdasarkan kategori, merek, penggunaan, harga, warna, dan ukuran.
- Menampilkan panduan ukuran dan informasi produk secara lengkap.
- Mengelola campaign seperti New Release, Best Seller, Sale, Running Collection, dan Basketball Collection.
- Mengumpulkan traffic langsung dari SEO, iklan, media sosial, dan komunitas olahraga.
- Mengurangi ketergantungan terhadap marketplace.
- Mengelola stok setiap ukuran dan warna secara akurat.
- Menyediakan pengalaman belanja yang lebih kuat secara visual dan brand-oriented.

Dalam rancangan ini, informasi variasi tidak menggunakan nama varian terpisah. Label yang tampil kepada customer dibentuk otomatis dari kombinasi `color_name` dan `size`, misalnya `Black / EU 42`.

---

## 4. Ruang Lingkup Produk

### 4.1 Dalam Scope

Website mencakup:

1. Public storefront.
2. Customer authentication.
3. Product catalog.
4. Category page.
5. Collection page.
6. Product detail page.
7. Product search.
8. Filter produk berdasarkan kategori, merek, harga, warna, ukuran, dan stok.
9. Size guide.
10. Cart.
11. Checkout.
12. Address management.
13. Shipping rate calculation menggunakan Biteship.
14. Payment menggunakan Midtrans Snap.
15. Order history.
16. Order detail dan tracking.
17. Admin dashboard.
18. Product management.
19. Category management.
20. Collection management.
21. Product image management.
22. Product variant management berdasarkan warna dan ukuran.
23. Stock management.
24. Voucher management.
25. Banner management.
26. CMS pages.
27. Payment webhook handling.
28. Shipping webhook handling.
29. Stock adjustment dan stock logs.
30. Notification system.
31. Wishlist.
32. Product review.

### 4.2 Di Luar Scope untuk MVP

Fitur berikut tidak wajib pada MVP pertama:

1. Loyalty point.
2. Affiliate atau referral system.
3. Multi-vendor marketplace.
4. Auction.
5. Sistem raffle sepatu limited edition.
6. Live chat internal.
7. Product comparison tingkat lanjut.
8. AI recommendation engine.
9. Virtual try-on berbasis augmented reality.
10. Native mobile application.
11. Multi-warehouse management kompleks.
12. Full accounting system.
13. ERP internal.
14. Return dan refund automation kompleks.
15. Integrasi stok dua arah dengan marketplace.

---

## 5. User Role

### 5.1 Guest

Guest adalah pengunjung yang belum login.

Kemampuan:

- Melihat homepage.
- Melihat kategori.
- Melihat koleksi.
- Melihat daftar produk.
- Melihat detail produk.
- Melihat pilihan warna dan ukuran.
- Melihat size guide.
- Mencari dan memfilter produk.
- Menambahkan produk ke cart sebagai session cart jika guest cart diaktifkan.
- Login atau register sebelum checkout.

### 5.2 Customer

Customer adalah user yang sudah login.

Kemampuan:

- Mengelola profil.
- Mengelola alamat.
- Menambahkan varian sepatu ke cart.
- Mengubah jumlah item.
- Checkout.
- Memilih kurir.
- Menggunakan voucher.
- Melakukan pembayaran.
- Melihat riwayat order.
- Melihat status pembayaran.
- Melihat status pengiriman.
- Melacak paket.
- Memberikan review setelah order selesai.
- Menambahkan produk ke wishlist.

### 5.3 Admin

Admin adalah pengelola operasional website.

Kemampuan:

- Mengelola produk.
- Mengelola kategori.
- Mengelola koleksi.
- Mengelola gambar produk.
- Mengelola variasi warna dan ukuran.
- Melihat dan menyesuaikan stok setiap SKU.
- Mengelola order.
- Melihat pembayaran.
- Membuat pengiriman Biteship.
- Melihat tracking pengiriman.
- Mengelola voucher.
- Mengelola banner.
- Mengelola halaman statis.
- Memoderasi review.
- Melihat stock logs.
- Melihat integration logs.
- Melihat aktivitas admin.

### 5.4 Super Admin

Super Admin memiliki seluruh akses Admin dan akses tambahan:

- Mengelola akun admin.
- Mengelola konfigurasi Midtrans.
- Mengelola konfigurasi Biteship.
- Mengelola konfigurasi stok.
- Mengelola site settings.
- Melihat seluruh audit log.
- Mengatur role dan permission.

---

## 6. Target User

Target user website:

1. Pengguna yang mencari sneakers untuk kebutuhan sehari-hari.
2. Pelari yang mencari running shoes berdasarkan kebutuhan latihan.
3. Pemain basket yang membutuhkan basketball shoes.
4. Pengguna gym dan olahraga yang membutuhkan training shoes.
5. Pengguna yang mencari sepatu lifestyle atau casual.
6. Orang tua yang mencari sepatu anak.
7. Sneaker enthusiast yang mencari produk baru atau koleksi tertentu.
8. Customer yang sudah mengenal toko dari marketplace atau media sosial.
9. Customer baru dari SEO, Instagram, TikTok, komunitas olahraga, dan iklan digital.

---

## 7. Value Proposition

Website harus menonjolkan:

1. Produk sepatu original.
2. Katalog lengkap dan mudah dijelajahi.
3. Pilihan warna dan ukuran yang jelas.
4. Informasi stok real-time per ukuran.
5. Panduan ukuran yang mudah dipahami.
6. Foto produk berkualitas tinggi dari berbagai sudut.
7. Deskripsi produk lengkap, termasuk material, teknologi, fungsi, dan perawatan.
8. Pembayaran aman melalui Midtrans.
9. Pengiriman fleksibel melalui Biteship.
10. Promo, koleksi, dan produk terbaru yang mudah ditemukan.
11. Riwayat order dan pelacakan pengiriman yang transparan.
12. Review pembeli terverifikasi.

---

## 8. Teknologi

### 8.1 Backend

- Laravel 12 atau versi stabil terbaru.
- PHP 8.3+.
- Laravel Starter Kit React Inertia.
- Laravel Queue untuk proses asynchronous.
- Laravel Scheduler untuk scheduled jobs.
- Laravel Notifications untuk notifikasi internal.
- Laravel Policies untuk authorization.
- Laravel Form Request untuk validasi.
- Laravel Eloquent ORM.

### 8.2 Frontend

- React.
- TypeScript.
- Inertia.js.
- Vite.
- Tailwind CSS.
- Tiptap.js untuk rich text editor produk dan CMS.
- React Hook Form atau form bawaan Inertia.
- Zod opsional untuk validasi frontend.
- Shadcn/ui atau custom UI component.

### 8.3 Database

- MySQL 8.x.

### 8.4 Payment

- Midtrans Snap.
- Midtrans notification atau webhook.

### 8.5 Shipping

- Biteship Rates API.
- Biteship Orders API.
- Biteship Tracking API.
- Biteship webhook.

### 8.6 Inventory Management

- Stok dikelola secara lokal pada database website.
- `product_variants.stock` menjadi stok utama per SKU sepatu.
- `product_variants.reserved_stock` menahan stok sementara ketika customer sudah membuat order tetapi pembayaran belum selesai.
- `stock_logs` mencatat perubahan stok manual, reservasi, pelepasan reservasi, dan pengurangan stok karena order.

### 8.7 Storage

- Local storage untuk development.
- S3-compatible storage atau hosting storage untuk production.
- Product images disimpan pada storage dan URL disimpan pada database.
- Gambar perlu dioptimasi menjadi WebP atau AVIF jika memungkinkan.

---

## 9. Prinsip Arsitektur

1. Laravel menjadi backend utama.
2. Inertia digunakan agar frontend React tetap menggunakan routing dan controller Laravel.
3. React TypeScript digunakan untuk UI modern dan typed.
4. MySQL digunakan sebagai relational database.
5. Detail produk panjang disimpan pada `products.description` dalam format HTML yang telah disanitasi.
6. Produk menyimpan informasi umum untuk satu model sepatu.
7. Variasi stok disimpan pada `product_variants` berdasarkan warna dan ukuran.
8. Label variasi di frontend dibentuk otomatis dari warna dan ukuran.
9. Stok utama berasal dari `product_variants.stock`.
10. Website menjadi master stock untuk penjualan langsung.
11. Order yang dibayar mengurangi stok final.
12. Jika pembayaran gagal, dibatalkan, atau expired, stock reservation harus dilepas.
13. Semua webhook harus idempotent.
14. Semua request penting ke Midtrans dan Biteship harus dicatat dalam log.
15. Proses berat seperti webhook processing dan create shipment menggunakan queue.
16. Perubahan stok harus menggunakan database transaction dan row lock.
17. Harga dan informasi produk pada order harus disimpan sebagai snapshot agar histori tetap konsisten.

---

## 10. Modul Utama

### 10.1 Public Storefront

#### Deskripsi

Halaman publik untuk menampilkan identitas toko, campaign, kategori, koleksi, dan produk sepatu.

#### Halaman

1. Homepage.
2. Product listing.
3. Category detail.
4. Collection detail.
5. Product detail.
6. Search result.
7. Size guide.
8. Cart.
9. Checkout.
10. Static pages.

#### Requirement

- Homepage menampilkan hero banner utama.
- Homepage menampilkan kategori utama.
- Homepage menampilkan featured collections.
- Homepage menampilkan best seller.
- Homepage menampilkan new arrivals.
- Homepage menampilkan produk sale.
- Homepage dapat menampilkan section berdasarkan kebutuhan, misalnya Running, Basketball, Lifestyle, dan Kids.
- Product card menampilkan gambar utama, nama produk, merek, harga, harga diskon, badge, dan status stok.
- Product listing dapat difilter berdasarkan kategori, merek, harga, warna, ukuran, status stok, dan keyword.
- Product listing dapat diurutkan berdasarkan terbaru, harga terendah, harga tertinggi, best seller, dan diskon terbesar.
- Product detail menampilkan galeri, nama, merek, harga, pilihan warna, pilihan ukuran, stok, size guide, deskripsi, review, dan related products.
- Ukuran yang habis harus terlihat disabled dan tidak dapat dipilih.
- Pergantian warna dapat mengganti gambar utama sesuai gambar varian jika tersedia.

---

### 10.2 Product Catalog

#### Deskripsi

Modul untuk mengelola seluruh katalog sepatu.

#### Struktur Modul Produk

Tabel utama:

1. `categories`
2. `collections`
3. `products`
4. `product_collections`
5. `product_images`
6. `product_variants`
7. `stock_logs`

#### Requirement

- Admin dapat membuat kategori.
- Admin dapat membuat koleksi.
- Admin dapat membuat produk.
- Admin dapat mengisi nama model sepatu.
- Admin dapat memilih kategori.
- Admin dapat mengisi merek melalui `brand_name`.
- Admin dapat mengisi SKU induk produk jika diperlukan.
- Admin dapat mengatur harga normal dan harga sale pada level produk.
- Admin dapat mengisi short description.
- Admin dapat mengisi deskripsi lengkap menggunakan Tiptap.js.
- Admin dapat memasukkan material, teknologi, kegunaan, fit, panduan perawatan, dan rekomendasi penggunaan pada deskripsi.
- Admin dapat mengisi berat dan dimensi pengiriman.
- Admin dapat upload beberapa gambar produk.
- Admin dapat menentukan gambar utama.
- Admin dapat membuat kombinasi warna dan ukuran sebagai varian.
- Admin dapat mengisi SKU unik setiap varian.
- Admin dapat mengatur harga khusus per varian apabila berbeda dari harga produk.
- Admin dapat mengatur stok per varian.
- Setiap perubahan stok penting dicatat ke `stock_logs`.

#### Contoh Produk

Produk: `Urban Runner Pro`  
Merek: `Example Brand`  
Kategori: `Running Shoes`

Collections:

- New Arrivals
- Best Seller
- Running Essentials

Variasi:

- Black, EU 40
- Black, EU 41
- Black, EU 42
- White, EU 40
- White, EU 41
- White, EU 42

Label yang tampil pada UI dibentuk otomatis, misalnya `Black / EU 42`.

---

### 10.3 Category

#### Deskripsi

Category adalah klasifikasi utama produk untuk navigasi dan filter katalog.

#### Contoh Kategori

- Sneakers
- Running Shoes
- Basketball Shoes
- Training Shoes
- Lifestyle Shoes
- Casual Shoes
- Skate Shoes
- Kids Shoes
- Sandals and Slides

Category juga dapat menggunakan parent-child, misalnya:

```text
Men
├── Running Shoes
├── Basketball Shoes
└── Lifestyle Shoes

Women
├── Running Shoes
├── Training Shoes
└── Lifestyle Shoes

Kids
├── Boys
└── Girls
```

#### Requirement

- Category dapat memiliki parent category.
- Category memiliki slug unik.
- Category memiliki nama dan deskripsi.
- Category dapat diaktifkan atau dinonaktifkan.
- Category dapat memiliki gambar.
- Category memiliki urutan tampil.
- Category digunakan pada navigasi utama, filter, dan landing page.

---

### 10.4 Collection

#### Deskripsi

Collection adalah grouping produk untuk kebutuhan marketing, tema, campaign, atau kurasi tertentu.

#### Contoh Collection

- New Arrivals
- Best Seller
- Limited Release
- Running Essentials
- Basketball Collection
- Everyday Sneakers
- Back to School
- Sale up to 50%

#### Requirement

- Produk dapat masuk ke banyak koleksi.
- Koleksi memiliki slug.
- Koleksi dapat memiliki banner desktop dan mobile.
- Koleksi dapat memiliki periode aktif dengan `starts_at` dan `ends_at`.
- Koleksi dapat ditandai sebagai featured.
- Koleksi dapat diaktifkan atau dinonaktifkan.
- Koleksi digunakan untuk landing page campaign.

---

### 10.5 Product Variant dan Stock

#### Deskripsi

Varian produk menyimpan kombinasi warna dan ukuran sepatu, SKU, harga opsional, stok, reserved stock, berat, dimensi, gambar, dan status aktif.

#### Data Utama Varian

- `product_id`
- `sku`
- `color_name`
- `color_hex`
- `size`
- `regular_price`
- `sale_price`
- `stock`
- `reserved_stock`
- `weight`
- `length`
- `width`
- `height`
- `image_url`
- `is_active`

#### Requirement

- Setiap produk minimal memiliki satu varian.
- Untuk sepatu, setiap kombinasi warna dan ukuran menjadi satu SKU terpisah.
- SKU varian wajib unik.
- Warna disimpan pada `color_name`.
- Representasi warna opsional disimpan pada `color_hex`.
- Ukuran disimpan sebagai string pada `size`, misalnya `EU 42`.
- Sistem ukuran utama untuk toko harus ditentukan pada site settings atau standar operasional toko.
- Harga varian dapat kosong jika mengikuti harga produk.
- Harga varian mengoverride harga produk jika diisi.
- Stok ditampilkan berdasarkan `stock` pada `product_variants`.
- `reserved_stock` digunakan untuk menahan stok sementara selama pembayaran.
- Gambar varian dapat digunakan untuk membedakan colorway.
- Varian yang tidak aktif tidak dapat dibeli.
- Ukuran dengan available stock nol tidak dapat dipilih.
- Admin dapat melakukan stock adjustment.
- Sistem mencatat perubahan stok ke `stock_logs`.

#### Pembentukan Label Varian

```text
variant_display_label = color_name + " / " + size
```

Contoh:

```text
White / EU 41
Black / EU 42
University Red / EU 43
```

#### Formula Stok Website

```text
available_stock = stock - reserved_stock
```

Jika hasil perhitungan kurang dari 0, sistem harus menganggap stok tersedia sebagai 0 dan mencatat error invariant.

---

### 10.6 Product Image Gallery

#### Deskripsi

Galeri produk menampilkan detail visual sepatu dari berbagai sudut.

#### Requirement

- Satu produk dapat memiliki banyak gambar.
- Admin dapat menentukan primary image.
- Admin dapat mengatur urutan gambar.
- Gambar dapat memiliki alt text.
- Gambar varian dapat digunakan ketika customer memilih warna tertentu.
- Rekomendasi gambar produk:
  - Tampak samping.
  - Tampak depan.
  - Tampak belakang.
  - Tampak atas.
  - Detail outsole.
  - Detail material.
  - Foto on-feet atau lifestyle.
- Frontend mendukung thumbnail dan zoom.
- Mobile mendukung swipe gallery.

---

### 10.7 Size Guide

#### Deskripsi

Size guide membantu customer memilih ukuran sepatu yang sesuai.

#### Requirement

- Website memiliki halaman size guide global.
- Product detail memiliki tombol atau modal size guide.
- Panduan menjelaskan cara mengukur panjang kaki.
- Panduan dapat menampilkan konversi EU, US, UK, dan CM.
- Jika merek memiliki ukuran berbeda, informasi khusus merek dapat ditambahkan pada deskripsi produk.
- Customer diberi peringatan untuk memeriksa ukuran sebelum checkout.
- Admin dapat mengelola konten size guide melalui CMS.

#### Contoh Informasi

| Panjang Kaki | EU | US Men | US Women |
|---|---:|---:|---:|
| 25 cm | 40 | 7 | 8.5 |
| 26 cm | 41 | 8 | 9.5 |
| 27 cm | 42 | 9 | 10.5 |

Data pada tabel hanya contoh dan harus disesuaikan dengan standar produk yang dijual.

---

### 10.8 Cart

#### Deskripsi

Cart menyimpan varian sepatu yang akan dibeli customer.

#### Requirement

- Customer dapat menambahkan varian ke cart setelah memilih warna dan ukuran.
- Sistem tidak boleh menambahkan produk jika ukuran belum dipilih.
- Customer dapat mengubah quantity.
- Customer dapat menghapus item.
- Sistem memeriksa stok varian sebelum menambahkan ke cart.
- Harga pada cart disimpan sebagai `price_snapshot`.
- Informasi tampilan varian dibentuk dari warna dan ukuran.
- Jika harga berubah setelah item masuk cart, sistem menampilkan harga terbaru saat checkout.
- Jika stok berkurang atau habis, customer harus diberi informasi sebelum checkout.
- Quantity tidak dapat melebihi available stock.
- Cart hanya menyimpan varian aktif.

---

### 10.9 Checkout

#### Deskripsi

Checkout adalah proses customer memilih alamat, memilih kurir, mengonfirmasi produk, membuat order, dan melakukan pembayaran.

#### Flow Checkout

1. Customer membuka cart.
2. Customer meninjau nama produk, warna, ukuran, quantity, dan harga.
3. Customer klik checkout.
4. Sistem memvalidasi status produk, status varian, harga, dan stok terbaru.
5. Customer memilih alamat.
6. Sistem mengambil shipping rate dari Biteship.
7. Customer memilih kurir dan layanan.
8. Customer memasukkan voucher jika ada.
9. Sistem menghitung subtotal, diskon, ongkir, asuransi, biaya layanan, dan grand total.
10. Customer menyetujui kebijakan pembelian, penukaran ukuran, return, dan refund.
11. Sistem membuat order dengan status `pending_payment`.
12. Sistem menaikkan `reserved_stock` untuk setiap SKU terkait.
13. Sistem membuat Snap token Midtrans.
14. Customer membayar melalui Midtrans Snap.
15. Midtrans mengirim webhook.
16. Jika pembayaran sukses, order menjadi `paid`.
17. Sistem mengurangi `stock` dan `reserved_stock` secara final.
18. Sistem membuat shipment Biteship secara otomatis atau menunggu tindakan admin.

#### Requirement

- Checkout wajib login.
- Checkout wajib memiliki alamat pengiriman.
- Checkout wajib memilih kurir.
- Checkout wajib memvalidasi stok terbaru.
- Checkout harus menggunakan idempotency key untuk mencegah order ganda.
- Seluruh kalkulasi harga dilakukan ulang pada backend.
- Data produk, SKU, warna, ukuran, harga, berat, dan gambar disimpan sebagai snapshot pada order item.
- Setelah order berhasil dibuat, cart item yang telah diproses dihapus.
- Jika payment expired, failed, atau cancelled, `reserved_stock` dilepas.
- Jika Snap token gagal dibuat, order tetap tersimpan dan customer dapat mencoba pembayaran kembali.

---

### 10.10 Payment Midtrans

#### Deskripsi

Midtrans digunakan sebagai payment gateway untuk memproses pembayaran customer.

#### Requirement

- Sistem menggunakan Midtrans Snap.
- Request Snap token dilakukan dari backend Laravel.
- Frontend menampilkan Snap popup atau redirect URL.
- Sistem menyimpan Snap token dan redirect URL.
- Sistem menerima notification atau webhook dari Midtrans.
- Webhook memverifikasi signature.
- Webhook diproses secara idempotent.
- Status `settlement` atau `capture` yang valid mengubah payment menjadi paid.
- Payment expired mengubah order menjadi expired dan melepas stock reservation.
- Payment failed, cancelled, atau denied ditangani sesuai mapping status internal.
- Raw response disimpan untuk audit dan debugging.

#### Status Payment Internal

- `pending`
- `paid`
- `manual_review`
- `failed`
- `cancelled`
- `expired`
- `refunded`
- `partially_refunded`

#### Data yang Disimpan

- `midtrans_order_id`
- `midtrans_transaction_id`
- `midtrans_snap_token`
- `midtrans_redirect_url`
- `transaction_status`
- `fraud_status`
- `gross_amount`
- `currency`
- `paid_at`
- `expired_at`
- `failure_reason`
- `raw_response`

---

### 10.11 Shipping Biteship

#### Deskripsi

Biteship digunakan untuk cek ongkir, membuat pengiriman, mencetak label, dan melacak paket.

#### Requirement

- Sistem dapat mencari Biteship area ID untuk alamat customer.
- Sistem dapat melakukan rate checking.
- Customer dapat memilih kurir dan layanan.
- Sistem menghitung berat total berdasarkan varian sepatu dan quantity.
- Sistem dapat menggunakan dimensi paket untuk kebutuhan volumetric weight.
- Setelah order dibayar, admin atau sistem dapat membuat shipment.
- Sistem menyimpan Biteship order ID, tracking ID, waybill ID, dan label URL.
- Sistem menerima webhook tracking dari Biteship.
- Customer dapat melihat status pengiriman.
- Admin dapat melihat riwayat tracking.
- Create shipment harus dapat di-retry jika terjadi kegagalan.

#### Status Shipping Internal

- `not_created`
- `creating`
- `confirmed`
- `allocated`
- `picked`
- `in_transit`
- `delivered`
- `cancelled`
- `failed`
- `problem`
- `lost`
- `returned`

---

### 10.12 Stock Management

#### Deskripsi

Stock management dikelola langsung pada website menggunakan `stock`, `reserved_stock`, dan `stock_logs`.

#### Prinsip

- Website adalah master stock untuk checkout website.
- Stok dikelola per kombinasi warna dan ukuran.
- Available stock dihitung dari `stock - reserved_stock`.
- `reserved_stock` menahan stok sampai pembayaran berhasil, gagal, dibatalkan, atau expired.
- Stok final berkurang setelah pembayaran berhasil.
- Semua perubahan stok penting dicatat pada `stock_logs`.

#### Requirement

- Admin dapat melihat produk, SKU, warna, ukuran, stok total, reserved stock, dan available stock.
- Admin dapat mencari stok berdasarkan nama produk atau SKU.
- Admin dapat memfilter low stock dan out of stock.
- Admin dapat melakukan stock adjustment.
- Sistem menolak adjustment yang menghasilkan stok negatif.
- Sistem menolak adjustment yang menyebabkan `stock < reserved_stock`.
- Sistem mencatat alasan adjustment.
- Sistem menggunakan row lock saat reservasi dan finalisasi stok.
- Sistem melepas reservation ketika payment gagal, cancelled, atau expired.
- Low-stock threshold dapat dikonfigurasi melalui site settings.

#### Flow Stok Masuk

1. Admin membuka halaman stock adjustment.
2. Admin memilih SKU sepatu.
3. Admin memasukkan jumlah tambahan stok dan alasan.
4. Sistem memperbarui `product_variants.stock`.
5. Sistem mencatat perubahan ke `stock_logs`.

#### Flow Stok Keluar Website

1. Customer checkout.
2. Sistem memvalidasi available stock.
3. Sistem menaikkan `reserved_stock`.
4. Customer membayar.
5. Midtrans mengirim payment success.
6. Sistem mengurangi `stock` dan `reserved_stock`.
7. Sistem mencatat pengurangan stok ke `stock_logs`.

#### Flow Payment Expired

1. Midtrans mengirim status expired.
2. Order menjadi payment expired.
3. Sistem mengurangi `reserved_stock`.
4. Stok kembali tersedia untuk customer lain.
5. Sistem mencatat pelepasan reservation.

---

### 10.13 Voucher

#### Deskripsi

Voucher digunakan untuk memberikan diskon pada order.

#### Requirement

- Admin dapat membuat voucher.
- Voucher dapat berupa nominal tetap atau persentase.
- Voucher dapat memiliki minimum order.
- Voucher dapat memiliki maksimum diskon.
- Voucher dapat memiliki periode aktif.
- Voucher dapat dibatasi jumlah pemakaian total.
- Voucher dapat dibatasi jumlah pemakaian per customer.
- Voucher dapat berlaku untuk semua produk, produk tertentu, atau kategori tertentu.
- Sistem memvalidasi voucher pada backend.
- Sistem menyimpan voucher code snapshot pada order.
- Voucher yang digunakan pada order unpaid harus dilepas ketika order dibatalkan atau expired jika kuota direservasi.

---

### 10.14 Wishlist

#### Deskripsi

Customer dapat menyimpan produk sepatu yang diminati.

#### Requirement

- Wishlist hanya tersedia untuk user login.
- Customer dapat menambahkan produk ke wishlist.
- Customer dapat menghapus produk dari wishlist.
- Wishlist menyimpan produk, bukan SKU tertentu.
- Customer tetap harus memilih warna dan ukuran ketika memindahkan item ke cart.
- Produk nonaktif dapat disembunyikan atau ditampilkan sebagai unavailable sesuai pengaturan toko.

---

### 10.15 Product Review

#### Deskripsi

Customer dapat memberikan review setelah membeli produk.

#### Requirement

- Review hanya dapat dibuat oleh customer yang membeli produk tersebut.
- Review dapat dibuat setelah order delivered atau completed.
- Review berisi rating 1 sampai 5, judul, dan komentar.
- Review dikaitkan dengan order item untuk verifikasi pembelian.
- Admin dapat menyembunyikan review.
- Rating rata-rata produk dihitung dari review yang visible.
- Frontend menampilkan badge verified purchase.
- Upload foto review dapat ditambahkan pada fase berikutnya.

---

### 10.16 Notification System

#### Deskripsi

Notification system memberi informasi penting kepada customer dan admin.

#### Notifikasi Customer

- Order berhasil dibuat.
- Pembayaran berhasil.
- Pembayaran gagal atau expired.
- Pesanan sedang diproses.
- Pesanan dikirim.
- Pesanan diterima.
- Voucher atau campaign tertentu jika customer menyetujui marketing communication.

#### Notifikasi Admin

- Order baru dibayar.
- Shipment gagal dibuat.
- Payment membutuhkan manual review.
- Produk low stock.
- Produk out of stock.
- Webhook gagal diproses.

---

### 10.17 Admin Dashboard

#### Deskripsi

Admin dashboard digunakan untuk mengelola operasional toko sepatu.

#### Halaman Admin

1. Dashboard overview.
2. Product list.
3. Product create dan edit.
4. Product variant management.
5. Category list.
6. Collection list.
7. Order list.
8. Order detail.
9. Payment list.
10. Shipment list.
11. Voucher list.
12. Banner list.
13. Page CMS.
14. Customer list.
15. Review moderation.
16. Stock list.
17. Stock adjustment.
18. Stock logs.
19. Integration logs.
20. Site settings.
21. Admin activity logs.

#### Dashboard Metrics

- Gross sales.
- Net sales.
- Total orders.
- Pending payment.
- Paid orders.
- Orders pending processing.
- Orders pending shipment.
- Low-stock SKUs.
- Out-of-stock SKUs.
- Best-selling products.
- Best-selling sizes.
- Best-selling colors.
- Recent orders.
- Sales by category.
- Sales by brand.

---

### 10.18 CMS

#### Deskripsi

CMS digunakan untuk mengelola konten non-produk.

#### Requirement

- Admin dapat membuat dan mengedit halaman statis.
- Konten menggunakan Tiptap.js.
- Admin dapat mengatur status aktif.
- Admin dapat mengatur meta title dan meta description.
- Admin dapat mengelola banner homepage dan collection.

#### Contoh Halaman

- About Us.
- Contact.
- FAQ.
- Size Guide.
- Shipping Policy.
- Return and Exchange Policy.
- Privacy Policy.
- Terms and Conditions.
- Shoe Care Guide.
- Authenticity Guarantee.

---

## 11. User Flow

### 11.1 Guest Melihat Produk

```text
Homepage
→ Pilih kategori atau koleksi
→ Product listing
→ Gunakan filter
→ Product detail
→ Pilih warna
→ Pilih ukuran
→ Add to cart
→ Login atau register
```

### 11.2 Customer Checkout

```text
Cart
→ Review warna dan ukuran
→ Checkout
→ Pilih alamat
→ Cek ongkir Biteship
→ Pilih kurir
→ Masukkan voucher
→ Buat order
→ Bayar melalui Midtrans
→ Payment success
→ Order detail
```

### 11.3 Admin Menambah Produk

```text
Admin login
→ Product management
→ Create product
→ Pilih kategori
→ Isi nama model, merek, harga, dan deskripsi
→ Upload gambar
→ Tambah kombinasi warna dan ukuran
→ Isi SKU dan stok setiap kombinasi
→ Publish
```

### 11.4 Admin Memproses Order

```text
Order paid
→ Verifikasi item dan ukuran
→ Processing
→ Packing
→ Create shipment Biteship
→ Cetak label
→ Serahkan ke kurir
→ Tracking diperbarui melalui webhook
→ Delivered
→ Completed
```

### 11.5 Customer Memilih Ukuran

```text
Product detail
→ Buka size guide
→ Ukur panjang kaki
→ Pilih warna
→ Lihat ukuran yang tersedia
→ Pilih ukuran
→ Lihat status stok
→ Add to cart
```

---

## 12. Status dan State Machine

### 12.1 Order Status

| Status | Deskripsi |
|---|---|
| `pending_payment` | Order dibuat dan menunggu pembayaran |
| `paid` | Pembayaran berhasil |
| `processing` | Pesanan sedang diproses |
| `ready_to_ship` | Pesanan telah dikemas dan siap dikirim |
| `shipment_created` | Shipment telah dibuat |
| `shipped` | Pesanan telah diserahkan kepada kurir |
| `delivered` | Pesanan diterima customer |
| `completed` | Order selesai |
| `cancelled` | Order dibatalkan |
| `payment_failed` | Pembayaran gagal |
| `payment_expired` | Pembayaran expired |
| `shipment_failed` | Pembuatan atau proses shipment gagal |
| `shipment_problem` | Terdapat masalah pengiriman |
| `lost` | Paket dinyatakan hilang |
| `returned` | Paket dikembalikan |
| `refunded` | Dana telah dikembalikan |

### 12.2 Payment Status

| Status | Deskripsi |
|---|---|
| `pending` | Menunggu pembayaran |
| `paid` | Pembayaran berhasil |
| `manual_review` | Membutuhkan pengecekan manual |
| `failed` | Pembayaran gagal |
| `cancelled` | Pembayaran dibatalkan |
| `expired` | Pembayaran kadaluarsa |
| `refunded` | Pembayaran dikembalikan penuh |
| `partially_refunded` | Pembayaran dikembalikan sebagian |

### 12.3 Shipping Status

| Status | Deskripsi |
|---|---|
| `not_created` | Shipment belum dibuat |
| `creating` | Shipment sedang dibuat |
| `confirmed` | Shipment dikonfirmasi |
| `allocated` | Kurir telah dialokasikan |
| `picked` | Paket telah diambil kurir |
| `in_transit` | Paket dalam perjalanan |
| `delivered` | Paket diterima |
| `cancelled` | Shipment dibatalkan |
| `failed` | Pengiriman gagal |
| `problem` | Terdapat kendala pengiriman |
| `lost` | Paket hilang |
| `returned` | Paket dikembalikan |

### 12.4 Inventory Reservation Status

| Status | Deskripsi |
|---|---|
| `reserved` | Stok ditahan sementara |
| `released` | Reservation dilepas |
| `finalized` | Reservation menjadi pengurangan stok final |
| `expired` | Reservation berakhir karena pembayaran expired |

---

## 13. Database Ringkas

Database menggunakan struktur berikut.

### 13.1 User

- `users`
- `customer_addresses`

### 13.2 Product Catalog

- `categories`
- `collections`
- `products`
- `product_collections`
- `product_images`
- `product_variants`

### 13.3 Stock

- `stock_logs`

### 13.4 Cart dan Order

- `carts`
- `cart_items`
- `orders`
- `order_items`
- `order_addresses`

### 13.5 Payment

- `payments`
- `payment_logs`

### 13.6 Shipping

- `shipments`
- `shipment_trackings`
- `biteship_webhook_logs`

### 13.7 Promotion

- `vouchers`
- `voucher_products`
- `voucher_categories`

### 13.8 Additional

- `product_reviews`
- `wishlists`
- `notifications`
- `banners`
- `pages`
- `site_settings`
- `admin_activity_logs`

---

## 14. Product Data Model

### 14.1 Products

Tabel `products` menyimpan informasi umum satu model sepatu.

Data utama:

- `id`
- `category_id`
- `name`
- `slug`
- `sku`
- `brand_name`
- `regular_price`
- `sale_price`
- `short_description`
- `description`
- `stock_status`
- `status`
- `weight`
- `length`
- `width`
- `height`
- `is_featured`
- `is_new_arrival`
- `is_best_seller`
- `meta_title`
- `meta_description`
- timestamps dan soft delete

#### Aturan

- Satu record produk merepresentasikan satu model sepatu.
- Warna dan ukuran tidak disimpan pada tabel ini.
- Harga produk menjadi harga default.
- Stock status produk dapat dihitung ulang berdasarkan seluruh varian aktif.
- Produk dapat memiliki banyak gambar.
- Produk dapat memiliki banyak varian.
- Produk dapat berada pada banyak koleksi.

### 14.2 Product Variants

Tabel `product_variants` menyimpan kombinasi warna dan ukuran.

Data utama:

- `id`
- `product_id`
- `sku`
- `color_name`
- `color_hex`
- `size`
- `regular_price`
- `sale_price`
- `stock`
- `reserved_stock`
- `weight`
- `length`
- `width`
- `height`
- `image_url`
- `is_active`
- timestamps dan soft delete

#### Aturan

- Setiap kombinasi warna-ukuran memiliki SKU unik.
- Kombinasi `product_id`, `color_name`, dan `size` sebaiknya unik pada level aplikasi atau database.
- Varian mengikuti harga produk jika harga varian kosong.
- Gambar varian bersifat opsional.
- Ukuran disimpan dengan format konsisten, misalnya `EU 40`, `EU 41`, dan `EU 42`.
- Stock tidak boleh negatif.
- Reserved stock tidak boleh negatif.
- Reserved stock tidak boleh lebih besar dari stock.

### 14.3 Snapshot Cart dan Order

Cart dan order harus menyimpan data penting agar perubahan katalog tidak mengubah histori transaksi.

Snapshot minimal:

- Nama produk.
- SKU produk.
- SKU varian.
- Warna.
- Ukuran.
- Harga.
- Quantity.
- Subtotal.
- Berat.
- Dimensi.
- URL gambar produk.

---

## 15. API dan Internal Route Design

Karena menggunakan Inertia, sebagian besar route adalah web route Laravel. Endpoint API tetap diperlukan untuk webhook, async request, dan integrasi eksternal.

### 15.1 Public Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/` | Homepage |
| GET | `/products` | Product listing |
| GET | `/products/{slug}` | Product detail |
| GET | `/categories/{slug}` | Category page |
| GET | `/collections/{slug}` | Collection page |
| GET | `/search` | Search result |
| GET | `/size-guide` | Size guide |
| GET | `/pages/{slug}` | Static page |

### 15.2 Customer Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/cart` | Cart page |
| POST | `/cart/items` | Add varian ke cart |
| PATCH | `/cart/items/{id}` | Update quantity |
| DELETE | `/cart/items/{id}` | Remove cart item |
| GET | `/checkout` | Checkout page |
| POST | `/checkout` | Create order |
| GET | `/orders` | Order history |
| GET | `/orders/{order_number}` | Order detail |
| POST | `/wishlist/{product}` | Add wishlist |
| DELETE | `/wishlist/{product}` | Remove wishlist |
| POST | `/reviews` | Create review |

### 15.3 Admin Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/admin` | Dashboard |
| GET | `/admin/products` | Product list |
| GET | `/admin/products/create` | Create product page |
| POST | `/admin/products` | Store product |
| GET | `/admin/products/{id}/edit` | Edit product page |
| PUT | `/admin/products/{id}` | Update product |
| DELETE | `/admin/products/{id}` | Delete product |
| POST | `/admin/products/{id}/variants` | Create varian |
| PUT | `/admin/product-variants/{id}` | Update varian |
| DELETE | `/admin/product-variants/{id}` | Delete varian |
| GET | `/admin/orders` | Order list |
| GET | `/admin/orders/{id}` | Order detail |
| POST | `/admin/orders/{id}/create-shipment` | Create Biteship shipment |
| GET | `/admin/stock` | Stock list |
| GET | `/admin/stock/logs` | Stock log list |
| GET | `/admin/product-variants/{id}/stock-adjustment` | Stock adjustment page |
| PUT | `/admin/product-variants/{id}/stock-adjustment` | Update stock |

### 15.4 Webhook Routes

| Method | Route | Deskripsi |
|---|---|---|
| POST | `/webhooks/midtrans` | Midtrans notification |
| POST | `/webhooks/biteship` | Biteship webhook |

### 15.5 Utility API Routes

| Method | Route | Deskripsi |
|---|---|---|
| POST | `/api/shipping/rates` | Get Biteship rates |
| POST | `/api/payments/midtrans/snap-token` | Generate Snap token |
| GET | `/api/areas/search` | Search Biteship area |
| GET | `/api/products/{product}/availability` | Get stok warna dan ukuran terbaru |

---

## 16. Integrasi Detail

### 16.1 Midtrans

#### Trigger

- Saat order dibuat dan customer melanjutkan ke pembayaran.

#### Data Input

- Order number.
- Customer name.
- Customer email.
- Customer phone.
- Item details.
- Nama produk.
- Warna.
- Ukuran.
- Quantity.
- Gross amount.

#### Output

- Snap token.
- Redirect URL.
- Transaction status.
- Webhook payload.

#### Failure Handling

- Jika Snap token gagal dibuat, order tetap tersimpan dengan payment status `pending`.
- Customer dapat mencoba pembayaran kembali.
- Jika webhook datang lebih dari sekali, sistem tidak memproses perubahan stok dua kali.
- Jika signature tidak valid, webhook ditolak.
- Jika payment success diterima setelah order expired, sistem harus menjalankan rule rekonsiliasi dan menandai order untuk manual review bila stok tidak dapat dipenuhi.

### 16.2 Biteship

#### Trigger Rate Checking

- Saat customer berada di checkout dan memilih alamat.

#### Trigger Create Order

- Setelah pembayaran berhasil.
- Dapat dilakukan otomatis atau manual oleh admin.

#### Data Input Rate

- Origin area ID.
- Destination area ID.
- Total berat.
- Dimensi paket jika digunakan.
- Courier preferences jika dibatasi.

#### Data Output

- Courier company.
- Courier service.
- Estimated delivery.
- Price.

#### Failure Handling

- Jika rate gagal, tampilkan pesan error dan tombol retry.
- Jika create shipment gagal, order tetap berada pada status processing atau shipment failed.
- Admin dapat melakukan retry.
- Tracking update diproses secara idempotent.

### 16.3 Stock Management

#### Trigger Stock Adjustment

- Admin menambah atau mengurangi stok.
- Sistem melakukan reservasi ketika order dibuat.
- Sistem finalisasi stok setelah pembayaran berhasil.
- Sistem melepas reserved stock saat payment expired, failed, atau cancelled.

#### Data Penting

- Product variant ID.
- SKU varian.
- Warna.
- Ukuran.
- Stock before.
- Stock after.
- Reserved stock before.
- Reserved stock after.
- Quantity perubahan.
- Reference type dan reference ID.
- Admin user ID jika dilakukan manual.
- Alasan perubahan.

#### Failure Handling

- Sistem menolak stok negatif.
- Sistem menolak adjustment jika hasil stock lebih kecil dari reserved stock.
- Semua perubahan dicatat ke `stock_logs`.
- Jika finalisasi stok gagal, error dicatat dan order tidak boleh diproses dua kali.

---

## 17. Validasi Bisnis

### 17.1 Product

- `name` wajib.
- `slug` wajib unik.
- `brand_name` wajib.
- `regular_price` wajib lebih dari 0.
- `sale_price` tidak boleh lebih besar dari `regular_price`.
- Minimal satu gambar utama direkomendasikan sebelum publish.
- Minimal satu varian wajib sebelum publish.
- Produk published harus memiliki minimal satu varian aktif.

### 17.2 Product Variant

- `product_id` wajib.
- `sku` wajib dan unik.
- `color_name` wajib untuk sepatu dengan pilihan warna.
- `size` wajib.
- Kombinasi produk, warna, dan ukuran tidak boleh duplikat.
- Harga varian, jika diisi, harus lebih dari 0.
- Sale price varian tidak boleh melebihi regular price varian.
- Stock minimal 0.
- Reserved stock minimal 0.
- Reserved stock tidak boleh melebihi stock.

### 17.3 Cart

- Customer wajib memilih warna dan ukuran.
- Quantity minimal 1.
- Quantity tidak boleh melebihi available stock.
- Produk inactive tidak dapat ditambahkan.
- Varian inactive tidak dapat ditambahkan.
- Varian out of stock tidak dapat ditambahkan.

### 17.4 Checkout

- User wajib login.
- Alamat wajib lengkap.
- Kurir wajib dipilih.
- Grand total harus sesuai kalkulasi backend.
- Semua varian harus aktif.
- Semua varian harus memiliki stok cukup.
- Harga harus divalidasi ulang.
- Payment hanya dibuat untuk order valid.

### 17.5 Order

- Order number wajib unik.
- Checkout idempotency key wajib unik per user.
- Order tidak boleh dibayar atau difinalisasi stok dua kali.
- Order expired harus melepas reserved stock.
- Data warna dan ukuran pada order tidak boleh berubah setelah order dibuat.

### 17.6 Stock

- Stock adjustment harus memiliki alasan.
- Stock log wajib dibuat untuk perubahan penting.
- Reservation wajib dilepas jika payment gagal, cancelled, atau expired.
- Semua operasi stok kritis menggunakan database transaction.

---

## 18. Non-Functional Requirements

### 18.1 Performance

- Homepage load time target kurang dari 3 detik pada koneksi normal.
- Product listing mendukung pagination.
- Product listing menggunakan eager loading dan index yang tepat.
- Image menggunakan responsive sizes dan lazy loading.
- Gambar dikompresi dan dioptimasi.
- Filter produk tidak boleh memuat seluruh data sekaligus.
- Admin order dan stock list menggunakan pagination.
- Webhook dan shipment creation menggunakan queue jika sesuai.

### 18.2 Security

- Password menggunakan hashing Laravel.
- Admin route menggunakan auth dan role middleware.
- Authorization menggunakan Laravel Policies.
- Webhook Midtrans wajib memverifikasi signature.
- Webhook Biteship wajib diverifikasi sesuai mekanisme yang tersedia.
- API key disimpan pada environment variable atau secret manager.
- Upload file divalidasi berdasarkan MIME type, ekstensi, dan ukuran.
- Rich text dari Tiptap disanitasi.
- CSRF protection aktif.
- Endpoint sensitif menggunakan rate limiting.
- Log tidak boleh menyimpan data pembayaran sensitif yang tidak diperlukan.

### 18.3 Reliability

- Webhook bersifat idempotent.
- Payment log menyimpan payload penting.
- Biteship webhook log menyimpan payload.
- Stock log menyimpan perubahan stok.
- Queue worker dan scheduler harus dimonitor.
- Database backup dijalankan berkala.
- Stock reservation memiliki mekanisme cleanup jika webhook tidak diterima.

### 18.4 Maintainability

- Gunakan service class untuk Midtrans, Biteship, dan stock management.
- Gunakan action class untuk checkout dan order flow.
- Gunakan policy untuk authorization.
- Gunakan form request untuk validasi.
- Gunakan enum atau constants untuk status.
- Pisahkan query produk kompleks ke query object atau repository bila diperlukan.
- Gunakan TypeScript types untuk payload Inertia.

### 18.5 SEO

- Product detail memiliki meta title dan meta description.
- Category dan collection memiliki slug SEO-friendly.
- Product image memiliki alt text.
- Static page memiliki metadata.
- URL produk stabil.
- Sitemap dibuat otomatis.
- Canonical URL digunakan untuk mencegah duplikasi filter page.
- Product structured data dapat ditambahkan.
- Breadcrumb structured data dapat ditambahkan.

### 18.6 Accessibility

- Semua gambar memiliki alt text.
- Tombol ukuran memiliki label yang jelas.
- Status selected, unavailable, dan out of stock dapat dibaca screen reader.
- Color swatch tidak hanya mengandalkan warna; nama warna tetap ditampilkan.
- Navigasi dapat digunakan melalui keyboard.
- Kontras teks memenuhi standar WCAG dasar.

### 18.7 Responsiveness

- Website mendukung desktop, tablet, dan mobile.
- Product gallery mudah digunakan pada layar sentuh.
- Filter mobile menggunakan drawer atau bottom sheet.
- Size selector tetap mudah disentuh.
- Checkout dioptimasi untuk mobile.

---

## 19. Suggested Folder Structure

```text
app/
  Actions/
    Checkout/
      CreateOrderAction.php
      ReserveStockAction.php
      ReleaseStockAction.php
    Payment/
      CreateMidtransSnapTokenAction.php
      HandleMidtransWebhookAction.php
    Shipping/
      GetBiteshipRatesAction.php
      CreateBiteshipShipmentAction.php
      HandleBiteshipWebhookAction.php
    Stock/
      AdjustStockAction.php
      FinalizeReservedStockAction.php
      ReleaseStockReservationAction.php

  Enums/
    OrderStatus.php
    PaymentStatus.php
    ShippingStatus.php
    ProductStatus.php

  Http/
    Controllers/
      Storefront/
      Customer/
      Admin/
      Webhook/
      Api/
    Requests/
      ProductRequest.php
      ProductVariantRequest.php
      CheckoutRequest.php
      VoucherRequest.php
      StockAdjustmentRequest.php

  Jobs/
    CreateBiteshipShipmentJob.php
    ProcessMidtransWebhookJob.php
    ProcessBiteshipWebhookJob.php
    ReleaseExpiredStockReservationsJob.php

  Models/
    User.php
    Category.php
    Collection.php
    Product.php
    ProductVariant.php
    ProductImage.php
    Cart.php
    Order.php
    Payment.php
    Shipment.php
    StockLog.php

  Services/
    MidtransService.php
    BiteshipService.php
    StockService.php
    ProductAvailabilityService.php

resources/
  js/
    Pages/
      Storefront/
      Auth/
      Customer/
      Admin/
    Components/
      Product/
      Cart/
      Checkout/
      SizeGuide/
    Layouts/
    Types/
```

---

## 20. Frontend Page Requirements

### 20.1 Homepage

Komponen:

- Announcement bar.
- Header.
- Navigation menu.
- Search.
- Hero banner.
- Shop by category.
- Shop by sport.
- Featured collection.
- Best seller products.
- New arrivals.
- Sale section.
- Brand highlights.
- Newsletter subscription.
- Footer.

### 20.2 Product Listing

Komponen:

- Breadcrumb.
- Page title dan description.
- Filter category.
- Filter brand.
- Filter price.
- Filter color.
- Filter size.
- Filter stock status.
- Sort newest.
- Sort price low to high.
- Sort price high to low.
- Sort best seller.
- Product grid.
- Pagination atau load more.
- Active filter chips.
- Empty state.

### 20.3 Product Detail

Komponen:

- Breadcrumb.
- Product image gallery.
- Product title.
- Brand name.
- Rating dan jumlah review.
- Regular price.
- Sale price.
- Discount percentage.
- Color selector.
- Size selector.
- Size guide button.
- Stock status per size.
- Quantity selector.
- Add to cart.
- Buy now.
- Wishlist button.
- Shipping information.
- Rich description.
- Product specifications.
- Shoe care information.
- Reviews.
- Related products.
- Recently viewed products opsional.

### 20.4 Cart

Komponen:

- Cart item list.
- Product image.
- Product name.
- Brand.
- Color.
- Size.
- Quantity update.
- Price.
- Remove item.
- Stock warning.
- Voucher teaser.
- Price summary.
- Checkout button.

### 20.5 Checkout

Komponen:

- Address selector.
- Add atau edit address.
- Item summary berisi warna dan ukuran.
- Shipping rate selector.
- Voucher input.
- Subtotal.
- Discount.
- Shipping cost.
- Insurance cost.
- Service fee.
- Grand total.
- Policy agreement.
- Payment button.

### 20.6 Order Detail

Komponen:

- Order number.
- Order status timeline.
- Payment status.
- Shipping status.
- Product items.
- Warna dan ukuran setiap item.
- Address.
- Payment information.
- Tracking information.
- Download invoice.
- Contact support.
- Review product button setelah order selesai.

### 20.7 Size Guide

Komponen:

- Cara mengukur kaki.
- Ilustrasi pengukuran.
- Tabel konversi ukuran.
- Informasi fit.
- FAQ ukuran.
- Catatan perbedaan ukuran antar merek.

---

## 21. Admin Page Requirements

### 21.1 Product Management

- Product table.
- Search product.
- Filter status.
- Filter category.
- Filter brand.
- Create dan edit product.
- Upload product images.
- Set primary image.
- Reorder images.
- Manage collections.
- Rich text description editor.
- Set SEO metadata.
- Set featured, new arrival, dan best seller flags.

### 21.2 Variant Management

- Menambahkan warna.
- Menambahkan beberapa ukuran untuk satu warna.
- Generate kombinasi warna dan ukuran.
- Generate atau input SKU.
- Mengatur harga per kombinasi.
- Mengatur stok per kombinasi.
- Mengatur gambar per warna atau varian.
- Mengaktifkan atau menonaktifkan varian.
- Bulk update harga.
- Bulk update stok.
- Validasi duplikasi kombinasi warna dan ukuran.

### 21.3 Order Management

- Order list.
- Filter by status.
- Filter by date.
- Filter by payment status.
- Filter by shipping status.
- Search order number, customer, atau SKU.
- Order detail.
- Melihat warna dan ukuran item.
- Update processing status.
- Create shipment.
- Download atau print label.
- View payment raw response.
- View shipment tracking.
- Cancel order sesuai aturan.

### 21.4 Stock Management

- Stock table per SKU.
- Product image.
- Product name.
- Brand.
- Warna.
- Ukuran.
- Current stock.
- Reserved stock.
- Available stock.
- Low-stock indicator.
- Stock adjustment.
- Adjustment reason.
- Stock history.
- Export stock opsional.

### 21.5 Integration Logs

- Midtrans payment logs.
- Biteship webhook logs.
- Stock logs.
- Event type.
- Related order.
- Processing status.
- Payload detail.
- Error detail.
- Retry button untuk proses yang aman diulang.

---

## 22. Acceptance Criteria

### 22.1 Product Catalog

- Admin dapat membuat produk sepatu.
- Admin dapat memilih kategori dan mengisi merek.
- Admin dapat mengunggah banyak gambar.
- Admin dapat membuat variasi warna dan ukuran.
- Setiap kombinasi warna dan ukuran memiliki SKU unik.
- Product detail tampil pada frontend.
- Product dapat masuk ke lebih dari satu koleksi.
- Product description dapat menyimpan HTML dari Tiptap.
- Ukuran habis tampil disabled.
- Color swatch menampilkan nama warna.

### 22.2 Cart dan Checkout

- Customer wajib memilih warna dan ukuran sebelum add to cart.
- Customer dapat update quantity.
- Customer tidak dapat membeli melebihi available stock.
- Customer tidak dapat checkout varian inactive.
- Customer dapat memilih alamat.
- Customer dapat memilih ongkir dari Biteship.
- Sistem menghitung total pada backend.
- Order berhasil dibuat.
- Stok berhasil direservasi.

### 22.3 Payment

- Sistem berhasil membuat Snap token.
- Customer dapat membayar melalui Midtrans.
- Webhook payment success mengubah order menjadi paid.
- Stock final berkurang satu kali.
- Payment expired melepas stock reservation.
- Webhook ganda tidak menyebabkan stok berkurang dua kali.

### 22.4 Shipping

- Sistem dapat menampilkan pilihan ongkir.
- Admin dapat membuat shipment Biteship.
- Label dan nomor resi dapat disimpan.
- Tracking update dapat disimpan.
- Customer dapat melihat status pengiriman.

### 22.5 Stock

- Admin dapat melihat stok per warna dan ukuran.
- Admin dapat melakukan stock adjustment.
- Sistem mencatat perubahan ke `stock_logs`.
- Order paid mengurangi stock dan reserved stock.
- Payment expired, failed, atau cancelled melepas reserved stock.
- Sistem menolak stok negatif.

### 22.6 Review dan Wishlist

- Customer login dapat menambahkan produk ke wishlist.
- Customer yang telah membeli dapat membuat review.
- Review menampilkan verified purchase.
- Admin dapat menyembunyikan review.

---

## 23. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| SKU warna dan ukuran tidak konsisten | Operasional stok sulit dilacak | Gunakan format SKU standar dan validasi unik |
| Customer salah memilih ukuran | Meningkatkan permintaan penukaran | Sediakan size guide, cara mengukur, dan policy yang jelas |
| Stok ukuran populer cepat habis | Customer gagal checkout | Tampilkan stok terbaru dan lakukan reservasi dengan transaction lock |
| Webhook Midtrans ganda | Order dan stok diproses dua kali | Gunakan idempotency dan status transition guard |
| Webhook pembayaran terlambat | Stok reservation tidak sinkron | Gunakan scheduled reconciliation dan expiry cleanup |
| Biteship rate gagal | Customer tidak dapat checkout | Tampilkan retry dan error message yang jelas |
| Stock adjustment salah | Stok tidak akurat | Wajib alasan, stock log, dan role permission |
| Duplikasi kombinasi warna dan ukuran | SKU membingungkan | Tambahkan unique validation pada produk, warna, dan ukuran |
| Gambar warna tidak sesuai | Customer menerima ekspektasi visual yang salah | Kaitkan gambar dengan warna dan lakukan review sebelum publish |
| Rich text mengandung script | Risiko XSS | Sanitasi HTML |
| Queue worker mati | Webhook atau shipment tertunda | Monitoring queue, failed jobs, dan alert |
| Ukuran antar merek berbeda | Customer bingung | Tampilkan catatan ukuran spesifik pada produk atau merek |

---

## 24. MVP Scope

MVP pertama fokus pada:

1. Storefront responsive.
2. Product catalog sepatu.
3. Category dan collection.
4. Product detail.
5. Variasi warna dan ukuran.
6. Product image gallery.
7. Size guide.
8. Product search dan filter dasar.
9. Cart.
10. Checkout.
11. Address management.
12. Midtrans payment.
13. Biteship rate checking.
14. Basic shipment creation.
15. Admin product management.
16. Admin variant management.
17. Admin order management.
18. Stock adjustment.
19. Stock logs.
20. Stock reservation.
21. Payment webhook.
22. Biteship tracking webhook.
23. Voucher dasar.
24. Wishlist.
25. Product review dasar.

---

## 25. Future Enhancement

Setelah MVP stabil, fitur yang dapat ditambahkan:

1. Product recommendation berdasarkan aktivitas customer.
2. Recently viewed products.
3. Back-in-stock notification per ukuran.
4. Wishlist price-drop notification.
5. Advanced SEO schema markup.
6. WhatsApp integration.
7. Abandoned cart reminder.
8. Loyalty points.
9. Bundle product.
10. Product comparison.
11. Sneaker release calendar.
12. Limited-release raffle.
13. Virtual try-on.
14. Advanced dashboard analytics.
15. Export laporan penjualan.
16. Customer segmentation.
17. Email marketing integration.
18. Multi-warehouse stock.
19. Return, exchange, dan refund management.
20. Integrasi marketplace.
21. Integrasi point of sale toko fisik.
22. Recommendation berdasarkan bentuk kaki atau aktivitas.

---

## 26. Environment Variables

Contoh `.env`:

```env
APP_NAME="Toko Sepatu"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shoe_store_ecommerce
DB_USERNAME=root
DB_PASSWORD=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true

BITESHIP_API_KEY=
BITESHIP_BASE_URL=https://api.biteship.com
BITESHIP_ORIGIN_AREA_ID=

QUEUE_CONNECTION=database
FILESYSTEM_DISK=public

LOW_STOCK_THRESHOLD=5
STOCK_RESERVATION_MINUTES=60
```

---

## 27. Testing Requirements

### 27.1 Unit Test

- Product effective price calculation.
- Product variant effective price calculation.
- Voucher calculation.
- Variant display label generation dari warna dan ukuran.
- Available stock calculation.
- Stock reservation.
- Stock release.
- Stock finalization.
- Order total calculation.
- Status transition.

### 27.2 Feature Test

- Create product.
- Create color-size variants.
- Reject duplicate SKU.
- Reject duplicate color-size combination.
- Add varian ke cart.
- Reject add to cart tanpa ukuran.
- Update cart quantity.
- Checkout.
- Create Midtrans payment.
- Handle Midtrans webhook.
- Get Biteship rates.
- Create shipment.
- Stock adjustment.
- Stock reservation dan release.
- Review authorization.
- Wishlist flow.

### 27.3 Integration Test

- Midtrans sandbox.
- Biteship staging atau test environment.
- Webhook retry.
- Payment reconciliation.
- Shipping tracking update.

### 27.4 Manual Test

- Product create dan edit.
- Generate variasi warna dan ukuran.
- Image upload.
- Pergantian gambar saat colorway dipilih.
- Size selector pada mobile.
- Rich text editor.
- Filter warna dan ukuran.
- Checkout mobile.
- Payment flow.
- Shipping tracking.
- Admin stock logs.
- Accessibility pada selector warna dan ukuran.

---

## 28. Definition of Done

Fitur dianggap selesai jika:

1. UI selesai dan responsive.
2. Backend validation selesai.
3. Database migration selesai.
4. Authorization berjalan.
5. Error handling tersedia.
6. Loading state dan empty state tersedia.
7. Test minimal untuk flow utama tersedia.
8. Dokumentasi environment variable tersedia.
9. Tidak ada data dummy hardcoded di production.
10. Webhook idempotent.
11. Log integrasi tersimpan.
12. Stock transaction aman dari race condition.
13. Admin dapat mengoperasikan fitur tanpa akses database langsung.
14. Customer dapat memilih warna dan ukuran tanpa kebingungan.
15. Customer tidak dapat membeli SKU yang stoknya tidak tersedia.

---

## 29. Referensi Teknis

- Laravel Starter Kit React Inertia: <https://laravel.com/docs/starter-kits>
- Inertia.js: <https://inertiajs.com/>
- Midtrans Snap: <https://docs.midtrans.com/docs/snap>
- Midtrans Snap Integration Guide: <https://docs.midtrans.com/docs/snap-snap-integration-guide>
- Biteship API Introduction: <https://biteship.com/en/docs/intro>
- Biteship Rates API: <https://biteship.com/id/docs/api/rates/overview>
- Biteship Create Order API: <https://biteship.com/en/docs/api/orders/create>

---

## 30. Lampiran: Prinsip Skema Produk Final

Modul produk final:

```text
categories
collections
products
product_collections
product_images
product_variants
stock_logs
```

Prinsip utama:

- Satu record `products` merepresentasikan satu model sepatu.
- Informasi merek disimpan pada `brand_name`.
- Informasi detail produk disimpan pada `description` menggunakan Tiptap.js.
- Kombinasi warna dan ukuran disimpan pada `product_variants`.
- Setiap kombinasi warna dan ukuran memiliki SKU dan stok sendiri.
- Label varian pada UI dibentuk dari `color_name` dan `size`.
- Harga utama disimpan pada produk dan dapat dioverride pada varian.
- Stok tersedia dihitung dari `stock - reserved_stock`.
- Collection tetap many-to-many agar produk dapat masuk ke banyak campaign.
- Gambar produk dapat terdiri dari galeri umum dan gambar khusus varian.

Contoh struktur:

```text
Product
└── Urban Runner Pro
    ├── Black / EU 40
    ├── Black / EU 41
    ├── Black / EU 42
    ├── White / EU 40
    ├── White / EU 41
    └── White / EU 42
```

---

## 31. Kesimpulan

Website e-commerce toko sepatu akan dibangun sebagai modern monolith menggunakan Laravel, Inertia.js, React TypeScript, dan MySQL. Fokus utama sistem adalah katalog sepatu yang visual dan mudah digunakan, pemilihan warna dan ukuran yang jelas, checkout yang aman, pembayaran melalui Midtrans, pengiriman melalui Biteship, serta pengelolaan stok per SKU secara akurat.

Struktur produk telah disederhanakan agar sesuai dengan kebutuhan penjualan sepatu. Produk menyimpan informasi umum satu model, sedangkan kombinasi warna dan ukuran dikelola sebagai varian terpisah. Pendekatan ini memungkinkan customer melihat ketersediaan ukuran secara tepat dan membantu admin mengelola stok dengan lebih aman.

Dengan PRD ini, tim developer dapat menurunkan kebutuhan menjadi backlog, database migration, desain UI, service integration, test case, dan task development per sprint.
