<?php

namespace Bocum\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    public function verifyPassword(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.current_password' => 'Invalid password.',
        ]);

        return response()->json([
            'message' => 'Password verified successfully.',
        ]);
    }
}
