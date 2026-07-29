import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            <Head title="Lupa Password - SIVERA IV" />

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
                    <h3 className="text-3xl font-extrabold leading-tight">Lupa <span className="text-kai-orange">Kata Sandi</span>?</h3>
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                        Jangan khawatir! Ikuti langkah-langkah berikut untuk mereset kata sandi Anda dengan aman.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-white/60">
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                            <i className="fa-solid fa-envelope text-kai-orange"></i>
                            <span>Masukkan email atau NIP Anda</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                            <i className="fa-solid fa-envelope-open-text text-kai-orange"></i>
                            <span>Terima tautan reset kata sandi di email</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                            <i className="fa-solid fa-key text-kai-orange"></i>
                            <span>Buat kata sandi baru</span>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-white/40 relative z-10">
                    &copy; {new Date().getFullYear()} PT KAI Divre IV Tanjung Karang
                </div>
            </div>

            {/* Right Side - Reset Form */}
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
                        <h2 className="text-2xl font-extrabold text-kai-blue mt-6">Reset Kata Sandi</h2>
                        <p className="text-sm text-slate-500">Ikuti langkah untuk mereset password</p>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-2xl font-extrabold text-kai-blue">Reset Kata Sandi</h2>
                        <p className="text-sm text-slate-500">Ikuti langkah untuk mereset password Anda</p>
                    </div>

                    {status ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                            <i className="fa-solid fa-circle-check text-emerald-500 text-3xl block mb-2"></i>
                            <p className="text-sm font-bold text-emerald-800">Tautan Berhasil Dikirim!</p>
                            <p className="text-xs text-emerald-600 mt-1">{status}</p>
                            <Link href={route('login')} className="mt-4 inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition">
                                Kembali ke Login
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Masukkan <strong>Email</strong> Anda yang terdaftar. Kami akan mengirimkan tautan untuk mereset kata sandi.
                            </p>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email (sebagai NIP/Identitas)</label>
                                    <div className="relative mt-1.5">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                            <i className="fa-solid fa-user"></i>
                                        </span>
                                        <input 
                                            type="email" 
                                            required 
                                            placeholder="nama@kai.id"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange focus:border-transparent transition text-sm bg-slate-50/50" 
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-kai-blue to-kai-blueLight hover:from-kai-blueLight hover:to-kai-blue text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-kai-blue/25 transition transform hover:scale-[1.01] flex items-center justify-center gap-3 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    <i className="fa-solid fa-paper-plane"></i> Kirim Tautan Reset
                                </button>
                            </form>
                        </div>
                    )}

                    {!status && (
                        <div className="text-center text-sm text-slate-500 border-t border-slate-200 pt-4 mt-6">
                            <Link href={route('login')} className="text-kai-orange font-bold hover:text-kai-orangeHover transition hover:underline">
                                <i className="fa-solid fa-arrow-left mr-1"></i> Kembali ke Halaman Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
