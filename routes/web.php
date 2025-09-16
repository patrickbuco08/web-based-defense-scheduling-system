<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-react', function () {
    return view('test-react');
})->name('test-react');
