<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminCommand extends Command
{
    protected $signature = 'admin:grant {email : The email address of the user to promote}
                            {--revoke : Remove admin access instead of granting it}';

    protected $description = 'Grant or revoke admin access for a user';

    public function handle(): int
    {
        $user = User::query()->where('email', $this->argument('email'))->first();

        if ($user === null) {
            $this->error("No user found with email {$this->argument('email')}.");

            return self::FAILURE;
        }

        $granting = ! $this->option('revoke');
        $user->forceFill(['is_admin' => $granting])->save();

        $this->info(sprintf(
            '%s is %s an administrator.',
            $user->email,
            $granting ? 'now' : 'no longer',
        ));

        return self::SUCCESS;
    }
}
