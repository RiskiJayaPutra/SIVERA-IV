<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\AssetType;
use App\Models\Asset;
use App\Exports\AssetExport;

class MultiSheetAssetExport implements WithMultipleSheets
{
    use Exportable;

    protected $categories;
    protected $locationIds;

    public function __construct($categories, $locationIds)
    {
        $this->categories = $categories;
        $this->locationIds = $locationIds;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Fetch all requested categories
        $assetTypes = AssetType::whereIn('id', $this->categories)->get();

        foreach ($assetTypes as $type) {
            $query = Asset::with('location')->where('asset_type_id', $type->id);

            // Filter locations if not all locations are selected
            // We assume if $locationIds is not empty and doesn't contain a special 'all' flag, we filter it
            if (!empty($this->locationIds)) {
                $query->whereIn('location_id', $this->locationIds);
            }

            $assets = $query->get();
            $schemaCols = $type->schema['columns'] ?? [];
            $title = substr($type->name, 0, 31); // Excel sheet titles can't exceed 31 chars

            $sheets[] = new AssetExport($assets, $schemaCols, $title);
        }

        // If no data or categories matched, we might need a blank sheet to avoid error,
        // but Laravel Excel throws error on empty sheets array. We'll handle that gracefully in controller.

        return $sheets;
    }
}
