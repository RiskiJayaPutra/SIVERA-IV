<?php

namespace Database\Seeders;

use App\Models\User;
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
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Superadmin KAI',
            'email' => 'superadmin@kai.id',
            'role' => 'superadmin',
            'password' => bcrypt('password'), // password: password
        ]);

        User::factory()->create([
            'name' => 'Admin Divre IV',
            'email' => 'admin@kai.id',
            'role' => 'admin',
            'password' => bcrypt('password'), // password: password
        ]);

        $this->call([
            AssetTypeSeeder::class,
        ]);
    }
}
