<?php

namespace App\Services\Admin\ProductImport;

class YupooTitleParser
{
    public function parse(string $title): ?array
    {
        $title = preg_replace('/\s+/u', ' ', trim($title));
        preg_match('/(?:[【\[]\s*)?(\d+(?:\.\d+)?)\s*(?:¥|￥|元|Y)(?:\s*[】\]])?/iu', $title, $price);
        preg_match_all('/(?<![A-Z0-9])(?=[A-Z0-9-]*[A-Z])(?=[A-Z0-9-]*\d)[A-Z0-9]+(?:-[A-Z0-9]+)+(?![A-Z0-9])/iu', $title, $skus);

        if (! isset($price[1], $skus[0][0])) {
            return null;
        }

        return ['price_cny' => round((float) $price[1], 2), 'sku' => strtoupper($skus[0][0]), 'raw_title' => $title];
    }
}
