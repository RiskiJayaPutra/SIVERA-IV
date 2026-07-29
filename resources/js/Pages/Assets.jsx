import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditableAssetTable from '@/Components/EditableAssetTable';
import Modal from '@/Components/Modal';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Assets({ assetTypes = [], assets = [], totalAssets = 0, currentType, currentSchema, locations = [], locationPagination = null, filters = {} }) {
    
    const currentTab = assetTypes.find(t => t.slug === currentType);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedLocs, setSelectedLocs] = useState(filters.locations || []);
    const [showLocDropdown, setShowLocDropdown] = useState(false);
    const [modalSearch, setModalSearch] = useState('');
    const [globalLocSearch, setGlobalLocSearch] = useState(filters.search_location || '');
    const [locSearchFocused, setLocSearchFocused] = useState(false);

    const handleTabChange = (typeSlug) => {
        router.get(route('assets.index'), { asset_type: typeSlug }, { preserveState: true, preserveScroll: true });
    };

    const applyFilters = (newSearch, newSearchLoc, newLocs) => {
        router.get(route('assets.index'), { 
            asset_type: currentType, 
            search: newSearch, 
            search_location: newSearchLoc,
            locations: newLocs 
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const renderTable = () => {
        if (!currentTab || !currentSchema) return null;

        // Ensure assets is an array (since we removed pagination on backend, it's a flat array now)
        const assetsList = Array.isArray(assets) ? assets : (assets.data || []);

        // Filter locations based on selection or pagination
        let displayLocations = [];
        
        if (selectedLocs.length > 0) {
            displayLocations = locations.filter(l => selectedLocs.includes(l.id.toString()));
        } else if (globalLocSearch) {
            displayLocations = locations.filter(l => l.name.toLowerCase().includes(globalLocSearch.toLowerCase()));
        } else if (search) {
            // If searching, only display locations that have matching assets
            const matchingLocIds = [...new Set(assetsList.map(a => a.location_id))];
            displayLocations = locations.filter(l => matchingLocIds.includes(l.id));
        } else if (locationPagination && locationPagination.data) {
            // No filters: Use paginated locations from backend
            const paginatedIds = locationPagination.data.map(l => l.id);
            displayLocations = locations.filter(l => paginatedIds.includes(l.id));
        } else {
            // Fallback
            displayLocations = locations;
        }

        // Group assets by location
        const groupedAssets = {};
        assetsList.forEach(row => {
            if (!groupedAssets[row.location_id]) groupedAssets[row.location_id] = [];
            groupedAssets[row.location_id].push({
                id: row.id,
                ...row.data
            });
        });

        const columns = [
            { key: '_no', label: 'No', type: 'display' },
            ...(currentSchema.columns || []).filter(c => c.key !== '_no') // avoid double No
        ];

        if (displayLocations.length === 0) {
            return (
                <div className="p-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                    <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i>
                    <p className="font-semibold text-sm">Tidak ada wilayah yang sesuai dengan filter.</p>
                </div>
            );
        }

        // Build hierarchy
        const roots = displayLocations.filter(l => !l.parent_id);
        const childrenLocs = displayLocations.filter(l => l.parent_id);
        
        // Include children whose parent is not in displayLocations (orphans in current view)
        const rootIds = new Set(roots.map(r => r.id));
        const orphans = childrenLocs.filter(c => !rootIds.has(c.parent_id));
        roots.push(...orphans);

        return roots.map((root, index) => {
            const rootAssets = groupedAssets[root.id] || [];
            const myChildren = childrenLocs.filter(c => c.parent_id === root.id);
            
            return (
                <div key={root.id} className={index > 0 ? 'mt-8 border-t-2 border-slate-100 pt-8' : ''}>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <i className="fa-solid fa-building text-kai-blue"></i>
                            {root.name}
                        </h2>
                    </div>

                    <EditableAssetTable 
                        title={`Aset ${currentTab.name} Induk`} 
                        locationName={root.name}
                        icon={currentTab.icon} 
                        data={rootAssets} 
                        columns={columns} 
                        headerGroups={currentSchema.headerGroups} 
                        readOnly={false}
                        isGlobalMode={false}
                        locationId={root.id}
                        assetTypeId={currentTab.id}
                        batchRoute="assets.batch"
                    />

                    {myChildren.map(child => {
                        const childAssets = groupedAssets[child.id] || [];
                        return (
                            <div key={child.id} className="mt-4 pl-4 md:pl-8 border-l-2 border-slate-200">
                                <EditableAssetTable 
                                    title={`Aset ${currentTab.name}`} 
                                    locationName={child.name}
                                    icon={currentTab.icon} 
                                    data={childAssets} 
                                    columns={columns} 
                                    headerGroups={currentSchema.headerGroups} 
                                    readOnly={false}
                                    isGlobalMode={false}
                                    locationId={child.id}
                                    assetTypeId={currentTab.id}
                                    batchRoute="assets.batch"
                                />
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    return (
        <AuthenticatedLayout headerTitle={`Data ${currentTab?.name || 'Aset'}`} headerSubtitle={`Total ${totalAssets} aset terdaftar`}>
            <Head title={`Master ${currentTab?.name || 'Aset'} - SIVERA IV`} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 fade-in overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap bg-white rounded-xl shadow-sm border border-slate-100 p-1">
                        {assetTypes.map(tab => (
                            <button
                                key={tab.slug}
                                onClick={() => handleTabChange(tab.slug)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
                                    currentType === tab.slug 
                                        ? 'bg-kai-blue text-white shadow-sm' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-kai-blue'
                                }`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="border-b border-slate-100 bg-white p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-64">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Cari aset..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') applyFilters(search, globalLocSearch, selectedLocs);
                            }}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border-0 rounded-lg text-xs focus:ring-2 focus:ring-kai-blue transition"
                        />
                    </div>
                    <div className="relative w-full md:w-64 z-20">
                        <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Cari wilayah..." 
                            value={globalLocSearch}
                            onChange={(e) => setGlobalLocSearch(e.target.value)}
                            onFocus={() => setLocSearchFocused(true)}
                            onBlur={() => setTimeout(() => setLocSearchFocused(false), 200)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') applyFilters(search, globalLocSearch, selectedLocs);
                            }}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border-0 rounded-lg text-xs focus:ring-2 focus:ring-kai-blue transition"
                        />
                        {/* Autocomplete Dropdown */}
                        {locSearchFocused && globalLocSearch.length > 0 && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-slate-100 max-h-48 overflow-y-auto z-50 py-1">
                                {locations
                                    .filter(l => l.name.toLowerCase().includes(globalLocSearch.toLowerCase()))
                                    .map((loc, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs text-slate-700 transition"
                                            onClick={() => {
                                                setGlobalLocSearch(loc.name);
                                                applyFilters(search, loc.name, selectedLocs);
                                            }}
                                        >
                                            <i className="fa-solid fa-location-dot text-slate-300 mr-2"></i>
                                            {loc.name}
                                        </button>
                                    ))}
                                {locations.filter(l => l.name.toLowerCase().includes(globalLocSearch.toLowerCase())).length === 0 && (
                                    <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                        Wilayah tidak ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative w-full md:w-64 z-10">
                        <button
                            type="button"
                            onClick={() => setShowLocDropdown(true)}
                            className="w-full bg-slate-50 border-0 rounded-lg text-xs py-2 px-3 focus:ring-2 focus:ring-kai-blue text-left flex items-center justify-between transition"
                        >
                            <span className="text-slate-600 truncate">
                                {selectedLocs.length === 0 
                                    ? 'Filter Lokasi (Semua)' 
                                    : `${selectedLocs.length} Wilayah Dipilih`}
                            </span>
                            <i className="fa-solid fa-chevron-down text-slate-400"></i>
                        </button>
                        
                        <Modal show={showLocDropdown} onClose={() => setShowLocDropdown(false)} maxWidth="2xl">
                            <div className="p-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                    <h2 className="text-lg font-bold text-slate-800">Pilih Wilayah (Lokasi)</h2>
                                    <button onClick={() => setShowLocDropdown(false)} className="text-slate-400 hover:text-slate-600">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                
                                <div className="mb-4 relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Cari wilayah..." 
                                        value={modalSearch}
                                        onChange={(e) => setModalSearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-kai-blue transition"
                                    />
                                </div>
                                
                                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
                                    {locations.filter(l => !l.parent_id).filter(loc => loc.name.toLowerCase().includes(modalSearch.toLowerCase()) || locations.some(c => c.parent_id === loc.id && c.name.toLowerCase().includes(modalSearch.toLowerCase()))).map(loc => {
                                        const isChecked = selectedLocs.includes(loc.id.toString());
                                        const myChildren = locations.filter(c => c.parent_id === loc.id);
                                        const matchesSearch = loc.name.toLowerCase().includes(modalSearch.toLowerCase());
                                        
                                        // Skip parent if it doesn't match and none of its children match
                                        if (!matchesSearch && !myChildren.some(c => c.name.toLowerCase().includes(modalSearch.toLowerCase()))) return null;

                                        return (
                                            <div key={loc.id} className="border border-slate-100 rounded-xl overflow-hidden">
                                                <label className={`flex items-center gap-3 p-3 cursor-pointer transition ${isChecked ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedLocs([...selectedLocs, loc.id.toString()]);
                                                            } else {
                                                                setSelectedLocs(selectedLocs.filter(id => id !== loc.id.toString()));
                                                            }
                                                        }}
                                                        className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-4 h-4 shrink-0 cursor-pointer"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">{loc.name}</span>
                                                    </div>
                                                </label>
                                                {myChildren.length > 0 && (
                                                    <div className="bg-slate-50/50 p-2 pl-10 flex flex-col gap-1 border-t border-slate-100">
                                                        {myChildren.filter(c => c.name.toLowerCase().includes(modalSearch.toLowerCase()) || matchesSearch).map(child => {
                                                            const isChildChecked = selectedLocs.includes(child.id.toString());
                                                            return (
                                                                <label key={child.id} className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition ${isChildChecked ? 'bg-blue-50/30' : 'hover:bg-slate-100'}`}>
                                                                    <input 
                                                                        type="checkbox"
                                                                        checked={isChildChecked}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedLocs([...selectedLocs, child.id.toString()]);
                                                                            } else {
                                                                                setSelectedLocs(selectedLocs.filter(id => id !== child.id.toString()));
                                                                            }
                                                                        }}
                                                                        className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-3.5 h-3.5 shrink-0 cursor-pointer"
                                                                    />
                                                                    <span className="text-xs font-semibold text-slate-600">{child.name}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={() => setSelectedLocs([])}
                                        className="text-xs text-rose-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
                                    >
                                        Bersihkan Pilihan
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowLocDropdown(false);
                                            applyFilters(search, globalLocSearch, selectedLocs);
                                        }}
                                        className="text-xs bg-kai-blue hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
                                    >
                                        Terapkan Filter
                                    </button>
                                </div>
                            </div>
                        </Modal>
                        
                        {selectedLocs.length > 0 && (
                            <div className="absolute -top-2 -right-2 bg-kai-blue text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow">
                                {selectedLocs.length}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => applyFilters(search, globalLocSearch, selectedLocs)}
                            className="px-4 py-2 bg-kai-blue text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
                        >
                            Terapkan Filter
                        </button>
                        {(search || globalLocSearch || selectedLocs.length > 0) && (
                            <button 
                                onClick={() => {
                                    setSearch('');
                                    setGlobalLocSearch('');
                                    setSelectedLocs([]);
                                    applyFilters('', '', []);
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-lg transition w-full md:w-auto"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-5 overflow-x-auto">
                    {renderTable()}
                    
                    {/* Pagination for Locations (Tables) */}
                    {locationPagination && locationPagination.links && locationPagination.last_page > 1 && (
                        <div className="flex flex-col items-center justify-center mt-8 border-t border-slate-100 pt-6">
                            <span className="text-xs text-slate-400 font-semibold mb-3">
                                Halaman Wilayah ({locationPagination.current_page} dari {locationPagination.last_page})
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                {locationPagination.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url ? router.get(link.url, {}, { preserveState: true, preserveScroll: true }) : null}
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                                            link.active 
                                                ? 'bg-kai-blue text-white shadow-sm shadow-kai-blue/30' 
                                                : link.url ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label.replace('Previous', '<i class="fa-solid fa-chevron-left"></i>').replace('Next', '<i class="fa-solid fa-chevron-right"></i>') }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {assetTypes.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <i className="fa-solid fa-layer-group text-4xl mb-3 opacity-30"></i>
                            <p>Belum ada skema aset yang dibuat.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
