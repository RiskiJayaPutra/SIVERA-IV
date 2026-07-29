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
        Schema::create('locotrack_assets', function (Blueprint $table) {
            $table->id();
            $table->string('location_id');
            $table->string('lct_id')->nullable(); // ID LCT
            $table->string('facility_number')->nullable(); // No Sarana
            $table->string('gsm_number')->nullable(); // NO GSM
            $table->string('dipo')->nullable(); // DIPO
            $table->string('daop_divre')->nullable(); // DAOP/DIVRE
            $table->string('locotrack_type')->nullable(); // Tipe locotrack
            $table->string('locotrack_category')->nullable(); // Jenis Locotrack
            $table->string('group')->nullable(); // Kelompok
            $table->string('facility_condition')->nullable(); // Kondisi Sarana
            $table->string('installation_year')->nullable(); // tahun Pemasangan
            $table->string('facility_type')->nullable(); // Jenis Sarana
            $table->string('serial_number')->nullable(); // SN
            $table->text('description')->nullable(); // keterangan
            $table->timestamps();

            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locotrack_assets');
    }
};
