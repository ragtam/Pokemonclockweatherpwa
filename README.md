# Pokemon Weather Clock PWA ⚡

A Pokemon-themed Progressive Web App featuring a clock and weather display optimized for mobile devices.

## Features

- 🕐 **Clock View**: Real-time clock with current weather, sunrise/sunset times
- 📅 **7-Day Forecast**: Week-ahead weather forecast with daily sunrise/sunset
- ⚡ **Pikachu Gallery**: Three adorable Pikachu characters to keep you company
- 🎨 **Pokemon Aesthetic**: Vibrant colors and playful design inspired by Pokemon
- 📱 **Mobile Optimized**: Works in both portrait and landscape orientations
- 👆 **Swipe Navigation**: Intuitive left/right swipe gestures between views
- 🔋 **Wake Lock**: Keeps screen awake when in fullscreen mode
- 📴 **Offline Support**: Service worker enables offline functionality
- 🖼️ **Fullscreen Mode**: Immersive fullscreen display

## Installation

### On Mobile (Install as PWA)

1. Open the app in your mobile browser (Chrome, Safari, Edge)
2. Tap the browser menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be added to your home screen like a native app

### Desktop Development

```bash
npm install
npm run dev
```

## Usage

- **Swipe left/right** or use the indicators at the bottom to navigate between views
- **Tap the fullscreen button** (top-right) to enter fullscreen mode
- The app will automatically request Wake Lock to keep your screen on
- Pikachu characters change their pose every minute!

## Tech Stack

- ⚛️ React 18
- 🎨 Tailwind CSS v4
- 🌊 Motion (Framer Motion)
- 📱 PWA (Service Worker + Web Manifest)
- 🔒 Wake Lock API
- 🖼️ Fullscreen API

## Weather Data

Currently uses mock weather data. To integrate with a real weather API:

1. Get an API key from a weather service (OpenWeatherMap, WeatherAPI, etc.)
2. Update `/src/app/utils/mockWeatherData.ts` with real API calls
3. Add geolocation support to fetch weather for user's location

## Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)

Note: Wake Lock API support varies by browser and platform.

## License

MIT
