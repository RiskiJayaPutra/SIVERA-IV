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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 fade-in">
                <div className="stat-card total bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-kai-blue/10 flex items-center justify-center">
                            <i className="fa-solid fa-database text-kai-blue text-base"></i>
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-kai-blue">{stats.total || 0}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Total Aset</p>
                </div>
                <div className="stat-card baik bg-white rounded-2xl p-4 shadow-sm border border-slate-100 fade-in">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <i className="fa-solid fa-circle-check text-green-600 text-base"></i>
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-green-600">{stats.baik || 0}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Kondisi Baik</p>
                </div>
                <div className="stat-card perawatan bg-white rounded-2xl p-4 shadow-sm border border-slate-100 fade-in">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-base"></i>
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-yellow-600">{stats.perawatan || 0}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Perawatan</p>
                </div>
                <div className="stat-card rusak bg-white rounded-2xl p-4 shadow-sm border border-slate-100 fade-in">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <i className="fa-solid fa-circle-xmark text-red-600 text-base"></i>
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-red-600">{stats.rusak || 0}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Kondisi Rusak</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 fade-in mt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-kai-blue flex items-center gap-2">
                            <i className="fa-solid fa-map text-kai-orange"></i>
                            Peta Pemetaan Resort & Aset — Divre IV Tanjung Karang
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Klik titik stasiun / unit untuk melihat daftar aset di lokasi tersebut.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={resetMapView} className="map-zoom-btn" title="Reset tampilan">
                            <i className="fa-solid fa-arrows-to-dot text-xs"></i>
                        </button>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <button onClick={() => zoomMap(-1)} className="map-zoom-btn rounded-none border-0 border-r border-slate-200" title="Zoom Out">
                                <i className="fa-solid fa-minus text-xs"></i>
                            </button>
                            <span className="text-[10px] font-bold text-slate-600 px-3 min-w-[44px] text-center">{Math.round(mapScale * 100)}%</span>
                            <button onClick={() => zoomMap(1)} className="map-zoom-btn rounded-none border-0" title="Zoom In">
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
