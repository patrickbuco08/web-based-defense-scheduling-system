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
         style="background-image: url('{{ asset('images/background.webp') }}');">

        <div class="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <!-- Logo and Title -->
            <div class="flex flex-col items-center justify-center mb-6">
                <img src="{{ asset('images/cct-logo.png') }}" alt="CCT Logo" class="h-20 w-auto mb-4">
                <h1 class="text-2xl font-bold text-white tracking-wider text-center">
                    CCT DEFENSE SCHEDULING
                </h1>
            </div>

            <!-- Welcome Message -->
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white">Create an Account</h2>
                <p class="text-white/80">Join us by filling out the form below.</p>
            </div>

            <form method="POST" action="{{ route('register') }}" class="space-y-4">
                @csrf

                <!-- Name -->
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-white/80">Name</label>
                    <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus autocomplete="name"
                           class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                           placeholder="Your Name">
                    @error('name')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Email Address -->
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-white/80">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username"
                           class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                           placeholder="you@example.com">
                    @error('email')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-white/80">Password</label>
                    <input id="password" type="password" name="password" required autocomplete="new-password"
                           class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                           placeholder="••••••••">
                    @error('password')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="password_confirmation" class="block mb-2 text-sm font-medium text-white/80">Confirm Password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password"
                           class="w-full px-4 py-2 text-gray-900 bg-white/50 border border-transparent rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                           placeholder="••••••••">
                    @error('password_confirmation')
                        <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-center justify-between pt-4">
                    <a class="text-sm text-indigo-300 hover:text-indigo-100 underline" href="{{ route('login') }}">
                        {{ __('Already registered?') }}
                    </a>

                    <button type="submit" class="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors duration-300">
                        {{ __('Register') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
