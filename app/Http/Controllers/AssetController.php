<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Location;
use Illuminate\Support\Facades\DB;

class AssetController extends Controller
{
    /**
     * Menampilkan master data aset secara global (Read-Only).
     */
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
        
        $assets = null;
        $total = 0;

        $search = $request->query('search');
        $searchLoc = $request->query('search_location');
        $filterLocations = $request->query('locations', []);

        $locations = Location::select('id', 'name', 'type', 'parent_id')->orderBy('name')->get();
        $locationPagination = null;
        $displayLocations = collect();

        if ($currentType) {
            $query = Asset::with('location')->where('asset_type_id', $currentType->id);
            
            // Total overall assets for this type
            $total = (clone $query)->count();

            if (empty($filterLocations) && empty($search) && empty($searchLoc)) {
                // No filters: Paginate locations (e.g., 5 locations per page)
                $paginatedLocs = Location::select('id', 'name', 'type', 'parent_id')->whereNull('parent_id')->orderBy('name')->paginate(5)->withQueryString();
                $displayLocations = collect($paginatedLocs->items());
                $locationPagination = $paginatedLocs;

                $query->whereIn('location_id', $displayLocations->pluck('id'));
            } else {
                // Filters applied: Get assets based on filters
                if (!empty($filterLocations)) {
                    // Include children of selected locations
                    $childrenIds = Location::whereIn('parent_id', $filterLocations)->pluck('id')->toArray();
                    $allAllowedLocs = array_merge($filterLocations, $childrenIds);
                    $query->whereIn('location_id', $allAllowedLocs);
                }

                if (!empty($searchLoc)) {
                    $query->whereHas('location', function($q) use ($searchLoc) {
                        $q->where('name', 'like', "%{$searchLoc}%")
                          ->orWhereHas('parent', function($q2) use ($searchLoc) {
                              $q2->where('name', 'like', "%{$searchLoc}%");
                          });
                    });
                }

                if (!empty($search)) {
                    $query->where('data', 'like', "%{$search}%");
                }
            }

            $assets = $query->get();
        }

        return Inertia::render('Assets', [
            'assetTypes' => $assetTypes,
            'assets' => $assets,
            'totalAssets' => $total,
            'locations' => $locations,
            'locationPagination' => $locationPagination,
            'currentType' => $currentType ? $currentType->slug : null,
            'currentSchema' => $currentType ? $currentType->schema : null,
            'filters' => [
                'search' => $search,
                'search_location' => $searchLoc,
                'locations' => $filterLocations,
            ],
        ]);
    }

    /**
     * Batch save assets for a location and asset type
     */
    public function batchSave(Request $request, $locationId)
    {
        $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'rows' => 'array',
            'deleted' => 'array',
        ]);

        $assetTypeId = $request->input('asset_type_id');
        $assetsData = $request->input('rows', []);
        $deletedIds = $request->input('deleted', []);

        DB::transaction(function () use ($locationId, $assetTypeId, $assetsData, $deletedIds) {
            // Delete removed assets
            if (!empty($deletedIds)) {
                Asset::whereIn('id', $deletedIds)
                     ->where('location_id', $locationId)
                     ->where('asset_type_id', $assetTypeId)
                     ->delete();
            }

            // Update or Create assets
            foreach ($assetsData as $data) {
                // If it has a real ID (numeric or not starting with 'temp_')
                $isNew = isset($data['_isNew']) && $data['_isNew'] === true;
                $hasId = isset($data['id']) && !str_starts_with((string)$data['id'], 'temp_');
                
                // Clean up metadata
                unset($data['_isNew']);
                $id = $data['id'] ?? null;
                unset($data['id']);
                unset($data['location_id']);
                unset($data['location_name']);

                if (!$isNew && $hasId) {
                    // Update
                    Asset::where('id', $id)
                         ->where('location_id', $locationId)
                         ->where('asset_type_id', $assetTypeId)
                         ->update([
                             'data' => $data
                         ]);
                } else {
                    // Create
                    Asset::create([
                        'location_id' => $locationId,
                        'asset_type_id' => $assetTypeId,
                        'data' => $data
                    ]);
                }
            }
        });

        return response()->json(['message' => 'Assets saved successfully']);
    }

    /**
     * Batch save assets globally (from Assets.jsx)
     */
    public function globalBatchSave(Request $request)
    {
        $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'assets' => 'array',
            'deleted_ids' => 'array',
        ]);

        $assetTypeId = $request->input('asset_type_id');
        $assetsData = $request->input('assets', []);
        $deletedIds = $request->input('deleted_ids', []);

        DB::transaction(function () use ($assetTypeId, $assetsData, $deletedIds) {
            // Delete removed assets globally
            if (!empty($deletedIds)) {
                Asset::whereIn('id', $deletedIds)
                     ->where('asset_type_id', $assetTypeId)
                     ->delete();
            }

            // Update or Create assets
            foreach ($assetsData as $data) {
                $isNew = isset($data['_isNew']) && $data['_isNew'] === true;
                $hasId = isset($data['id']) && !str_starts_with((string)$data['id'], 'temp_');
                
                // Location ID is required for global save
                $locationId = $data['location_id'] ?? null;
                
                if (!$locationId && $isNew) {
                    continue; // Skip if no location selected for new asset
                }

                // Clean up metadata
                unset($data['_isNew']);
                $id = $data['id'] ?? null;
                unset($data['id']);
                unset($data['location_id']);
                unset($data['location_name']);

                if (!$isNew && $hasId) {
                    // Update
                    $updateData = ['data' => $data];
                    if ($locationId) {
                        $updateData['location_id'] = $locationId; // allow moving asset to another location
                    }
                    Asset::where('id', $id)
                         ->where('asset_type_id', $assetTypeId)
                         ->update($updateData);
                } else if ($locationId) {
                    // Create
                    Asset::create([
                        'location_id' => $locationId,
                        'asset_type_id' => $assetTypeId,
                        'data' => $data
                    ]);
                }
            }
        });

        return response()->json(['message' => 'Global assets saved successfully']);
    }
}
