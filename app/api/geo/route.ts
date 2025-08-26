import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Try to get country from Vercel's geo headers first
    const country = request.headers.get('x-vercel-ip-country') || 
                   request.headers.get('cf-ipcountry') || 
                   request.headers.get('x-country-code');
    
    if (country) {
      return NextResponse.json({ country: country.toUpperCase() });
    }

    // Fallback: try to get IP and use a geo service
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               request.ip || 
               '127.0.0.1';

    // For local development, default to a Russian IP
    if (ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ country: 'RU' }); // Default to Russian for local dev
    }

    // Try to use ipapi.co for country detection
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/country_code/`, {
        headers: {
          'User-Agent': 'terteryan-website/1.0'
        }
      });
      
      if (geoResponse.ok) {
        const countryCode = await geoResponse.text();
        if (countryCode && countryCode.length === 2) {
          return NextResponse.json({ country: countryCode.toUpperCase() });
        }
      }
    } catch (error) {
      console.log('ipapi.co failed:', error);
    }

    // Final fallback
    return NextResponse.json({ country: 'US' }); // Default to US (English)
    
  } catch (error) {
    console.error('Geo detection error:', error);
    return NextResponse.json({ country: 'US' }, { status: 500 });
  }
}
