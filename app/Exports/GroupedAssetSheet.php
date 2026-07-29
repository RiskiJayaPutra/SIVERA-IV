<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use App\Models\AssetType;
use Illuminate\Support\Collection;

class GroupedAssetSheet implements FromView, WithTitle, ShouldAutoSize
{
    protected $category;
    protected $locations;
    protected $assetsGrouped;
    protected $schemaCols;
    protected $title;
    protected $showEmptyLocations;

    public function __construct(AssetType $category, Collection $locations, Collection $assets, $title, $showEmptyLocations = false)
    {
        $this->category = $category;
        
        $this->schemaCols = $category->schema['columns'] ?? [];
        $this->title = $title;
        $this->showEmptyLocations = $showEmptyLocations;

        // Group assets by location ID
        $this->assetsGrouped = $assets->groupBy('location_id');

        // Filter locations if not showing empty
        if (!$this->showEmptyLocations) {
            $this->locations = $locations->filter(function ($loc) {
                return isset($this->assetsGrouped[$loc->id]) && $this->assetsGrouped[$loc->id]->isNotEmpty();
            });
        } else {
            $this->locations = $locations;
        }
    }

    public function view(): View
    {
        return view('exports.grouped_assets', [
            'category' => $this->category,
            'locations' => $this->locations,
            'assetsGrouped' => $this->assetsGrouped,
            'schemaCols' => $this->schemaCols
        ]);
    }

    public function title(): string
    {
        return $this->title;
    }
}
