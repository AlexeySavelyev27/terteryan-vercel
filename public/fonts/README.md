# Self-Hosted Fonts Setup

To eliminate font loading layout shifts, download these font files and place them in this directory:

## Required Font Files:

### Merriweather (Main serif font for menu/navigation):
- `Merriweather-Regular.woff2`
- `Merriweather-Regular.woff`
- `Merriweather-Light.woff2`
- `Merriweather-Light.woff`

### Vollkorn (Secondary serif font):
- `Vollkorn-Regular.woff2`
- `Vollkorn-Regular.woff`
- `Vollkorn-Medium.woff2`
- `Vollkorn-Medium.woff`

## Download Sources:

### Option 1: Google Fonts Helper (Recommended)
1. Go to https://gwfh.mranftl.com/fonts
2. Search for "Merriweather" and "Vollkorn"
3. For Merriweather: Select weights 300, 400
4. For Vollkorn: Select weights 400, 500
5. Download the font packages
6. Extract the `.woff2` and `.woff` files to this directory

### Option 2: Google Fonts Direct
1. Go to https://fonts.google.com/
2. Download Merriweather and Vollkorn font families
3. Convert TTF/OTF files to WOFF2/WOFF using online converters

## File Structure:
```
public/fonts/
├── Merriweather-Regular.woff2
├── Merriweather-Regular.woff
├── Merriweather-Light.woff2
├── Merriweather-Light.woff
├── Vollkorn-Regular.woff2
├── Vollkorn-Regular.woff
├── Vollkorn-Medium.woff2
├── Vollkorn-Medium.woff
└── README.md (this file)
```

Once these files are in place, the fonts will load instantly from your server with zero layout shifts!
