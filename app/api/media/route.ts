import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { MediaData, defaultMediaData } from '../../../src/data/mediaContent';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'mediaData.json');

// Helper function to read media data
export async function readMediaData(): Promise<MediaData> {
  try {
    if (existsSync(DATA_FILE)) {
      const data = await readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return defaultMediaData;
  } catch (error) {
    console.error('Error reading media data:', error);
    return defaultMediaData;
  }
}

// Helper function to write media data
export async function writeMediaData(data: MediaData): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing media data:', error);
    throw new Error('Failed to save media data');
  }
}

// GET - Retrieve all media data or specific type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'music', 'video', 'photos', 'publications'
    const locale = searchParams.get('locale') || 'ru';
    
    const mediaData = await readMediaData();
    
    if (type) {
      return NextResponse.json({
        success: true,
        data: mediaData[locale as keyof MediaData]?.[type as keyof MediaData['ru']],
      });
    }
    
    return NextResponse.json({
      success: true,
      data: mediaData,
    });
  } catch (error) {
    console.error('GET media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media data' },
      { status: 500 }
    );
  }
}

// POST - Add new media item
export async function POST(request: NextRequest) {
  try {
    const { type, locale, item } = await request.json();
    
    if (!type || !locale || !item) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: type, locale, item' },
        { status: 400 }
      );
    }
    
    const mediaData = await readMediaData();
    const localeData = mediaData[locale as keyof MediaData];
    
    if (!localeData || !localeData[type as keyof typeof localeData]) {
      return NextResponse.json(
        { success: false, error: 'Invalid type or locale' },
        { status: 400 }
      );
    }
    
    // Generate unique ID if not provided
    if (!item.id) {
      item.id = Date.now().toString();
    }
    
    // Add item to the appropriate array
    if (type === 'music') {
      localeData.music.tracks.push(item);
    } else {
      (localeData[type as keyof typeof localeData] as any).items.push(item);
    }
    
    await writeMediaData(mediaData);
    
    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('POST media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add media item' },
      { status: 500 }
    );
  }
}

// PUT - Update existing media item
export async function PUT(request: NextRequest) {
  try {
    const { type, locale, item } = await request.json();
    
    if (!type || !locale || !item || !item.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: type, locale, item with id' },
        { status: 400 }
      );
    }
    
    const mediaData = await readMediaData();
    const localeData = mediaData[locale as keyof MediaData];
    
    if (!localeData || !localeData[type as keyof typeof localeData]) {
      return NextResponse.json(
        { success: false, error: 'Invalid type or locale' },
        { status: 400 }
      );
    }
    
    // Find and update item
    let found = false;
    if (type === 'music') {
      const trackIndex = localeData.music.tracks.findIndex(track => track.id === item.id);
      if (trackIndex >= 0) {
        localeData.music.tracks[trackIndex] = item;
        found = true;
      }
    } else {
      const collection = (localeData[type as keyof typeof localeData] as any).items;
      const itemIndex = collection.findIndex((i: any) => i.id === item.id);
      if (itemIndex >= 0) {
        collection[itemIndex] = item;
        found = true;
      }
    }
    
    if (!found) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    await writeMediaData(mediaData);
    
    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('PUT media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update media item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove media item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const locale = searchParams.get('locale');
    const id = searchParams.get('id');
    
    if (!type || !locale || !id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: type, locale, id' },
        { status: 400 }
      );
    }
    
    const mediaData = await readMediaData();
    const localeData = mediaData[locale as keyof MediaData];
    
    if (!localeData || !localeData[type as keyof typeof localeData]) {
      return NextResponse.json(
        { success: false, error: 'Invalid type or locale' },
        { status: 400 }
      );
    }
    
    // Find and remove item
    let found = false;
    if (type === 'music') {
      const trackIndex = localeData.music.tracks.findIndex(track => track.id === id);
      if (trackIndex >= 0) {
        localeData.music.tracks.splice(trackIndex, 1);
        found = true;
      }
    } else {
      const collection = (localeData[type as keyof typeof localeData] as any).items;
      const itemIndex = collection.findIndex((i: any) => i.id === id);
      if (itemIndex >= 0) {
        collection.splice(itemIndex, 1);
        found = true;
      }
    }
    
    if (!found) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    await writeMediaData(mediaData);
    
    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('DELETE media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
}
