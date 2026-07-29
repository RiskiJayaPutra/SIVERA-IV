<?php

namespace App\Imports;

use App\Models\Asset;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithUpserts;

class AssetImport implements ToModel, WithHeadingRow, WithValidation, WithUpserts
{
    /**
     * @return string|array
     */
    public function uniqueBy()
    {
        return 'id'; // This tells Laravel Excel to use 'id' as the unique key for upserting
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Parse date properly if needed, but assuming Y-m-d format from template
        $lastMaintenance = isset($row['last_maintenance']) && !empty($row['last_maintenance']) 
            ? date('Y-m-d', strtotime($row['last_maintenance'])) 
            : now()->format('Y-m-d');

        return new Asset([
            'id'               => $row['id'],
            'name'             => $row['name'],
            'category_id'      => $row['category_id'],
            'ip'               => $row['ip'] ?? null,
            'mac'              => $row['mac'] ?? null,
            'location_id'      => $row['location_id'],
            'status'           => $row['status'] ?? 'Baik',
            'last_maintenance' => $lastMaintenance,
        ]);
    }

    public function rules(): array
    {
        return [
            'id' => 'required|string',
            'name' => 'required|string',
            'category_id' => 'required|exists:asset_categories,id',
            'location_id' => 'required|exists:locations,id',
            'status' => 'nullable|string|in:Baik,Perawatan,Rusak',
        ];
    }
}
