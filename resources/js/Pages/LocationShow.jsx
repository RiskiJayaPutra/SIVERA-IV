import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditableAssetTable from '@/Components/EditableAssetTable';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function LocationShow({ 
    location, 
    children = [], 
    assetTypes = [],
    assets = [],
    childAssets = []
}) {
    // Transform legacy flat schema with headerGroups into new nested group schema
    const getInitialSchema = (schema) => {
        if (!schema) return { columns: [] };
        const parsed = JSON.parse(JSON.stringify(schema)); // deep clone
        if (!parsed.headerGroups || parsed.headerGroups.length === 0) return parsed;
        
        const newColumns = [];
        const groupMap = {};
        
        (parsed.columns || []).forEach(col => {
            if (col.headerGroup) {
                if (!groupMap[col.headerGroup]) {
                    const legacyGroupInfo = parsed.headerGroups.find(g => g.id === col.headerGroup);
                    const groupCol = {
                        key: `group_${col.headerGroup}`,
                        label: legacyGroupInfo ? legacyGroupInfo.label : 'Group',
                        type: 'group',
                        subColumns: []
                    };
                    groupMap[col.headerGroup] = groupCol;
                    newColumns.push(groupCol);
                }
                const subCol = { ...col };
                delete subCol.headerGroup;
                groupMap[col.headerGroup].subColumns.push(subCol);
            } else {
                newColumns.push(col);
            }
        });
        
        return { columns: newColumns };
    };
    // Default to the first asset type if available
    const [currentTab, setCurrentTab] = useState(assetTypes.length > 0 ? assetTypes[0].slug : null);

    const allAssets = [...assets, ...childAssets];

    // Compute basic stats globally across all asset types
    // Since condition fields might vary, we check 'status', 'condition', 'facility_condition' inside data JSON.
    const getStatCount = (conditionCheck) => {
        return allAssets.filter(asset => {
            const data = asset.data || {};
            // Look for common status fields
            const val = data.status || data.condition || data.facility_condition || data.kondisi;
            if (!val) return false;
            return conditionCheck(val);
        }).length;
    };

    const statBaik = getStatCount(v => v === 'Baik' || v === 'Aktif');
    const statPerawatan = getStatCount(v => v === 'Perawatan');
    const statRusak = getStatCount(v => v === 'Rusak' || v === 'Tidak Aktif');

    const typeLabel = location.type === 'stasiun' ? 'Stasiun' : location.type === 'resort' ? 'Resort' : 'Unit';
    const typeColor = location.type === 'stasiun' ? 'bg-kai-blue/10 text-kai-blue' : location.type === 'resort' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700';
    const totalSemuaAset = allAssets.length;

    const handleSaveAssets = async (typeId, updatedData, deletedIds) => {
        try {
            await axios.post(route('assets.batch', location.id), {
                asset_type_id: typeId,
                assets: updatedData,
                deleted_ids: deletedIds
            });
            
            Swal.fire({
                title: 'Berhasil!',
                text: 'Data aset berhasil disimpan.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            
            router.reload({ only: ['assets', 'childAssets'] });
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const activeType = assetTypes.find(t => t.slug === currentTab);

    return (
        <AuthenticatedLayout headerTitle={location.name} headerSubtitle={`${typeLabel} — ${totalSemuaAset} aset terdaftar`}>
            <Head title={`${location.name} - SIVERA IV`} />

            {/* Header Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-kai-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm relative z-10">
                    <i className={`fa-solid ${location.type === 'stasiun' ? 'fa-train-subway' : location.type === 'resort' ? 'fa-house-chimney' : 'fa-building'} text-2xl ${location.type === 'stasiun' ? 'text-kai-blue' : location.type === 'resort' ? 'text-purple-500' : 'text-amber-500'}`}></i>
                </div>
                <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeColor}`}>
                            {typeLabel}
                        </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{location.name}</h2>
                    {location.parent && (
                        <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                            <i className="fa-solid fa-turn-up fa-rotate-90 text-slate-400"></i>
                            Induk: <Link href={route('locations.show', location.parent.id)} className="text-kai-blue hover:underline">{location.parent.name}</Link>
                        </p>
                    )}
                </div>
                
                <div className="flex gap-2 w-full md:w-auto relative z-10 overflow-x-auto pb-2 md:pb-0">
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3 min-w-[120px]">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-inner"><i className="fa-solid fa-check-circle"></i></div>
                        <div><p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Baik</p><p className="text-xl font-extrabold text-emerald-700 leading-none">{statBaik}</p></div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-center gap-3 min-w-[120px]">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg shadow-inner"><i className="fa-solid fa-wrench"></i></div>
                        <div><p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Rawat</p><p className="text-xl font-extrabold text-amber-700 leading-none">{statPerawatan}</p></div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-center gap-3 min-w-[120px]">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg shadow-inner"><i className="fa-solid fa-triangle-exclamation"></i></div>
                        <div><p className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">Rusak</p><p className="text-xl font-extrabold text-rose-700 leading-none">{statRusak}</p></div>
                    </div>
                </div>
            </div>

            {/* Child Locations (If Stasiun) */}
            {children.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 fade-in" style={{animationDelay: '0.1s'}}>
                    {children.map(child => (
                        <Link key={child.id} href={route('locations.show', child.id)} className="bg-white border border-slate-100 p-4 rounded-2xl hover:border-kai-blue/30 hover:shadow-md transition group flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-kai-blue/10 group-hover:text-kai-blue flex items-center justify-center text-lg transition border border-slate-100">
                                <i className={`fa-solid ${child.type === 'resort' ? 'fa-house-chimney' : 'fa-building'}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-700 text-sm truncate group-hover:text-kai-blue transition">{child.name}</h3>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase">{child.type}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {child.assets_count}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Asset Management Area */}
            {assetTypes.length > 0 ? (
                <div className="mt-4 bg-white rounded-3xl shadow-sm border border-slate-100 fade-in overflow-hidden" style={{animationDelay: '0.2s'}}>
                    {/* Tabs */}
                    <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap bg-white rounded-xl shadow-sm border border-slate-100 p-1">
                            {assetTypes.map(tab => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setCurrentTab(tab.slug)}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
                                        currentTab === tab.slug 
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

                    <div className="p-4 sm:p-6">
                        {activeType && (
                                <EditableAssetTable
                                    key={activeType.id}
                                    title={activeType.name}
                                    icon={activeType.icon}
                                    columns={getInitialSchema(activeType.schema).columns}
                                    data={allAssets
                                    .filter(a => a.asset_type_id === activeType.id)
                                    .map(a => ({ id: a.id, location_id: a.location_id, location_name: a.location?.name, ...a.data }))
                                }
                                onSave={(data, deleted) => handleSaveAssets(activeType.id, data, deleted)}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-6 text-center py-12 bg-white rounded-3xl border border-slate-100">
                    <i className="fa-solid fa-layer-group text-4xl text-slate-300 mb-4 block"></i>
                    <p className="text-slate-500 font-semibold">Belum ada Skema Aset yang dibuat.</p>
                    <p className="text-xs text-slate-400 mt-1">Minta Superadmin untuk membuat skema aset terlebih dahulu.</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
