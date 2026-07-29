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
        Schema::create('assets', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('ip')->nullable();
            $table->string('mac')->nullable();
            $table->string('category_id');
            $table->string('location_id');
            $table->enum('status', ['Baik', 'Perawatan', 'Rusak'])->default('Baik');
            $table->date('last_maintenance')->nullable();
            $table->timestamps();
            
            $table->foreign('category_id')->references('id')->on('asset_categories')->onDelete('cascade');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
