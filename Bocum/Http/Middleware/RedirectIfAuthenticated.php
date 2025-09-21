<?php

namespace Bocum\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * The callback that should be used to generate the authentication redirect path.
     *
     * @var callable
     */
    protected static $redirectToCallback;

    /**
     * Specify the callback that should be used to generate the redirect path.
     *
     * @param  callable  $callback
     * @return void
     */
    public static function redirectUsing(callable $callback)
    {
        static::$redirectToCallback = $callback;
    }

    /**
     * Get the path the user should be redirected to when they are authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $guard
     * @return string
     */
    protected function redirectTo($request, $guard = null)
    {
        if (static::$redirectToCallback) {
            return call_user_func(static::$redirectToCallback, $request, $guard);
        }

        return $request->expectsJson() ? null : route('app');
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards): mixed
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return redirect($this->redirectTo($request, $guard));
            }
        }

        return $next($request);
    }
}
