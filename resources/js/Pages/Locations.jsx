import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';

export default function Locations({ locations = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Build hierarchical data for rendering
    const locList = locations.data || [];
    const roots = locList.filter(l => !l.parent_id);
    const childrenLocs = locList.filter(l => l.parent_id);
    
    const hierarchicalLocations = [];
    roots.forEach(root => {
        hierarchicalLocations.push(root);
        const myChildren = childrenLocs.filter(c => c.parent_id === root.id);
        myChildren.forEach(child => {
            child._isChild = true;
            hierarchicalLocations.push(child);
        });
    });
    // Add any orphans (children whose parent doesn't exist)
    const mappedIds = new Set(hierarchicalLocations.map(l => l.id));
    const orphans = locList.filter(l => !mappedIds.has(l.id));
    hierarchicalLocations.push(...orphans);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        type: 'stasiun',
        parent_id: '',
    });

    const openCreateModal = () => {
        reset();
        setIsEditMode(false);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (loc) => {
        setData({
            id: loc.id,
            name: loc.name,
            type: loc.type,
            parent_id: loc.parent_id || '',
        });
        setIsEditMode(true);
        setIsCreateModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('locations.update', data.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                    Swal.fire({ title: 'Berhasil', text: 'Lokasi diperbarui', icon: 'success', timer: 1500, showConfirmButton: false });
                }
            });
        } else {
            post(route('locations.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                    Swal.fire({ title: 'Berhasil', text: 'Lokasi ditambahkan', icon: 'success', timer: 1500, showConfirmButton: false });
                }
            });
        }
    };

    const handleDelete = (loc) => {
        Swal.fire({
            title: 'Hapus Lokasi?',
            text: `Data ${loc.name} beserta aset terkait mungkin ikut terhapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('locations.destroy', loc.id), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1500, showConfirmButton: false })
                });
            }
        });
    };

    return (
        <AuthenticatedLayout headerTitle="Lokasi & Resort" headerSubtitle={`${locations.total || 0} lokasi terdaftar`}>
            <Head title="Data Lokasi - SIVERA IV" />

            <style dangerouslySetInnerHTML={{__html: `
                .table-row-hover:hover { background: #F8FAFC; }
                .fade-in { animation: fadeSlideIn 0.3s ease both; }
                @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}} />

            {/* ===== ACTION BAR: TAMBAH LOKASI ===== */}
            <div className="flex flex-wrap items-center justify-end gap-2 fade-in mb-4">
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue rounded-xl transition shadow-sm">
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Tambah Lokasi</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-in">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4 text-left">Nama Lokasi</th>
                                <th className="py-3 px-4 text-left">Tipe</th>
                                <th className="py-3 px-4 text-left">Induk</th>
                                <th className="py-3 px-4 text-left">Total Aset</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hierarchicalLocations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                                        <i className="fa-solid fa-map-location-dot text-3xl block mb-2 opacity-30"></i>
                                        Belum ada lokasi terdaftar
                                    </td>
                                </tr>
                            ) : hierarchicalLocations.map(loc => (
                                <tr key={loc.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition group ${loc._isChild ? 'bg-slate-50/30' : ''}`}>
                                    <td className="py-3 px-4">
                                        <div className={`flex items-center gap-2.5 ${loc._isChild ? 'ml-6 border-l-2 border-slate-200 pl-3' : ''}`}>
                                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background: loc.type === 'stasiun' ? '#0D2C54' : (loc.type === 'unit' ? '#EA580C' : '#7C3AED')}}></span>
                                            <span className={`font-semibold ${loc._isChild ? 'text-slate-600 text-xs' : 'text-slate-800'}`}>{loc.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${loc.type === 'stasiun' ? 'bg-kai-blue/10 text-kai-blue' : 'bg-purple-100 text-purple-700'}`}>
                                            {loc.type === 'stasiun' ? 'Stasiun' : 'Unit Pendukung'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-xs">{loc.parent?.name || <span className="text-slate-300">—</span>}</td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold text-slate-700">{(loc.it_assets_count || 0) + (loc.network_assets_count || 0) + (loc.cctv_assets_count || 0) + (loc.locotrack_assets_count || 0)}</span>
                                        <span className="text-slate-400 text-xs"> aset</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => openEditModal(loc)} className="text-slate-400 hover:text-kai-blue mx-1 transition" title="Edit">
                                            <i className="fa-solid fa-pen text-xs"></i>
                                        </button>
                                        <button onClick={() => handleDelete(loc)} className="text-slate-400 hover:text-red-600 mx-1 transition" title="Hapus">
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* PAGINATION REMOVED TO SUPPORT FULL HIERARCHY RENDERING */}
            </div>

            {/* CREATE MODAL */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="80vw">
                <div className="p-10">
                    <h2 className="text-3xl font-extrabold text-kai-blue mb-8">{isEditMode ? 'Edit Lokasi' : 'Tambah Lokasi/Resort'}</h2>
                    <form onSubmit={submitCreate}>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">ID Lokasi</label>
                                <input type="text" value={data.id} onChange={e => setData('id', e.target.value)}
                                    className={`w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange ${isEditMode ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                                    placeholder="e.g., TNK, KOT"
                                    readOnly={isEditMode}
                                />
                                {errors.id && <p className="text-red-500 text-sm mt-2">{errors.id}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Nama Lokasi</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="e.g., Tanjung Karang"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Tipe Lokasi</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                    <option value="stasiun">Stasiun</option>
                                    <option value="resort">Resort</option>
                                    <option value="unit">Unit</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
                            </div>
                            {data.type !== 'stasiun' && (
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Induk (Stasiun / Resort)</label>
                                    <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                        <option value="">Pilih Lokasi Induk...</option>
                                        <optgroup label="Daftar Stasiun">
                                            {(locations.data || []).filter(l => l.type === 'stasiun').map(st => (
                                                <option key={st.id} value={st.id}>{st.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Daftar Resort">
                                            {(locations.data || []).filter(l => l.type === 'resort').map(st => (
                                                <option key={st.id} value={st.id}>{st.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    {errors.parent_id && <p className="text-red-500 text-sm mt-2">{errors.parent_id}</p>}
                                </div>
                            )}
                        </div>
                        <div className="mt-12 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-8 py-4 text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-8 py-4 text-lg font-bold text-white bg-kai-blue hover:bg-kai-blueLight rounded-lg transition disabled:opacity-50">
                                Simpan Lokasi
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
