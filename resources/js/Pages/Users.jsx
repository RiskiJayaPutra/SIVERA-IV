import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';

export default function Users({ users = [], locations = [] }) {
    const authUser = usePage().props.auth.user;
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        nip: '',
        position: '',
        location_id: '',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user) => {
        clearErrors();
        setEditingUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '', // blank for edit
            role: user.role || 'admin',
            nip: user.nip || '',
            position: user.position || '',
            location_id: user.location_id || '',
        });
        setIsEditModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
                Swal.fire({ title: 'Berhasil', text: 'User berhasil ditambahkan', icon: 'success', timer: 1500, showConfirmButton: false });
            }
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('users.update', editingUser.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                Swal.fire({ title: 'Berhasil', text: 'Data user berhasil diperbarui', icon: 'success', timer: 1500, showConfirmButton: false });
            }
        });
    };

    const handleDelete = (user) => {
        Swal.fire({
            title: 'Hapus User?',
            text: `Anda yakin ingin menghapus ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', user.id), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({ title: 'Terhapus!', text: 'User berhasil dihapus', icon: 'success', timer: 1500, showConfirmButton: false });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout headerTitle="Manajemen Pengguna" headerSubtitle={`${users.total || 0} pengguna terdaftar`}>
            <Head title="Manajemen Pengguna - SIVERA IV" />

            <style dangerouslySetInnerHTML={{__html: `
                .table-row-hover:hover { background: #F8FAFC; }
                .fade-in { animation: fadeSlideIn 0.3s ease both; }
                @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}} />

            {/* ===== ACTION BAR: TAMBAH USER ===== */}
            <div className="flex flex-wrap items-center justify-end gap-2 fade-in mb-4">
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue rounded-xl transition shadow-sm">
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Tambah User</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-in">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4 text-left">Nama</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Role</th>
                                <th className="py-3 px-4 text-left">Lokasi Tugas</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!users.data || users.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                                        <i className="fa-solid fa-users text-3xl block mb-2 opacity-30"></i>
                                        Belum ada user terdaftar
                                    </td>
                                </tr>
                            ) : users.data.map(u => {
                                const isCurrentUser = authUser && authUser.id === u.id;
                                return (
                                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2.5">
                                                {u.profile_photo_url ? (
                                                    <img src={u.profile_photo_url} alt={u.name} className="w-7 h-7 rounded-full object-cover shadow-sm flex-shrink-0" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kai-blue to-kai-blueLight text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                        {u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
                                                    </div>
                                                )}
                                                <span className="font-semibold text-slate-800">{u.name}</span>
                                                {isCurrentUser && (
                                                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Anda</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 text-xs">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${u.role === 'superadmin' ? 'bg-kai-blue/10 text-kai-blue' : 'bg-kai-orange/10 text-kai-orange'}`}>
                                                {u.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 text-xs">{u.location?.name || <span className="text-slate-300">—</span>}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={() => openEditModal(u)} className="text-slate-400 hover:text-kai-blue mx-1 transition" title="Edit">
                                                <i className="fa-solid fa-pen text-xs"></i>
                                            </button>
                                            {!isCurrentUser && (
                                                <button onClick={() => handleDelete(u)} className="text-slate-400 hover:text-red-600 mx-1 transition" title="Hapus">
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* PAGINATION */}
                {users.links && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="80vw">
                <div className="p-10">
                    <h2 className="text-3xl font-extrabold text-kai-blue mb-8">Tambah Pengguna</h2>
                    <form onSubmit={submitCreate}>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Nama Lengkap</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Nama pengguna"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Email aktif"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Min. 8 karakter"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">NIP (Opsional)</label>
                                    <input type="text" value={data.nip} onChange={e => setData('nip', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                        placeholder="NIP"
                                    />
                                    {errors.nip && <p className="text-red-500 text-sm mt-2">{errors.nip}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Jabatan (Opsional)</label>
                                    <input type="text" value={data.position} onChange={e => setData('position', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                        placeholder="e.g. Kepala Unit"
                                    />
                                    {errors.position && <p className="text-red-500 text-sm mt-2">{errors.position}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Role</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Lokasi (Opsional)</label>
                                    <select value={data.location_id} onChange={e => setData('location_id', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                        <option value="">Semua Wilayah</option>
                                        {(locations || []).map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="text-red-500 text-sm mt-2">{errors.location_id}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-8 py-4 text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-8 py-4 text-lg font-bold text-white bg-kai-blue hover:bg-kai-blueLight rounded-lg transition disabled:opacity-50">
                                Simpan User
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* EDIT MODAL */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="80vw">
                <div className="p-10">
                    <h2 className="text-3xl font-extrabold text-kai-blue mb-8">Edit Pengguna</h2>
                    <form onSubmit={submitEdit}>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Nama Lengkap</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Nama pengguna"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Email aktif"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-slate-600 mb-1">Password Baru (Opsional)</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                    className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">NIP (Opsional)</label>
                                    <input type="text" value={data.nip} onChange={e => setData('nip', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                        placeholder="NIP"
                                    />
                                    {errors.nip && <p className="text-red-500 text-sm mt-2">{errors.nip}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Jabatan (Opsional)</label>
                                    <input type="text" value={data.position} onChange={e => setData('position', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange"
                                        placeholder="e.g. Kepala Unit"
                                    />
                                    {errors.position && <p className="text-red-500 text-sm mt-2">{errors.position}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Role</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-slate-600 mb-1">Lokasi (Opsional)</label>
                                    <select value={data.location_id} onChange={e => setData('location_id', e.target.value)}
                                        className="w-full px-5 py-4 text-xl border border-slate-200 rounded-lg focus:ring-2 focus:ring-kai-orange focus:border-kai-orange">
                                        <option value="">Semua Wilayah</option>
                                        {(locations || []).map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="text-red-500 text-sm mt-2">{errors.location_id}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-8 py-4 text-lg font-bold text-white bg-kai-orange hover:bg-orange-600 rounded-lg transition disabled:opacity-50">
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
