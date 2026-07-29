import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

// Helper: auto-generate a slug key from Indonesian label
const labelToKey = (label) => {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_') || 'kolom';
};

// Type configs for user-friendly labels and icons
const TYPE_OPTIONS = [
    { value: 'text', label: 'Teks Pendek', icon: 'fa-font', desc: 'Satu baris teks' },
    { value: 'number', label: 'Angka', icon: 'fa-hashtag', desc: 'Hanya angka' },
    { value: 'select', label: 'Dropdown', icon: 'fa-list-ul', desc: 'Pilihan statis' },
    { value: 'radio', label: 'Opsi Tunggal', icon: 'fa-circle-dot', desc: 'Untuk tipe Grup' },
    { value: 'date', label: 'Tanggal', icon: 'fa-calendar', desc: 'Pemilih tanggal' },
    { value: 'status', label: 'Status', icon: 'fa-tags', desc: 'Label warna' },
    { value: 'group', label: 'Grup Header', icon: 'fa-layer-group', desc: 'Header bersarang' },
    { value: 'location_select', label: 'Pilih Wilayah', icon: 'fa-map-location-dot', desc: 'Pilihan Lokasi' }
];

const ColumnCard = ({ col, idx, total, onUpdate, onRemove, onMoveUp, onMoveDown, onMove, expandedIdx, setExpandedIdx, draggedIdx, setDraggedIdx, dragOverIdx, setDragOverIdx, parentIdx = null, addColumn }) => {
    const myId = parentIdx !== null ? `${parentIdx}-${idx}` : `${idx}`;
    const isExpanded = expandedIdx === myId || (expandedIdx && typeof expandedIdx === 'string' && expandedIdx.startsWith(`${myId}-`));
    const typeConfig = TYPE_OPTIONS.find(t => t.value === col.type) || TYPE_OPTIONS[0];

    const handleLabelChange = (newLabel) => {
        const updates = { label: newLabel };
        // Auto-generate key if it was auto-generated before (starts with 'col_' or matches old auto-key)
        if (!col._keyManual) {
            updates.key = labelToKey(newLabel);
        }
        // Also update subLabel for radio columns
        if (col.type === 'radio') {
            updates.subLabel = newLabel;
        }
        onUpdate(idx, updates, undefined, parentIdx);
    };

    // Style for drag feedback
    let dragClass = '';
    if (draggedIdx === myId) dragClass = 'opacity-50 scale-[0.98]';
    else if (dragOverIdx === myId) dragClass = 'border-kai-blue border-dashed border-2 bg-kai-blue/5 scale-[1.01]';
    else dragClass = isExpanded ? 'border-kai-blue/40 bg-white shadow-md ring-1 ring-kai-blue/10' : 'border-slate-200 bg-slate-50/80 hover:border-slate-300';

    return (
        <div 
            draggable={!isExpanded}
            onDragStart={(e) => {
                if (isExpanded) { e.preventDefault(); return; }
                e.dataTransfer.effectAllowed = 'move';
                setDraggedIdx(myId);
            }}
            onDragOver={(e) => {
                if (isExpanded || draggedIdx === null) return;
                // Only allow dropping within the same parent
                const draggedParts = draggedIdx.toString().split('-');
                const myParts = myId.toString().split('-');
                if (draggedParts.length !== myParts.length) return;
                if (draggedParts.length === 2 && draggedParts[0] !== myParts[0]) return;
                
                e.preventDefault();
                if (dragOverIdx !== myId) setDragOverIdx(myId);
            }}
            onDragLeave={() => {
                if (dragOverIdx === myId) setDragOverIdx(null);
            }}
            onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null && draggedIdx !== myId) {
                    const draggedParts = draggedIdx.toString().split('-');
                    const myParts = myId.toString().split('-');
                    
                    if (draggedParts.length === myParts.length && (draggedParts.length === 1 || draggedParts[0] === myParts[0])) {
                        const fromIdx = parseInt(draggedParts[draggedParts.length - 1]);
                        const toIdx = parseInt(myParts[myParts.length - 1]);
                        
                        if (fromIdx !== toIdx && typeof onMove === 'function') {
                            onMove(fromIdx, toIdx, parentIdx);
                        }
                    }
                }
                setDraggedIdx(null);
                setDragOverIdx(null);
            }}
            onDragEnd={() => {
                setDraggedIdx(null);
                setDragOverIdx(null);
            }}
            className={`rounded-xl border transition-all duration-200 ${dragClass}`}
        >
            {/* Collapsed Header - Always Visible */}
            <div 
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                onClick={() => setExpandedIdx(isExpanded ? null : myId)}
            >
                {/* Drag Handle */}
                {!isExpanded && (
                    <div className="w-5 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                        <i className="fa-solid fa-grip-vertical"></i>
                    </div>
                )}
                {/* Number Badge */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${isExpanded ? 'bg-kai-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                </div>

                {/* Type Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isExpanded ? 'bg-kai-blue/10 text-kai-blue' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    <i className={`fa-solid ${typeConfig.icon} text-sm`}></i>
                </div>

                {/* Label & Type Summary */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{col.label || 'Kolom Tanpa Nama'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{typeConfig.label}
                        {col.options && col.options.length > 0 && <span className="text-slate-300"> · {col.options.length} pilihan</span>}
                        {col.headerGroup && <span className="text-kai-blue/60"> · Sub-kolom</span>}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => onMoveUp(idx, parentIdx)} disabled={idx === 0} className="w-7 h-7 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed">
                        <i className="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                    <button type="button" onClick={() => onMoveDown(idx, parentIdx)} disabled={idx === total - 1} className="w-7 h-7 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed">
                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                    </button>
                    <button type="button" onClick={() => onRemove(idx, parentIdx)} className="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition ml-1">
                        <i className="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                </div>

                {/* Expand Indicator */}
                <i className={`fa-solid fa-chevron-right text-[10px] text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}></i>
            </div>

            {/* Expanded Settings */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-4 animate-fadeIn">
                    {/* Row 1: Nama Kolom */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">
                            <i className="fa-solid fa-tag text-slate-400 mr-1.5"></i>
                            Nama Kolom (Header Tabel)
                        </label>
                        <input 
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 outline-none transition"
                            value={col.label}
                            onChange={e => handleLabelChange(e.target.value)}
                            placeholder="Misal: Nomor Kereta, Kondisi, dll"
                        />
                    </div>

                    {/* Row 2: Tipe Data — Visual Cards */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                            <i className="fa-solid fa-shapes text-slate-400 mr-1.5"></i>
                            Jenis Data
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
                            {TYPE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onUpdate(idx, 'type', opt.value, parentIdx)}
                                    className={`text-left p-2.5 rounded-xl border-2 transition-all duration-150 ${
                                        col.type === opt.value 
                                            ? (opt.value === 'group' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-kai-blue bg-kai-blue/5 shadow-sm')
                                            : 'border-slate-100 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className={`fa-solid ${opt.icon} text-xs ${col.type === opt.value ? 'text-kai-blue' : 'text-slate-400'}`}></i>
                                        <span className={`text-xs font-bold ${col.type === opt.value ? 'text-kai-blue' : 'text-slate-700'}`}>{opt.label}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditional: Dropdown Options */}
                    {(col.type === 'select' || col.type === 'status') && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                            <label className="block text-xs font-bold text-amber-700 mb-1.5">
                                <i className="fa-solid fa-list mr-1.5"></i>
                                Daftar Pilihan
                            </label>
                            <p className="text-[10px] text-amber-600/70 mb-2">Pisahkan setiap pilihan menggunakan tanda koma ( , )</p>
                            <input 
                                type="text"
                                className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-kai-blue focus:ring-1 focus:ring-kai-blue/20 outline-none"
                                value={col.options_raw !== undefined ? col.options_raw : (col.options || []).join(', ')}
                                onChange={e => onUpdate(idx, {
                                    options_raw: e.target.value,
                                    options: e.target.value.split(',').map(s => s.trimStart())
                                }, null, parentIdx)}
                                placeholder={col.type === 'status' ? 'Baik, Perawatan, Rusak' : 'Pilihan 1, Pilihan 2, Pilihan 3'}
                            />
                            {(col.options || []).filter(opt => opt.trim()).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {col.options.filter(opt => opt.trim()).map((opt, oi) => (
                                        <span key={oi} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            col.type === 'status' 
                                                ? (opt === 'Baik' || opt === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : opt === 'Perawatan' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')
                                                : 'bg-slate-100 text-slate-600'
                                        }`}>{opt}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Conditional: Radio / Sub-Column Config */}
                    {col.type === 'radio' && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3 mt-4">
                            <p className="text-xs font-bold text-kai-blue flex items-center gap-1.5">
                                <i className="fa-solid fa-circle-dot"></i>
                                Pengaturan Sub-Kolom (Pilihan Tunggal)
                            </p>
                            <p className="text-[10px] text-blue-500/70 -mt-1">Kolom ini akan muncul sebagai opsi radio. Contoh: IP atau Analog</p>
                            
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nilai yang Disimpan</label>
                                <input 
                                    type="text"
                                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:border-kai-blue outline-none"
                                    value={col.radioValue || ''}
                                    onChange={e => onUpdate(idx, 'radioValue', e.target.value, parentIdx)}
                                    placeholder="Contoh: ip, analog, dvr"
                                />
                                <p className="text-[9px] text-slate-400 mt-0.5">Teks yang akan tersimpan di database ketika opsi ini dipilih</p>
                            </div>
                        </div>
                    )}

                    {/* Conditional: Group Type (Sub-Columns) */}
                    {col.type === 'group' && (
                        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 mt-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-purple-600 flex items-center gap-1.5">
                                    <i className="fa-solid fa-layer-group"></i> Sub-Kolom (Berada di bawah header ini)
                                </p>
                                <span className="text-[10px] font-bold text-purple-400 bg-purple-100 px-2 py-0.5 rounded-full">
                                    {(col.subColumns || []).length} kolom
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                                {(col.subColumns || []).map((subCol, sIdx) => (
                                    <ColumnCard 
                                        key={`sub-${idx}-${sIdx}`}
                                        col={subCol} idx={sIdx} total={(col.subColumns || []).length} parentIdx={idx}
                                        onUpdate={onUpdate} onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown}
                                        onMove={onMove}
                                        expandedIdx={expandedIdx} setExpandedIdx={setExpandedIdx}
                                        draggedIdx={draggedIdx} setDraggedIdx={setDraggedIdx}
                                        dragOverIdx={dragOverIdx} setDragOverIdx={setDragOverIdx}
                                        addColumn={addColumn}
                                    />
                                ))}
                                {(col.subColumns || []).length === 0 && (
                                    <div className="text-center py-4 border-2 border-dashed border-purple-200 rounded-lg">
                                        <p className="text-[10px] font-bold text-purple-400">Belum ada sub-kolom</p>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => addColumn(idx)}
                                className="w-full py-2.5 border-2 border-dashed border-purple-200 rounded-lg text-purple-400 font-bold hover:border-purple-500 hover:text-purple-600 transition hover:bg-purple-100 flex justify-center items-center gap-2 text-xs"
                            >
                                <i className="fa-solid fa-plus"></i> Tambah Sub-Kolom
                            </button>
                        </div>
                    )}

                    {/* Toggles Row */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${col.bold ? 'bg-kai-blue/5 border-kai-blue/30 text-kai-blue' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={col.bold || false} onChange={e => onUpdate(idx, 'bold', e.target.checked, parentIdx)} className="sr-only" />
                            <i className={`fa-solid fa-bold text-xs ${col.bold ? 'text-kai-blue' : 'text-slate-300'}`}></i>
                            Tebal
                        </label>
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${col.mono ? 'bg-kai-blue/5 border-kai-blue/30 text-kai-blue' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={col.mono || false} onChange={e => onUpdate(idx, 'mono', e.target.checked, parentIdx)} className="sr-only" />
                            <i className={`fa-solid fa-code text-xs ${col.mono ? 'text-kai-blue' : 'text-slate-300'}`}></i>
                            Monospace
                        </label>
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${col._readOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={col._readOnly || false} onChange={e => onUpdate(idx, '_readOnly', e.target.checked, parentIdx)} className="sr-only" />
                            <i className={`fa-solid fa-lock text-xs ${col._readOnly ? 'text-amber-500' : 'text-slate-300'}`}></i>
                            Hanya Baca
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

// Live Preview component
function LivePreview({ columns }) {
    // Flatten visible columns for the <tbody>
    const getVisibleCols = () => {
        let cols = [];
        columns.forEach(c => {
            if (c.type === 'display') return;
            if (c.type === 'group') {
                (c.subColumns || []).forEach(sc => {
                    if (sc.type !== 'display') cols.push(sc);
                });
            } else {
                cols.push(c);
            }
        });
        return cols;
    };
    
    const visibleCols = getVisibleCols();
    const hasGroups = columns.some(c => c.type === 'group' && (c.subColumns || []).length > 0);

    const sampleData = [
        { _fill: true }, { _fill: true },
    ];

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-eye text-kai-blue text-xs"></i>
                <span className="text-xs font-bold text-slate-600">Preview Tabel</span>
                <span className="text-[10px] text-slate-400 ml-auto">{visibleCols.length} kolom</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        {hasGroups ? (
                            <>
                                <tr className="bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
                                    <th rowSpan={2} className="py-2 px-3 border border-slate-200 bg-slate-100 w-10">No</th>
                                    {columns.filter(c => c.type !== 'display').map((col, i) => {
                                        if (col.type === 'group') {
                                            const subCount = (col.subColumns || []).filter(sc => sc.type !== 'display').length;
                                            if (subCount === 0) return null;
                                            return <th key={`hg-${i}`} colSpan={subCount} className="py-2 px-2 border border-slate-200 bg-purple-50 text-purple-600 font-bold">{col.label}</th>;
                                        }
                                        return <th key={`rh-${i}`} rowSpan={2} className="py-2 px-2 border border-slate-200 bg-slate-100 text-slate-500 align-middle">{col.label}</th>;
                                    })}
                                </tr>
                                <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                                    {columns.filter(c => c.type === 'group').map(group => (
                                        (group.subColumns || []).filter(sc => sc.type !== 'display').map((subCol, si) => (
                                            <th key={`sh-${group.key}-${si}`} className="py-1.5 px-2 border border-slate-200 bg-slate-50 text-slate-400">{subCol.label}</th>
                                        ))
                                    ))}
                                </tr>
                            </>
                        ) : (
                            <tr className="bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <th className="py-2 px-3 border border-slate-200 w-10">No</th>
                                {columns.filter(c => c.type !== 'display').map((col, i) => (
                                    <th key={i} className="py-2 px-3 border border-slate-200 text-left">{col.label}</th>
                                ))}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {sampleData.map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-2 px-3 border border-slate-200 text-center text-slate-400 font-mono">{rowIdx + 1}</td>
                                {visibleCols.map((col, ci) => (
                                    <td key={ci} className={`py-2 px-3 border border-slate-200 ${col.mono ? 'font-mono' : ''} ${col.bold ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
                                        {col.type === 'radio' ? (
                                            <div className="flex justify-center">
                                                <div className={`w-3.5 h-3.5 rounded-full border-2 ${rowIdx === 0 ? 'border-kai-blue bg-kai-blue' : 'border-slate-300'}`}>
                                                    {rowIdx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[2px]"></div>}
                                                </div>
                                            </div>
                                        ) : col.type === 'status' ? (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rowIdx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {(col.options || ['Baik', 'Perawatan'])[rowIdx % (col.options?.length || 2)]}
                                            </span>
                                        ) : col.type === 'select' ? (
                                            <span className="text-slate-500 italic">{(col.options || ['—'])[0]}</span>
                                        ) : col.type === 'number' ? (
                                            <span className="text-slate-400 font-mono">{rowIdx === 0 ? '128' : '256'}</span>
                                        ) : (
                                            <span className="text-slate-300">contoh data...</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Transform legacy flat schema with headerGroups into new nested group schema
const getInitialSchema = (assetType) => {
    if (!assetType?.schema) return { columns: [] };
    // Deep clone to avoid mutating original prop
    const schema = JSON.parse(JSON.stringify(assetType.schema));
    
    // If it's already using the new format or doesn't have legacy headerGroups, return as is
    if (!schema.headerGroups || schema.headerGroups.length === 0) return schema;
    
    const newColumns = [];
    const groupMap = {}; // mapping groupId to its group column
    
    (schema.columns || []).forEach(col => {
        if (col.headerGroup) {
            // Find or create group
            if (!groupMap[col.headerGroup]) {
                const legacyGroupInfo = schema.headerGroups.find(g => g.id === col.headerGroup);
                const groupCol = {
                    key: `group_${col.headerGroup}`,
                    label: legacyGroupInfo ? legacyGroupInfo.label : 'Group',
                    type: 'group',
                    subColumns: []
                };
                groupMap[col.headerGroup] = groupCol;
                newColumns.push(groupCol);
            }
            // Add col as sub-column
            const subCol = { ...col };
            delete subCol.headerGroup;
            groupMap[col.headerGroup].subColumns.push(subCol);
        } else {
            newColumns.push(col);
        }
    });
    
    return { columns: newColumns };
};

export default function Builder({ assetType }) {
    const isEdit = !!assetType;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: assetType?.name || '',
        icon: assetType?.icon || 'fa-box',
        schema: getInitialSchema(assetType)
    });

    // === Undo/Redo State ===
    const [history, setHistory] = useState([data.schema]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const updateSchema = (newSchema) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newSchema)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setData('schema', newSchema);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setData('schema', history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setData('schema', history[newIndex]);
        }
    };

    const [expandedIdx, setExpandedIdx] = useState(null);
    const [draggedIdx, setDraggedIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    // === Column Handlers ===
    const addColumn = (parentIdx = null) => {
        const newCol = { key: `kolom_${Date.now()}`, label: '', type: 'text' };
        const newSchema = { ...data.schema };
        newSchema.columns = [...(newSchema.columns || [])];
        
        if (parentIdx !== null) {
            if (!newSchema.columns[parentIdx].subColumns) newSchema.columns[parentIdx].subColumns = [];
            newSchema.columns[parentIdx].subColumns = [...newSchema.columns[parentIdx].subColumns, newCol];
            setExpandedIdx(`${parentIdx}-${newSchema.columns[parentIdx].subColumns.length - 1}`);
        } else {
            newSchema.columns.push(newCol);
            setExpandedIdx(`${newSchema.columns.length - 1}`);
        }
        updateSchema(newSchema);
    };

    const updateColumn = (index, fieldOrObj, value, parentIdx = null) => {
        const newSchema = { ...data.schema };
        newSchema.columns = JSON.parse(JSON.stringify(newSchema.columns || [])); // deep copy

        let targetCol = parentIdx !== null ? newSchema.columns[parentIdx].subColumns[index] : newSchema.columns[index];

        if (typeof fieldOrObj === 'object') {
            Object.assign(targetCol, fieldOrObj);
        } else {
            targetCol[fieldOrObj] = value;
        }
        updateSchema(newSchema);
    };

    const removeColumn = (index, parentIdx = null) => {
        const newSchema = { ...data.schema };
        newSchema.columns = JSON.parse(JSON.stringify(newSchema.columns || []));
        
        if (parentIdx !== null) {
            newSchema.columns[parentIdx].subColumns.splice(index, 1);
        } else {
            newSchema.columns.splice(index, 1);
        }
        updateSchema(newSchema);
        setExpandedIdx(null);
    };

    const moveColumn = (fromIdx, toIdx, parentIdx = null) => {
        const newSchema = { ...data.schema };
        newSchema.columns = JSON.parse(JSON.stringify(newSchema.columns || []));

        let targetArray = parentIdx !== null ? newSchema.columns[parentIdx].subColumns : newSchema.columns;
        if (!targetArray || toIdx < 0 || toIdx >= targetArray.length) return;

        const [moved] = targetArray.splice(fromIdx, 1);
        targetArray.splice(toIdx, 0, moved);
        updateSchema(newSchema);
        setExpandedIdx(parentIdx !== null ? `${parentIdx}-${toIdx}` : `${toIdx}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.name) {
            return Swal.fire('Perhatian', 'Nama aset wajib diisi', 'warning');
        }
        
        // Clean up empty options and temporary fields before saving
        const cleanedSchema = JSON.parse(JSON.stringify(data.schema));
        cleanedSchema.columns.forEach(col => {
            if (col.options) col.options = col.options.map(o => o.trim()).filter(o => o);
            delete col.options_raw;
            if (col.subColumns) {
                col.subColumns.forEach(sub => {
                    if (sub.options) sub.options = sub.options.map(o => o.trim()).filter(o => o);
                    delete sub.options_raw;
                });
            }
        });
        
        setData('schema', cleanedSchema);
        
        if (isEdit) {
            put(route('asset-types.update', assetType.id));
        } else {
            post(route('asset-types.store'));
        }
    };

    const columns = data.schema.columns || [];

    return (
        <AuthenticatedLayout 
            headerTitle={isEdit ? `Edit Header: ${data.name}` : 'Buat Skema Aset Baru'} 
            headerSubtitle="Atur kolom, dropdown, dan struktur header tabel aset"
        >
            <Head title={`${isEdit ? 'Edit' : 'Buat'} Skema - SIVERA IV`} />

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto fade-in">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    
                    {/* LEFT: Column Editor (3 cols) */}
                    <div className="xl:col-span-3 space-y-5">
                        
                        {/* Meta Info Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-kai-blue/10 text-kai-blue flex items-center justify-center text-xl border border-kai-blue/10">
                                    <i className={`fa-solid ${data.icon}`}></i>
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text"
                                        className="w-full bg-transparent border-0 border-b-2 border-slate-200 text-lg font-extrabold text-slate-800 pb-1 focus:border-kai-blue outline-none transition placeholder:text-slate-300"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nama Tipe Aset (misal: Aset CCTV)"
                                    />
                                </div>
                                <div className="shrink-0">
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">ICON</label>
                                    <input 
                                        type="text"
                                        className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-center font-mono focus:border-kai-blue outline-none"
                                        value={data.icon}
                                        onChange={e => setData('icon', e.target.value)}
                                        placeholder="fa-box"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Column List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-table-columns text-kai-blue text-sm"></i>
                                    <h3 className="text-sm font-extrabold text-slate-800">Daftar Kolom</h3>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{columns.length} kolom</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setExpandedIdx(null); }} 
                                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                                >
                                    <i className="fa-solid fa-compress mr-1"></i> Tutup Semua
                                </button>
                            </div>
                            
                            <div className="p-4 space-y-2">
                                {columns.map((col, idx) => (
                                    <ColumnCard 
                                        key={`col-${idx}`}
                                        col={col} idx={idx} total={columns.length}
                                        onUpdate={updateColumn}
                                        onRemove={removeColumn}
                                        onMoveUp={(i, p) => moveColumn(i, i - 1, p)}
                                        onMoveDown={(i, p) => moveColumn(i, i + 1, p)}
                                        onMove={moveColumn}
                                        expandedIdx={expandedIdx}
                                        setExpandedIdx={setExpandedIdx}
                                        draggedIdx={draggedIdx}
                                        setDraggedIdx={setDraggedIdx}
                                        dragOverIdx={dragOverIdx}
                                        setDragOverIdx={setDragOverIdx}
                                        addColumn={addColumn}
                                    />
                                ))}

                                {columns.length === 0 && (
                                    <div className="py-10 text-center text-slate-300">
                                        <i className="fa-solid fa-table-columns text-3xl mb-3 block"></i>
                                        <p className="text-sm font-semibold">Belum ada kolom</p>
                                        <p className="text-xs mt-1">Klik tombol di bawah untuk menambahkan kolom pertama</p>
                                    </div>
                                )}

                                <button 
                                    type="button" 
                                    onClick={() => addColumn()}
                                    className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-kai-blue hover:text-kai-blue transition hover:bg-kai-blue/5 flex justify-center items-center gap-2 text-sm"
                                >
                                    <i className="fa-solid fa-plus"></i> Tambah Kolom Baru
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: Live Preview & Actions (2 cols) */}
                    <div className="xl:col-span-2 space-y-5">
                        
                        {/* Sticky Preview */}
                        <div className="xl:sticky xl:top-4 space-y-5">
                            {/* Live Preview */}
                            <LivePreview columns={columns} />

                            {/* Summary Stats */}
                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                                    <i className="fa-solid fa-chart-pie text-kai-orange text-xs"></i> Ringkasan Skema
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-black text-slate-800">{columns.length}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Blok</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-black text-slate-800">{columns.filter(c => c.type === 'group').length}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Header Grup</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-black text-slate-800">{
                                            columns.reduce((count, c) => count + (c.type === 'group' ? (c.subColumns || []).length : 0), 0)
                                        }</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sub-Kolom</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-black text-slate-800">{
                                            columns.reduce((count, c) => {
                                                if (c.type === 'group') return count + (c.subColumns || []).filter(s => s.type === 'radio').length;
                                                return count + (c.type === 'radio' ? 1 : 0);
                                            }, 0)
                                        }</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Radio / Pilihan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 rounded-xl p-1">
                                    <button 
                                        type="button" onClick={undo} disabled={historyIndex === 0}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white hover:shadow-sm transition"
                                    >
                                        <i className="fa-solid fa-rotate-left"></i>
                                    </button>
                                    <button 
                                        type="button" onClick={redo} disabled={historyIndex === history.length - 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white hover:shadow-sm transition"
                                    >
                                        <i className="fa-solid fa-rotate-right"></i>
                                    </button>
                                </div>
                                <div className="flex-1 flex gap-3">
                                    <Link 
                                        href={route('asset-types.index')} 
                                        className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition"
                                    >
                                        <i className="fa-solid fa-arrow-left mr-2"></i>Batal
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-[2] px-5 py-3 rounded-xl text-sm font-bold text-white bg-kai-blue hover:bg-blue-800 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
                                        ) : (
                                            <><i className="fa-solid fa-check-circle"></i> Simpan Perubahan</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
