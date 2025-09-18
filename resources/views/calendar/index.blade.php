@extends('app')

@push('head')
    @vite(['resources/js/Pages/Calendar/index.tsx'])
@endpush

@section('content')
    <div id="calendar"></div>
@endsection

@push('script')
@endpush
