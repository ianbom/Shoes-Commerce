<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductImportCandidateRequest;
use App\Http\Requests\Admin\ProductImportRequest;
use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Services\Admin\ProductImport\ProductImportPersistenceService;
use App\Services\Admin\ProductImport\ProductImportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class ProductImportController extends Controller
{
    public function index(): Response
    {
        return inertia('admin/product-imports/index');
    }

    public function store(ProductImportRequest $request, ProductImportService $service): RedirectResponse
    {
        return redirect()->route('admin.product-imports.show', $service->createBatch($request->validated('source_url'), $request->user()));
    }

    public function show(ProductImportBatch $productImportBatch, ProductImportService $service): Response
    {
        return inertia('admin/product-imports/show', $service->data($productImportBatch));
    }

    public function selectCandidate(ProductImportCandidateRequest $request, ProductImportBatch $batch, ProductImportItem $item, ProductImportService $service): RedirectResponse
    {
        abort_unless($item->product_import_batch_id === $batch->id, 404);
        $service->selectCandidate($item, $request->validated('kicksdb_id'));

        return back();
    }

    public function saveItem(ProductImportBatch $batch, ProductImportItem $item, ProductImportPersistenceService $persistence): RedirectResponse
    {
        abort_unless($item->product_import_batch_id === $batch->id, 404);
        $persistence->save($item);

        return back()->with('success', 'Produk disimpan sebagai draft.');
    }

    public function saveAll(ProductImportBatch $batch, ProductImportPersistenceService $persistence): RedirectResponse
    {
        $persistence->saveAll($batch);

        return back()->with('success', 'Produk valid telah diproses.');
    }
}
