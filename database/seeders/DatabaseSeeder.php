<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Page copy, CMS blocks and the service catalogue.
            SiteContentSeeder::class,
            // Departments, practitioners, patients and sample bookings.
            ClinicSeeder::class,
            // Local-only demo logins; refuses to run in production.
            DemoUsersSeeder::class,
        ]);
    }
}
