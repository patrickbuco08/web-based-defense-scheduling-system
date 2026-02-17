<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>

<body class="font-sans text-gray-900 antialiased">
    <div class="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-fixed"
        style="background-image: url('{{ asset('images/cct-background.webp') }}');">

        <div
            class="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <!-- Logo and Title -->
            <div class="flex flex-col items-center justify-center mb-6">
                <img src="{{ asset('images/cct-logo.png') }}" alt="CCT Logo" class="h-20 w-auto mb-4">
                <h1 class="text-2xl font-bold text-primary tracking-wider text-center">
                    CCT DEFENSE SCHEDULING
                </h1>
            </div>

            <!-- Welcome Message -->
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white">Welcome back</h2>
                <p class="text-white/80">Please enter your credentials to log in.</p>
            </div>

            <!-- Session Status -->
            @if (session('status'))
                <div class="mb-4 font-medium text-sm text-green-300">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-6">
                @csrf

                <!-- Email Address -->
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-white/80">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus
                        autocomplete="username"
                        class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                        placeholder="you@example.com">
                    @error('email')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-white/80">Password</label>
                    <input id="password" type="password" name="password" required autocomplete="current-password"
                        class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                        placeholder="••••••••">
                    @error('password')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <label for="remember_me" class="inline-flex items-center">
                        <input id="remember_me" type="checkbox" name="remember"
                            class="rounded h-4 w-4 text-indigo-600 bg-white/30 border-transparent focus:ring-indigo-500">
                        <span class="ms-2 text-sm text-white/80">Remember me</span>
                    </label>

                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}"
                            class="text-sm text-primary underline-offset-4 hover:underline">
                            Forgot your password?
                        </a>
                    @endif
                </div>

                <!-- Log in Button -->
                <div>
                    <button type="submit"
                        class="w-full px-4 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors duration-300">
                        Log in
                    </button>
                </div>

                <!-- Register Link -->
                @if(config('app.with_register_link', false))
                <div class="text-center mt-4">
                    <p class="text-sm text-white/80">
                        Don't have an account?
                        <a href="{{ route('register') }}"
                            class="text-primary underline-offset-4 font-medium hover:underline">
                            Register here
                        </a>
                    </p>
                </div>
                @endif
            </form>
        </div>
    </div>
</body>

</html>
