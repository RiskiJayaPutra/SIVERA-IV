<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Location;
use Faker\Factory as Faker;

class AssetDummySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $locations = Location::all();
        if ($locations->isEmpty()) {
            $this->command->error('No locations found. Please run LocationSeeder first.');
            return;
        }

        $assetTypes = AssetType::all();
        if ($assetTypes->isEmpty()) {
            $this->command->error('No asset types found. Please run AssetTypeSeeder first.');
            return;
        }

        // Wipe existing assets to ensure clean balanced data
        Asset::truncate();
        
        $globalItSequence = 1;

        foreach ($assetTypes as $type) {
            $this->command->info('Seeding dummy data for ' . $type->name . ' across all locations...');
            
            foreach ($locations as $location) {
                // Generate 50-100 assets per location per type as requested
                $count = rand(50, 100);
                
                for ($i = 1; $i <= $count; $i++) {
                    $data = [];
                    if ($type->slug === 'it' || $type->slug === 'aset-it') {
                        $deviceOptions = [
                            'PC' => '001',
                            'Monitor' => '002',
                            'Printer' => '003',
                            'Scanner' => '004',
                            'Laptop' => '007',
                            'PC AIO' => '008',
                        ];
                        
                        $selectedDevice = $faker->randomElement(array_keys($deviceOptions));
                        $deviceCode = $deviceOptions[$selectedDevice];

                        $mmyy = $faker->dateTimeBetween('-5 years', 'now')->format('my'); // e.g. 0226
                        $source = $faker->randomElement(['1', '2']); // 1: Divre/TNK, 2: Pusat
                        $sequence = str_pad($globalItSequence++, 5, '0', STR_PAD_LEFT);
                        
                        // IT.002.0226.1.C032.00003
                        $assetNumber = "IT.{$deviceCode}.{$mmyy}.{$source}.C032.{$sequence}";

                        $data = [
                            'asset_number' => $assetNumber,
                            'serial_number' => strtoupper($faker->bothify('SN-????-####')),
                            'device_type' => $selectedDevice,
                            'nipp' => $faker->numerify('########'),
                            'nama' => $faker->name,
                        ];
                    } elseif ($type->slug === 'network') {
                        $data = [
                            'region' => 'Divre IV TNK',
                            'active_service_location' => $location->name,
                            'network_type' => $faker->randomElement(['LAN', 'WAN', 'Fiber Optic', 'Wireless']),
                            'bandwidth_kbps' => $faker->randomElement([10000, 20000, 50000, 100000]),
                            'status' => $faker->randomElement(['Aktif', 'Tidak Aktif', 'Perawatan']),
                            'router_brand' => $faker->randomElement(['Cisco', 'Juniper', 'Malpu', 'Tidak Ada']),
                        ];
                    } elseif ($type->slug === 'cctv') {
                        $indonesianCctvDescriptions = [
                            'Kamera berfungsi dengan baik, tidak ada *blind spot*.',
                            'Kabel jaringan perlu dirapikan ulang.',
                            'Lensa buram akibat debu, perlu dibersihkan.',
                            'Recorder menyimpan data hingga 30 hari terakhir.',
                            'Sudut pandang perlu disesuaikan kembali.',
                            'Sistem *power supply* stabil.',
                            'Memerlukan penggantian konektor BNC.',
                            'Fokus kamera sedikit meleset di malam hari.',
                            'Kondisi fisik *housing* sedikit retak namun aman.'
                        ];
                        
                        $data = [
                            'train_number' => 'KA-' . $faker->numerify('###'),
                            'train_type' => $faker->randomElement(['Penumpang', 'Barang', 'Lori']),
                            'cctv_type' => $faker->randomElement(['ip', 'analog']),
                            'recorder_type' => $faker->randomElement(['dvr', 'nvr', 'standalone']),
                            'monitor' => $faker->randomElement(['Ada', 'Tidak Ada']),
                            'quantity' => $faker->numberBetween(1, 20),
                            'condition' => $faker->randomElement(['Baik', 'Perawatan', 'Rusak']),
                            'description' => $faker->randomElement($indonesianCctvDescriptions),
                        ];
                    } elseif ($type->slug === 'locotrack') {
                        $indonesianDescriptions = [
                            'Kondisi baik, beroperasi normal.',
                            'Sedang dalam jadwal perawatan rutin.',
                            'Memerlukan perbaikan pada modul antena.',
                            'Telah dikalibrasi ulang.',
                            'Unit pengganti sementara.',
                            'Perlu penggantian baterai cadangan.',
                            'Indikator signal lemah, butuh pengecekan.',
                            'Berfungsi normal, siap digunakan.'
                        ];
                        
                        $data = [
                            'lct_id' => 'LCT-' . $faker->unique()->numerify('#####'),
                            'facility_number' => 'FAC-' . $faker->numerify('####'),
                            'gsm_number' => '08' . $faker->numerify('##########'),
                            'dipo' => 'TNK',
                            'daop_divre' => 'DIVRE IV',
                            'locotrack_type' => $faker->randomElement(['Type A', 'Type B', 'Type C']),
                            'locotrack_category' => $faker->randomElement(['Cat 1', 'Cat 2']),
                            'group' => 'Kelompok ' . $faker->randomElement(['A', 'B', 'C']),
                            'facility_condition' => $faker->randomElement(['Baik', 'Perawatan', 'Rusak']),
                            'installation_year' => $faker->year(),
                            'facility_type' => $faker->randomElement(['Lokomotif', 'Gerbong']),
                            'serial_number' => strtoupper($faker->bothify('SN-LCT-####')),
                            'description' => $faker->randomElement($indonesianDescriptions),
                        ];
                    }

                    Asset::create([
                        'asset_type_id' => $type->id,
                        'location_id' => $location->id,
                        'data' => $data,
                    ]);
                }
            }
        }
        
        $this->command->info('Dummy data seeded perfectly across all locations!');
    }
}
