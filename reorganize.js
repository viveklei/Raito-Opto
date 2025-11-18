/**
 * Automated Website Reorganization Script
 * Run this with Node.js: node reorganize-website.js
 * 
 * This script will:
 * 1. Create the professional folder structure
 * 2. Copy files to new locations  
 * 3. Update all file paths automatically
 * 4. Create necessary documentation files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    rootDir: process.cwd(),
    structure: {
        'assets/images/logo': [],
        'assets/css/main': [],
        'assets/css/pages': [],
        'assets/js/core': [],
        'assets/js/pages': [],
        'pages/public': [],
        'pages/auth': [],
        'docs': []
    },
    fileMapping: {
        // Images
        'raito.jpg': 'assets/images/logo/raito.jpg',
        
        // CSS Files
        'styles.css': 'assets/css/main/styles.css',
        'about.css': 'assets/css/pages/about.css',
        'contact.css': 'assets/css/pages/contact.css',
        'products.css': 'assets/css/pages/products.css',
        'login.css': 'assets/css/pages/login.css',
        'admin.css': 'assets/css/pages/admin.css',
        'common-pages.css': 'assets/css/pages/common-pages.css',
        
        // JavaScript Files
        'data-manager.js': 'assets/js/core/data-manager.js',
        'website-loader.js': 'assets/js/core/website-loader.js',
        'script.js': 'assets/js/pages/script.js',
        'about.js': 'assets/js/pages/about.js',
        'contact.js': 'assets/js/pages/contact.js',
        'products.js': 'assets/js/pages/products.js',
        'login.js': 'assets/js/pages/login.js',
        'admin.js': 'assets/js/pages/admin.js',
        
        // HTML Files
        'about.html': 'pages/public/about.html',
        'contact.html': 'pages/public/contact.html',
        'products.html': 'pages/public/products.html',
        'solutions.html': 'pages/public/solutions.html',
        'technology.html': 'pages/public/technology.html',
        'service.html': 'pages/public/service.html',
        'company.html': 'pages/public/company.html',
        'login.html': 'pages/auth/login.html',
        'admin.html': 'pages/auth/admin.html'
    },
    pathReplacements: {
        // For index.html
        'index.html': [
            { find: 'href="styles.css"', replace: 'href="assets/css/main/styles.css"' },
            { find: 'src="raito.jpg"', replace: 'src="assets/images/logo/raito.jpg"' },
            { find: 'src="data-manager.js"', replace: 'src="assets/js/core/data-manager.js"' },
            { find: 'src="script.js"', replace: 'src="assets/js/pages/script.js"' },
            { find: 'src="website-loader.js"', replace: 'src="assets/js/core/website-loader.js"' },
            { find: 'href="about.html"', replace: 'href="pages/public/about.html"' },
            { find: 'href="contact.html"', replace: 'href="pages/public/contact.html"' },
            { find: 'href="products.html"', replace: 'href="pages/public/products.html"' },
            { find: 'href="solutions.html"', replace: 'href="pages/public/solutions.html"' },
            { find: 'href="technology.html"', replace: 'href="pages/public/technology.html"' },
            { find: 'href="service.html"', replace: 'href="pages/public/service.html"' },
            { find: 'href="company.html"', replace: 'href="pages/public/company.html"' },
            { find: 'href="login.html"', replace: 'href="pages/auth/login.html"' }
        ],
        
        // For pages in pages/public/
        'pages/public': [
            { find: 'href="styles.css"', replace: 'href="../../assets/css/main/styles.css"' },
            { find: 'href="about.css"', replace: 'href="../../assets/css/pages/about.css"' },
            { find: 'href="contact.css"', replace: 'href="../../assets/css/pages/contact.css"' },
            { find: 'href="products.css"', replace: 'href="../../assets/css/pages/products.css"' },
            { find: 'href="common-pages.css"', replace: 'href="../../assets/css/pages/common-pages.css"' },
            { find: 'src="raito.jpg"', replace: 'src="../../assets/images/logo/raito.jpg"' },
            { find: 'src="script.js"', replace: 'src="../../assets/js/pages/script.js"' },
            { find: 'src="about.js"', replace: 'src="../../assets/js/pages/about.js"' },
            { find: 'src="contact.js"', replace: 'src="../../assets/js/pages/contact.js"' },
            { find: 'src="products.js"', replace: 'src="../../assets/js/pages/products.js"' },
            { find: 'src="data-manager.js"', replace: 'src="../../assets/js/core/data-manager.js"' },
            { find: 'src="website-loader.js"', replace: 'src="../../assets/js/core/website-loader.js"' },
            { find: 'href="index.html"', replace: 'href="../../index.html"' },
            { find: 'href="login.html"', replace: 'href="../auth/login.html"' }
        ],
        
        // For pages in pages/auth/
        'pages/auth': [
            { find: 'href="login.css"', replace: 'href="../../assets/css/pages/login.css"' },
            { find: 'href="admin.css"', replace: 'href="../../assets/css/pages/admin.css"' },
            { find: 'src="login.js"', replace: 'src="../../assets/js/pages/login.js"' },
            { find: 'src="admin.js"', replace: 'src="../../assets/js/pages/admin.js"' },
            { find: 'src="data-manager.js"', replace: 'src="../../assets/js/core/data-manager.js"' },
            { find: 'src="raito.jpg"', replace: 'src="../../assets/images/logo/raito.jpg"' },
            { find: 'href="index.html"', replace: 'href="../../index.html"' }
        ]
    }
};

console.log('🚀 Starting Website Reorganization...\n');

// Step 1: Create folder structure
function createFolders() {
    console.log('📁 Creating folder structure...');
    
    Object.keys(config.structure).forEach(folder => {
        const folderPath = path.join(config.rootDir, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`   ✓ Created: ${folder}`);
        }
    });
    
    console.log('');
}

// Step 2: Copy and move files
function moveFiles() {
    console.log('📦 Moving files to new locations...');
    
    Object.entries(config.fileMapping).forEach(([source, destination]) => {
        const sourcePath = path.join(config.rootDir, source);
        const destPath = path.join(config.rootDir, destination);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`   ✓ Moved: ${source} → ${destination}`);
        } else {
            console.log(`   ⚠ Not found: ${source}`);
        }
    });
    
    console.log('');
}

// Step 3: Update file paths
function updatePaths() {
    console.log('🔧 Updating file paths...');
    
    // Update index.html
    updateFile('index.html', config.pathReplacements['index.html']);
    
    // Update files in pages/public/
    const publicPages = ['about.html', 'contact.html', 'products.html', 'solutions.html', 
                         'technology.html', 'service.html', 'company.html'];
    
    publicPages.forEach(page => {
        const filePath = path.join('pages', 'public', page);
        updateFile(filePath, config.pathReplacements['pages/public']);
    });
    
    // Update files in pages/auth/
    const authPages = ['login.html', 'admin.html'];
    
    authPages.forEach(page => {
        const filePath = path.join('pages', 'auth', page);
        updateFile(filePath, config.pathReplacements['pages/auth']);
    });
    
    console.log('');
}

// Helper function to update a single file
function updateFile(filePath, replacements) {
    const fullPath = path.join(config.rootDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`   ⚠ File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = 0;
    
    replacements.forEach(({ find, replace }) => {
        if (content.includes(find)) {
            content = content.replace(new RegExp(find, 'g'), replace);
            changesMade++;
        }
    });
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`   ✓ Updated: ${filePath} (${changesMade} changes)`);
}

// Step 4: Create documentation files
function createDocs() {
    console.log('📝 Creating documentation files...');
    
    // Create .gitignore
    const gitignore = `# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor directories
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Logs
*.log
npm-debug.log*

# Build outputs
dist/
build/

# Temporary files
tmp/
temp/
*.tmp
`;
    
    fs.writeFileSync('.gitignore', gitignore);
    console.log('   ✓ Created: .gitignore');
    
    // Create docs/setup-guide.md
    const setupGuide = `# Setup Guide

## Quick Start

1. Extract all files
2. Open \`index.html\` in Live Server
3. Navigate through the website
4. Access admin panel at \`pages/auth/login.html\`

## Folder Structure

See main README.md for complete structure details.

## Development

- All CSS in \`assets/css/\`
- All JS in \`assets/js/\`
- All pages in \`pages/\`
- Keep \`index.html\` at root
`;
    
    fs.writeFileSync('docs/setup-guide.md', setupGuide);
    console.log('   ✓ Created: docs/setup-guide.md');
    
    console.log('');
}

// Step 5: Create summary
function createSummary() {
    console.log('📊 Reorganization Summary:');
    console.log('');
    console.log('✅ Folder structure created');
    console.log('✅ Files moved to new locations');
    console.log('✅ All paths updated');
    console.log('✅ Documentation files created');
    console.log('');
    console.log('📁 New Structure:');
    console.log('');
    console.log('raito-website/');
    console.log('├── index.html');
    console.log('├── README.md');
    console.log('├── .gitignore');
    console.log('├── assets/');
    console.log('│   ├── images/logo/');
    console.log('│   ├── css/main/');
    console.log('│   ├── css/pages/');
    console.log('│   ├── js/core/');
    console.log('│   └── js/pages/');
    console.log('├── pages/');
    console.log('│   ├── public/');
    console.log('│   └── auth/');
    console.log('└── docs/');
    console.log('');
    console.log('🎉 Reorganization Complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Open index.html in your browser');
    console.log('2. Test all page navigation');
    console.log('3. Verify admin panel works');
    console.log('4. Check all styles and scripts load correctly');
    console.log('');
    console.log('⚠️  Note: Original files are still in root directory.');
    console.log('   You can safely delete them after verifying everything works.');
}

// Main execution
function reorganize() {
    try {
        createFolders();
        moveFiles();
        updatePaths();
        createDocs();
        createSummary();
    } catch (error) {
        console.error('❌ Error during reorganization:', error.message);
        process.exit(1);
    }
}

// Run the reorganization
reorganize();