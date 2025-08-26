#!/usr/bin/env node

/**
 * Photo optimization script
 * Generates thumbnails, medium, and large versions of photos
 * Usage: node scripts/generate-thumbnails.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos');
const ORIGINAL_DIR = path.join(PHOTOS_DIR, 'original');
const THUMBNAILS_DIR = path.join(PHOTOS_DIR, 'thumbnails');
const MEDIUM_DIR = path.join(PHOTOS_DIR, 'medium');
const LARGE_DIR = path.join(PHOTOS_DIR, 'large');

// Ensure directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

// Get all jpg files from original directory
function getOriginalPhotos() {
  if (!fs.existsSync(ORIGINAL_DIR)) {
    console.log('❌ Original photos directory not found:', ORIGINAL_DIR);
    return [];
  }
  
  return fs.readdirSync(ORIGINAL_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
}

// Copy file (since we can't resize without external library)
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    console.error(`❌ Failed to copy ${source} to ${destination}:`, error.message);
    return false;
  }
}

// Generate optimized versions (for now just copies, but can be enhanced with sharp)
function generateOptimizedVersions() {
  console.log('🖼️  Starting photo optimization...');
  
  // Ensure all directories exist
  ensureDirectoryExists(THUMBNAILS_DIR);
  ensureDirectoryExists(MEDIUM_DIR);
  ensureDirectoryExists(LARGE_DIR);
  
  const originalPhotos = getOriginalPhotos();
  
  if (originalPhotos.length === 0) {
    console.log('❌ No photos found in original directory');
    return;
  }
  
  console.log(`📸 Found ${originalPhotos.length} photos to optimize`);
  
  let successful = 0;
  
  originalPhotos.forEach(filename => {
    const originalPath = path.join(ORIGINAL_DIR, filename);
    const thumbnailPath = path.join(THUMBNAILS_DIR, filename);
    const mediumPath = path.join(MEDIUM_DIR, filename);
    const largePath = path.join(LARGE_DIR, filename);
    
    console.log(`Processing: ${filename}`);
    
    // For now, we'll copy files as-is
    // In production, you would use Sharp or similar to actually resize
    let success = true;
    
    // Copy to thumbnails (would be 150px width in production)
    if (!fs.existsSync(thumbnailPath)) {
      success = copyFile(originalPath, thumbnailPath) && success;
    }
    
    // Copy to medium (would be 400px width in production)  
    if (!fs.existsSync(mediumPath)) {
      success = copyFile(originalPath, mediumPath) && success;
    }
    
    // Copy to large (would be 800px width in production)
    if (!fs.existsSync(largePath)) {
      success = copyFile(originalPath, largePath) && success;
    }
    
    if (success) {
      successful++;
      console.log(`  ✓ ${filename}`);
    }
  });
  
  console.log(`\\n🎉 Photo optimization complete!`);
  console.log(`✓ ${successful}/${originalPhotos.length} photos processed successfully`);
  
  if (successful < originalPhotos.length) {
    console.log(`❌ ${originalPhotos.length - successful} photos failed to process`);
  }
  
  console.log('\\n📝 Note: This script currently copies files as-is.');
  console.log('   For production, consider adding Sharp library for actual image resizing:');
  console.log('   npm install sharp');
  console.log('   Then update this script to resize images properly.');
}

// Enhanced version with Sharp (commented out, requires Sharp installation)
/*
const sharp = require('sharp');

async function generateOptimizedVersionsWithSharp() {
  console.log('🖼️  Starting photo optimization with Sharp...');
  
  ensureDirectoryExists(THUMBNAILS_DIR);
  ensureDirectoryExists(MEDIUM_DIR);
  ensureDirectoryExists(LARGE_DIR);
  
  const originalPhotos = getOriginalPhotos();
  
  if (originalPhotos.length === 0) {
    console.log('❌ No photos found in original directory');
    return;
  }
  
  console.log(`📸 Found ${originalPhotos.length} photos to optimize`);
  
  let successful = 0;
  
  for (const filename of originalPhotos) {
    const originalPath = path.join(ORIGINAL_DIR, filename);
    const baseName = path.parse(filename).name;
    const ext = '.jpg'; // Always output as JPG for consistency
    
    const thumbnailPath = path.join(THUMBNAILS_DIR, baseName + ext);
    const mediumPath = path.join(MEDIUM_DIR, baseName + ext);
    const largePath = path.join(LARGE_DIR, baseName + ext);
    
    console.log(`Processing: ${filename}`);
    
    try {
      // Generate thumbnail (150px width)
      if (!fs.existsSync(thumbnailPath)) {
        await sharp(originalPath)
          .resize(150, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);
      }
      
      // Generate medium (400px width)
      if (!fs.existsSync(mediumPath)) {
        await sharp(originalPath)
          .resize(400, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85 })
          .toFile(mediumPath);
      }
      
      // Generate large (800px width)
      if (!fs.existsSync(largePath)) {
        await sharp(originalPath)
          .resize(800, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 90 })
          .toFile(largePath);
      }
      
      successful++;
      console.log(`  ✓ ${filename}`);
    } catch (error) {
      console.error(`  ❌ Failed to process ${filename}:`, error.message);
    }
  }
  
  console.log(`\\n🎉 Photo optimization complete!`);
  console.log(`✓ ${successful}/${originalPhotos.length} photos processed successfully`);
}
*/

// Main execution
if (require.main === module) {
  generateOptimizedVersions();
  
  // Uncomment this line and install Sharp for proper image resizing:
  // generateOptimizedVersionsWithSharp();
}

module.exports = {
  generateOptimizedVersions,
  ensureDirectoryExists,
  getOriginalPhotos
};
