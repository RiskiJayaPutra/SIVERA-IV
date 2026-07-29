<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Location;
use App\Models\User;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $assetTypes = AssetType::all();
        $assetTypeSlug = $request->query('asset_type');
        
        $currentType = null;
        if ($assetTypeSlug) {
            $currentType = AssetType::where('slug', $assetTypeSlug)->first();
        } else if ($assetTypes->count() > 0) {
            $currentType = $assetTypes->first();
        }
        
        $locationsCount = Location::count();
        $usersCount = User::count();

        // Calculate Global Stats dynamically
        $allAssets = Asset::all();
        $totalAssets = $allAssets->count();
        
        $statBaik = 0;
        $statPerawatan = 0;
        $statRusak = 0;

        foreach ($allAssets as $asset) {
            $data = $asset->data ?? [];
            $status = $data['status'] ?? $data['condition'] ?? $data['facility_condition'] ?? $data['kondisi'] ?? null;
            
            if ($status === 'Baik' || $status === 'Aktif') {
                $statBaik++;
            } elseif ($status === 'Perawatan') {
                $statPerawatan++;
            } elseif ($status === 'Rusak' || $status === 'Tidak Aktif') {
                $statRusak++;
            }
        }

        $stats = [
            'totalAssets' => $totalAssets,
            'totalLocations' => $locationsCount,
            'totalCategories' => $assetTypes->count(),
            'totalUsers' => $usersCount,
            'statBaik' => $statBaik,
            'statPerawatan' => $statPerawatan,
            'statRusak' => $statRusak,
        ];

        // Fetch Data for Table
        $assets = null;
        if ($currentType) {
            $assets = Asset::with('location')
                ->where('asset_type_id', $currentType->id)
                ->paginate(15)
                ->withQueryString();
        }

        return Inertia::render('Reports', [
            'stats' => $stats,
            'assetTypes' => $assetTypes,
            'assets' => $assets,
            'currentType' => $currentType ? $currentType->slug : null,
            'currentSchema' => $currentType ? $currentType->schema : null,
        ]);
    }

    public function export(Request $request)
    {
        $assetTypeSlug = $request->input('asset_type');
        $currentType = AssetType::where('slug', $assetTypeSlug)->firstOrFail();

        $assets = Asset::with('location')
            ->where('asset_type_id', $currentType->id)
            ->get();

        $schemaCols = $currentType->schema['columns'] ?? [];

        $fileName = 'Laporan_' . $currentType->name . '_' . date('Ymd_His') . '.xlsx';

        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\AssetExport($assets, $schemaCols), $fileName);
    }
}
