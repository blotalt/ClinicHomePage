<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Throwaway accounts for poking at the site locally.
 *
 * Both use the password "password". They exist so nobody has to put a real
 * address (or a real password) into a local database — do not run this
 * anywhere public.
 */
class DemoUsersSeeder extends Seeder
{
    public const ADMIN_EMAIL = 'admin@lumina.test';

    public const STAFF_EMAIL = 'staff@lumina.test';

    public const PASSWORD = 'password';

    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command?->error(
                'DemoUsersSeeder refuses to run in production.',
            );

            return;
        }

        $admin = $this->upsert(self::ADMIN_EMAIL, 'Demo Admin');
        // is_admin is not mass-assignable on purpose.
        $admin->forceFill(['is_admin' => true])->save();

        $staff = $this->upsert(self::STAFF_EMAIL, 'Demo Staff');
        $staff->forceFill(['is_admin' => false])->save();

        $this->command?->info(sprintf(
            "Demo accounts ready (password: %s)\n  admin: %s  -> /admin\n  staff: %s  -> 403 at /admin",
            self::PASSWORD,
            self::ADMIN_EMAIL,
            self::STAFF_EMAIL,
        ));
    }

    private function upsert(string $email, string $name): User
    {
        $user = User::query()->firstOrNew(['email' => $email]);

        $user->forceFill([
            'name' => $name,
            'password' => Hash::make(self::PASSWORD),
            'email_verified_at' => now(),
        ])->save();

        return $user;
    }
}
