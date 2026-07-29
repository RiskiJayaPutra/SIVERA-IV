// ============================================
// SIVERA IV - Shared Application Logic & DB
// ============================================

const DEFAULT_DB = {
    locations: [
        // === JALUR UTAMA — Horizontal (Y=620) ===
        { id: 'st-tarahan', name: 'Stasiun Tarahan', type: 'stasiun', x: 80, y: 620, color: '#F97316', parentId: null },
        { id: 'st-sukamenanti', name: 'Stasiun Sukamenanti', type: 'stasiun', x: 130, y: 620, color: '#F97316', parentId: null },
        { id: 'st-garuntung', name: 'Stasiun Garuntung', type: 'stasiun', x: 180, y: 620, color: '#F97316', parentId: null },
        { id: 'st-tanjungkarang', name: 'Stasiun Tanjung Karang', type: 'stasiun', x: 230, y: 620, color: '#F97316', parentId: null },
        { id: 'st-labuanratu', name: 'Stasiun Labuan Ratu', type: 'stasiun', x: 280, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-gedungratu', name: 'Stasiun Gedung Ratu', type: 'stasiun', x: 320, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-rejosari', name: 'Stasiun Rejosari', type: 'stasiun', x: 360, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-branti', name: 'Stasiun Branti', type: 'stasiun', x: 400, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-tegineneng', name: 'Stasiun Tegineneng', type: 'stasiun', x: 440, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-rengas', name: 'Stasiun Rengas', type: 'stasiun', x: 480, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-bekri', name: 'Stasiun Bekri', type: 'stasiun', x: 520, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-hajipemanggilan', name: 'Stasiun Haji Pemanggilan', type: 'stasiun', x: 560, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-sulusuban', name: 'Stasiun Sulusuban', type: 'stasiun', x: 600, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-bl-pagar', name: 'Stasiun Blambangan Pagar', type: 'stasiun', x: 640, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-kalibalangan', name: 'Stasiun Kalibalangan', type: 'stasiun', x: 680, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-candimas', name: 'Stasiun Candi Mas', type: 'stasiun', x: 720, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-kotabumi', name: 'Stasiun Kota Bumi', type: 'stasiun', x: 760, y: 620, color: '#F97316', parentId: null },
        { id: 'st-cempaka', name: 'Stasiun Cempaka', type: 'stasiun', x: 800, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-menggala', name: 'Stasiun Menggala', type: 'stasiun', x: 840, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-ketapang', name: 'Stasiun Ketapang', type: 'stasiun', x: 810, y: 550, color: '#22C55E', parentId: null },
        { id: 'st-negara-ratu', name: 'Stasiun Negara Ratu', type: 'stasiun', x: 880, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-tulung-buyut', name: 'Stasiun Tulung Buyut', type: 'stasiun', x: 920, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-negara-agung', name: 'Stasiun Negara Agung', type: 'stasiun', x: 960, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-blambanganumpu', name: 'Stasiun Blambangan Umpu', type: 'stasiun', x: 1000, y: 620, color: '#22C55E', parentId: null },
        { id: 'st-giham', name: 'Stasiun Giham', type: 'stasiun', x: 1080, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-tanjungrajo', name: 'Stasiun Tanjung Rajo', type: 'stasiun', x: 1120, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-waytuba', name: 'Stasiun Way Tuba', type: 'stasiun', x: 1160, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-waypisang', name: 'Stasiun Way Pisang', type: 'stasiun', x: 1200, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-martapura', name: 'Stasiun Martapura', type: 'stasiun', x: 1240, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-sungaituha', name: 'Stasiun Sungai Tuha', type: 'stasiun', x: 1280, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-gilas', name: 'Stasiun Gilas', type: 'stasiun', x: 1320, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-sepancar', name: 'Stasiun Sepancar', type: 'stasiun', x: 1360, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-kemelak', name: 'Stasiun Kemelak', type: 'stasiun', x: 1400, y: 620, color: '#EAB308', parentId: null },
        { id: 'st-baturaja', name: 'Stasiun Baturaja', type: 'stasiun', x: 1450, y: 620, color: '#3B82F6', parentId: null },

        // === JALUR CABANG BATURAJA — Vertical (X=1450) ===
        { id: 'st-tigagajah', name: 'Stasiun Tigagajah', type: 'stasiun', x: 1450, y: 580, color: '#F97316', parentId: null },
        { id: 'st-lubukbatang', name: 'Stasiun Lubuk Batang', type: 'stasiun', x: 1450, y: 540, color: '#22C55E', parentId: null },
        { id: 'st-belatung', name: 'Stasiun Belatung', type: 'stasiun', x: 1450, y: 500, color: '#22C55E', parentId: null },
        { id: 'st-kepayang', name: 'Stasiun Kepayang', type: 'stasiun', x: 1450, y: 460, color: '#22C55E', parentId: null },
        { id: 'st-belimbing-airkaka', name: 'Stasiun Belimbing Airkaka', type: 'stasiun', x: 1450, y: 420, color: '#22C55E', parentId: null },
        { id: 'st-durian', name: 'Stasiun Durian', type: 'stasiun', x: 1450, y: 380, color: '#22C55E', parentId: null },
        { id: 'st-lubukrukam', name: 'Stasiun Lubuk Rukam', type: 'stasiun', x: 1450, y: 340, color: '#22C55E', parentId: null },
        { id: 'st-peninjawan', name: 'Stasiun Peninjawan', type: 'stasiun', x: 1450, y: 300, color: '#F97316', parentId: null },
        { id: 'st-talangbaru', name: 'Stasiun Talang Baru', type: 'stasiun', x: 1450, y: 260, color: '#EAB308', parentId: null },
        { id: 'st-metur', name: 'Stasiun Metur', type: 'stasiun', x: 1450, y: 220, color: '#EAB308', parentId: null },
        { id: 'st-kotabaru', name: 'Stasiun Kota Baru', type: 'stasiun', x: 1450, y: 180, color: '#EAB308', parentId: null },
        { id: 'st-pagar-gunung', name: 'Stasiun Pagar Gunung', type: 'stasiun', x: 1450, y: 140, color: '#EAB308', parentId: null },
        { id: 'st-airasam', name: 'Stasiun Air Asam', type: 'stasiun', x: 1450, y: 110, color: '#EAB308', parentId: null },
        { id: 'st-sukamerindu', name: 'Stasiun Suka Merindu', type: 'stasiun', x: 1450, y: 80, color: '#EAB308', parentId: null },
        { id: 'st-tanjungrambang', name: 'Stasiun Tanjungrambang', type: 'stasiun', x: 1450, y: 50, color: '#EAB308', parentId: null },

        // === UNIT / RESORT KERJA ===
        // Tarahan
        { id: 'unit-depo-lok', name: 'Dipo Lok', type: 'unit', parentId: 'st-tarahan', x: 40, y: 470, color: '#8B5CF6' },
        { id: 'unit-depo-grb', name: 'Dipo GRB', type: 'unit', parentId: 'st-tarahan', x: 110, y: 470, color: '#8B5CF6' },
        { id: 'unit-kru-kai', name: 'Kru KAI Tim', type: 'unit', parentId: 'st-tarahan', x: 40, y: 505, color: '#8B5CF6' },
        { id: 'unit-poskes', name: 'POSKES', type: 'unit', parentId: 'st-tarahan', x: 110, y: 505, color: '#8B5CF6' },
        { id: 'unit-take-or-pay', name: 'Take or Pay', type: 'unit', parentId: 'st-tarahan', x: 75, y: 540, color: '#8B5CF6' },
        
        // Tanjung Karang
        { id: 'unit-st-tnk', name: 'ST. TNK', type: 'unit', parentId: 'st-tanjungkarang', x: 185, y: 470, color: '#8B5CF6' },
        { id: 'unit-dipo-lok-tnk', name: 'Dipo Lok', type: 'unit', parentId: 'st-tanjungkarang', x: 255, y: 470, color: '#8B5CF6' },
        { id: 'unit-kru-ka-tnk', name: 'Kru KA', type: 'unit', parentId: 'st-tanjungkarang', x: 185, y: 505, color: '#8B5CF6' },
        { id: 'unit-poskes-crew-ka', name: 'POSKES Crew KA', type: 'unit', parentId: 'st-tanjungkarang', x: 255, y: 505, color: '#8B5CF6' },
        { id: 'unit-ws-spinteks', name: 'WS. Spinteks', type: 'unit', parentId: 'st-tanjungkarang', x: 185, y: 540, color: '#8B5CF6' },
        { id: 'unit-ktr-divre-iv', name: 'Ktr Divre IV', type: 'unit', parentId: 'st-tanjungkarang', x: 255, y: 540, color: '#8B5CF6' },
        { id: 'unit-bp-tnk', name: 'BP', type: 'unit', parentId: 'st-tanjungkarang', x: 220, y: 575, color: '#8B5CF6' },
        { id: 'unit-resort-jr-tnk', name: 'Resort JR TNK', type: 'unit', parentId: 'st-tanjungkarang', x: 300, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-stl-tnk', name: 'Resort STL TNK', type: 'unit', parentId: 'st-tanjungkarang', x: 300, y: 505, color: '#8B5CF6' },
        { id: 'unit-vip-sta-tnk', name: 'VIP Sta. Tanjungkarang', type: 'unit', parentId: 'st-tanjungkarang', x: 300, y: 540, color: '#8B5CF6' },

        // Rejosari
        { id: 'unit-resort-jj-rjs', name: 'Resort JJ', type: 'unit', parentId: 'st-rejosari', x: 350, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-stl-rjs', name: 'Resort STL Rjs', type: 'unit', parentId: 'st-rejosari', x: 350, y: 505, color: '#8B5CF6' },
        { id: 'unit-dipo-grb-rjs', name: 'Dipo GRB', type: 'unit', parentId: 'st-rejosari', x: 350, y: 540, color: '#8B5CF6' },

        // Tegineneng
        { id: 'unit-resort-jr-tgl', name: 'Resort JR Tgl', type: 'unit', parentId: 'st-tegineneng', x: 430, y: 470, color: '#8B5CF6' },

        // Bekri
        { id: 'unit-resort-jr-bkj', name: 'Resort JR BKJ', type: 'unit', parentId: 'st-bekri', x: 510, y: 470, color: '#8B5CF6' },

        // Blambangan Pagar
        { id: 'unit-resort-jr-bba', name: 'Resort JR BBA', type: 'unit', parentId: 'st-bl-pagar', x: 630, y: 470, color: '#8B5CF6' },

        // Kotabumi
        { id: 'unit-tower-sinter-kb', name: 'Tower Sinter KB', type: 'unit', parentId: 'st-kotabumi', x: 750, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-sinter-kb', name: 'Resort Sinter KB', type: 'unit', parentId: 'st-kotabumi', x: 750, y: 505, color: '#8B5CF6' },
        { id: 'unit-resort-jr-kb', name: 'Resort JR KB', type: 'unit', parentId: 'st-kotabumi', x: 750, y: 540, color: '#8B5CF6' },

        // Ketapang
        { id: 'unit-resort-jr-ktp', name: 'Resort JR KTP', type: 'unit', parentId: 'st-ketapang', x: 800, y: 490, color: '#8B5CF6' },
        { id: 'unit-kru-ka-ktp', name: 'Kru KA KTP', type: 'unit', parentId: 'st-ketapang', x: 800, y: 525, color: '#8B5CF6' },

        // Negara Ratu
        { id: 'unit-resort-jr-nrr', name: 'Resort JR NRR', type: 'unit', parentId: 'st-negara-ratu', x: 870, y: 470, color: '#8B5CF6' },

        // Tulung Buyut
        { id: 'unit-resort-jr-tly', name: 'Resort JR TLY', type: 'unit', parentId: 'st-tulung-buyut', x: 910, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-sinter-nrr', name: 'Resort Sinter NRR', type: 'unit', parentId: 'st-tulung-buyut', x: 910, y: 505, color: '#8B5CF6' },

        // Negara Agung
        { id: 'unit-resort-jr-ngn', name: 'Resort JR NGN', type: 'unit', parentId: 'st-negara-agung', x: 950, y: 470, color: '#8B5CF6' },

        // Blambangan Umpu
        { id: 'unit-resort-jr-bbu', name: 'Resort JR BBU', type: 'unit', parentId: 'st-blambanganumpu', x: 990, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-jr-kyg', name: 'Resort JR KYg', type: 'unit', parentId: 'st-blambanganumpu', x: 990, y: 505, color: '#8B5CF6' },

        // Way Tuba
        { id: 'unit-resort-jr-way', name: 'Resort JR WAY', type: 'unit', parentId: 'st-waytuba', x: 1150, y: 470, color: '#8B5CF6' },

        // Martapura
        { id: 'unit-resort-jr-mp', name: 'Resort JR MP', type: 'unit', parentId: 'st-martapura', x: 1230, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-sintel-mp', name: 'Resort Sintel MP', type: 'unit', parentId: 'st-martapura', x: 1230, y: 505, color: '#8B5CF6' },

        // Sepancar
        { id: 'unit-resort-jr-spc', name: 'Resort JR SPC', type: 'unit', parentId: 'st-sepancar', x: 1350, y: 470, color: '#8B5CF6' },

        // Baturaja
        { id: 'unit-resort-jr-bta', name: 'Resort JR BTA', type: 'unit', parentId: 'st-baturaja', x: 1440, y: 470, color: '#8B5CF6' },
        { id: 'unit-resort-sinter-bta', name: 'Resort Sinter BTA', type: 'unit', parentId: 'st-baturaja', x: 1440, y: 505, color: '#8B5CF6' },
        { id: 'unit-resort-jj-bta', name: 'Resort JJ BTA', type: 'unit', parentId: 'st-baturaja', x: 1440, y: 540, color: '#8B5CF6' },
        { id: 'unit-bp-bta', name: 'BP BTA', type: 'unit', parentId: 'st-baturaja', x: 1440, y: 575, color: '#8B5CF6' },

        // Tigagajah
        { id: 'unit-kru-ka-tjh', name: 'Kru KA TJH', type: 'unit', parentId: 'st-tigagajah', x: 1420, y: 580, color: '#8B5CF6' },

        // Belimbing Airkaka
        { id: 'unit-resort-jr-bik', name: 'Resort JR BIK', type: 'unit', parentId: 'st-belimbing-airkaka', x: 1420, y: 420, color: '#8B5CF6' },

        // Peninjawan
        { id: 'unit-resort-jr-pnw', name: 'Resort JR PNW', type: 'unit', parentId: 'st-peninjawan', x: 1420, y: 300, color: '#8B5CF6' },
        { id: 'unit-resort-sinter-pnw', name: 'Resort Sinter PNW', type: 'unit', parentId: 'st-peninjawan', x: 1420, y: 335, color: '#8B5CF6' },

        // Pagar Gunung
        { id: 'unit-resort-jr-pgg', name: 'Resort JR PGG', type: 'unit', parentId: 'st-pagar-gunung', x: 1420, y: 140, color: '#8B5CF6' },
        { id: 'unit-resort-sinter-pgg', name: 'Resort Sinter PGG', type: 'unit', parentId: 'st-pagar-gunung', x: 1420, y: 175, color: '#8B5CF6' },

        // Tanjungrambang
        { id: 'unit-resort-jr-tjr', name: 'Resort JR TJr', type: 'unit', parentId: 'st-tanjungrambang', x: 1420, y: 50, color: '#8B5CF6' }
    ],
    categories: [
        { id: 'cat-1', name: 'Router' },
        { id: 'cat-2', name: 'Switch' },
        { id: 'cat-3', name: 'Kabel FO' },
        { id: 'cat-4', name: 'LAN' },
        { id: 'cat-5', name: 'Printer' },
        { id: 'cat-6', name: 'Server' },
        { id: 'cat-7', name: 'Access Point' }
    ],
    assets: [
        // Tarahan & Units
        { id: 'ast-001', name: 'Router Cisco ISR 4331', ip: '10.4.1.1', mac: '00:0A:95:9D:68:16', category: 'cat-1', locationId: 'st-tarahan', status: 'Baik', lastMaintenance: '2026-06-15' },
        { id: 'ast-002', name: 'Switch Cisco Catalyst 2960', ip: '10.4.1.2', mac: '00:0A:95:9D:68:17', category: 'cat-2', locationId: 'st-tarahan', status: 'Baik', lastMaintenance: '2026-06-10' },
        { id: 'ast-003', name: 'Kabel FO 12 Core', ip: '-', mac: '-', category: 'cat-3', locationId: 'st-tarahan', status: 'Baik', lastMaintenance: '2026-05-20' },
        { id: 'ast-004', name: 'LAN Cat6 50m', ip: '-', mac: '-', category: 'cat-4', locationId: 'st-tarahan', status: 'Perawatan', lastMaintenance: '2026-07-01' },
        { id: 'ast-005', name: 'Printer Epson L3110', ip: '10.4.1.10', mac: '00:0A:95:9D:68:18', category: 'cat-5', locationId: 'st-tarahan', status: 'Rusak', lastMaintenance: '2026-07-05' },
        { id: 'ast-006', name: 'Access Point Ubiquiti UAP-AC', ip: '10.4.1.20', mac: '00:0A:95:9D:68:19', category: 'cat-7', locationId: 'st-tarahan', status: 'Baik', lastMaintenance: '2026-06-30' },
        { id: 'ast-007', name: 'Server Dell PowerEdge R740', ip: '10.4.2.1', mac: '00:0A:95:9D:68:1A', category: 'cat-6', locationId: 'unit-depo-lok', status: 'Baik', lastMaintenance: '2026-06-28' },
        { id: 'ast-008', name: 'Switch Cisco 3750', ip: '10.4.2.2', mac: '00:0A:95:9D:68:1B', category: 'cat-2', locationId: 'unit-depo-lok', status: 'Baik', lastMaintenance: '2026-06-20' },
        // Tanjung Karang
        { id: 'ast-009', name: 'Router TP-Link ER605', ip: '10.4.3.1', mac: '00:0A:95:9D:68:1C', category: 'cat-1', locationId: 'st-tanjungkarang', status: 'Baik', lastMaintenance: '2026-06-18' },
        { id: 'ast-010', name: 'Switch D-Link DGS-1210', ip: '10.4.3.2', mac: '00:0A:95:9D:68:1D', category: 'cat-2', locationId: 'st-tanjungkarang', status: 'Baik', lastMaintenance: '2026-06-16' },
        // Rejosari
        { id: 'ast-011', name: 'Router Mikrotik RB750', ip: '10.4.4.1', mac: '00:0A:95:9D:68:1E', category: 'cat-1', locationId: 'st-rejosari', status: 'Perawatan', lastMaintenance: '2026-07-02' },
        { id: 'ast-012', name: 'Switch TP-Link TL-SG108', ip: '10.4.4.2', mac: '00:0A:95:9D:68:1F', category: 'cat-2', locationId: 'st-rejosari', status: 'Baik', lastMaintenance: '2026-06-25' },
        // Kotabumi
        { id: 'ast-013', name: 'Router Cisco 2911', ip: '10.4.5.1', mac: '00:0A:95:9D:68:20', category: 'cat-1', locationId: 'st-kotabumi', status: 'Baik', lastMaintenance: '2026-06-22' },
        { id: 'ast-014', name: 'Kabel FO 24 Core', ip: '-', mac: '-', category: 'cat-3', locationId: 'st-kotabumi', status: 'Baik', lastMaintenance: '2026-06-01' },
        // Menggala
        { id: 'ast-015', name: 'Switch Cisco 2960', ip: '10.4.6.1', mac: '00:0A:95:9D:68:21', category: 'cat-2', locationId: 'st-menggala', status: 'Rusak', lastMaintenance: '2026-07-08' },
        // Baturaja
        { id: 'ast-016', name: 'Router TP-Link Archer', ip: '10.4.7.1', mac: '00:0A:95:9D:68:22', category: 'cat-1', locationId: 'st-baturaja', status: 'Baik', lastMaintenance: '2026-06-28' },
        { id: 'ast-017', name: 'Printer Brother DCP', ip: '10.4.7.10', mac: '00:0A:95:9D:68:23', category: 'cat-5', locationId: 'st-baturaja', status: 'Perawatan', lastMaintenance: '2026-07-10' },
    ],
    users: [
        { id: 'usr-001', name: 'Super Admin KAI', email: 'superadmin@kai.id', role: 'superadmin', password: 'admin123', locationId: null, nip: '19820301', position: 'Manajer', avatar: null },
        { id: 'usr-002', name: 'Admin Tarahan', email: 'admin.tarahan@kai.id', role: 'admin', password: 'admin123', locationId: 'st-tarahan', nip: '19900812', position: 'Asisten Manajer', avatar: null },
        { id: 'usr-003', name: 'Admin Baturaja', email: 'admin.baturaja@kai.id', role: 'admin', password: 'admin123', locationId: 'st-baturaja', nip: '19950524', position: null, avatar: null },
        { id: 'usr-004', name: 'Admin Kotabumi', email: 'admin.kotabumi@kai.id', role: 'admin', password: 'admin123', locationId: 'st-kotabumi', nip: '19921106', position: null, avatar: null }
    ]
};

// Initialize DB
function initDB() {
    const dbStr = localStorage.getItem('sivera_db');
    let needsReset = false;
    if (dbStr) {
        try {
            const parsed = JSON.parse(dbStr);
            if (!parsed.locations || parsed.schemaVersion !== 4) {
                needsReset = true;
            } else {
                const existingIds = new Set(parsed.locations.map(l => l.id));
                const missingLocations = DEFAULT_DB.locations.filter(l => !existingIds.has(l.id));
                if (missingLocations.length) {
                    parsed.locations.push(...missingLocations);
                    localStorage.setItem('sivera_db', JSON.stringify(parsed));
                }
            }
        } catch (e) {
            needsReset = true;
        }
    } else {
        needsReset = true;
    }

    if (needsReset) {
        localStorage.setItem('sivera_db', JSON.stringify({ ...DEFAULT_DB, schemaVersion: 4 }));
    }
}
initDB();

// Get database
function getDB() {
    return JSON.parse(localStorage.getItem('sivera_db') || JSON.stringify(DEFAULT_DB));
}

// Save database
function saveDB(db) {
    localStorage.setItem('sivera_db', JSON.stringify(db));
}

// ============================================
// Auth Helpers - WITH CACHE SYSTEM
// ============================================

// Cache user data untuk menghindari pembacaan berulang dari localStorage
let cachedUser = null;
let cachedUserData = null;
let sidebarInitialized = false;

function getCurrentUser(forceRefresh = false) {
    if (forceRefresh || !cachedUser) {
        cachedUser = JSON.parse(localStorage.getItem('sivera_user') || 'null');
    }
    return cachedUser;
}

function getCurrentUserData(forceRefresh = false) {
    if (forceRefresh || !cachedUserData) {
        const user = getCurrentUser(forceRefresh);
        if (user) {
            const db = getDB();
            cachedUserData = db.users.find(u => u.id === user.id || u.email === user.email);
        } else {
            cachedUserData = null;
        }
    }
    return cachedUserData;
}

function clearUserCache() {
    cachedUser = null;
    cachedUserData = null;
    sidebarInitialized = false;
}

// ============================================
// Role-based Dashboard Redirect
// ============================================
function redirectToDashboard() {
    const user = getCurrentUser();
    if (!user) return;
    
    if (user.role === 'superadmin') {
        window.location.href = 'dashboard.html';
    } else if (user.role === 'admin') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

function checkAuth() {
    const user = getCurrentUser(true);
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }

    const currentPage = window.location.pathname.split('/').pop();
    const adminRestrictedPages = ['locations.html', 'categories.html', 'users.html', 'reports.html'];
    const publicPages = ['login.html', 'register.html', 'register-superadmin.html', 'forgot-password.html', 'index.html', ''];
    const superadminPages = ['dashboard.html'];
    const adminPages = ['dashboard.html'];

    // Jika user sudah login dan mencoba akses halaman public, redirect ke dashboard masing-masing
    if (publicPages.includes(currentPage) || currentPage === '') {
        redirectToDashboard();
        return null;
    }

    // Jika user mencoba akses dashboard-superadmin tapi role-nya admin
    if (user.role === 'admin' && currentPage === 'dashboard.html') {
        window.location.href = 'dashboard.html';
        return null;
    }

    // Jika user mencoba akses dashboard-admin tapi role-nya superadmin
    if (user.role === 'superadmin' && currentPage === 'dashboard.html') {
        window.location.href = 'dashboard.html';
        return null;
    }

    // Admin tidak bisa akses halaman admin-restricted
    if (user.role === 'admin' && adminRestrictedPages.includes(currentPage)) {
        setTimeout(() => {
            alert('Akses Ditolak! Anda tidak memiliki izin untuk mengakses halaman ini.');
            window.location.href = 'dashboard.html';
        }, 100);
        return null;
    }

    return user;
}

// Cek apakah user sudah login (untuk halaman public)
function checkAlreadyLoggedIn() {
    const user = getCurrentUser(true);
    if (user) {
        redirectToDashboard();
        return true;
    }
    return false;
}

function handleLogout() {
    clearUserCache();
    localStorage.removeItem('sivera_user');
    window.location.href = 'login.html';
}

function updateSidebarNavigation() {
    const user = getCurrentUser();
    if (!user) return;

    // Ambil data lengkap user dari database
    const db = getDB();
    const fullUser = db.users.find(u => u.id === user.id || u.email === user.email);
    
    // Update role badge dengan data yang konsisten
    const roleBadgeEl = document.getElementById('roleBadge');
    if (roleBadgeEl) {
        let displayText = '';
        let className = '';
        
        if (user.role === 'superadmin') {
            // Tampilkan jabatan jika ada, atau Superadmin
            if (fullUser && fullUser.position) {
                displayText = fullUser.position;
            } else {
                displayText = 'Superadmin';
            }
            className = 'text-xs px-2.5 py-1 rounded-full font-bold bg-kai-blue/10 text-kai-blue';
        } else {
            // Admin - tampilkan lokasi tugas
            const locationName = user.locationId ? 
                (db.locations.find(l => l.id === user.locationId)?.name || '') : '';
            displayText = `Admin${locationName ? ' ' + locationName : ''}`;
            className = 'text-xs px-2.5 py-1 rounded-full font-bold bg-kai-orange/10 text-kai-orange';
        }
        
        roleBadgeEl.textContent = displayText;
        roleBadgeEl.className = className;
    }

    // Update top avatar
    const topAvatar = document.getElementById('topUserAvatar');
    if (topAvatar) {
        if (user.avatar) {
            topAvatar.innerHTML = `<img src="${user.avatar}" alt="Foto profil" class="w-full h-full object-cover rounded-full">`;
        } else {
            topAvatar.textContent = user.name.substring(0, 2).toUpperCase();
        }
    }

    // =============================================
    // MANAJEMEN MENU SIDEBAR BERDASARKAN ROLE
    // =============================================
    // Daftar menu yang hanya untuk Superadmin
    const adminOnlySelectors = [
        'a[href="locations.html"]',
        'a[href="categories.html"]',
        'a[href="users.html"]',
        'a[href="reports.html"]'
    ];

    if (user.role === 'admin') {
        // Sembunyikan menu untuk admin
        adminOnlySelectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.display = 'none';
            }
        });
    } else {
        // Superadmin: tampilkan semua menu
        adminOnlySelectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.display = '';
            }
        });
    }
}

// Inisialisasi sidebar - panggil sekali di setiap halaman
function initSidebar() {
    // Jika sudah diinisialisasi di halaman ini, skip
    if (sidebarInitialized) return;
    sidebarInitialized = true;
    updateSidebarNavigation();
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-rose-50 border-rose-200 text-rose-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    const icons = {
        success: 'fa-circle-check text-emerald-500',
        error: 'fa-circle-xmark text-rose-500',
        warning: 'fa-triangle-exclamation text-amber-500',
        info: 'fa-circle-info text-blue-500'
    };

    const container = document.getElementById('toast-container') || (() => {
        const c = document.createElement('div');
        c.id = 'toast-container';
        c.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none';
        document.body.appendChild(c);
        return c;
    })();

    const toast = document.createElement('div');
    toast.className = `flex items-start p-4 rounded-2xl border ${colors[type]} shadow-lg pointer-events-auto toast transition-all duration-300`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type]} text-lg mt-0.5 mr-3"></i>
        <div class="flex-1"><p class="text-sm font-semibold">${message}</p></div>
        <button class="ml-3 text-slate-400 hover:text-slate-600 transition" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ============================================
// Shared Utility Functions
// ============================================
function formatDateIndonesian(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function formatDateShort(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function generateId(prefix = 'id') {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function getStatusBadge(status) {
    const map = {
        'Baik': 'status-baik',
        'Perawatan': 'status-perawatan',
        'Rusak': 'status-rusak'
    };
    return `status-badge ${map[status] || 'status-baik'}`;
}

function getLocationLabel(locationId, db) {
    const loc = db.locations.find(l => l.id === locationId);
    if (!loc) return '-';
    if (loc.type === 'unit' && loc.parentId) {
        const parent = db.locations.find(l => l.id === loc.parentId);
        if (parent) return `${parent.name.replace('Stasiun ', '')} › ${loc.name}`;
    }
    return loc.name;
}

// ============================================
// Profile Management
// ============================================
function openProfileModal() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.add('hidden');

    const user = getCurrentUser(true);
    if (!user) return;
    
    const db = getDB();
    const fullUser = db.users.find(u => u.id === user.id || u.email === user.email);
    if (!fullUser) return;

    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');

    if (!modalContent || !modalOverlay) return;

    modalContent.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <div>
                    <h2 class="text-base font-extrabold text-kai-blue">Edit Profil Pengguna</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Perbarui data diri dan foto profil Anda.</p>
                </div>
                <button onclick="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
            <form onsubmit="saveProfile(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                    <input id="profileName" type="text" required value="${fullUser.name}" 
                        class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange text-sm bg-slate-50/50" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Jabatan</label>
                    <input id="profilePosition" type="text" value="${fullUser.position || ''}" placeholder="Manajer / Asisten Manajer"
                        class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange text-sm bg-slate-50/50" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nomor Kartu Pegawai / NIP</label>
                    <input id="profileNip" type="text" required value="${fullUser.nip || ''}" 
                        class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange text-sm bg-slate-50/50" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Ubah Kata Sandi (Kosongkan jika tidak diubah)</label>
                    <input id="profilePassword" type="password" placeholder="••••••" 
                        class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kai-orange text-sm bg-slate-50/50" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Foto Profil Baru</label>
                    <input id="profileAvatar" type="file" accept="image/*" 
                        class="w-full text-sm text-slate-500 file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-kai-blue/10 file:text-kai-blue file:font-bold cursor-pointer" />
                </div>
                <div class="flex gap-3 pt-3 border-t border-slate-100 mt-4">
                    <button type="button" onclick="closeModal()" 
                        class="flex-1 py-2.5 border-1.5 border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition">
                        Batal
                    </button>
                    <button type="submit" 
                        class="flex-1 py-2.5 bg-gradient-to-r from-kai-blue to-kai-blueLight text-white font-bold rounded-xl text-xs transition shadow-md hover:from-kai-blueLight hover:to-kai-blue">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    `;
    modalOverlay.classList.remove('hidden');
}

function saveProfile(e) {
    e.preventDefault();
    const db = getDB();
    const current = getCurrentUser(true);
    if (!current) return;

    const user = db.users.find(u => u.id === current.id || u.email === current.email);
    if (!user) return;

    const name = document.getElementById('profileName').value.trim();
    const position = document.getElementById('profilePosition').value.trim();
    const nip = document.getElementById('profileNip').value.trim();
    const password = document.getElementById('profilePassword').value;
    const avatarInput = document.getElementById('profileAvatar');

    const commitChanges = (avatar = null) => {
        user.name = name;
        user.position = position || null;
        user.nip = nip;
        if (password) user.password = password;
        if (avatar) user.avatar = avatar;

        saveDB(db);

        const updatedSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            locationId: user.locationId,
            avatar: user.avatar || null,
            nip: user.nip || null,
            position: user.position || null
        };
        localStorage.setItem('sivera_user', JSON.stringify(updatedSession));
        
        // Clear cache agar data terbaru terbaca
        clearUserCache();

        closeModal();
        
        // Re-init sidebar dengan data baru
        sidebarInitialized = false;
        initSidebar();
        
        showToast('Profil berhasil diperbarui!', 'success');
        
        if (typeof renderUsersTable === 'function') renderUsersTable();
    };

    if (avatarInput && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = () => commitChanges(reader.result);
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        commitChanges();
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function toggleUserMenu() {
    const el = document.getElementById('userMenu');
    if (el) el.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('userMenu');
    const button = document.querySelector('button[onclick="toggleUserMenu()"]');
    if (menu && !menu.classList.contains('hidden')) {
        if (!menu.contains(e.target) && (!button || !button.contains(e.target))) {
            menu.classList.add('hidden');
        }
    }
});