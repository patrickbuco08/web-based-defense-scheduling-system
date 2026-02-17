<?php

namespace Bocum\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRegisterLink
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if register link is enabled
        if (!config('app.with_register_link', false)) {
            // Return 404 or redirect with error message
            abort(404, 'Registration is not available.');
        }

        return $next($request);
    }
}
