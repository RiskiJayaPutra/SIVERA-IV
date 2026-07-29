<?php

namespace App\Http\Controllers;

use App\Models\AssetType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AssetTypeController extends Controller
{
    public function index()
    {
        $assetTypes = AssetType::all();
        
        return Inertia::render('AssetTypes/Index', [
            'assetTypes' => $assetTypes
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetTypes/Builder');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'schema' => 'required|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        AssetType::create($validated);

        return redirect()->route('asset-types.index')->with('success', 'Tipe aset berhasil dibuat.');
    }

    public function edit(AssetType $assetType)
    {
        return Inertia::render('AssetTypes/Builder', [
            'assetType' => $assetType
        ]);
    }

    public function update(Request $request, AssetType $assetType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'schema' => 'required|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $assetType->update($validated);

        return redirect()->route('asset-types.index')->with('success', 'Tipe aset berhasil diperbarui.');
    }

    public function destroy(AssetType $assetType)
    {
        $assetType->delete();
        return redirect()->route('asset-types.index')->with('success', 'Tipe aset berhasil dihapus.');
    }
}
