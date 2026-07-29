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
        Schema::create('cctv_assets', function (Blueprint $table) {
            $table->id();
            $table->string('location_id');
            $table->string('train_number')->nullable(); // nomor kereta
            $table->string('train_type')->nullable(); // Type kereta
            $table->string('cctv_type')->nullable(); // status cctv (ip / analog)
            $table->string('recorder_type')->nullable(); // Recorder (dvr / nvr / standalone)
            $table->string('monitor')->nullable(); // monitor
            $table->integer('quantity')->nullable(); // jumlah
            $table->string('condition')->nullable(); // kondisi
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
        Schema::dropIfExists('cctv_assets');
    }
};
