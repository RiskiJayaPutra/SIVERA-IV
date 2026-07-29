import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import Modal from '@/Components/Modal';

export default function AuthenticatedLayout({ children, headerTitle, headerSubtitle }) {
    const { user } = usePage().props.auth;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showPhotoReminder, setShowPhotoReminder] = useState(!user.profile_photo_url);

    const closeSidebar = () => setSidebarOpen(false);
    const openSidebar = () => setSidebarOpen(true);

    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
    
    // helper to determine if nav link is active
    const navActive = (routeName) => {
        try {
            return route().current(routeName);
        } catch(e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-35 bg-black/40 md:hidden block"
                    onClick={closeSidebar}
                    style={{ zIndex: 35 }}
                ></div>
            )}

            {/* Sidebar */}
            <aside 
                className={`sidebar fixed md:relative top-0 left-0 h-full md:h-auto w-64 bg-kai-navy text-white flex flex-col z-40 shadow-xl md:shadow-none flex-shrink-0 transition-transform duration-300 ${
                    sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
                }`}
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md p-1">
                            <img src="/images/logo.png" alt="Logo KAI" className="w-full h-full object-contain scale-90" />
                        </div>
                        <div>
                            <span className="text-sm font-extrabold text-white block">SIVERA IV</span>
                            <span className="text-[9px] text-blue-200 block leading-none mt-0.5">Divre IV Tanjung Karang</span>
                        </div>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden text-blue-200 hover:text-white transition">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2 custom-scrollbar-dark">
                    <Link href={route('dashboard')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('dashboard') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <i className={`fa-solid fa-gauge text-base w-5 text-center ${navActive('dashboard') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link href={route('assets.index')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('assets.*') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <i className={`fa-solid fa-server text-base w-5 text-center ${navActive('assets.*') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                        <span>Data Aset</span>
                    </Link>
                    <Link href={route('locations.index')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('locations.*') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <i className={`fa-solid fa-map-location-dot text-base w-5 text-center ${navActive('locations.*') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                        <span>Master Lokasi</span>
                    </Link>

                    {user.role === 'superadmin' && (
                        <>
                            <Link href={route('users.index')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('users.*') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                                <i className={`fa-solid fa-users-gear text-base w-5 text-center ${navActive('users.*') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                                <span>Manajemen User</span>
                            </Link>
                            <Link href={route('asset-types.index')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('asset-types.*') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                                <i className={`fa-solid fa-layer-group text-base w-5 text-center ${navActive('asset-types.*') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                                <span>Master Skema Aset</span>
                            </Link>
                        </>
                    )}
                    <Link href={route('reports.index')} className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 gap-3 border-l-4 ${navActive('reports.*') ? 'bg-white/10 text-white font-bold border-kai-orange' : 'font-medium text-blue-100/70 border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <i className={`fa-solid fa-file-invoice text-base w-5 text-center ${navActive('reports.*') ? 'text-kai-orange' : 'text-blue-200/50'}`}></i>
                        <span>Laporan</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={openSidebar} className="md:hidden text-slate-500 hover:text-slate-700 transition p-1.5 rounded-lg hover:bg-slate-100">
                            <i className="fa-solid fa-bars text-lg"></i>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight">{headerTitle || 'Dashboard'}</h1>
                            {headerSubtitle && <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{headerSubtitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${user.role === 'superadmin' ? 'bg-kai-blue/10 text-kai-blue' : 'bg-kai-orange/10 text-kai-orange'}`}>
                            {user.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                        </span>
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 text-sm font-bold text-kai-blue">
                                {user.profile_photo_url ? (
                                    <img src={user.profile_photo_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200" />
                                ) : (
                                    <span id="topUserAvatar" className="w-8 h-8 rounded-full bg-kai-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                                <span className="hidden md:block truncate max-w-[150px] text-slate-700">{user.name}</span>
                                <i className="fa-solid fa-chevron-down text-xs text-slate-400"></i>
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 text-sm z-50">
                                    <Link href={route('profile.edit')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                                        <i className="fa-solid fa-user-pen w-5 text-kai-orange"></i> Profil pengguna
                                    </Link>
                                    <Link href={route('profile.password')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                                        <i className="fa-solid fa-lock w-5 text-kai-orange"></i> Ubah password
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2">
                                        <i className="fa-solid fa-right-from-bracket w-5"></i> Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 p-4 md:p-6 space-y-5 overflow-auto relative">
                    {children}
                </main>
            </div>

            {/* Photo Reminder Modal */}
            <Modal show={showPhotoReminder} onClose={() => setShowPhotoReminder(false)} maxWidth="md">
                <div className="p-8 text-center relative overflow-hidden">
                    <button 
                        onClick={() => setShowPhotoReminder(false)}
                        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-kai-orange/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-kai-blue/10 rounded-full blur-2xl"></div>
                    
                    <div className="mx-auto w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-rose-200 z-10 relative">
                        <i className="fa-solid fa-camera"></i>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-3 relative z-10">Lengkapi Profil Anda</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed relative z-10">
                        Anda wajib mengunggah foto profil (JPG/PNG, Maks. 10MB) sebelum dapat melanjutkan menggunakan sistem.
                    </p>
                    <Link 
                        href={route('profile.edit')}
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-kai-blue text-white rounded-xl font-bold hover:bg-kai-blueLight transition shadow-md relative z-10"
                        onClick={() => setShowPhotoReminder(false)}
                    >
                        <i className="fa-solid fa-arrow-right"></i> Pergi ke Halaman Profil
                    </Link>
                </div>
            </Modal>
        </div>
    );
}
