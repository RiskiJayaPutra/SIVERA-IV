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
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_categories');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For rolling back, we recreate the tables (schema based on the old tables)
        Schema::create('asset_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('category_id')->constrained('asset_categories')->onDelete('cascade');
            $table->string('ip')->nullable();
            $table->string('mac')->nullable();
            $table->string('location_id');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
            $table->enum('status', ['Baik', 'Perawatan', 'Rusak'])->default('Baik');
            $table->date('last_maintenance')->nullable();
            $table->timestamps();
        });
    }
};
