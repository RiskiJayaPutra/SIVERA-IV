import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';

const ITEMS_PER_PAGE = 15;

if (typeof window !== 'undefined') {
    window.onerror = function(message, source, lineno, colno, error) {
        alert("CRASH: " + message + "\nLine: " + lineno + "\nError: " + (error && error.stack));
        return false;
    };
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg whitespace-pre-wrap font-mono text-xs overflow-auto">
                    <strong>Error Rendering Table:</strong><br />
                    {this.state.error && this.state.error.toString()}<br />
                    {this.state.error && this.state.error.stack}
                </div>
            );
        }
        return this.props.children;
    }
}

/**
 * EditableAssetTable — Komponen tabel reusable dengan mode view/edit (mirip Excel)
 * 
 * Props:
 * - title: string — Judul tabel (e.g. "Aset IT")
 * - icon: string — Font Awesome icon class (e.g. "fa-computer")
 * - data: array — Data aset dari server
 * - columns: array — Definisi kolom [{key, label, type, options?, colSpan?, rowSpan?}]
 * - headerGroups: array — Header group untuk nested headers (CCTV) [{label, colSpan}]
 * - locationId: string — ID lokasi untuk batch save
 * - batchRoute: string — Route name untuk batch save
 * - locationName: string — Nama lokasi untuk display
 * - readOnly: boolean — Jika true, tombol Edit disembunyikan
 */
export default function EditableAssetTable({ 
    title, icon, data = [], columns,
    locationId, batchRoute, locationName, readOnly = false,
    isGlobalMode = false, locations = [], assetTypeId, headerGroups
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [saving, setSaving] = useState(false);
    const [activeCell, setActiveCell] = useState(null); // {row, col}

    // Compute flattened columns for data mapping
    const getFlatColumns = () => {
        let cols = [];
        columns.forEach(c => {
            if (c.type === 'display') return;
            if (c.type === 'group') {
                (c.subColumns || []).forEach(sc => {
                    if (sc.type !== 'display') {
                        // Radio columns inside a group should save to their schema-defined radioGroupKey, falling back to group key
                        cols.push({
                            ...sc,
                            radioGroupKey: sc.radioGroupKey || (sc.type === 'radio' ? c.key : sc.key),
                            radioGroup: sc.radioGroup || (sc.type === 'radio' ? c.key : sc.key)
                        });
                    }
                });
            } else {
                cols.push(c);
            }
        });
        return cols;
    };
    
    const dataColumns = getFlatColumns();
    const hasGroups = columns.some(c => c.type === 'group' && (c.subColumns || []).length > 0);

    // Calculate pagination
    const totalItems = isEditing ? editData.length : data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentData = isEditing ? editData.slice(startIdx, endIdx) : data.slice(startIdx, endIdx);

    // Reset page when data changes
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [totalItems]);

    // Enter edit mode
    const handleEdit = () => {
        setEditData(data.map(item => ({ ...item, _isNew: false })));
        setDeletedIds([]);
        setIsEditing(true);
        setActiveCell(null);
    };

    // Cancel edit mode
    const handleCancel = () => {
        setIsEditing(false);
        setEditData([]);
        setDeletedIds([]);
        setActiveCell(null);
    };

    const handleAddRow = () => {
        const newRow = { _isNew: true, _tempId: Date.now() };
        dataColumns.forEach(col => {
            if (col.key !== '_no' && col.key !== '_actions') {
                if (col.type === 'group') {
                    (col.subColumns || []).forEach(subCol => {
                        newRow[subCol.radioGroupKey || subCol.key] = subCol.type === 'number' ? null : '';
                    });
                } else if (col.type === 'location_select') {
                    newRow[col.key] = ''; // blank location
                } else {
                    newRow[col.radioGroupKey || col.key] = col.type === 'number' ? null : '';
                }
            }
        });
        setEditData(prev => [...prev, newRow]);
        // Navigate to last page
        const newTotal = editData.length + 1;
        const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
    };

    // Delete row
    const handleDeleteRow = (globalIdx) => {
        const row = editData[globalIdx];
        if (row.id && !row._isNew) {
            setDeletedIds(prev => [...prev, row.id]);
        }
        setEditData(prev => prev.filter((_, i) => i !== globalIdx));
    };

    // Update cell value
    const handleCellChange = (globalIdx, key, value) => {
        setEditData(prev => {
            const updated = [...prev];
            updated[globalIdx] = { ...updated[globalIdx], [key]: value };
            return updated;
        });
    };

    // Save all changes
    const handleSave = () => {
        setSaving(true);
        const rows = editData.map(row => {
            const cleanRow = {};
            const processedKeys = new Set();
            dataColumns.forEach(col => {
                if (col.key === '_no' || col.key === '_actions') return;
                if (col.type === 'group') {
                    (col.subColumns || []).filter(sc => sc.type !== 'display').forEach(subCol => {
                        const dbKey = subCol.radioGroupKey || subCol.key;
                        if (processedKeys.has(dbKey)) return;
                        processedKeys.add(dbKey);
                        cleanRow[dbKey] = row[dbKey] ?? null;
                    });
                    return;
                }
                // Location ID specifically for global mode
                if (isGlobalMode && col.type === 'location_select') {
                    cleanRow.location_id = row[col.key] || null;
                    return;
                }
                // For radio columns, use the actual DB key (radioGroupKey) and skip virtual keys
                const dbKey = col.radioGroupKey || col.key;
                if (processedKeys.has(dbKey)) return;
                processedKeys.add(dbKey);
                cleanRow[dbKey] = row[dbKey] ?? null;
            });
            if (row.id && !row._isNew) cleanRow.id = row.id;
            if (isGlobalMode) cleanRow._isNew = row._isNew; // pass _isNew for globalBatchSave logic
            return cleanRow;
        });

        const postUrl = isGlobalMode ? route(batchRoute) : route(batchRoute, locationId);
        
        axios.post(postUrl, {
            rows,
            deleted: deletedIds,
            asset_type_id: assetTypeId
        }).then(response => {
            setSaving(false);
            setIsEditing(false);
            setDeletedIds([]);
            setActiveCell(null);
            Swal.fire({
                icon: 'success',
                title: 'Tersimpan',
                text: 'Perubahan data berhasil disimpan.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            // Reload data entirely to get new IDs, update totals, and re-sync filters
            router.reload({ preserveScroll: true, preserveState: true });
        }).catch(error => {
            setSaving(false);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: 'Terjadi kesalahan saat menyimpan data.'
            });
        });
    };

    // Render cell content in view mode
    const renderViewCell = (row, col, displayIdx) => {
        if (col.key === '_no') return displayIdx;
        
        const val = row[col.key];
        
        if (col.type === 'radio') {
            // Radio reads from the actual DB field (radioGroupKey), not the virtual column key
            const actualVal = row[col.radioGroupKey || col.key];
            const isChecked = actualVal?.toLowerCase() === col.radioValue?.toLowerCase();
            return isChecked ? <i className="fa-solid fa-check text-kai-blue font-bold"></i> : '';
        }
        
        if (col.type === 'status') {
            if (!val) return '-';
            const statusClass = val === 'Baik' || val === 'Aktif' ? 'status-baik' : val === 'Perawatan' ? 'status-perawatan' : 'status-rusak';
            return <span className={`status-badge ${statusClass}`}>{val}</span>;
        }

        if (col.type === 'location_select') {
            const loc = locations.find(l => l.id == val);
            return loc ? loc.name : (row.location_name || '-');
        }

        if (col.type === 'number' && val) {
            return col.suffix ? `${val} ${col.suffix}` : val;
        }

        return val || '-';
    };

    // Render cell input in edit mode
    const renderEditCell = (row, col, globalIdx, localIdx) => {
        if (col.key === '_no') return startIdx + localIdx + 1;
        if (col.key === '_actions') {
            return (
                <button 
                    onClick={() => handleDeleteRow(globalIdx)}
                    className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 flex items-center justify-center transition"
                    title="Hapus baris"
                >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
            );
        }

        const isActive = activeCell?.row === globalIdx && activeCell?.col === col.key;
        // For radio columns, read from the actual DB field
        const val = col.type === 'radio' ? (row[col.radioGroupKey || col.key] ?? '') : (row[col.key] ?? '');

        if (col.type === 'select') {
            return (
                <select
                    value={val}
                    onChange={(e) => handleCellChange(globalIdx, col.key, e.target.value)}
                    className="w-full bg-transparent border-0 text-xs py-1 px-1 focus:ring-1 focus:ring-kai-blue rounded cursor-pointer"
                >
                    <option value="">— Pilih —</option>
                    {col.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        if (col.type === 'location_select') {
            return (
                <select
                    value={val}
                    onChange={(e) => handleCellChange(globalIdx, col.key, e.target.value)}
                    className="w-full bg-transparent border-0 text-xs py-1 px-1 font-bold text-kai-blue focus:ring-1 focus:ring-kai-blue rounded cursor-pointer"
                >
                    <option value="">— Pilih Lokasi —</option>
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
            );
        }

        if (col.type === 'radio') {
            const isChecked = val?.toLowerCase() === col.radioValue?.toLowerCase();
            return (
                <div className="flex items-center justify-center">
                    <input
                        type="radio"
                        name={`${col.radioGroup}_${globalIdx}`}
                        checked={isChecked}
                        onChange={() => handleCellChange(globalIdx, col.radioGroupKey || col.key, col.radioValue)}
                        className="w-4 h-4 text-kai-blue focus:ring-kai-blue cursor-pointer"
                    />
                </div>
            );
        }

        if (col.type === 'status') {
            return (
                <select
                    value={val}
                    onChange={(e) => handleCellChange(globalIdx, col.key, e.target.value)}
                    className="w-full bg-transparent border-0 text-xs py-1 px-1 focus:ring-1 focus:ring-kai-blue rounded cursor-pointer"
                >
                    <option value="">— Pilih —</option>
                    {(col.options || ['Baik', 'Perawatan', 'Rusak']).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        // Text / Number — show as plain text until clicked
        if (!isActive) {
            return (
                <div 
                    onClick={() => setActiveCell({ row: globalIdx, col: col.key })}
                    className="cursor-text min-h-[28px] flex items-center text-xs px-1 py-1 rounded hover:bg-kai-blue/5 transition"
                >
                    {val || <span className="text-slate-300 italic">Klik untuk isi...</span>}
                </div>
            );
        }

        return (
            <input
                type={col.type === 'number' ? 'number' : 'text'}
                value={val}
                onChange={(e) => handleCellChange(globalIdx, col.key, col.type === 'number' ? (e.target.value ? parseInt(e.target.value) : null) : e.target.value)}
                onBlur={() => setActiveCell(null)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') setActiveCell(null); }}
                autoFocus
                className="w-full bg-white border border-kai-blue/40 text-xs py-1 px-2 rounded focus:ring-2 focus:ring-kai-blue/30 focus:border-kai-blue outline-none shadow-sm"
            />
        );
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    // Determine which columns to render (filter out radio "display" columns in edit mode is not needed, we render all)
    const allEditColumns = [...dataColumns]; // includes _actions

    return (
        <ErrorBoundary>
        <div className={`bg-white rounded-2xl shadow-card border overflow-hidden fade-in mb-5 transition-all ${isEditing ? 'border-kai-blue/30 ring-1 ring-kai-blue/10' : 'border-slate-200'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-kai-blue flex items-center gap-2">
                    <i className={`fa-solid ${icon} text-kai-orange`}></i>
                    {title} {locationName ? `di ${locationName}` : ''}
                    <span className="text-[10px] font-bold text-slate-400 ml-1">({data.length})</span>
                </h3>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-50"
                            >
                                {saving ? (
                                    <><i className="fa-solid fa-spinner fa-spin text-xs"></i> Menyimpan...</>
                                ) : (
                                    <><i className="fa-solid fa-floppy-disk text-xs"></i> Simpan</>
                                )}
                            </button>
                        </>
                    ) : (
                        !readOnly && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-kai-blue bg-kai-blue/10 hover:bg-kai-blue/20 rounded-lg transition"
                            >
                                <i className="fa-solid fa-pen-to-square text-xs"></i>
                                Edit Data
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        {/* Nested header (for CCTV-style tables) */}
                        {hasGroups ? (
                            <>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider text-center">
                                    {columns.filter(c => c.type !== 'display').map((col, i) => {
                                        if (col.type === 'group') {
                                            const subCount = (col.subColumns || []).filter(sc => sc.type !== 'display').length;
                                            if (subCount === 0) return null;
                                            return (
                                                <th key={`hg-${i}`} colSpan={subCount} className="py-2.5 px-2 border border-slate-200 bg-blue-50/50 text-kai-blue font-bold">
                                                    {col.label}
                                                </th>
                                            );
                                        }
                                        return (
                                            <th key={`rh-${i}`} rowSpan={2} className="py-3 px-3 border border-slate-200 bg-slate-50 text-slate-600 align-middle">
                                                {col.label}
                                            </th>
                                        );
                                    })}
                                    {isEditing && <th rowSpan={2} className="py-3 px-2 w-10 border border-slate-200 bg-slate-50"></th>}
                                </tr>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider text-center">
                                    {columns.filter(c => c.type === 'group').map(group => (
                                        (group.subColumns || []).filter(sc => sc.type !== 'display').map((subCol, si) => (
                                            <th key={`sh-${group.key}-${si}`} className="py-2.5 px-2 border border-slate-200 bg-white text-slate-600">
                                                {subCol.subLabel || subCol.label}
                                            </th>
                                        ))
                                    ))}
                                </tr>
                            </>
                        ) : (
                            /* Simple header (non-nested) */
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                {dataColumns.map((col, i) => (
                                    <th key={i} className={`py-3 px-4 border border-slate-200 bg-slate-50 text-slate-600 align-middle ${col.type === 'radio' || col.type === 'status' || col.type === 'display' ? 'text-center' : 'text-left'}`}>{col.label}</th>
                                ))}
                                {isEditing && <th className="py-3 px-2 w-10 border border-slate-200 bg-slate-50"></th>}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {currentData.length === 0 && !isEditing ? (
                            <tr>
                                <td colSpan={dataColumns.length + (isEditing ? 1 : 0)} className="py-12 text-center text-slate-400 text-sm">
                                    <i className={`fa-solid ${icon} text-3xl block mb-2 opacity-30`}></i>
                                    Belum ada {title} di lokasi ini
                                </td>
                            </tr>
                        ) : (
                            currentData.map((row, localIdx) => {
                                const globalIdx = startIdx + localIdx;
                                const displayIdx = globalIdx + 1;
                                const isDeleted = deletedIds.includes(row.id);
                                if (isDeleted) return null;

                                return (
                                    <tr 
                                        key={row.id || row._tempId || localIdx} 
                                        className={`border-b border-slate-100 transition ${
                                            isEditing 
                                                ? 'hover:bg-kai-blue/5' 
                                                : 'hover:bg-blue-50/40'
                                        } ${row._isNew ? 'bg-emerald-50/30' : ''}`}
                                    >
                                        {dataColumns.map((col, colIdx) => {
                                            if (col.type === 'group') {
                                                return (col.subColumns || []).filter(sc => sc.type !== 'display').map((subCol, sIdx) => (
                                                    <td 
                                                        key={`${colIdx}-${sIdx}`} 
                                                        className={`py-2 px-2 text-xs border border-slate-200 ${
                                                            (headerGroups || subCol.type === 'radio' || subCol.type === 'status') ? 'text-center' : 'px-3'
                                                        } ${subCol.mono ? 'font-mono' : ''} ${subCol.bold ? 'font-semibold text-slate-800' : 'text-slate-600'}`}
                                                    >
                                                        {isEditing 
                                                            ? renderEditCell(row, subCol, globalIdx, localIdx)
                                                            : renderViewCell(row, subCol, displayIdx)
                                                        }
                                                    </td>
                                                ));
                                            }
                                            return (
                                                <td 
                                                    key={colIdx} 
                                                    className={`py-2 px-2 text-xs border border-slate-200 ${
                                                        (headerGroups || col.type === 'radio' || col.type === 'status') ? 'text-center' : 'px-3'
                                                    } ${col.mono ? 'font-mono' : ''} ${col.bold ? 'font-semibold text-slate-800' : 'text-slate-600'}`}
                                                >
                                                    {isEditing 
                                                        ? renderEditCell(row, col, globalIdx, localIdx)
                                                        : renderViewCell(row, col, displayIdx)
                                                    }
                                                </td>
                                            );
                                        })}
                                        {isEditing && (
                                            <td className="py-2 px-2 text-center border border-slate-200">
                                                {renderEditCell(row, { key: '_actions' }, globalIdx, localIdx)}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add row button in edit mode */}
            {isEditing && (
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleAddRow}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-kai-blue bg-kai-blue/10 hover:bg-kai-blue/20 rounded-lg transition w-full justify-center"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        Tambah Baris Baru
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-slate-400 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    {getPageNumbers().map((page, i) => (
                        page === '...' ? (
                            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-300">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                    currentPage === page 
                                        ? 'bg-kai-blue text-white shadow-sm shadow-kai-blue/30' 
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-slate-400 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    <span className="text-[10px] text-slate-400 ml-2">
                        {startIdx + 1}–{Math.min(endIdx, totalItems)} dari {totalItems}
                    </span>
                </div>
            )}
        </div>
        </ErrorBoundary>
    );
}
