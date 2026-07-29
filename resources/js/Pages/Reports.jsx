import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditableAssetTable from '@/Components/EditableAssetTable';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import Swal from 'sweetalert2';

export default function Reports({ stats, assetTypes = [], assets = {}, currentType, currentSchema }) {
    
    const currentTab = assetTypes.find(t => t.slug === currentType);

    const handleTabChange = (typeSlug) => {
        router.get(route('reports.index'), { asset_type: typeSlug }, { preserveScroll: true });
    };

    const handleExport = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Menyiapkan Export',
            text: `Sedang menyusun data Excel untuk ${currentTab?.name}...`,
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        });

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('reports.export');

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);

        const typeInput = document.createElement('input');
        typeInput.type = 'hidden';
        typeInput.name = 'asset_type';
        typeInput.value = currentType;
        form.appendChild(typeInput);

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

                    {currentTab && (
                        <button 
                            onClick={handleExport}
                            className="bg-kai-orange text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-orange-600 transition flex items-center justify-center gap-2 shrink-0"
                        >
                            <i className="fa-solid fa-file-excel"></i> Export Excel {currentTab.name}
                        </button>
                    )}
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
