@extends('app')

@section('title', 'Sugarcane Samples Dashboard')

@push('head')
    @vite(['resources/js/Pages/TestReact/index.jsx'])
@endpush

@section('content')
    <div id="app"></div>
@endsection
