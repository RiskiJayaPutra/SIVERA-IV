import React from 'react';

/*
 * MapSVG — Peta Wilayah Sistem Informasi Divre IV TNK
 * Features:
 *   - Uniform unit box sizes
 *   - Strictly straight orthogonal connecting lines
 *   - Spacious gaps between stations to prevent text overlap
 */

const MAP_W = 2200;
const MAP_H = 1000;
const MY = 690;

const NC = {
    inet: '#3B82F6', telkom: '#F472B6', icon: '#F97316',
    lanfo: '#EAB308', swfo: '#22C55E', lan: '#8B5CF6'
};
const NC_LABEL = {
    inet: 'SDWAN ICON + BB Inet (ITN dll)', telkom: 'SDWAN ICON + BB Telkom',
    icon: 'SDWAN + BB ICON', lanfo: 'Lan via FO',
    swfo: 'Switch Manage via FO', lan: 'Lan'
};

const MAIN = [
    { id:'st-tarahan',        x:110,  label:'TARAHAN',           net:'icon',  r:11, freq:'6+30', major:true },
    { id:'st-sukamenanti',    x:170,  label:'Sukamenanti',       net:'icon',  r:6 },
    { id:'st-blokpos',        x:215,  label:'Blok Pos',          net:'icon',  r:6 },
    { id:'st-garuntung',      x:257,  label:'Garuntung',         net:'icon',  r:6 },
    { id:'st-tanjungkarang',  x:327,  label:'TANJUNGKARANG',     net:'icon',  r:12, freq:'7+50', major:true },
    { id:'st-labuanratu',     x:404,  label:'Labuan Ratu',       net:'lanfo', r:6 },
    { id:'st-gedungratu',     x:453,  label:'Gedung Ratu',       net:'lanfo', r:6 },
    { id:'st-rejosari',       x:502,  label:'Rejosari',          net:'lanfo', r:7 },
    { id:'st-branti',         x:544,  label:'Branti',            net:'lanfo', r:6 },
    { id:'st-tegineneng',     x:593,  label:'Tegineneng',        net:'lanfo', r:7 },
    { id:'st-rengas',         x:635,  label:'Rengas',            net:'lanfo', r:6 },
    { id:'st-bekri',          x:691,  label:'BEKRI',             net:'icon',  r:10, freq:'3+30', major:true },
    { id:'st-hajipemanggilan',x:747, label:'Haji Pemanggilan',  net:'lanfo', r:6 },
    { id:'st-sulusuban',      x:796, label:'Sulusuban',         net:'lanfo', r:6 },
    { id:'st-bl-pagar',       x:849, label:'Blambangan Pagar',  net:'lanfo', r:7 },
    { id:'st-kalibalangan',   x:898, label:'Kalibalangan',      net:'lanfo', r:6 },
    { id:'st-candimas',       x:947, label:'Candi Mas',         net:'lanfo', r:6 },
    { id:'st-kotabumi',       x:1013, label:'KOTA BUMI',         net:'icon',  r:11, freq:'5+30', major:true },
    { id:'st-cempaka',        x:1066, label:'Cempaka',           net:'lanfo', r:6 },
    { id:'st-ketapang',       x:1122, label:'KETAPANG',          net:'inet',  r:10, freq:'3+30', major:true },
    { id:'st-negararatu',     x:1174, label:'Negara Ratu',       net:'swfo',  r:7 },
    { id:'st-tulungbuyut',    x:1223, label:'Tulung Buyut',      net:'swfo',  r:7 },
    { id:'st-negriagung',     x:1272, label:'Negri Agung',       net:'swfo',  r:7 },
    { id:'st-blambanganumpu', x:1342, label:'BLAMBANGAN UMPU',   net:'icon',  r:10, freq:'3+30', major:true },
    { id:'st-giham',          x:1398, label:'Giham',             net:'swfo',  r:7 },
    { id:'st-tanjungrajo',    x:1447, label:'Tanjung Rajo',      net:'swfo',  r:6 },
    { id:'st-waytuba',        x:1496, label:'Way Tuba',          net:'swfo',  r:7 },
    { id:'st-waypisang',      x:1538, label:'Way Pisang',        net:'swfo',  r:6 },
    { id:'st-martapura',      x:1594, label:'MARTAPURA',         net:'icon',  r:10, freq:'3+30', major:false },
    { id:'st-sungaituha',     x:1643, label:'Sungai Tuha',       net:'swfo',  r:6 },
    { id:'st-gilas',          x:1685, label:'Gilas',             net:'swfo',  r:6 },
    { id:'st-sepancar',       x:1727, label:'Sepancar',          net:'swfo',  r:7 },
    { id:'st-kemelak',        x:1769, label:'Kemelak',           net:'swfo',  r:6 },
    { id:'st-baturaja',       x:1839, label:'BATURAJA',          net:'inet',  r:13, freq:'3+30', major:true }
];

const BX = 1839;
const BVERT = [
    { id:'st-tigagajah',         x:BX, y:642, label:'TIGAGAJAH',         net:'icon', r:10, freq:'5+20', major:true },
    { id:'st-lubukbatang',       x:BX, y:602, label:'Lubuk Batang',      net:'swfo', r:6 },
    { id:'st-belatung',          x:BX, y:566, label:'Belatung',          net:'swfo', r:6 },
    { id:'st-kepayang',          x:BX, y:530, label:'Kepayang',          net:'swfo', r:6 },
    { id:'st-belimbingairkaka',  x:BX, y:494, label:'Belimbing Airkaka', net:'swfo', r:7 },
    { id:'st-durian',            x:BX, y:458, label:'Durian',            net:'swfo', r:6 },
    { id:'st-lubukrukam',        x:BX, y:422, label:'Lubuk Rukam',       net:'swfo', r:6 },
    { id:'st-peninjawan',        x:BX, y:382, label:'PENINJAWAN',        net:'icon', r:9, freq:'3+30', major:true },
    { id:'st-talangbaru',        x:BX, y:342, label:'Talang Baru',       net:'swfo', r:6 },
    { id:'st-metur',             x:BX, y:306, label:'Metur',             net:'swfo', r:6 },
    { id:'st-kotabaru',          x:BX, y:270, label:'KOTA BARU',         net:'swfo', r:8, major:true }
];

const BTOP_Y = 270;
const BHORIZ = [
    { id:'st-pagargunung',    x:BX-160, y:BTOP_Y, label:'PAGAR GUNUNG',    net:'icon', r:8, freq:'3+30', major:true },
    { id:'st-airasam',        x:BX-280, y:BTOP_Y, label:'Air Asam',        net:'swfo', r:6 },
    { id:'st-sukamerindu',    x:BX-400, y:BTOP_Y, label:'Suka Merindu',    net:'swfo', r:6 },
    { id:'st-tanjungrambang', x:BX-540, y:BTOP_Y, label:'TANJUNGRAMBANG',  net:'swfo', r:8, freq:'3+30', major:true }
];

const ALL_STATIONS = [...MAIN, ...BVERT, ...BHORIZ];

const UNIT_GROUPS = [
    { parentId: 'st-tarahan', direction: 'up', items: [{label:'DIPO LOK', freq:'(3+30)'}, {label:'DIPO GRB', freq:'(3+30)'}, {label:'KRU KA THN', freq:'(3+30)'}, {label:'POSKES'}, {label:'TAKE OR PAY'}] },
    { parentId: 'st-tanjungkarang', direction: 'down', items: [{label:'ST. TNK', freq:'(3+30)'}, {label:'KTR DIVRE 4'}, {label:'DIPO LOK', freq:'(3+30)'}, {label:'KRU KA', freq:'(3+30)'}, {label:'POSKES CREW KA'}] },
    { parentId: 'st-tanjungkarang', direction: 'up', items: [{label:'Resort JR Tnk'}, {label:'Resort STL Tnk'}] },
    { parentId: 'st-rejosari', direction: 'up', items: [{label:'Resort JR Rjs'}, {label:'Resort STL Rjs'}] },
    { parentId: 'st-tegineneng', direction: 'down', items: [{label:'Resort JR Tgi'}] },
    { parentId: 'st-bekri', direction: 'up', items: [{label:'Resort JR Bkr'}, {label:'Resort Sintel KB'}, {label:'Resort KB'}] },
    { parentId: 'st-kotabumi', direction: 'up', items: [{label:'Tower KTP'}, {label:'Kru KA KTP'}, {label:'Resort Sintel KB'}, {label:'Resort JR KB'}] },
    { parentId: 'st-ketapang', direction: 'up', items: [{label:'Resort JR KTP', freq:'(3+30)'}, {label:'Kru KA KTP'}] },
    { parentId: 'st-ketapang', direction: 'down', items: [{label:'Resort JR BEU', freq:'(3+30)'}] },
    { parentId: 'st-negriagung', direction: 'down', items: [{label:'Resort JR TLY'}, {label:'Resort Sintel NRR'}] },
    { parentId: 'st-blambanganumpu', direction: 'down', items: [{label:'Resort JR NGK'}] },
    { parentId: 'st-giham', direction: 'up', items: [{label:'Resort JR KYG'}] },
    { parentId: 'st-waytuba', direction: 'down', items: [{label:'Resort JR WAY'}] },
    { parentId: 'st-martapura', direction: 'up', items: [{label:'Resort JR MP'}] },
    { parentId: 'st-martapura', direction: 'down', items: [{label:'Resort Sintel MP'}] },
    { parentId: 'st-sepancar', direction: 'down', items: [{label:'Resort JR SPC'}] },
    { parentId: 'st-baturaja', direction: 'down', items: [{label:'Resort JR BTA', freq:'(3+30)'}, {label:'Resort Sintel BTA'}, {label:'Resort JJ BTA'}, {label:'BP BTA', freq:'(3+30)'}] },

    { parentId: 'st-tigagajah', direction: 'right', items: [{label:'Kru KA TJH', freq:'(3+30)'}] },
    { parentId: 'st-belimbingairkaka', direction: 'right', items: [{label:'Resort JR BK'}] },
    { parentId: 'st-peninjawan', direction: 'right', items: [{label:'Resort JR PNW'}, {label:'Resort Sintel PNW'}] },
    { parentId: 'st-pagargunung', direction: 'up', items: [{label:'Resort JR PGG'}, {label:'Resort Sintel PGG'}] },
    { parentId: 'st-tanjungrambang', direction: 'up', items: [{label:'Resort JR TJR'}] },
];

export default function MapSVG({ onClickStation, locations = [] }) {
    const svgRef = React.useRef(null);
    const [expandedUnits, setExpandedUnits] = React.useState({});

    React.useEffect(() => {
        window.__mapClickStation = (stId) => {
            if (onClickStation) onClickStation(stId);
        };
        window.__toggleMapUnit = (stId) => {
            setExpandedUnits(prev => ({ ...prev, [stId]: !prev[stId] }));
        };
        return () => { 
            delete window.__mapClickStation;
            delete window.__toggleMapUnit;
        };
    }, [onClickStation]);

    React.useEffect(() => {
        if (!svgRef.current) return;

        const locAssetCounts = {};
        if (locations && locations.length) {
            locations.forEach(l => { 
                locAssetCounts[l.id] = (l.assets_count || 0); 
            });
        }

        let h = '';
        h += `<defs>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="railGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0D2C54" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="#0D2C54" stop-opacity="0.15"/>
            </linearGradient>
        </defs>`;
        h += `<rect width="${MAP_W}" height="${MAP_H}" fill="#FFFFFF"/>`;

        // HEADER
        h += `<rect x="16" y="14" width="122" height="28" rx="2" fill="#111827"/>`;
        h += `<text x="77" y="33" text-anchor="middle" font-size="12" font-weight="800" fill="white" font-family="Plus Jakarta Sans,sans-serif">PETA WILAYAH</text>`;
        h += `<rect x="140" y="14" width="320" height="28" rx="2" fill="#DC2626"/>`;
        h += `<text x="300" y="33" text-anchor="middle" font-size="11.5" font-weight="700" fill="white" font-family="Plus Jakarta Sans,sans-serif">SISTEM INFORMASI DIVRE IV TNK</text>`;

        // KAI LOGO
        h += `<rect x="${MAP_W - 115}" y="12" width="100" height="34" rx="6" fill="#0D2C54"/>`;
        h += `<text x="${MAP_W - 65}" y="36" text-anchor="middle" font-size="19" font-weight="900" fill="white" font-family="Plus Jakarta Sans,sans-serif" letter-spacing="4">KAI</text>`;

        // IT SUPPORT ZONE
        const spX = 1069; 
        h += `<line x1="${spX}" y1="50" x2="${spX}" y2="${MY + 30}" stroke="#94A3B8" stroke-width="1.6" stroke-dasharray="8,5" opacity="0.45"/>`;
        h += `<rect x="${spX - 110}" y="82" width="104" height="22" rx="4" fill="rgba(30,64,175,0.08)"/>`;
        h += `<text x="${spX - 58}" y="97" text-anchor="middle" font-size="9" font-weight="700" fill="#1E40AF" font-family="Plus Jakarta Sans,sans-serif">WILAYAH IT SUPPORT 1</text>`;
        h += `<rect x="${spX + 6}" y="82" width="104" height="22" rx="4" fill="rgba(180,83,9,0.08)"/>`;
        h += `<text x="${spX + 58}" y="97" text-anchor="middle" font-size="9" font-weight="700" fill="#92400E" font-family="Plus Jakarta Sans,sans-serif">WILAYAH IT SUPPORT 2</text>`;

        // RAIL TRACK
        h += `<line x1="90" y1="${MY}" x2="${BX + 15}" y2="${MY}" stroke="url(#railGrad)" stroke-width="18" stroke-linecap="round"/>`;
        h += `<line x1="${BX}" y1="${MY + 8}" x2="${BX}" y2="${BTOP_Y - 8}" stroke="url(#railGrad)" stroke-width="18" stroke-linecap="round"/>`;
        h += `<line x1="${BHORIZ[0].x + 8}" y1="${BTOP_Y}" x2="${BHORIZ[BHORIZ.length-1].x - 8}" y2="${BTOP_Y}" stroke="url(#railGrad)" stroke-width="18" stroke-linecap="round"/>`;

        const LW = 7;
        for (let i = 0; i < MAIN.length - 1; i++) {
            const a = MAIN[i], b = MAIN[i+1];
            h += `<line x1="${a.x}" y1="${MY}" x2="${b.x}" y2="${MY}" stroke="${NC[b.net]||NC.lan}" stroke-width="${LW}" opacity="0.9"/>`;
        }
        h += `<line x1="${BX}" y1="${MY}" x2="${BX}" y2="${BVERT[0].y}" stroke="${NC[BVERT[0].net]}" stroke-width="${LW}" opacity="0.9"/>`;
        for (let i = 0; i < BVERT.length - 1; i++) {
            const a = BVERT[i], b = BVERT[i+1];
            h += `<line x1="${BX}" y1="${a.y}" x2="${BX}" y2="${b.y}" stroke="${NC[b.net]||NC.lan}" stroke-width="${LW}" opacity="0.9"/>`;
        }
        const kb = BVERT[BVERT.length - 1];
        h += `<line x1="${kb.x}" y1="${kb.y}" x2="${BHORIZ[0].x}" y2="${BHORIZ[0].y}" stroke="${NC[BHORIZ[0].net]||NC.lan}" stroke-width="${LW}" opacity="0.9"/>`;
        for (let i = 0; i < BHORIZ.length - 1; i++) {
            const a = BHORIZ[i], b = BHORIZ[i+1];
            h += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${NC[b.net]||NC.lan}" stroke-width="${LW}" opacity="0.9"/>`;
        }

        // BOUNDARY
        const bmx = (kb.x + BHORIZ[0].x) / 2, bmy = (kb.y + BHORIZ[0].y) / 2;
        h += `<text x="${bmx}" y="${bmy - 45}" text-anchor="middle" font-size="10" font-weight="700" fill="#475569" font-family="Plus Jakarta Sans,sans-serif">Batas wil. Divre IV TNK</text>`;
        h += `<text x="${bmx}" y="${bmy - 30}" text-anchor="middle" font-size="10" font-weight="700" fill="#475569" font-family="Plus Jakarta Sans,sans-serif">dengan Divre III KPT</text>`;

        // CONNECTING LINES & UNIT BOXES
        const BOX_W = 100;
        const BOX_H = 18;
        const BOX_GAP = 3;

        UNIT_GROUPS.forEach(grp => {
            if (!expandedUnits[grp.parentId]) return;

            const st = ALL_STATIONS.find(s => s.id === grp.parentId);
            if (!st) return;

            const count = grp.items.length;
            const totalH = count * BOX_H + (count - 1) * BOX_GAP;
            const boxes = [];
            const stY = st.y || MY;

            if (grp.direction === 'up') {
                const O = 85; // increased offset to move boxes slightly further up
                const topY = stY - O - totalH;
                h += `<line x1="${st.x}" y1="${stY}" x2="${st.x}" y2="${topY}" stroke="#94A3B8" stroke-width="1.5" opacity="0.7"/>`;
                for (let i=0; i<count; i++) {
                    boxes.push({ x: st.x - BOX_W/2, y: topY + i * (BOX_H + BOX_GAP), item: grp.items[i] });
                }
            } 
            else if (grp.direction === 'down') {
                const O = 70; // increased offset to move boxes slightly further down
                const topY = stY + O;
                h += `<line x1="${st.x}" y1="${stY}" x2="${st.x}" y2="${topY + totalH}" stroke="#94A3B8" stroke-width="1.5" opacity="0.7"/>`;
                for (let i=0; i<count; i++) {
                    boxes.push({ x: st.x - BOX_W/2, y: topY + i * (BOX_H + BOX_GAP), item: grp.items[i] });
                }
            } 
            else if (grp.direction === 'right') {
                const O = 130; // increased offset to move boxes slightly further right
                const topY = stY - totalH/2;
                const leftX = st.x + O;
                h += `<line x1="${st.x}" y1="${stY}" x2="${leftX}" y2="${stY}" stroke="#94A3B8" stroke-width="1.5" opacity="0.7"/>`;
                h += `<line x1="${leftX}" y1="${topY}" x2="${leftX}" y2="${topY + totalH}" stroke="#94A3B8" stroke-width="1.5" opacity="0.7"/>`;
                for (let i=0; i<count; i++) {
                    boxes.push({ x: leftX, y: topY + i * (BOX_H + BOX_GAP), item: grp.items[i] });
                }
            }

            boxes.forEach(b => {
                h += `<rect x="${b.x}" y="${b.y}" width="${BOX_W}" height="${BOX_H}" rx="3" fill="#F3E8FF" stroke="#8B5CF6" stroke-width="1" class="click-area" onclick="window.__mapClickStation('${grp.parentId}')" style="cursor:pointer"/>`;
                h += `<text x="${b.x + BOX_W/2}" y="${b.y + 12}" text-anchor="middle" font-size="8" font-weight="700" fill="#6D28D9" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${b.item.label}</text>`;
                if (b.item.freq) {
                    h += `<text x="${b.x + BOX_W + 5}" y="${b.y + 12}" font-size="7.5" font-weight="700" fill="#64748B" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${b.item.freq}</text>`;
                }
            });
        });

        // SDWAN INFO BOX
        h += `<rect x="800" y="800" width="145" height="35" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2"/>`;
        h += `<text x="872" y="817" text-anchor="middle" font-size="8.5" font-weight="700" fill="#475569" font-family="Plus Jakarta Sans,sans-serif">(10 + 10) + ITN Up</text>`;
        h += `<text x="872" y="830" text-anchor="middle" font-size="7.5" font-weight="600" fill="#94A3B8" font-family="Plus Jakarta Sans,sans-serif">To 30 Mbps (SDWAN)</text>`;

        // STATION NODES
        const drawSt = (st, yp) => {
            const x = st.x, y = yp || st.y;
            const c = NC[st.net] || '#94A3B8';
            const r = st.r;
            let s = '';

            const cr = Math.max(r + 18, 28);
            s += `<circle cx="${x}" cy="${y}" r="${cr}" fill="transparent" class="click-area" style="pointer-events:all;cursor:pointer" onclick="window.__mapClickStation('${st.id}')"/>`;
            s += `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.2" style="pointer-events:none"/>`;
            s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="white" stroke-width="${r >= 9 ? 2.8 : 1.8}" style="pointer-events:none"/>`;

            const isMajor = st.major || r >= 10;

            if (yp === MY || yp === BTOP_Y) {
                if (isMajor) {
                    s += `<text x="${x}" y="${y - r - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="#0D2C54" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="3" stroke-linejoin="round">${st.label}</text>`;
                    s += `<text x="${x}" y="${y - r - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="#0D2C54" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.label}</text>`;
                    if (st.freq) {
                        s += `<text x="${x}" y="${y - r - 26}" text-anchor="middle" font-size="9" font-weight="700" fill="#64748B" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="2">${st.freq}</text>`;
                        s += `<text x="${x}" y="${y - r - 26}" text-anchor="middle" font-size="9" font-weight="700" fill="#64748B" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.freq}</text>`;
                    }
                } else {
                    s += `<text transform="translate(${x - 3},${y + r + 10}) rotate(-55)" text-anchor="end" font-size="9.5" font-weight="700" fill="#334155" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="2">${st.label}</text>`;
                    s += `<text transform="translate(${x - 3},${y + r + 10}) rotate(-55)" text-anchor="end" font-size="9.5" font-weight="700" fill="#334155" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.label}</text>`;
                }
            } else {
                if (isMajor) {
                    s += `<text x="${x + r + 12}" y="${y + 4}" text-anchor="start" font-size="11.5" font-weight="800" fill="#0D2C54" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="3">${st.label}</text>`;
                    s += `<text x="${x + r + 12}" y="${y + 4}" text-anchor="start" font-size="11.5" font-weight="800" fill="#0D2C54" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.label}</text>`;
                    if (st.freq) {
                        s += `<text x="${x + r + 12}" y="${y + 17}" text-anchor="start" font-size="9" font-weight="700" fill="#64748B" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="2">${st.freq}</text>`;
                        s += `<text x="${x + r + 12}" y="${y + 17}" text-anchor="start" font-size="9" font-weight="700" fill="#64748B" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.freq}</text>`;
                    }
                } else {
                    s += `<text x="${x + r + 10}" y="${y + 3.5}" text-anchor="start" font-size="9.5" font-weight="700" fill="#334155" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none" stroke="white" stroke-width="2">${st.label}</text>`;
                    s += `<text x="${x + r + 10}" y="${y + 3.5}" text-anchor="start" font-size="9.5" font-weight="700" fill="#334155" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${st.label}</text>`;
                }
            }

            const ac = locAssetCounts[st.id];
            if (ac !== undefined && ac > 0) {
                const bx = x + r + 1, by = y - r - 1;
                s += `<rect x="${bx - 9}" y="${by - 9}" width="18" height="13" rx="6" fill="#EF7D00" stroke="white" stroke-width="1.2"/>`;
                s += `<text x="${bx}" y="${by + 1}" text-anchor="middle" font-size="8" font-weight="800" fill="white" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">${ac}</text>`;
            }

            const hasUnits = UNIT_GROUPS.some(g => g.parentId === st.id);
            if (hasUnits) {
                const isExp = expandedUnits[st.id];
                const tx = x - r - 2, ty = y - r - 2;
                s += `<circle cx="${tx}" cy="${ty}" r="7" fill="${isExp ? '#EF4444' : '#3B82F6'}" stroke="white" stroke-width="1.5" class="click-area" style="pointer-events:all;cursor:pointer" onclick="window.__toggleMapUnit('${st.id}')"/>`;
                if (isExp) {
                    s += `<line x1="${tx - 3}" y1="${ty}" x2="${tx + 3}" y2="${ty}" stroke="white" stroke-width="2" stroke-linecap="round" pointer-events="none"/>`;
                } else {
                    s += `<line x1="${tx - 3}" y1="${ty}" x2="${tx + 3}" y2="${ty}" stroke="white" stroke-width="2" stroke-linecap="round" pointer-events="none"/>`;
                    s += `<line x1="${tx}" y1="${ty - 3}" x2="${tx}" y2="${ty + 3}" stroke="white" stroke-width="2" stroke-linecap="round" pointer-events="none"/>`;
                }
            }

            return s;
        };

        MAIN.forEach(st => { h += drawSt(st, MY); });
        BVERT.forEach(st => { h += drawSt(st); });
        BHORIZ.forEach(st => { h += drawSt(st, BTOP_Y); });

        // TRAIN ICON
        const tx = MAP_W - 180, ty = MY - 155;
        h += `<g transform="translate(${tx}, ${ty})">
            <rect x="0" y="0" width="100" height="60" rx="10" fill="#0D2C5410"/>
            <text x="50" y="26" text-anchor="middle" font-size="26" pointer-events="none">🚂</text>
            <text x="50" y="46" text-anchor="middle" font-size="9" font-weight="800" fill="#0D2C54" font-family="Plus Jakarta Sans,sans-serif" pointer-events="none">KAI DIVRE IV</text>
        </g>`;

        svgRef.current.innerHTML = h;

    }, [locations, expandedUnits]);

    return (
        <svg ref={svgRef} id="mapSVG" xmlns="http://www.w3.org/2000/svg"
            width={MAP_W} height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision' }}>
        </svg>
    );
}
