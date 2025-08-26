const fs = require('fs');
const path = require('path');

// Paths
const ORIGINAL_DIR = path.join(__dirname, 'public', 'photos', 'original');
const THUMBNAILS_DIR = path.join(__dirname, 'public', 'photos', 'thumbnails');

console.log('🔧 Fixing empty thumbnail files...');

// Get all jpg files from original directory
const originalFiles = fs.readdirSync(ORIGINAL_DIR)
  .filter(file => file.endsWith('.jpg') && file !== '.gitkeep');

console.log(`Found ${originalFiles.length} original photos`);

let copied = 0;

originalFiles.forEach(filename => {
  const originalPath = path.join(ORIGINAL_DIR, filename);
  const thumbnailPath = path.join(THUMBNAILS_DIR, filename);
  
  try {
    // Check if thumbnail is empty or doesn't exist
    const thumbnailExists = fs.existsSync(thumbnailPath);
    const thumbnailSize = thumbnailExists ? fs.statSync(thumbnailPath).size : 0;
    
    if (!thumbnailExists || thumbnailSize === 0) {
      console.log(`Copying ${filename}...`);
      fs.copyFileSync(originalPath, thumbnailPath);
      copied++;
    } else {
      console.log(`Skipping ${filename} (already exists and not empty)`);
    }
  } catch (error) {
    console.error(`❌ Failed to copy ${filename}:`, error.message);
  }
});

console.log(`✅ Fixed ${copied} thumbnail files`);
console.log('🎉 Thumbnails are now ready!');
