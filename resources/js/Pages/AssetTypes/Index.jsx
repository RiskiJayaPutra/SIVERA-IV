import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ assetTypes = [] }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Skema Aset?',
            text: 'Ini juga akan menghapus SEMUA data aset yang menggunakan skema ini secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('asset-types.destroy', id), {
                    preserveScroll: true
                });
            }
        });
    };

    return (
        <AuthenticatedLayout headerTitle="Master Skema Aset" headerSubtitle="Atur kolom dan form dinamis untuk aset">
            <Head title="Master Skema Aset - SIVERA IV" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800">Daftar Skema Aset</h2>
                        <p className="text-xs text-slate-500 mt-1">Mengelola konfigurasi kolom dan header untuk ke-4 aset utama</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assetTypes.map(type => (
                        <div key={type.id} className="border border-slate-100 rounded-2xl p-5 hover:border-kai-blue/30 transition group bg-slate-50/50 hover:bg-white hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-kai-blue/10 text-kai-blue flex items-center justify-center text-xl shadow-inner">
                                    <i className={`fa-solid ${type.icon || 'fa-box'}`}></i>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('asset-types.edit', type.id)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-kai-blue hover:border-kai-blue flex items-center gap-2 text-xs font-bold transition shadow-sm">
                                        <i className="fa-solid fa-pen"></i> Edit Header
                                    </Link>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{type.name}</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">Sistem: {type.slug}</p>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                <span><i className="fa-solid fa-table-columns mr-1 text-slate-400"></i> {type.schema?.columns?.length || 0} Kolom Utama</span>
                                {type.schema?.headerGroups && (
                                    <span><i className="fa-solid fa-layer-group mr-1 text-slate-400"></i> {type.schema.headerGroups.length} Grup</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
