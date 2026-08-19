<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            ['loc' => url('/'), 'lastmod' => now()],
            ['loc' => url('/about'), 'lastmod' => null],
            ['loc' => url('/list'), 'lastmod' => null],
        ])->merge(
            Product::query()
                ->where('status', 'published')
                ->orderBy('id')
                ->cursor()
                ->map(fn (Product $product): array => [
                    'loc' => route('detail', ['product' => $product->slug]),
                    'lastmod' => $product->updated_at,
                ]),
        );

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }
}
