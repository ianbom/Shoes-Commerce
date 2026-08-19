# Yupoo KicksDB Product Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin batch importer that scrapes Yupoo category albums, matches SKUs through KicksDB, previews results, and saves selected products into the existing catalog.

**Architecture:** Persist imports as `ProductImportBatch` and `ProductImportItem`. Queue scraping and rate-limited KicksDB lookups; expose Inertia admin pages and scoped actions for candidate selection and transactional saving. Reuse existing product/category/image/variant models and admin UI patterns.

**Tech Stack:** Laravel 13, PHP 8.3, Laravel HTTP client, queue jobs, MySQL, Pest 4, Inertia v3, React 19, TypeScript, Tailwind v4, Wayfinder.

**Spec:** `docs/superpowers/specs/2026-08-19-yupoo-kicksdb-product-import-design.md`

## Global Constraints

- KicksDB endpoint: `GET /v3/stockx/products?query={sku}` with `Authorization: Bearer {KICKSDB_API_KEY}`.
- Product status: `draft`; every imported variant stock: `10`; `reserved_stock`: `0`; active: `true`.
- Variant label order: `US / UK / CM`, example `US M 4 / UK 3.5 / CM 23`.
- Product price: Yupoo CNY price × `2644.40`, rounded to two decimals.
- Product name: KicksDB `title`; duplicate SKU: skip and report.
- Category: auto-find/create from KicksDB `category`.
- Images: all unique `image` + `gallery` URLs; first primary.
- Yupoo metadata is not persisted to final products.
- API keys never reach frontend, logs, database, or session.
- External requests require explicit timeouts, retry/backoff, status handling, cache, and SSRF-safe URL validation.
- No comments added to code unless explicitly required.

---

### Task 1: Configuration and Import Persistence

**Files:**
- Create: migration for `product_import_batches`
- Create: migration for `product_import_items`
- Create: `app/Models/ProductImportBatch.php`
- Create: `app/Models/ProductImportItem.php`
- Modify: `config/services.php`
- Modify: `.env.example`
- Modify: `database/seeders/SiteSettingSeeder.php`
- Test: `tests/Unit/ProductImportPriceTest.php`

**Interfaces:**
- Produces `ProductImportBatch` with `items()` relation and `ProductImportItem` with `batch()` relation.
- Produces config keys `services.kicksdb.base_url` and `services.kicksdb.key`.
- Produces site setting `cny_to_idr_rate` with value `2644.40`.

- [ ] **Step 1: Write the failing price conversion test**

```php
it('converts CNY to IDR using the seeded rate', function () {
    expect(round(420 * 2644.40, 2))->toBe(1110648.0);
});
```

- [ ] **Step 2: Run the focused test**

Run: `php artisan test tests/Unit/ProductImportPriceTest.php`
Expected: FAIL because the test file does not exist.

- [ ] **Step 3: Add migrations and models**

Use decimal columns for `price_cny` and `price_idr`, JSON columns for normalized KicksDB payload/candidates, enum-like string status columns, foreign keys to users/products, indexes on batch/status/SKU, and a uniqueness constraint preventing duplicate source items within one batch. Add casts for JSON, decimals, and timestamps. Use model fillable attributes consistent with existing models.

- [ ] **Step 4: Add KicksDB config and rate setting**

Add `KICKSDB_API_KEY=` and `KICKSDB_BASE_URL=https://api.kicks.dev` to `.env.example`; map both through `config/services.php`. Upsert `cny_to_idr_rate` as type `decimal` in `SiteSettingSeeder`.

- [ ] **Step 5: Run the focused test and migrations**

Run: `php artisan test tests/Unit/ProductImportPriceTest.php && php artisan migrate:fresh --seed`
Expected: PASS; migrations and seeders complete.

---

### Task 2: Yupoo Parser and SSRF-Safe Scraper

**Files:**
- Create: `app/Services/Admin/ProductImport/YupooUrlValidator.php`
- Create: `app/Services/Admin/ProductImport/YupooTitleParser.php`
- Create: `app/Services/Admin/ProductImport/YupooScraper.php`
- Test: `tests/Unit/ProductImport/YupooTitleParserTest.php`
- Test: `tests/Unit/ProductImport/YupooUrlValidatorTest.php`
- Test: `tests/Feature/Admin/ProductImportYupooScraperTest.php`

**Interfaces:**
- `YupooTitleParser::parse(string $title): ?array` returns `price_cny`, `sku`, and `raw_title`.
- `YupooUrlValidator::validate(string $url): UriInterface` rejects non-HTTPS and hosts outside `*.x.yupoo.com`.
- `YupooScraper::scrape(string $url): array` returns normalized album items with `source_album_url`, `source_title`, `source_sku`, `price_cny`, and optional `thumbnail_url`.

- [ ] **Step 1: Write parser tests**

Cover `【 420¥】 【 GX】 【 HQ7978-001】 AJ5圣诞节`, variable whitespace, ASCII brackets, missing price, missing SKU, and duplicate SKU handling.

- [ ] **Step 2: Run parser tests**

Run: `php artisan test tests/Unit/ProductImport/YupooTitleParserTest.php`
Expected: FAIL before parser implementation.

- [ ] **Step 3: Implement parser and URL validator**

Normalize Unicode whitespace, extract numeric Yuan price, identify sneaker SKU token with letters/digits/hyphens, preserve raw title only in import item, and reject malformed input. Permit only HTTPS Yupoo category URLs and prevent host/path changes during pagination.

- [ ] **Step 4: Write HTTP-fake scraper test**

Fake two category pages containing `.album__title`, album anchors, thumbnails, and a next-page link. Assert both pages are scraped, duplicate albums are removed, and unrelated-host links are ignored.

- [ ] **Step 5: Implement scraper**

Use Laravel `Http` with connect/request timeouts, retry/backoff, HTML parsing via existing installed PHP tooling or DOM/XPath standard library, and bounded pagination. Extract `.album__title`, nearest album URL, and image URL. Throw a safe domain exception for empty/invalid pages.

- [ ] **Step 6: Run tests**

Run: `php artisan test tests/Unit/ProductImport tests/Feature/Admin/ProductImportYupooScraperTest.php`
Expected: PASS.

---

### Task 3: KicksDB Client and Normalization

**Files:**
- Create: `app/Services/Integrations/KicksDbService.php`
- Create: `app/Services/Admin/ProductImport/KicksDbProductNormalizer.php`
- Test: `tests/Unit/ProductImport/KicksDbProductNormalizerTest.php`
- Test: `tests/Feature/Integrations/KicksDbServiceTest.php`

**Interfaces:**
- `KicksDbService::searchBySku(string $sku): array`.
- `KicksDbService::product(string $idOrSlug): array`.
- `KicksDbProductNormalizer::selectMatch(string $sku, array $results): array`.
- `KicksDbProductNormalizer::normalizeProduct(array $payload): array`.
- `KicksDbProductNormalizer::variantLabels(array $variants): array`.

- [ ] **Step 1: Write normalizer tests**

Assert exact SKU selection, unmatched candidate ordering, image/gallery deduplication, category/title mapping, and variant output `US M 4 / UK 3.5 / CM 23` with stock `10`.

- [ ] **Step 2: Write HTTP-fake integration tests**

Assert bearer authorization, query URL, detail request with `display[variants]=true`, `401` failure, `404` handling, and `429` retry behavior.

- [ ] **Step 3: Implement client**

Use configured base URL/key, explicit timeouts, retry `[1, 5, 10]`, `throw()` for unrecoverable statuses, cache normalized SKU lookups, and never include authorization headers in exceptions or logs.

- [ ] **Step 4: Implement normalizer**

Keep only title, SKU, brand, model, description, category, image, gallery, and variants. Select one US, UK, and CM size per KicksDB variant where present; deduplicate labels and reject products without usable variants at save time.

- [ ] **Step 5: Run tests**

Run: `php artisan test tests/Unit/ProductImport/KicksDbProductNormalizerTest.php tests/Feature/Integrations/KicksDbServiceTest.php`
Expected: PASS.

---

### Task 4: Queue Batch Orchestration

**Files:**
- Create: `app/Jobs/ProductImport/ProcessProductImportBatch.php`
- Create: `app/Jobs/ProductImport/LookupProductImportItem.php`
- Create: `app/Services/Admin/ProductImport/ProductImportService.php`
- Create: `app/Http/Requests/Admin/ProductImportRequest.php`
- Test: `tests/Feature/Admin/ProductImportBatchTest.php`

**Interfaces:**
- `ProductImportService::createBatch(string $url, User $admin): ProductImportBatch`.
- `ProductImportService::refresh(ProductImportBatch $batch): array`.
- `ProductImportService::selectCandidate(ProductImportItem $item, string $kicksdbId): void`.
- `ProductImportService::saveItem(ProductImportItem $item): Product`.
- `ProductImportService::saveAll(ProductImportBatch $batch): void`.

- [ ] **Step 1: Write feature tests**

Cover admin authorization, URL validation, batch creation, scraper item persistence, matched/unmatched statuses, duplicate detection, and retry-safe lookup processing.

- [ ] **Step 2: Implement batch creation and coordinator job**

Create batch as `pending`, dispatch coordinator, scrape items idempotently, snapshot the conversion rate into each item, then dispatch lookup jobs with bounded concurrency/rate limiting.

- [ ] **Step 3: Implement lookup job**

Search exact SKU, fetch detail for exact result, store normalized payload or candidate payload, mark item `matched`, `unmatched`, or `failed`, and update batch counters without failing sibling items.

- [ ] **Step 4: Implement refresh and candidate selection**

Return paginated batch items with only frontend-safe fields. Candidate selection must scope item to batch, fetch detail, validate selected ID exists among candidates, and mark item `ready`.

- [ ] **Step 5: Run feature tests**

Run: `php artisan test tests/Feature/Admin/ProductImportBatchTest.php`
Expected: PASS.

---

### Task 5: Transactional Catalog Persistence

**Files:**
- Create: `app/Services/Admin/ProductImport/ProductImportPersistenceService.php`
- Test: `tests/Feature/Admin/ProductImportPersistenceTest.php`

**Interfaces:**
- `ProductImportPersistenceService::save(ProductImportItem $item): Product`.
- `ProductImportPersistenceService::saveAll(ProductImportBatch $batch): void`.

- [ ] **Step 1: Write persistence tests**

Assert draft Product, converted price, SKU, auto-created Category and pivot, every unique image, primary image, all size variants with stock `10`, duplicate skip, unresolved rejection, and concurrent duplicate safety.

- [ ] **Step 2: Implement transactional save**

Lock the import item, recheck `Product::where('sku', ...)`, create/find category by slug, create product/images/variants inside `DB::transaction`, mark item saved, and update counters. Use the selected candidate payload when present while preserving Yupoo-converted price.

- [ ] **Step 3: Implement save-all**

Iterate ready items in chunks, call the same transactional save method, continue after item-level failure, and refresh batch counters.

- [ ] **Step 4: Run tests**

Run: `php artisan test tests/Feature/Admin/ProductImportPersistenceTest.php`
Expected: PASS.

---

### Task 6: Admin Routes, Controllers, and Wayfinder

**Files:**
- Create: `app/Http/Controllers/Admin/ProductImportController.php`
- Create: `app/Http/Requests/Admin/ProductImportCandidateRequest.php`
- Create: `app/Http/Requests/Admin/ProductImportSaveRequest.php`
- Modify: `routes/web.php`
- Modify: generated Wayfinder route/action files
- Test: `tests/Feature/Admin/ProductImportRoutesTest.php`

**Interfaces:**
- `index`, `store`, `show`, `selectCandidate`, `saveItem`, `saveAll` controller methods.
- Scoped `{productImportBatch}` and `{productImportItem}` bindings for item actions.

- [ ] **Step 1: Write route tests**

Assert all routes require authenticated admin, item actions cannot target another batch, and invalid candidate IDs return validation errors.

- [ ] **Step 2: Add routes and controller methods**

Keep methods thin: validate request, call service, return Inertia page/redirect with safe status data. Use implicit binding plus explicit batch-item ownership checks.

- [ ] **Step 3: Generate Wayfinder**

Run: `php artisan wayfinder:generate --with-form --no-interaction`
Expected: generated imports resolve without TypeScript errors.

- [ ] **Step 4: Run route tests**

Run: `php artisan test tests/Feature/Admin/ProductImportRoutesTest.php`
Expected: PASS.

---

### Task 7: Inertia Admin Import UI

**Files:**
- Create: `resources/js/pages/admin/product-imports/index.tsx`
- Create: `resources/js/pages/admin/product-imports/show.tsx`
- Create: `resources/js/pages/admin/product-imports/components/import-card.tsx`
- Create: `resources/js/pages/admin/product-imports/components/import-detail-modal.tsx`
- Modify: existing admin navigation component
- Test: `tests/Browser/ProductImportPageTest.php` if browser suite is configured

**Interfaces:**
- Props match controller payload: batch summary, paginated items, candidate arrays, and errors.
- Actions use generated Wayfinder route helpers.

- [ ] **Step 1: Add page components**

Follow existing admin `PageHeader`, `Card`, `Badge`, `Button`, `Dialog`, pagination, and table/card conventions. Add URL form, loading state, progress summary, tabs, cards, modal details, candidate picker, per-card save, save-all, and unmatched list.

- [ ] **Step 2: Add polling**

Use Inertia v3 polling while batch status is `pending`, `scraping`, or `matching`; stop on terminal status and preserve scroll/state.

- [ ] **Step 3: Add navigation entry**

Place `Product import` under Catalog using the existing sidebar/nav pattern.

- [ ] **Step 4: Run frontend checks**

Run: `npm run lint:check && npm run format:check && npm run types:check`
Expected: PASS.

---

### Task 8: Full Verification and Documentation Wiring

**Files:**
- Modify: `config/queue.php` only if rate-limit configuration requires it
- Modify: `README` or existing setup documentation only if project convention requires environment variables
- Test: all existing and new tests

- [ ] **Step 1: Run backend suite**

Run: `composer test`
Expected: PASS.

- [ ] **Step 2: Run frontend suite**

Run: `npm run lint:check && npm run format:check && npm run types:check && npm run build`
Expected: PASS.

- [ ] **Step 3: Verify generated routes and migrations**

Run: `php artisan route:list --path=admin/product-imports` and `php artisan migrate:fresh --seed`
Expected: six protected import routes and successful schema/data setup.

- [ ] **Step 4: Verify secrets and diff**

Run: `git status --short && git diff --check`
Expected: no `.env` changes staged or committed, no whitespace errors, only feature files changed.

---
