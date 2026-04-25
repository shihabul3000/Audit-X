const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\Users\\hp\\Desktop\\Assignments\\Audit-X\\Actual-Project\\Frontend\\allcodecopy.txt';
const sourceDirs = [
    'c:\\Users\\hp\\Desktop\\Assignments\\Audit-X\\Actual-Project\\Frontend',
    'c:\\Users\\hp\\Desktop\\Assignments\\Audit-X\\Actual-Project\\Backend'
];

const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.env', '.json', '.prisma']);

let allContent = '';

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('node_modules') || 
            fullPath.includes('.git') || 
            fullPath.includes('dist') || 
            fullPath.includes('build') || 
            fullPath.includes('allcodecopy.txt') || 
            fullPath.includes('n4_13_complete_code.txt') || 
            file === 'package-lock.json') {
            continue;
        }

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(fullPath);
            if (extensions.has(ext)) {
                allContent += `\n\n/* =========================================================\n * File: ${fullPath}\n * ========================================================= */\n\n`;
                allContent += fs.readFileSync(fullPath, 'utf8');
            }
        }
    }
}

for (const dir of sourceDirs) {
    traverseDir(dir);
}

fs.writeFileSync(targetFile, allContent, 'utf8');
console.log('Successfully gathered all code!');
