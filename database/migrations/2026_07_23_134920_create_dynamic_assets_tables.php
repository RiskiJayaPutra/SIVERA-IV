<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Drop old specific tables
        Schema::dropIfExists('it_assets');
        Schema::dropIfExists('network_assets');
        Schema::dropIfExists('cctv_assets');
        Schema::dropIfExists('locotrack_assets');

        // 2. Create asset_types table
        Schema::create('asset_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->default('fa-box');
            $table->json('schema')->nullable(); // Stores the column definitions
            $table->timestamps();
        });

        // 3. Create generic assets table
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('location_id');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
            $table->foreignId('asset_type_id')->constrained('asset_types')->onDelete('cascade');
            $table->json('data')->nullable(); // Stores the actual data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_types');

        // Note: Recreating the 4 specific tables in down() is verbose, 
        // usually we just drop the new ones.
    }
};
