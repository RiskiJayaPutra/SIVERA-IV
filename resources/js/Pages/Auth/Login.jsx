import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [forgotModalOpen, setForgotModalOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            <Head title="Login - SIVERA IV" />

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
                    <h3 className="text-3xl font-extrabold leading-tight">Kelola Aset TI dengan <span className="text-kai-orange">Lebih Cepat</span></h3>
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                        Pantau seluruh perangkat jaringan di wilayah Divre IV melalui peta interaktif berbasis Single Page Application.
                    </p>
                </div>

                <div className="text-xs text-white/40 relative z-10">
                    &copy; {new Date().getFullYear()} PT KAI Divre IV Tanjung Karang
                </div>
            </div>

            {/* Right Side - Login Form */}
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
                        <h2 className="text-2xl font-extrabold text-kai-blue mt-6">Selamat Datang</h2>
                        <p className="text-sm text-slate-500">Masuk ke sistem SIVERA IV</p>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-2xl font-extrabold text-kai-blue">Selamat Datang</h2>
                        <p className="text-sm text-slate-500">Masuk ke sistem SIVERA IV</p>
                    </div>

                    {status && (
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email atau NIP</label>
                            <div className="relative mt-1.5">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="nama@kai.id atau NIP"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50" 
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kata Sandi</label>
                                {canResetPassword && (
                                    <button 
                                        type="button" 
                                        onClick={() => setForgotModalOpen(true)}
                                        className="text-xs font-bold text-kai-orange hover:text-kai-orangeHover transition"
                                    >
                                        Lupa Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative mt-1.5">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    placeholder="Masukkan kata sandi"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50" 
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
                        
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-kai-orange shadow-sm focus:ring-kai-orange w-4 h-4" 
                                />
                                <span className="ml-2 text-sm text-slate-600 font-medium">Ingat saya</span>
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-kai-blue/25 transition transform hover:scale-[1.01] flex items-center justify-center gap-3 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            Masuk <i className="fa-solid fa-right-to-bracket"></i>
                        </button>
                    </form>

                    <div className="text-center text-sm text-slate-500">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-kai-orange font-bold hover:text-kai-orangeHover transition hover:underline">
                            Daftar di sini
                        </Link>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 z-50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm p-1 border border-slate-100">
                                    <img src="/images/logo.png" alt="Logo KAI" className="w-full h-full object-contain scale-90" />
                                </div>
                                <span className="text-sm font-extrabold text-kai-blue">SIVERA IV</span>
                            </div>
                            <button onClick={() => setForgotModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <h2 className="font-extrabold text-lg text-kai-blue">Lupa Kata Sandi?</h2>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Hubungi Administrator untuk mengatur ulang kata sandi Anda atau gunakan tautan reset bawaan.
                        </p>
                        <div className="mt-5 space-y-4">
                            <Link href={route('password.request')} className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue text-white font-bold text-sm shadow-md transition-all">
                                <i className="fa-solid fa-link mr-2"></i> Buka Halaman Reset Password
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
