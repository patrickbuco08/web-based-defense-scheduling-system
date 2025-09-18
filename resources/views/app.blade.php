<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel + React</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.ts'])

    @stack('head')
</head>

<body class="font-sans antialiased">
    @include('layouts.navigation')
    <main class="w-full container mx-auto px-4">
        @yield('content')
    </main>

    @stack('scripts')
</body>

</html>
