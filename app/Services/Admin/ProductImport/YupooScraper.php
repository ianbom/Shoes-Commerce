<?php

namespace App\Services\Admin\ProductImport;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class YupooScraper
{
    public function __construct(private readonly YupooUrlValidator $urls, private readonly YupooTitleParser $titles) {}

    public function scrape(string $url): array
    {
        $initial = $this->urls->validate($url);
        $pending = [$initial];
        $visited = [];
        $items = [];

        while ($pending !== [] && count($visited) < 50) {
            $page = array_shift($pending);
            if (isset($visited[$page])) {
                continue;
            }
            $visited[$page] = true;
            $html = $this->fetch($page);
            $dom = new \DOMDocument;
            libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="UTF-8">'.$html, LIBXML_NOERROR | LIBXML_NOWARNING);
            libxml_clear_errors();
            $xpath = new \DOMXPath($dom);

            foreach ($xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' album__title ')]") as $titleNode) {
                $parsed = $this->titles->parse($titleNode->textContent);
                $container = $xpath->query("ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' categories__children ')][1]", $titleNode)->item(0);
                $anchor = $container ? $xpath->query(".//a[contains(concat(' ', normalize-space(@class), ' '), ' album__main ')][1]", $container)->item(0) : null;
                if (! $parsed || ! $anchor instanceof \DOMElement || ! $anchor->hasAttribute('href')) {
                    continue;
                }
                $album = $this->urls->resolve($page, $anchor->getAttribute('href'));
                $image = $xpath->query('.//img[1]', $anchor)->item(0);
                $thumbnail = $image instanceof \DOMElement ? ($image->getAttribute('data-src') ?: $image->getAttribute('src')) : null;
                $items[$album] = [...$parsed, 'source_album_url' => $album, 'thumbnail_url' => $thumbnail ?: null];
            }

            foreach ($xpath->query('//a[@href]') as $link) {
                $next = $this->urls->pagination($initial, $link->getAttribute('href'));
                if ($next && ! isset($visited[$next]) && (str_contains($link->textContent, 'Next') || str_contains($link->getAttribute('href'), 'page='))) {
                    $pending[] = $next;
                }
            }
        }

        if ($items === []) {
            throw new RuntimeException('Kategori Yupoo kosong atau struktur halaman tidak dikenali.');
        }

        return array_values($items);
    }

    private function fetch(string $url): string
    {
        try {
            return Http::withUserAgent('ShoesCommerceProductImporter/1.0')
                ->connectTimeout(5)->timeout(15)->retry([1000, 5000, 10000], throw: false)
                ->get($url)->throw()->body();
        } catch (ConnectionException|\Throwable $exception) {
            throw new RuntimeException('Kategori Yupoo tidak dapat diambil.', previous: $exception);
        }
    }
}
