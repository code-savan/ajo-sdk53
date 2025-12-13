# 🎨 Creating a Smaller Splash Icon

## Problem
The app icon on the splash screen is too large (fills the screen). You want it to be smaller (around 40% of screen size).

## Solution
Create a new splash image with the icon centered but smaller with white padding around it.

## Quick Fix (Recommended)

### Option 1: Use Figma/Design Tool
1. Create a canvas: **1284 x 2778** (iPhone splash size)
2. Fill background: **White (#FFFFFF)**
3. Place your app icon in the center: **~150-200px** size
4. Export as PNG: `splash-small.png`
5. Save to: `/Users/mac/Downloads/ajo-sdk53/mobileapp/assets/splash-small.png`

### Option 2: Use Online Tool
Visit: https://www.canva.com or https://www.figma.com
- Create blank design
- Size: 1284 x 2778
- Background: White
- Add your appicon.png
- Resize to 150px x 150px
- Center it
- Download as PNG

### Option 3: Use ImageMagick (Command Line)
```bash
cd /Users/mac/Downloads/ajo-sdk53/mobileapp/assets

# Create splash with small centered icon
convert -size 1284x2778 xc:white \
  \( appicon.png -resize 150x150 \) \
  -gravity center -composite \
  splash-small.png
```

## Update app.json

After creating `splash-small.png`, update:

```json
{
  "splash": {
    "image": "./assets/splash-small.png",  // ← Use new smaller splash
    "resizeMode": "contain",
    "backgroundColor": "#FFFFFF"
  }
}
```

## Current Config (Using Full Icon)
Right now it uses `appicon.png` which is 1024x1024, so it fills most of the screen.

## Recommended Icon Sizes

| Device Type | Icon Size on Splash |
|-------------|---------------------|
| Small | 100-120px |
| Medium (Recommended) | 150-180px |
| Large | 200-240px |

For a professional look, **150px** is ideal.

---

**Quick Test:**
After creating the splash, run:
```bash
npx expo start
```
Press `i` for iOS simulator to preview the splash screen.
