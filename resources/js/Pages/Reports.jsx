import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditableAssetTable from '@/Components/EditableAssetTable';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Reports({ stats, assetTypes = [], locations = [], assets = {}, currentType, currentSchema, auth }) {
    
    const currentTab = assetTypes.find(t => t.slug === currentType);
    
    // Advanced Export States
    const [exportCategories, setExportCategories] = React.useState([]);
    const [exportLocations, setExportLocations] = React.useState([]);
    const [previewData, setPreviewData] = React.useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

    React.useEffect(() => {
        // Fetch Preview Data
        setIsPreviewLoading(true);
        axios.post(route('reports.preview'), {
            categories: exportCategories,
            locations: exportLocations
        }).then(res => {
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
        setExportLocations(prev => 
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
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
            { name: 'locations', value: JSON.stringify(exportLocations) }
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories Filter */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-slate-700 text-sm">Filter Kategori Aset</h4>
                            <button 
                                onClick={() => setExportCategories([])}
                                className="text-xs text-kai-blue hover:underline font-semibold"
                            >
                                Reset (Semua)
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {assetTypes.map(type => (
                                <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={exportCategories.includes(type.id)}
                                        onChange={() => handleCategoryToggle(type.id)}
                                        className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-4 h-4"
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
                                <button 
                                    onClick={() => setExportLocations([])}
                                    className="text-xs text-kai-blue hover:underline font-semibold"
                                >
                                    Reset (Semua)
                                </button>
                            )}
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {auth?.user?.role === 'Admin Lokasi' ? (
                                <div className="text-xs font-semibold text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                                    Otorisasi Lokasi: Terbatas pada wilayah Anda.
                                </div>
                            ) : (
                                locations.map(loc => (
                                    <label key={loc.id} className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={exportLocations.includes(loc.id)}
                                            onChange={() => handleLocationToggle(loc.id)}
                                            className="rounded text-kai-blue focus:ring-kai-blue border-slate-300 w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-kai-blue transition truncate" title={loc.name}>{loc.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Preview & Action */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-800 text-white flex flex-col relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full"></div>
                        <h4 className="font-semibold text-slate-200 text-sm mb-4 relative z-10">Preview Laporan</h4>
                        
                        {isPreviewLoading ? (
                            <div className="flex-1 flex items-center justify-center relative z-10">
                                <i className="fa-solid fa-spinner fa-spin text-2xl text-kai-orange"></i>
                            </div>
                        ) : (
                            <div className="flex-1 relative z-10">
                                <div className="mb-4">
                                    <p className="text-xs text-slate-400 mb-1">Total Data Ekspor</p>
                                    <p className="text-3xl font-black text-white">{previewData?.total || 0} <span className="text-sm font-normal text-slate-300">Aset</span></p>
                                </div>
                                
                                {previewData?.categories?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {previewData.categories.map(c => (
                                            <span key={c.name} className="px-2 py-1 rounded bg-white/10 text-xs font-semibold">
                                                {c.name}: {c.count}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                                    <i className="fa-solid fa-file-excel"></i> Download Excel Terpadu
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
