<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/png" href="{{ asset('favicon-32x32.png') }}">
    <title>Defense Scheduling System</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.ts', 'resources/js/Pages/App/index.tsx'])
</head>

<body class="font-sans antialiased">
    <div id="root" data-login-success="{{ session('login_success') ? 'true' : 'false' }}"></div>
</body>

</html>
