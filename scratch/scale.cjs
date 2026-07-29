const fs = require('fs');
let code = fs.readFileSync('resources/js/Components/MapSVG.jsx', 'utf8');

const SCALE = 0.7;
let newCode = code.replace(/x:(\d+)/g, (match, p1) => {
    let oldX = parseInt(p1);
    let newX = Math.round(110 + (oldX - 110) * SCALE);
    return 'x:' + newX;
});

// For BVERT, all share BX. Let's find the new BX. BX was 2580.
let newBX = Math.round(110 + (2580 - 110) * SCALE);
newCode = newCode.replace(/const BX = 2580;/, 'const BX = ' + newBX + ';');
// Also MAP_W should be scaled
let newMapW = Math.round(3200 * SCALE);
newCode = newCode.replace(/const MAP_W = 3200;/, 'const MAP_W = 2200;');

// Also BHORIZ has x:BX-100, x:BX-230. 
newCode = newCode.replace(/x:BX-100/g, 'x:BX-70');
newCode = newCode.replace(/x:BX-230/g, 'x:BX-160');
newCode = newCode.replace(/x:BX-360/g, 'x:BX-250');
newCode = newCode.replace(/x:BX-490/g, 'x:BX-340');

const Y_SCALE = 0.8;
newCode = newCode.replace(/y:(\d+)/g, (match, p1) => {
    let oldY = parseInt(p1);
    if (oldY >= 165 && oldY <= 630) {
        let newY = Math.round(690 - (690 - oldY) * Y_SCALE);
        return 'y:' + newY;
    }
    return match;
});

newCode = newCode.replace(/const BTOP_Y = 165;/, 'const BTOP_Y = 270;');

// SDWAN INFO BOX position needs to be adjusted
newCode = newCode.replace(/x="1060"/, 'x="800"');
newCode = newCode.replace(/x="1132"/g, 'x="872"');

// spX for IT support zone. was 1480. 110 + (1480-110)*0.7 = 110 + 959 = 1069
newCode = newCode.replace(/const spX = 1480;/, 'const spX = 1069;');

fs.writeFileSync('resources/js/Components/MapSVG.jsx', newCode);
console.log('Done scaling map by 0.7');
