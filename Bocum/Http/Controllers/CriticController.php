<?php

namespace Bocum\Http\Controllers;

use Illuminate\Http\Request;
use Bocum\Models\User;
use Illuminate\Support\Facades\Auth;

class CriticController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        
        $critics = User::with(['roles', 'department'])
            ->where('id', '!=', $authUser->id)
            ->where('department_id', $authUser->department_id)
            ->whereDoesntHave('roles', function($query) {
                $query->where('name', 'admin');
            })
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name ?? 'user',
                    'department' => $user->department ? [
                        'id' => $user->department->id,
                        'name' => $user->department->name,
                    ] : null,
                    'created_at' => $user->created_at,
                    'email_verified_at' => $user->email_verified_at,
                ];
            });

        return response()->json($critics);
    }
}
