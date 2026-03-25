<?php

namespace Bocum\Http\Controllers\API;

use Bocum\Http\Controllers\Controller;
use Bocum\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Get the current user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user()->load('department')
            ]
        ]);
    }

    /**
     * Update the user's profile.
     */
    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $selectedRole = $validated['role'] ?? null;

        unset($validated['role']);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($selectedRole && $user->hasAnyRole(['adviser', 'coordinator'])) {
            $currentRoles = $user->getRoleNames()->toArray();
            $preservedRoles = array_values(array_filter(
                $currentRoles,
                fn (string $role) => !in_array($role, ['adviser', 'coordinator'], true)
            ));

            $user->syncRoles([...$preservedRoles, $selectedRole]);
            $user->refresh();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => array_merge($user->load('department')->toArray(), [
                    'roles' => $user->getRoleNames()->toArray(),
                ])
            ]
        ]);
    }
}
