# PWA Installation Guide

## Installing on Mobile Devices

### iOS (iPhone/iPad) - Safari

1. Open Safari and navigate to the app URL
2. Tap the Share button (square with arrow pointing up) at the bottom
3. Scroll down and tap "Add to Home Screen"
4. Edit the name if desired, then tap "Add"
5. The app icon will appear on your home screen
6. Tap the icon to launch the app in fullscreen mode

**Note:** On iOS, Safari is required for PWA installation. Other browsers (Chrome, Firefox) don't support this feature.

### Android - Chrome/Edge

1. Open Chrome or Edge browser and navigate to the app URL
2. Tap the three-dot menu in the top-right corner
3. Select "Add to Home screen" or "Install app"
4. Confirm the installation
5. The app will be added to your home screen and app drawer
6. Launch it like any other app

### Android - Firefox

1. Open Firefox and navigate to the app URL
2. Tap the three-dot menu
3. Select "Install"
4. Confirm the installation
5. Access from home screen or app drawer

## Features When Installed as PWA

✅ **Fullscreen Display** - No browser UI, just the app  
✅ **Home Screen Icon** - Quick access like a native app  
✅ **Offline Support** - Service worker caches core functionality  
✅ **Wake Lock** - Screen stays on during use  
✅ **Standalone Experience** - Feels like a native app  

## Enabling Fullscreen Mode

Once installed:
1. Open the app
2. Tap the fullscreen button (expand icon) in the top-right corner
3. Or press 'F' on keyboard (desktop/tablet with keyboard)
4. The app will enter fullscreen mode and activate Wake Lock

## Screen Wake Lock

The app automatically requests Wake Lock to keep your screen on:
- Activates when the app is open
- Reactivates when you return to the app
- Prevents screen from sleeping during use
- Perfect for use as a bedside clock

**Browser Support:**
- ✅ Chrome/Edge on Android
- ✅ Safari on iOS 16.4+
- ⚠️ Limited support on desktop browsers
- ❌ Not supported on older iOS versions

## Troubleshooting

### Wake Lock Not Working
- Ensure you're using a supported browser
- Check that battery saver mode is not active
- On iOS, make sure Auto-Lock is set to "Never" in Settings
- Try closing and reopening the app

### App Won't Install
- Clear browser cache and try again
- Make sure you have space on your device
- Try a different browser
- On iOS, use Safari specifically

### Swipe Navigation Issues
- Ensure touch gestures are enabled
- Try swiping from the middle of the screen
- Disable browser gestures that might conflict
- Use the dots at the bottom to switch views

## Uninstalling the PWA

### iOS
1. Long-press the app icon
2. Tap "Remove App"
3. Select "Delete App"

### Android
1. Long-press the app icon
2. Tap "App info" or drag to "Uninstall"
3. Confirm uninstallation

## Technical Requirements

- Modern browser (last 2 versions recommended)
- HTTPS connection (required for service workers)
- JavaScript enabled
- Minimum 320px screen width
- Touch-enabled device for swipe gestures

## Privacy & Permissions

The app requests:
- **Wake Lock**: To keep screen on
- **Fullscreen**: For immersive display
- **Cache Storage**: For offline functionality

No data is collected or transmitted. All weather data is currently mocked for demonstration.
