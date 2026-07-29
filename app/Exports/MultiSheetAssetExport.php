<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\AssetType;
use App\Models\Asset;
use App\Models\Location;
use App\Exports\AssetExport;
use App\Exports\GroupedAssetSheet;

class MultiSheetAssetExport implements WithMultipleSheets
{
    use Exportable;

    protected $categories;
    protected $locationIds;
    protected $format;
    protected $showEmptyLocations;

    public function __construct($categories, $locationIds, $format = 'combined', $showEmptyLocations = false)
    {
        $this->categories = $categories;
        $this->locationIds = $locationIds;
        $this->format = $format;
        $this->showEmptyLocations = $showEmptyLocations;
    }

    public function sheets(): array
    {
        $sheets = [];

        $assetTypes = AssetType::whereIn('id', $this->categories)->get();
        
        $locationsQuery = Location::with('parent');
        if (!empty($this->locationIds)) {
            $locationsQuery->whereIn('id', $this->locationIds);
        }
        $allLocations = $locationsQuery->get()->sortBy(function($loc) {
            return ($loc->parent ? $loc->parent->name . ' - ' : '') . $loc->name;
        });

        foreach ($assetTypes as $type) {
            $query = Asset::with('location')->where('asset_type_id', $type->id);

            if (!empty($this->locationIds)) {
                $query->whereIn('location_id', $this->locationIds);
            }

            $assets = $query->get();
            $schemaCols = $type->schema['columns'] ?? [];
            $title = substr($type->name, 0, 31);

            if ($this->format === 'grouped') {
                $sheets[] = new GroupedAssetSheet($type, $allLocations, $assets, $title, $this->showEmptyLocations);
            } else {
                $sheets[] = new AssetExport($assets, $schemaCols, $title);
            }
        }

        return $sheets;
    }
}
