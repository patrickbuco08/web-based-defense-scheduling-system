<?php

namespace Bocum\Providers;

use Bocum\Models\Room;
use Bocum\Models\User;
use Bocum\Models\Defense;
use Bocum\Policies\RoomPolicy;
use Bocum\Policies\AccountPolicy;
use Bocum\Policies\DefensePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Room::class => RoomPolicy::class,
        User::class => AccountPolicy::class,
        Defense::class => DefensePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

    }
}
