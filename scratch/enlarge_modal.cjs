const fs = require('fs');
const path = require('path');

const files = [
    'resources/js/Pages/Assets.jsx',
    'resources/js/Pages/Locations.jsx',
    'resources/js/Pages/Categories.jsx',
    'resources/js/Pages/Users.jsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the Modal block
    const modalStartRegex = /<Modal\s+show=\{isCreateModalOpen\}/;
    const modalStartMatch = content.match(modalStartRegex);
    
    if (modalStartMatch) {
        const startIndex = modalStartMatch.index;
        const endIndex = content.indexOf('</Modal>', startIndex) + 8;
        
        let modalBlock = content.substring(startIndex, endIndex);
        
        // Apply replacements inside the modal block to make it larger
        modalBlock = modalBlock.replace(/className="p-6"/g, 'className="p-10"'); // padding
        modalBlock = modalBlock.replace(/className="([^"]*)text-lg([^"]*)"/g, 'className="$1text-3xl$2"'); // title
        modalBlock = modalBlock.replace(/className="([^"]*)mb-4([^"]*)"/g, 'className="$1mb-8$2"'); // title margin
        modalBlock = modalBlock.replace(/className="([^"]*)gap-4([^"]*)"/g, 'className="$1gap-8$2"'); // grid gap
        modalBlock = modalBlock.replace(/className="([^"]*)space-y-4([^"]*)"/g, 'className="$1space-y-8$2"'); // vertical space
        
        // labels
        modalBlock = modalBlock.replace(/className="block text-xs font-bold/g, 'className="block text-lg font-bold');
        
        // inputs
        modalBlock = modalBlock.replace(/px-3 py-2 text-sm/g, 'px-5 py-4 text-xl');
        
        // errors
        modalBlock = modalBlock.replace(/text-\[10px\] mt-1/g, 'text-sm mt-2');
        
        // buttons container
        modalBlock = modalBlock.replace(/mt-6 flex justify-end gap-2/g, 'mt-12 flex justify-end gap-4');
        
        // buttons
        modalBlock = modalBlock.replace(/px-4 py-2 text-xs font-bold/g, 'px-8 py-4 text-lg font-bold');
        
        content = content.substring(0, startIndex) + modalBlock + content.substring(endIndex);
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
