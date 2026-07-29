import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import MapSVG from '@/Components/MapSVG';

export default function Dashboard({ assets = [], locations = [], stats = {} }) {
    const [mapScale, setMapScale] = useState(1);
    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    const MAX_SCALE = 4;
    const ZOOM_STEP = 0.2;
    const minScaleLimitRef = useRef(0.2);

    const resetMapView = () => {
        if (!viewportRef.current) return;
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        const MAP_W = 2100;
        const MAP_H = 850;
        const fitScale = Math.min((vw - 40) / MAP_W, (vh - 40) / MAP_H, 1);
        minScaleLimitRef.current = fitScale * 0.9;
        
        setMapScale(fitScale);
        setMapOffset({
            x: (vw - MAP_W * fitScale) / 2,
            y: (vh - MAP_H * fitScale) / 2
        });
    };

    useEffect(() => {
        resetMapView();
        window.addEventListener('resize', resetMapView);
        return () => window.removeEventListener('resize', resetMapView);
    }, []);

    const zoomMap = (direction) => {
        if (!viewportRef.current) return;
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        
        setMapScale(prevScale => {
            const newScale = Math.min(MAX_SCALE, Math.max(minScaleLimitRef.current, prevScale + direction * ZOOM_STEP));
            const cx = vw / 2;
            const cy = vh / 2;
            
            setMapOffset(prevOffset => ({
                x: cx - (cx - prevOffset.x) * (newScale / prevScale),
                y: cy - (cy - prevOffset.y) * (newScale / prevScale)
            }));
            
            return newScale;
        });
    };

    // Pan logic
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    
    const onPointerDown = (e) => {
        if (e.target.tagName === 'circle' || e.target.classList.contains('click-area')) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y };
        viewportRef.current.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        if (!isDragging.current) return;
        setMapOffset({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const onPointerUp = () => {
        isDragging.current = false;
        if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
    };

    const handleStationClick = (stationId) => {
        // Check if this station/location exists in our locations data
        const loc = locations.find(l => l.id === stationId);
        if (loc) {
            // Navigate to the location detail page
            router.visit(route('locations.show', stationId));
        } else {
            // Station not in DB yet – show a gentle notice
            console.log(`Location "${stationId}" not found in database.`);
        }
    };

    return (
        <AuthenticatedLayout headerTitle="Dashboard SIVERA IV" headerSubtitle="Peta pemetaan resort & aset">
            <Head title="Dashboard - SIVERA IV" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 fade-in">
                {/* Total Aset */}
                <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <i className="fa-solid fa-database absolute -right-4 -bottom-4 text-8xl text-kai-blue opacity-[0.03] group-hover:scale-110 transition-transform"></i>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-1">Total Aset</h4>
                            <span className="text-4xl font-black text-slate-800 tracking-tight">{stats.total || 0}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-kai-blue border border-blue-100/50 shadow-inner">
                            <i className="fa-solid fa-database text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Kondisi Baik */}
                <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <i className="fa-solid fa-circle-check absolute -right-4 -bottom-4 text-8xl text-emerald-500 opacity-[0.03] group-hover:scale-110 transition-transform"></i>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-1">Kondisi Baik</h4>
                            <span className="text-4xl font-black text-slate-800 tracking-tight">{stats.baik || 0}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50 shadow-inner">
                            <i className="fa-solid fa-circle-check text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Perawatan */}
                <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <i className="fa-solid fa-triangle-exclamation absolute -right-4 -bottom-4 text-8xl text-amber-500 opacity-[0.03] group-hover:scale-110 transition-transform"></i>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-1">Perawatan</h4>
                            <span className="text-4xl font-black text-slate-800 tracking-tight">{stats.perawatan || 0}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shadow-inner">
                            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Kondisi Rusak */}
                <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <i className="fa-solid fa-circle-xmark absolute -right-4 -bottom-4 text-8xl text-rose-500 opacity-[0.03] group-hover:scale-110 transition-transform"></i>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-1">Kondisi Rusak</h4>
                            <span className="text-4xl font-black text-slate-800 tracking-tight">{stats.rusak || 0}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100/50 shadow-inner">
                            <i className="fa-solid fa-circle-xmark text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden fade-in mt-6 sm:mt-8">
                {/* Command Center Header */}
                <div className="bg-kai-navy p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-map text-kai-orange"></i>
                            Peta Pemetaan Resort & Aset — Divre IV Tanjung Karang
                        </h3>
                        <p className="text-[11px] text-blue-200/70 mt-1 font-medium">Klik titik stasiun / unit untuk melihat daftar aset di lokasi tersebut.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={resetMapView} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/5" title="Reset tampilan">
                            <i className="fa-solid fa-arrows-to-dot text-xs"></i>
                        </button>
                        <div className="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/5">
                            <button onClick={() => zoomMap(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 text-white transition border-r border-white/10" title="Zoom Out">
                                <i className="fa-solid fa-minus text-xs"></i>
                            </button>
                            <span className="text-[10px] font-bold text-white px-3 min-w-[48px] text-center">{Math.round(mapScale * 100)}%</span>
                            <button onClick={() => zoomMap(1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 text-white transition border-l border-white/10" title="Zoom In">
                                <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    id="mapViewport" 
                    ref={viewportRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                    style={{ touchAction: 'none' }}
                >
                    <div id="mapTransform" style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`, transformOrigin: '0 0', willChange: 'transform' }}>
                        <MapSVG 
                            onClickStation={handleStationClick} 
                            locations={locations}
                        />
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
