import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-700 font-sans">
            <Head title="SIVERA IV | Divre IV Tanjung Karang" />

            <style dangerouslySetInnerHTML={{__html: `
                .hero-section {
                  background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);
                }
            
                /* ===== Train animation strip ===== */
                .rail-strip {
                  position: relative;
                  height: 90px;
                  overflow: hidden;
                  background: linear-gradient(180deg, #FFFFFF 0%, #F3F6FB 100%);
                }
            
                .rail-strip .sky-line {
                  position: absolute;
                  inset: 0;
                  background-image:
                    radial-gradient(circle at 12% 30%, rgba(13,44,84,0.05) 0, rgba(13,44,84,0.05) 2px, transparent 2px),
                    radial-gradient(circle at 32% 55%, rgba(13,44,84,0.05) 0, rgba(13,44,84,0.05) 2px, transparent 2px),
                    radial-gradient(circle at 62% 25%, rgba(13,44,84,0.05) 0, rgba(13,44,84,0.05) 2px, transparent 2px),
                    radial-gradient(circle at 82% 45%, rgba(13,44,84,0.05) 0, rgba(13,44,84,0.05) 2px, transparent 2px);
                }
            
                .rail-strip .ballast {
                  position: absolute;
                  left: 0; right: 0; bottom: 0;
                  height: 36px;
                  background: repeating-linear-gradient(
                    90deg,
                    #DCE3EC 0px, #DCE3EC 6px,
                    #E9EDF3 6px, #E9EDF3 12px
                  );
                }
            
                .rail-strip .sleepers {
                  position: absolute;
                  left: 0; right: 0; bottom: 20px;
                  height: 10px;
                  background: repeating-linear-gradient(
                    90deg,
                    #B9C2CF 0px, #B9C2CF 14px,
                    transparent 14px, transparent 34px
                  );
                }
            
                .rail-strip .rail-line {
                  position: absolute;
                  left: 0; right: 0; bottom: 24px;
                  height: 4px;
                  background: #7C8698;
                  box-shadow: 0 6px 0 0 #7C8698;
                }
            
                .train {
                  position: absolute;
                  bottom: 24px;
                  left: -340px;
                  display: flex;
                  align-items: flex-end;
                  animation: trainMove 16s linear infinite;
                  will-change: transform;
                }
            
                @keyframes trainMove {
                  0%   { transform: translateX(0); }
                  100% { transform: translateX(calc(100vw + 340px)); }
                }
            
                .train .wheel {
                  animation: wheelSpin 0.55s linear infinite;
                  transform-origin: center;
                }
            
                @keyframes wheelSpin {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
            
                .smoke {
                  position: absolute;
                  border-radius: 999px;
                  background: rgba(148,163,184,0.55);
                  animation: smokeRise 2.4s ease-out infinite;
                  opacity: 0;
                }
                .smoke.s1 { width: 10px; height: 10px; left: 30px; top: -8px; animation-delay: 0s; }
                .smoke.s2 { width: 14px; height: 14px; left: 34px; top: -8px; animation-delay: 0.6s; }
                .smoke.s3 { width: 18px; height: 18px; left: 26px; top: -8px; animation-delay: 1.2s; }
                .smoke.s4 { width: 12px; height: 12px; left: 38px; top: -8px; animation-delay: 1.8s; }
            
                @keyframes smokeRise {
                  0%   { opacity: 0; transform: translate(0,0) scale(0.6); }
                  15%  { opacity: 0.7; }
                  100% { opacity: 0; transform: translate(18px,-46px) scale(1.6); }
                }
            
                @media (prefers-reduced-motion: reduce) {
                  .train { animation: none; left: 40px; }
                  .train .wheel { animation: none; }
                  .smoke { animation: none; opacity: 0; }
                }
            
                /* Feature Cards */
                .feature-card {
                  transition: all 0.3s ease;
                }
                .feature-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.08);
                }
            `}} />

            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto h-20 px-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md p-1 border border-slate-100">
                            <img src="/images/logo.png" alt="Logo KAI" className="w-full h-full object-contain scale-90" />
                        </div>
                        <div>
                            <p className="font-extrabold text-kai-blue text-xl leading-tight">SIVERA IV</p>
                            <p className="text-xs text-slate-500">Sistem Informasi Divre IV Tanjung Karang</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href={route('login')} className="px-4 sm:px-5 py-2.5 text-sm font-bold text-kai-blue hover:bg-slate-50 rounded-xl transition">Masuk</Link>
                        <Link href={route('register')} className="px-3 sm:px-5 py-2.5 rounded-xl bg-kai-orange hover:bg-kai-orangeHover text-white text-sm font-bold shadow-lg shadow-kai-orange/20 transition">Registrasi Admin</Link>
                    </div>
                </div>
            </header>

            <main className="hero-section min-h-[calc(100vh-80px)] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto px-5 pt-4 pb-6 lg:pt-6 lg:pb-8 grid lg:grid-cols-2 gap-12 items-center w-full">
                    <section>
                        <span className="inline-flex gap-2 items-center px-4 py-2 rounded-full bg-orange-50 text-kai-orange text-xs font-bold border border-orange-100">
                            <i className="fa-solid fa-train"></i> PT KAI Divre IV Tanjung Karang
                        </span>
                        <h1 className="mt-6 text-4xl lg:text-5xl font-extrabold leading-tight text-kai-blue">
                            Informasi Aset Jaringan <br />Setiap Stasiun <span className="text-kai-orange">Seketika</span>
                        </h1>
                        <p className="mt-5 text-base lg:text-lg leading-relaxed max-w-xl text-slate-600">
                            SIVERA IV membantu pegawai Divre IV Tanjung Karang melihat status aset perangkat di setiap wilayah tanpa perlu mencari data secara manual.
                        </p>
                    </section>

                    <section className="relative">
                        <div className="absolute -inset-4 bg-kai-blue/5 rounded-3xl"></div>
                        <div className="relative w-full min-h-[340px] max-h-[540px] bg-slate-200 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                            <img src="/images.jpeg" alt="Operasional PT KAI" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            <div className="hidden absolute inset-0 flex-col items-center justify-center text-slate-400 font-bold bg-slate-200">
                                <i className="fa-solid fa-image text-5xl mb-3"></i>
                                <span>Ilustrasi Operasional PT KAI</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="rail-strip mt-auto" aria-hidden="true">
                    <div className="sky-line"></div>
                    <div className="ballast"></div>
                    <div className="sleepers"></div>
                    <div className="rail-line"></div>

                    <div className="train">
                        <svg width="320" height="90" viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg">
                            {/* gerbong belakang */}
                            <rect x="150" y="30" width="150" height="34" rx="4" fill="#1B497E" />
                            <rect x="160" y="36" width="26" height="18" rx="2" fill="#DCEBFF" />
                            <rect x="196" y="36" width="26" height="18" rx="2" fill="#DCEBFF" />
                            <rect x="232" y="36" width="26" height="18" rx="2" fill="#DCEBFF" />
                            <rect x="268" y="36" width="20" height="18" rx="2" fill="#DCEBFF" />
                            <rect x="150" y="60" width="150" height="6" fill="#0D2C54" />

                            {/* lokomotif */}
                            <path d="M40 20 h95 a10 10 0 0 1 10 10 v30 h-105 a10 10 0 0 1 -10 -10 z" fill="#0D2C54" />
                            <rect x="55" y="30" width="30" height="20" rx="2" fill="#DCEBFF" />
                            <rect x="95" y="30" width="30" height="20" rx="2" fill="#DCEBFF" />
                            <rect x="20" y="46" width="30" height="18" rx="3" fill="#EF7D00" />
                            <rect x="35" y="60" width="110" height="6" fill="#0D2C54" />

                            {/* cerobong */}
                            <rect x="60" y="8" width="12" height="16" rx="2" fill="#0D2C54" />

                            {/* bemper depan */}
                            <rect x="12" y="58" width="14" height="8" rx="2" fill="#EF7D00" />

                            {/* roda */}
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="35" cy="70" r="10" fill="#0D2C54" />
                                <circle cx="35" cy="70" r="3.5" fill="#EF7D00" />
                            </g>
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="70" cy="70" r="10" fill="#0D2C54" />
                                <circle cx="70" cy="70" r="3.5" fill="#EF7D00" />
                            </g>
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="115" cy="70" r="10" fill="#0D2C54" />
                                <circle cx="115" cy="70" r="3.5" fill="#EF7D00" />
                            </g>
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="185" cy="70" r="9" fill="#0D2C54" />
                                <circle cx="185" cy="70" r="3" fill="#EF7D00" />
                            </g>
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="230" cy="70" r="9" fill="#0D2C54" />
                                <circle cx="230" cy="70" r="3" fill="#EF7D00" />
                            </g>
                            <g className="wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                                <circle cx="275" cy="70" r="9" fill="#0D2C54" />
                                <circle cx="275" cy="70" r="3" fill="#EF7D00" />
                            </g>
                        </svg>

                        <div className="smoke s1"></div>
                        <div className="smoke s2"></div>
                        <div className="smoke s3"></div>
                        <div className="smoke s4"></div>
                    </div>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-5 py-6 border-t border-slate-200 text-xs text-slate-400 text-center">
                <span>© {new Date().getFullYear()} PT KAI Divre IV Tanjung Karang</span>
            </footer>
        </div>
    );
}
