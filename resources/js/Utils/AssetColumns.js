export const getItColumns = () => [
    { key: '_no', label: 'No', type: 'display' },
    { key: 'location_name', label: 'Lokasi', type: 'text', _readOnly: true }, // For global tables
    { key: 'asset_number', label: 'Nomor Asset', type: 'text', mono: true },
    { key: 'serial_number', label: 'Serial Number', type: 'text', mono: true },
    { key: 'device_type', label: 'Jenis Perangkat', type: 'select', bold: true, options: ['PC', 'PC AIO', 'Printer', 'Scanner', 'Lainnya'] },
    { key: 'user_number', label: 'Nomor Pengguna', type: 'text' },
    { key: 'user_name', label: 'Nama Pengguna', type: 'text' },
];

export const getNetworkColumns = () => [
    { key: '_no', label: 'No', type: 'display' },
    { key: 'location_name', label: 'Lokasi', type: 'text', _readOnly: true },
    { key: 'region', label: 'Wilayah', type: 'text' },
    { key: 'active_service_location', label: 'Lokasi Layanan Aktif', type: 'text' },
    { key: 'network_type', label: 'Jaringan', type: 'text', bold: true },
    { key: 'bandwidth_kbps', label: 'Band Width (kbps)', type: 'number', mono: true, suffix: 'kbps' },
    { key: 'status', label: 'Status', type: 'status', options: ['Aktif', 'Tidak Aktif', 'Perawatan'] },
    { key: 'router_brand', label: 'Router', type: 'select', options: ['Cisco', 'Juniper', 'Malpu', 'Tidak Ada'] },
];

export const getCctvColumns = () => [
    { key: '_no', label: 'No', type: 'display' },
    { key: 'location_name', label: 'Lokasi', type: 'text', _readOnly: true },
    { key: 'train_number', label: 'Nomor Kereta', type: 'text', mono: true },
    { key: 'train_type', label: 'Type Kereta', type: 'text' },
    // Status CCTV sub-columns
    { key: 'cctv_ip', label: 'IP', subLabel: 'IP', type: 'radio', radioValue: 'ip', radioGroup: 'cctv_type', radioGroupKey: 'cctv_type', headerGroup: 'status_cctv', _skipHeader: true },
    { key: 'cctv_analog', label: 'Analog', subLabel: 'Analog', type: 'radio', radioValue: 'analog', radioGroup: 'cctv_type', radioGroupKey: 'cctv_type', headerGroup: 'status_cctv', _skipHeader: true },
    // Recorder sub-columns
    { key: 'recorder_dvr', label: 'DVR', subLabel: 'DVR', type: 'radio', radioValue: 'dvr', radioGroup: 'recorder_type', radioGroupKey: 'recorder_type', headerGroup: 'recorder', _skipHeader: true },
    { key: 'recorder_nvr', label: 'NVR', subLabel: 'NVR', type: 'radio', radioValue: 'nvr', radioGroup: 'recorder_type', radioGroupKey: 'recorder_type', headerGroup: 'recorder', _skipHeader: true },
    { key: 'recorder_standalone', label: 'Standalone', subLabel: 'Standalone', type: 'radio', radioValue: 'standalone', radioGroup: 'recorder_type', radioGroupKey: 'recorder_type', headerGroup: 'recorder', _skipHeader: true },
    { key: 'monitor', label: 'Monitor', type: 'text' },
    { key: 'quantity', label: 'Jumlah', type: 'number' },
    { key: 'condition', label: 'Kondisi', type: 'status', options: ['Baik', 'Perawatan', 'Rusak'] },
    { key: 'description', label: 'Keterangan', type: 'text' },
];

export const getCctvHeaderGroups = () => [
    { id: 'status_cctv', label: 'Status CCTV', colSpan: 2 },
    { id: 'recorder', label: 'Recorder', colSpan: 3 },
];

export const getLocotrackColumns = () => [
    { key: '_no', label: 'No', type: 'display' },
    { key: 'location_name', label: 'Lokasi', type: 'text', _readOnly: true },
    { key: 'lct_id', label: 'ID LCT', type: 'text', mono: true },
    { key: 'facility_number', label: 'No Sarana', type: 'text' },
    { key: 'gsm_number', label: 'No GSM', type: 'text', mono: true },
    { key: 'dipo', label: 'DIPO', type: 'text' },
    { key: 'daop_divre', label: 'DAOP/DIVRE', type: 'text' },
    { key: 'locotrack_type', label: 'Tipe Locotrack', type: 'text' },
    { key: 'locotrack_category', label: 'Jenis Locotrack', type: 'text' },
    { key: 'group', label: 'Kelompok', type: 'text' },
    { key: 'facility_condition', label: 'Kondisi Sarana', type: 'status', options: ['Baik', 'Perawatan', 'Rusak'] },
    { key: 'installation_year', label: 'Tahun Pemasangan', type: 'text' },
    { key: 'facility_type', label: 'Jenis Sarana', type: 'text' },
    { key: 'serial_number', label: 'SN', type: 'text', mono: true },
    { key: 'description', label: 'Keterangan', type: 'text' },
];

// Helper to filter out the location_name column for the LocationShow page
export const filterLocationColumn = (columns) => columns.filter(c => c.key !== 'location_name');
