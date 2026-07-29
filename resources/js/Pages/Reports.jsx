import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditableAssetTable from '@/Components/EditableAssetTable';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from '@/Components/Modal';

export default function Reports({ stats, assetTypes = [], locations = [], assets = {}, currentType, currentSchema, auth }) {
    
    const currentTab = assetTypes.find(t => t.slug === currentType);
    
    // Advanced Export States
    const [exportCategories, setExportCategories] = useState([]);
    const [exportLocations, setExportLocations] = useState(() => {
        // Parse locations from URL if any
        const params = new URLSearchParams(window.location.search);
        const locs = params.get('locations');
        return locs ? locs.split(',').map(Number) : [];
    });
    const [exportFormat, setExportFormat] = useState('combined');
    const [showEmptyLocations, setShowEmptyLocations] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    
    // Modal states
    const [showLocDropdown, setShowLocDropdown] = useState(false);
    const [modalSearch, setModalSearch] = useState('');

    useEffect(() => {
        // Fetch Preview Data
        setIsPreviewLoading(true);
        const payload = { 
            categories: exportCategories, 
            locations: exportLocations,
            format: exportFormat,
            show_empty: showEmptyLocations
        };
        axios.post(route('reports.preview'), payload).then(res => {
            setPreviewData(res.data);
            setIsPreviewLoading(false);
        }).catch(err => {
            console.error(err);
            setIsPreviewLoading(false);
        });
    }, [exportCategories, exportLocations]);

    const handleCategoryToggle = (id) => {
        setExportCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleLocationToggle = (id) => {
        const newLocs = exportLocations.includes(id) 
            ? exportLocations.filter(l => l !== id) 
            : [...exportLocations, id];
        
        setExportLocations(newLocs);
        
        // Dynamically update the table below
        router.get(route('reports.index'), {
            asset_type: currentType,
            locations: newLocs.join(',')
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['assets']
        });
    };

    const handleClearLocations = () => {
        setExportLocations([]);
        router.get(route('reports.index'), {
            asset_type: currentType,
            locations: ''
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['assets']
        });
    };

    const handleTabChange = (typeSlug) => {
        router.get(route('reports.index'), { asset_type: typeSlug }, { preserveScroll: true });
    };

    const handleExport = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Menyiapkan Export',
            text: `Sedang menyusun data Excel terpadu...`,
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        });

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('reports.export');

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        const inputs = [
            { name: '_token', value: csrfToken },
            { name: 'categories', value: JSON.stringify(exportCategories) },
            { name: 'locations', value: JSON.stringify(exportLocations) },
            { name: 'format', value: exportFormat },
            { name: 'show_empty', value: showEmptyLocations }
        ];

        inputs.forEach(inputData => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = inputData.name;
            input.value = inputData.value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const renderTable = () => {
        if (!currentTab || !currentSchema) return null;

        if (exportFormat === 'grouped') {
            // Group the data by location_id
            const grouped = {};
            (assets.data || []).forEach(row => {
                const locId = row.location_id;
                if (!grouped[locId]) {
                    grouped[locId] = {
                        name: row.location?.name || '-',
                        data: []
                    };
                }
                grouped[locId].data.push({
                    id: row.id,
                    location_id: row.location_id,
                    location_name: row.location?.name || '-',
                    ...row.data
                });
            });

            const columns = [
                { key: '_no', label: 'No', type: 'display' },
                ...(currentSchema.columns || []).filter(c => c.key !== '_no')
            ];

            const sortedLocIds = Object.keys(grouped).sort((a,b) => grouped[a].name.localeCompare(grouped[b].name));
            
            if (sortedLocIds.length === 0) {
                return (
                     <div className="text-center py-12 text-slate-400">
                         <i className="fa-solid fa-folder-open text-4xl mb-3 opacity-30"></i>
                         <p>Belum ada aset untuk laporan ini.</p>
                     </div>
                );
            }

            return (
                <div className="space-y-8">
                    {sortedLocIds.map(locId => (
                        <EditableAssetTable 
                            key={locId}
                            title={`Laporan ${currentTab.name}`} 
                            icon={currentTab.icon}
                            locationName={grouped[locId].name}
                            data={grouped[locId].data} 
                            columns={columns} 
                            headerGroups={currentSchema.headerGroups} 
                            readOnly={true} 
                        />
                    ))}
                </div>
            );
        }

        // Inject location_name for global table display
        const tableData = (assets.data || []).map(row => ({
            id: row.id,
            location_id: row.location_id,
            location_name: row.location?.name || '-',
            ...row.data
        }));

        // Dynamically prepend Location column if it doesn't exist in schema
        const columns = [
            { key: '_no', label: 'No', type: 'display' },
            { key: 'location_name', label: 'Lokasi', type: 'text', _readOnly: true },
            ...(currentSchema.columns || []).filter(c => c.key !== '_no')
        ];

        return (
            <EditableAssetTable 
                title={`Laporan ${currentTab.name}`} 
                icon={currentTab.icon} 
                data={tableData} 
                columns={columns} 
                headerGroups={currentSchema.headerGroups} 
                readOnly={true} 
            />
        );
    };

    return (
        <AuthenticatedLayout headerTitle="Laporan Aset" headerSubtitle="Ringkasan dan ekspor data">
            <Head title="Laporan Aset - SIVERA IV" />

            {/* Global Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-kai-blue/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-kai-blue/10 text-kai-blue flex items-center justify-center">
                                <i className="fa-solid fa-server"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Aset</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800">{stats.totalAssets}</h3>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100/50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Kondisi Baik</span>
                        </div>
                        <h3 className="text-3xl font-black text-emerald-800">{stats.statBaik}</h3>
                    </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100/50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                <i className="fa-solid fa-wrench"></i>
                            </div>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Perawatan</span>
                        </div>
                        <h3 className="text-3xl font-black text-amber-800">{stats.statPerawatan}</h3>
                    </div>
                </div>

                <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-100/50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Rusak</span>
                        </div>
                        <h3 className="text-3xl font-black text-rose-800">{stats.statRusak}</h3>
                    </div>
                </div>
            </div>

            {/* Advanced Export Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6 fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-file-export text-kai-orange"></i> Advanced Export Laporan
                </h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Filters & Options Column */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Categories Filter */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-slate-700 text-sm">Filter Kategori Aset</h4>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setExportCategories(assetTypes.map(t => t.id))}
                                            className="text-xs text-kai-blue hover:underline font-semibold"
                                        >
                                            Pilih Semua
                                        </button>
                                        <span className="text-slate-300">|</span>
                                        <button 
                                            onClick={() => setExportCategories([])}
                                            className="text-xs text-rose-500 hover:underline font-semibold"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar px-1 py-1">
                                    {assetTypes.map(type => (
                                        <label key={type.id} className="flex items-center gap-2 cursor-pointer group p-1 rounded hover:bg-slate-50 transition">
                                            <input 
                                                type="checkbox" 
                                                checked={exportCategories.includes(type.id)}
                                                onChange={() => handleCategoryToggle(type.id)}
                                                className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-4 h-4 shrink-0 cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-kai-blue transition">{type.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Locations Filter */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-slate-700 text-sm">Filter Lokasi</h4>
                                    {auth?.user?.role !== 'Admin Lokasi' && (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setExportLocations(locations.map(l => l.id))}
                                                className="text-xs text-kai-blue hover:underline font-semibold"
                                            >
                                                Pilih Semua
                                            </button>
                                            <span className="text-slate-300">|</span>
                                            <button 
                                                onClick={handleClearLocations}
                                                className="text-xs text-rose-500 hover:underline font-semibold"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {auth?.user?.role === 'Admin Lokasi' ? (
                                    <div className="text-xs font-semibold text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                                        Otorisasi Lokasi: Terbatas pada wilayah Anda.
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowLocDropdown(true)}
                                            className="w-full bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 hover:border-kai-blue focus:ring-2 focus:ring-kai-blue text-left flex items-center justify-between transition"
                                        >
                                            <span className="text-slate-600 truncate">
                                                {exportLocations.length === 0 
                                                    ? 'Pilih Wilayah (Semua)' 
                                                    : `${exportLocations.length} Wilayah Dipilih`}
                                            </span>
                                            <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                                        </button>
                                        
                                        <Modal show={showLocDropdown} onClose={() => setShowLocDropdown(false)} maxWidth="2xl">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                                    <h2 className="text-lg font-bold text-slate-800">Pilih Wilayah (Lokasi)</h2>
                                                    <button onClick={() => setShowLocDropdown(false)} className="text-slate-400 hover:text-slate-600 transition">
                                                        <i className="fa-solid fa-xmark text-xl"></i>
                                                    </button>
                                                </div>
                                                
                                                <div className="mb-4 relative">
                                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Cari wilayah..." 
                                                        value={modalSearch}
                                                        onChange={(e) => setModalSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-kai-blue transition"
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                                                    {locations.filter(loc => loc.name.toLowerCase().includes(modalSearch.toLowerCase())).map(loc => {
                                                        const isChecked = exportLocations.includes(loc.id);
                                                        return (
                                                            <label 
                                                                key={loc.id} 
                                                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition border ${isChecked ? 'border-kai-blue bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}
                                                            >
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => handleLocationToggle(loc.id)}
                                                                    className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-4 h-4 shrink-0 cursor-pointer"
                                                                />
                                                                <span className="text-sm font-semibold text-slate-700 truncate" title={loc.name}>{loc.name}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setExportLocations(locations.map(l => l.id))}
                                                            className="text-sm text-kai-blue hover:text-blue-700 font-bold px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                                                        >
                                                            Pilih Semua
                                                        </button>
                                                        <button 
                                                            onClick={handleClearLocations}
                                                            className="text-sm text-rose-500 hover:text-rose-600 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition"
                                                        >
                                                            Bersihkan Pilihan
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowLocDropdown(false)}
                                                        className="bg-kai-blue text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition"
                                                    >
                                                        Terapkan
                                                    </button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Format Export */}
                        <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50">
                            <h4 className="font-semibold text-slate-700 text-sm mb-4">Pengaturan Format Laporan Excel</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${exportFormat === 'combined' ? 'border-kai-blue bg-blue-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                    <input type="radio" name="exportFormat" value="combined" checked={exportFormat === 'combined'} onChange={(e) => setExportFormat(e.target.value)} className="sr-only" />
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <i className={`fa-solid fa-table-cells-large ${exportFormat === 'combined' ? 'text-kai-blue' : 'text-slate-400'}`}></i>
                                            <span className="font-bold text-slate-800 text-sm">Tabel Gabungan</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportFormat === 'combined' ? 'border-kai-blue' : 'border-slate-300'}`}>
                                            {exportFormat === 'combined' && <div className="w-2 h-2 rounded-full bg-kai-blue"></div>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 ml-6">Seluruh aset digabung dalam 1 sheet. Ideal untuk <span className="font-semibold text-slate-700">Pivot Table / Analisis</span>.</p>
                                </label>

                                <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${exportFormat === 'grouped' ? 'border-kai-blue bg-blue-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                    <input type="radio" name="exportFormat" value="grouped" checked={exportFormat === 'grouped'} onChange={(e) => setExportFormat(e.target.value)} className="sr-only" />
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <i className={`fa-solid fa-list-ul ${exportFormat === 'grouped' ? 'text-kai-blue' : 'text-slate-400'}`}></i>
                                            <span className="font-bold text-slate-800 text-sm">Tabel Dipisah per Lokasi</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportFormat === 'grouped' ? 'border-kai-blue' : 'border-slate-300'}`}>
                                            {exportFormat === 'grouped' && <div className="w-2 h-2 rounded-full bg-kai-blue"></div>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 ml-6">Data dikelompokkan per stasiun. Ideal untuk <span className="font-semibold text-slate-700">Audit & Checklist Lapangan</span>.</p>
                                </label>
                            </div>

                            {/* Show Empty Locations Option (only for grouped) */}
                            {exportFormat === 'grouped' && (
                                <div className="mt-4 pt-4 border-t border-slate-200 fade-in flex items-center justify-between bg-white p-3 rounded-lg border">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Tampilkan lokasi tanpa data</p>
                                        <p className="text-xs text-slate-500">Cetak tulisan "Belum ada aset" sebagai bukti audit jika nihil.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={showEmptyLocations} onChange={(e) => setShowEmptyLocations(e.target.checked)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-kai-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kai-blue"></div>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview & Action Column */}
                    <div className="border border-slate-100 rounded-xl p-5 bg-slate-800 text-white flex flex-col relative overflow-hidden h-full">
                        <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute -left-10 bottom-10 w-24 h-24 bg-kai-blue/20 rounded-full blur-xl pointer-events-none"></div>
                        
                        <h4 className="font-semibold text-slate-200 text-sm mb-4 relative z-10 flex items-center gap-2">
                            <i className="fa-solid fa-eye text-kai-blue"></i> Preview Hasil Export
                        </h4>
                        
                        {isPreviewLoading ? (
                            <div className="flex-1 flex items-center justify-center relative z-10 py-10">
                                <i className="fa-solid fa-spinner fa-spin text-3xl text-kai-blue"></i>
                            </div>
                        ) : (
                            <div className="flex-1 relative z-10 flex flex-col">
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Data Aset</p>
                                        <p className="text-2xl font-black text-white">{previewData?.total || 0}</p>
                                    </div>
                                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Lokasi</p>
                                        <p className="text-2xl font-black text-white">{previewData?.locations?.length || 0}</p>
                                    </div>
                                </div>
                                
                                <div className="mb-5">
                                    <p className="text-xs text-slate-400 mb-2">Workbook yang terbentuk ({previewData?.categories?.length || 0} Sheet):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {previewData?.categories?.length > 0 ? previewData.categories.map(c => (
                                            <span key={c.name} className="px-2 py-1 rounded bg-kai-blue/20 text-kai-blue border border-kai-blue/30 text-xs font-semibold flex items-center gap-1">
                                                <i className="fa-regular fa-file-excel"></i> {c.name}
                                            </span>
                                        )) : <span className="text-xs text-slate-500 italic">Semua Kategori</span>}
                                    </div>
                                </div>

                                <div className="mb-6 bg-slate-700/30 p-3 rounded-lg border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-1">Format Layout:</p>
                                    <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                                        <i className="fa-solid fa-layer-group"></i> {previewData?.format_desc || 'Tabel Gabungan'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-auto relative z-10">
                            {auth?.user?.role === 'Viewer' ? (
                                <button disabled className="w-full bg-slate-700 text-slate-400 px-5 py-3 rounded-lg text-sm font-bold cursor-not-allowed">
                                    <i className="fa-solid fa-lock mr-2"></i> Tidak Ada Akses Ekspor
                                </button>
                            ) : (
                                <button 
                                    onClick={handleExport}
                                    disabled={!previewData || previewData.total === 0 || isPreviewLoading}
                                    className="w-full bg-kai-orange text-white px-5 py-3 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-file-excel text-lg"></i> Download Laporan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                                Laporan {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5 overflow-x-auto">
                    {renderTable()}
                    
                    {/* Pagination for Inertia Data */}
                    {assets?.links && assets.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-6 border-t border-slate-100 pt-5">
                            {assets.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url ? router.get(link.url, {}, { preserveScroll: true }) : null}
                                    disabled={!link.url}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                        link.active 
                                            ? 'bg-kai-blue text-white shadow-sm shadow-kai-blue/30' 
                                            : link.url ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label.replace('Previous', '<i class="fa-solid fa-chevron-left"></i>').replace('Next', '<i class="fa-solid fa-chevron-right"></i>') }}
                                />
                            ))}
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
