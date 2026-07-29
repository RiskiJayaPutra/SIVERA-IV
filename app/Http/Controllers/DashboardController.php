<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $assetQuery = Asset::query();
        $locationsQuery = Location::query();
        
        if ($user->role !== 'superadmin' && $user->location_id) {
            $allowedLocations = Location::where('id', $user->location_id)
                                        ->orWhere('parent_id', $user->location_id)
                                        ->pluck('id');
            
            $assetQuery->whereIn('location_id', $allowedLocations);
        }

        // Count for locations (include children to aggregate)
        $locations = $locationsQuery->withCount(['assets'])->get();

        // Aggregate assets from child units to their parent stasiun/resort
        foreach ($locations as $loc) {
            if ($loc->type === 'stasiun' || $loc->type === 'resort') {
                $childAssetsCount = $locations->where('parent_id', $loc->id)->sum('assets_count');
                $loc->assets_count += $childAssetsCount;
            }
        }

        // Fetch all relevant assets to count dynamically in PHP
        // Because querying JSON across various ambiguous status keys in DB is complex
        $allAssets = $assetQuery->get();
        
        $total = $allAssets->count();
        
        $baik = 0;
        $perawatan = 0;
        $rusak = 0;

        foreach ($allAssets as $asset) {
            $data = $asset->data ?? [];
            $status = $data['status'] ?? $data['condition'] ?? $data['facility_condition'] ?? $data['kondisi'] ?? null;
            
            if ($status === 'Baik' || $status === 'Aktif') {
                $baik++;
            } elseif ($status === 'Perawatan') {
                $perawatan++;
            } elseif ($status === 'Rusak' || $status === 'Tidak Aktif') {
                $rusak++;
            }
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => $total,
                'baik' => $baik,
                'perawatan' => $perawatan,
                'rusak' => $rusak,
            ],
            'locations' => $locations,
            'recentActivities' => [] // can be expanded later
        ]);
    }
}
