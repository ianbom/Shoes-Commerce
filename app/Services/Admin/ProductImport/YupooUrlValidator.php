<?php

namespace App\Services\Admin\ProductImport;

use Illuminate\Validation\ValidationException;

class YupooUrlValidator
{
    public function validate(string $url): string
    {
        $parts = parse_url($url);
        $host = strtolower($parts['host'] ?? '');

        if (($parts['scheme'] ?? '') !== 'https' || ! preg_match('/^[a-z0-9-]+\.x\.yupoo\.com$/', $host) || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])) {
            throw ValidationException::withMessages(['source_url' => 'URL harus berupa kategori HTTPS pada subdomain *.x.yupoo.com.']);
        }

        return $url;
    }

    public function pagination(string $initialUrl, string $candidate): ?string
    {
        $resolved = $this->resolve($initialUrl, $candidate);
        $initial = parse_url($initialUrl);
        $next = parse_url($resolved);
        $basePath = rtrim(dirname($initial['path'] ?? '/'), '/');

        return ($next['scheme'] ?? '') === 'https'
            && strtolower($next['host'] ?? '') === strtolower($initial['host'] ?? '')
            && str_starts_with($next['path'] ?? '/', $basePath.'/') ? $resolved : null;
    }

    public function resolve(string $base, string $url): string
    {
        if (str_starts_with($url, 'https://')) {
            return $url;
        }

        $parts = parse_url($base);
        $path = str_starts_with($url, '/') ? $url : rtrim(dirname($parts['path'] ?? '/'), '/').'/'.$url;

        return 'https://'.$parts['host'].$path;
    }
}
