import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import InputError from '@/Components/InputError';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            <Head title="Daftar - SIVERA IV" />

            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-kai-blue to-kai-blueLight text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 -ml-40 -mb-40"></div>

                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-1.5">
                            <img src="/images/logo.png" alt="Logo KAI" className="w-full h-full object-contain scale-90" />
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight">SIVERA IV</span>
                            <p className="text-sm text-white/70 -mt-0.5">Sistem Informasi Divre IV</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-extrabold leading-tight">Bergabunglah sebagai <span className="text-kai-orange">Admin</span></h3>
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                        Daftarkan diri Anda sebagai Admin IT Support di wilayah Divre IV untuk membantu pengelolaan aset.
                    </p>
                </div>

                <div className="text-xs text-white/40 relative z-10">
                    &copy; {new Date().getFullYear()} PT KAI Divre IV Tanjung Karang
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white lg:bg-transparent relative z-10">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center">
                        <div className="inline-flex items-center gap-3">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md p-1">
                                <img src="/images/logo.png" alt="Logo KAI" className="w-full h-full object-contain scale-90" />
                            </div>
                            <div className="text-left">
                                <span className="text-lg font-extrabold text-kai-blue">SIVERA IV</span>
                                <p className="text-[10px] text-slate-400 -mt-0.5">Sistem Informasi Divre IV</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-kai-blue mt-6">Daftar Akun</h2>
                        <p className="text-sm text-slate-500">Buat akun Admin baru</p>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-2xl font-extrabold text-kai-blue">Daftar Akun Admin</h2>
                        <p className="text-sm text-slate-500">Buat akun Admin baru untuk wilayah Divre IV</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Lengkap</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Nama lengkap pegawai"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50 mt-1.5" 
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email (sebagai NIP/Identitas)</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="nama@kai.id"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50 mt-1.5" 
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kata Sandi</label>
                            <div className="relative mt-1.5">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    placeholder="Minimal 8 karakter"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Konfirmasi Kata Sandi</label>
                            <div className="relative mt-1.5">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    required 
                                    placeholder="Ulangi kata sandi"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                                >
                                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-kai-blue/25 transition transform hover:scale-[1.01] flex items-center justify-center gap-3 text-sm mt-6 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-user-plus"></i> Daftar Admin
                        </button>
                    </form>

                    <div className="text-center text-sm text-slate-500">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-kai-orange font-bold hover:text-kai-orangeHover transition hover:underline">
                            Login di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
