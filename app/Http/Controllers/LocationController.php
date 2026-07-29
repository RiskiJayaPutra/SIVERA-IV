<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        // Fetch all locations without pagination to allow hierarchical rendering in frontend
        $locations = Location::with('parent')->withCount(['assets'])->orderBy('name')->get();
        
        return Inertia::render('Locations', [
            'locations' => [
                'data' => $locations, // Wrap in data to maintain frontend compatibility
                'total' => $locations->count()
            ],
        ]);
    }

    public function show(string $id)
    {
        $location = Location::with([
            'parent', 
            'children.assets', 
            'assets'
        ])->withCount(['assets'])->findOrFail($id);
        
        // Get child locations (units/resorts under this station)
        $children = Location::where('parent_id', $id)->withCount(['assets'])->get();
        
        // Get all asset types (schemas)
        $assetTypes = \App\Models\AssetType::all();
            
        // Get generic assets in this location
        $assets = \App\Models\Asset::where('location_id', $id)->get();
        
        // Get generic assets from children
        $childIds = $children->pluck('id')->toArray();
        $childAssets = \App\Models\Asset::with('location')
            ->whereIn('location_id', $childIds)
            ->get();

        return Inertia::render('LocationShow', [
            'location' => $location,
            'children' => $children,
            'assetTypes' => $assetTypes,
            'assets' => $assets,
            'childAssets' => $childAssets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:locations,id',
            'name' => 'required|string',
            'type' => 'required|string|in:stasiun,unit,resort',
            'parent_id' => 'nullable|string|exists:locations,id',
        ]);

        $validated['x'] = 0;
        $validated['y'] = 0;
        $validated['color'] = '#94A3B8';

        Location::create($validated);
        return redirect()->route('locations.index')->with('message', 'Location created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $location = Location::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string|in:stasiun,unit,resort',
            'parent_id' => 'nullable|string|exists:locations,id',
        ]);

        $location->update($validated);
        return redirect()->route('locations.index')->with('message', 'Location updated successfully.');
    }

    public function destroy(string $id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return redirect()->route('locations.index')->with('message', 'Location deleted successfully.');
    }
}
