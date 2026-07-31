<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssetType;

class AssetTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Aset IT',
                'slug' => 'aset-it',
                'icon' => 'fa-computer',
                'schema' => [
                    'columns' => [
                        ['key' => 'asset_number', 'label' => 'Nomor Asset', 'type' => 'text', 'mono' => true],
                        ['key' => 'serial_number', 'label' => 'Serial Number', 'type' => 'text', 'mono' => true],
                        ['key' => 'device_type', 'label' => 'Jenis Perangkat', 'type' => 'select', 'bold' => true, 'options' => ['PC', 'PC AIO', 'Laptop', 'Monitor', 'Printer', 'Scanner']],
                        [
                            'key' => 'pengguna',
                            'type' => 'group',
                            'label' => 'Pengguna',
                            'subColumns' => [
                                ['key' => 'nama', 'type' => 'text', 'label' => 'Nama'],
                                ['key' => 'nipp', 'type' => 'number', 'label' => 'NIPP'],
                            ]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Aset Jaringan',
                'slug' => 'network',
                'icon' => 'fa-network-wired',
                'schema' => [
                    'columns' => [
                        ['key' => 'region', 'label' => 'Wilayah', 'type' => 'text'],
                        ['key' => 'active_service_location', 'label' => 'Lokasi Layanan Aktif', 'type' => 'text'],
                        ['key' => 'network_type', 'label' => 'Jaringan', 'type' => 'text', 'bold' => true],
                        ['key' => 'bandwidth_kbps', 'label' => 'Band Width (kbps)', 'type' => 'number', 'mono' => true, 'suffix' => 'kbps'],
                        ['key' => 'status', 'label' => 'Status', 'type' => 'status', 'options' => ['Aktif', 'Tidak Aktif', 'Perawatan']],
                        ['key' => 'router_brand', 'label' => 'Router', 'type' => 'select', 'options' => ['Cisco', 'Juniper', 'Malpu', 'Tidak Ada']],
                    ]
                ]
            ],
            [
                'name' => 'Aset CCTV',
                'slug' => 'cctv',
                'icon' => 'fa-video',
                'schema' => [
                    'columns' => [
                        ['key' => 'train_number', 'label' => 'Nomor Kereta', 'type' => 'text', 'mono' => true],
                        ['key' => 'train_type', 'label' => 'Type Kereta', 'type' => 'text'],
                        [
                            'key' => 'group_status_cctv',
                            'type' => 'group',
                            'label' => 'Status CCTV',
                            'subColumns' => [
                                ['key' => 'cctv_ip', 'type' => 'radio', 'label' => 'IP', 'subLabel' => 'IP', 'radioGroup' => 'cctv_type', 'radioGroupKey' => 'cctv_type', 'radioValue' => 'ip', '_skipHeader' => true],
                                ['key' => 'cctv_analog', 'type' => 'radio', 'label' => 'Analog', 'subLabel' => 'Analog', 'radioGroup' => 'cctv_type', 'radioGroupKey' => 'cctv_type', 'radioValue' => 'analog', '_skipHeader' => true],
                            ]
                        ],
                        [
                            'key' => 'group_recorder',
                            'type' => 'group',
                            'label' => 'Recorder',
                            'subColumns' => [
                                ['key' => 'recorder_dvr', 'type' => 'radio', 'label' => 'DVR', 'subLabel' => 'DVR', 'radioGroup' => 'recorder_type', 'radioGroupKey' => 'recorder_type', 'radioValue' => 'dvr', '_skipHeader' => true],
                                ['key' => 'recorder_nvr', 'type' => 'radio', 'label' => 'NVR', 'subLabel' => 'NVR', 'radioGroup' => 'recorder_type', 'radioGroupKey' => 'recorder_type', 'radioValue' => 'nvr', '_skipHeader' => true],
                                ['key' => 'recorder_standalone', 'type' => 'radio', 'label' => 'Standalone', 'subLabel' => 'Standalone', 'radioGroup' => 'recorder_type', 'radioGroupKey' => 'recorder_type', 'radioValue' => 'standalone', '_skipHeader' => true],
                            ]
                        ],
                        ['key' => 'monitor', 'label' => 'Monitor', 'type' => 'text'],
                        ['key' => 'quantity', 'label' => 'Jumlah', 'type' => 'number'],
                        ['key' => 'condition', 'label' => 'Kondisi', 'type' => 'status', 'options' => ['Baik', 'Perawatan', 'Rusak']],
                        ['key' => 'description', 'label' => 'Keterangan', 'type' => 'text'],
                    ],
                    'headerGroups' => [
                        ['id' => 'status_cctv', 'label' => 'Status CCTV', 'colSpan' => 2],
                        ['id' => 'recorder', 'label' => 'Recorder', 'colSpan' => 3],
                    ]
                ]
            ],
            [
                'name' => 'Aset Locotrack',
                'slug' => 'locotrack',
                'icon' => 'fa-location-dot',
                'schema' => [
                    'columns' => [
                        ['key' => 'lct_id', 'label' => 'ID LCT', 'type' => 'text', 'mono' => true],
                        ['key' => 'facility_number', 'label' => 'No Sarana', 'type' => 'text'],
                        ['key' => 'gsm_number', 'label' => 'No GSM', 'type' => 'text', 'mono' => true],
                        ['key' => 'dipo', 'label' => 'DIPO', 'type' => 'text'],
                        ['key' => 'daop_divre', 'label' => 'DAOP/DIVRE', 'type' => 'text'],
                        ['key' => 'locotrack_type', 'label' => 'Tipe Locotrack', 'type' => 'text'],
                        ['key' => 'locotrack_category', 'label' => 'Jenis Locotrack', 'type' => 'text'],
                        ['key' => 'group', 'label' => 'Kelompok', 'type' => 'text'],
                        ['key' => 'facility_condition', 'label' => 'Kondisi Sarana', 'type' => 'status', 'options' => ['Baik', 'Perawatan', 'Rusak']],
                        ['key' => 'installation_year', 'label' => 'Tahun Pemasangan', 'type' => 'text'],
                        ['key' => 'facility_type', 'label' => 'Jenis Sarana', 'type' => 'text'],
                        ['key' => 'serial_number', 'label' => 'SN', 'type' => 'text', 'mono' => true],
                        ['key' => 'description', 'label' => 'Keterangan', 'type' => 'text'],
                    ]
                ]
            ]
        ];

        foreach ($types as $type) {
            AssetType::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
