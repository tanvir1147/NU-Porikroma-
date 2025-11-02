# Google AdSense Setup Guide

## ✅ Current Status
- AdSense script is properly integrated
- Client ID is configured: `ca-pub-4826393383001468`
- Ad banners are placed in strategic locations (top, middle, bottom)

## 🔧 Next Steps

### 1. Get Your Ad Unit IDs
1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Navigate to **Ads** → **By ad unit**
3. Create new ad units for each position:
   - **Top Banner**: Responsive display ad (728x90 or responsive)
   - **Middle Banner**: Rectangle ad (300x250 or responsive)
   - **Bottom Banner**: Responsive display ad (728x90 or responsive)
   - **Sidebar** (optional): Vertical ad (160x600 or responsive)

### 2. Update Environment Variables
Replace the placeholder ad slot IDs in your `.env` file:

```env
# Replace these with your actual ad unit IDs from AdSense dashboard
NEXT_PUBLIC_ADSENSE_TOP_SLOT="1234567890"        # Replace with actual ID
NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT="1234567891"     # Replace with actual ID
NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT="1234567892"     # Replace with actual ID
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT="1234567893"    # Replace with actual ID
```

### 3. Ad Placement Locations
Your ads are currently placed at:
- **Top**: Below the header, before the notice filters
- **Middle**: After the first 5 notices (if more than 5 exist)
- **Bottom**: Before the footer

### 4. Testing
- Ads may take 24-48 hours to start showing after setup
- Use AdSense's "Ad review center" to check ad status
- Test on different devices (mobile/desktop)

### 5. Important Notes
- ✅ AdSense script loads with `strategy="afterInteractive"` for better performance
- ✅ Ads are responsive and mobile-friendly
- ✅ Loading states and error handling are implemented
- ✅ Ads won't show if client ID is not properly configured

## 🚀 Current Implementation Features
- **Responsive ads**: Automatically adjust to screen size
- **Loading states**: Shows skeleton while ads load
- **Error handling**: Graceful fallback if ads fail to load
- **Mobile optimized**: Different ad formats for different screen sizes
- **Performance optimized**: Ads load after page interaction

## 📱 Mobile Optimization
- Top/Bottom: Horizontal banner ads
- Middle: Rectangle ads (better for mobile)
- Responsive sizing based on screen width

Your AdSense integration is ready! Just update the ad unit IDs and you're good to go.