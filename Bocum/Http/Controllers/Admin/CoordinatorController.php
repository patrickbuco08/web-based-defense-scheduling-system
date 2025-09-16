<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Bocum\Models\User;
use Illuminate\Support\Facades\Hash;

class CoordinatorController extends Controller
{
    public function index()
    {
        $coordinators = User::role('coordinator')->latest()->paginate(15);
        return view('admin.coordinators.index', compact('coordinators'));
    }

    public function create()
    {
        return view('admin.coordinators.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','unique:users,email'],
            'password' => ['required','string','min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email'=> $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        $user->assignRole('coordinator');

        return redirect()->route('admin.coordinators.index')->with('status', 'Coordinator created.');
    }
}
