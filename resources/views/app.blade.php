<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @if (request()->is('admin/*', 'dashboard', 'my-profile*', 'my-cart*', 'checkout*', 'my-order*', 'wishlist*', 'notifications*', 'address*', 'settings/*', 'login', 'register', 'forgot-password', 'reset-password*', 'confirm-password', 'verify-email'))
            <meta name="robots" content="noindex,nofollow">
        @endif

        {{-- Inline style to keep app in light mode before hydration --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }
        </style>

        <link rel="icon" href="/logo-shay/axegear-logo.webp" type="image/png">
        <link rel="apple-touch-icon" href="/logo-shay/axegear-logo.webp">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=bebas-neue:400|montserrat:400,500,600,700" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'GodKillerGoods') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
