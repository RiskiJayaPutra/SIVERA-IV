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
        Schema::create('network_assets', function (Blueprint $table) {
            $table->id();
            $table->string('location_id');
            $table->string('region')->nullable(); // Wilayah
            $table->string('active_service_location')->nullable(); // Lokasi Layanan Aktif
            $table->string('network_type')->nullable(); // Jaringan
            $table->integer('bandwidth_kbps')->nullable(); // Band Width (kbps)
            $table->string('status')->nullable(); // Status
            $table->string('router_brand')->nullable(); // Router
            $table->timestamps();

            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('network_assets');
    }
};
