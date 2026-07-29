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
            $query = Asset::with('location')->where('asset_type_id', $currentType->id);
            
            if ($request->has('locations') && !empty($request->query('locations'))) {
                $filterLocs = explode(',', $request->query('locations'));
                $childrenIds = Location::whereIn('parent_id', $filterLocs)->pluck('id')->toArray();
                $allLocs = array_merge($filterLocs, $childrenIds);
                $query->whereIn('location_id', $allLocs);
            }

            $assets = $query->paginate(15)->withQueryString();
        }

        return Inertia::render('Reports', [
            'stats' => $stats,
            'assetTypes' => $assetTypes,
            'locations' => Location::select('id', 'name', 'type', 'parent_id')->orderBy('name')->get(),
            'assets' => $assets,
            'currentType' => $currentType ? $currentType->slug : null,
            'currentSchema' => $currentType ? $currentType->schema : null,
        ]);
    }

    public function export(Request $request)
    {
        $categories = $request->input('categories', []);
        $locations = $request->input('locations', []);

        if (is_string($categories)) $categories = json_decode($categories, true) ?? [];
        if (is_string($locations)) $locations = json_decode($locations, true) ?? [];

        $user = auth()->user();
        if ($user->role === 'Admin Lokasi') {
            $locations = [$user->location_id];
        } else if ($user->role === 'Viewer') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengekspor data.');
        }

        if (empty($categories)) {
            $categories = AssetType::pluck('id')->toArray();
        }

        if (!empty($locations)) {
            $childrenIds = Location::whereIn('parent_id', $locations)->pluck('id')->toArray();
            $locations = array_merge($locations, $childrenIds);
        }

        $format = $request->input('format', 'combined');
        $showEmptyLocations = filter_var($request->input('show_empty', false), FILTER_VALIDATE_BOOLEAN);

        $fileName = 'Laporan_Aset_SIVERA_' . date('Ymd_His') . '.xlsx';

        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\MultiSheetAssetExport($categories, $locations, $format, $showEmptyLocations), $fileName);
    }

    public function previewExport(Request $request)
    {
        $categories = $request->input('categories', []);
        $locations = $request->input('locations', []);

        if (is_string($categories)) $categories = json_decode($categories, true) ?? [];
        if (is_string($locations)) $locations = json_decode($locations, true) ?? [];

        $user = auth()->user();
        if ($user->role === 'Admin Lokasi') {
            $locations = [$user->location_id];
        }

        $query = Asset::query();
        
        if (!empty($categories)) {
            $query->whereIn('asset_type_id', $categories);
        }
        if (!empty($locations)) {
            $childrenIds = Location::whereIn('parent_id', $locations)->pluck('id')->toArray();
            $allLocs = array_merge($locations, $childrenIds);
            $query->whereIn('location_id', $allLocs);
        }

        $totalData = (clone $query)->count();
        
        $byCategory = (clone $query)
            ->selectRaw('asset_type_id, count(*) as count')
            ->groupBy('asset_type_id')
            ->with('assetType:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->assetType ? $item->assetType->name : 'Unknown',
                    'count' => $item->count
                ];
            });

        $byLocation = (clone $query)
            ->selectRaw('location_id, count(*) as count')
            ->groupBy('location_id')
            ->with('location:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->location ? $item->location->name : 'Unknown',
                    'count' => $item->count
                ];
            });

        $format = $request->input('format', 'combined');
        $formatDesc = $format === 'grouped' ? 'Tabel Dipisah per Lokasi' : 'Tabel Gabungan';

        return response()->json([
            'total' => $totalData,
            'categories' => $byCategory,
            'locations' => $byLocation,
            'format_desc' => $formatDesc
        ]);
    }
}
