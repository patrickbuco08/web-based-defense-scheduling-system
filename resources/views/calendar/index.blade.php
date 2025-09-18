@extends('app')

@push('head')
    @vite(['resources/js/Pages/Calendar'])
@endpush

@section('content')
    <div id="calendar"></div>
@endsection

@push('script')
@endpush
