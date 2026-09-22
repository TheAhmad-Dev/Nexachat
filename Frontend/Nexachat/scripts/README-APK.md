# Building the Nexachat APK with automatic backend connection

## What this solves

A release APK has no Metro bundler connection, so the runtime
auto-detection used in Expo Go cannot work. Instead, the build
script detects your PC's current WiFi IP **at build time** and
bakes it into the APK. Install the APK on any phone on the same
WiFi and it connects to your backend with zero configuration.

## Requirements

1. Backend running on the PC:
   ```
   cd App_Backend
   npm run dev
   ```
   (It binds to 0.0.0.0, so phones can reach it.)

2. Phone on the **same WiFi** as the PC.

3. EAS CLI logged in (first time only):
   ```
   npx eas login
   ```

## Build

```
cd Frontend/Nexachat
npm run build:apk
```

The script prints the detected IP and backend URL, then runs
`eas build --profile preview --platform android` with
`EXPO_PUBLIC_API_URL=http://<your-ip>:3000` injected.

When it finishes, EAS gives you a download link — install the
APK on the phone and log in.

## If your PC's WiFi IP changes later

Just rebuild (one command, ~nothing to edit):

```
npm run build:apk
```

## Production note

`npm run build:apk:prod` builds the production profile the same
way — fine for LAN testing, but for a real deployment you should
host the backend publicly (e.g. Railway/Render/VPS) and set
`EXPO_PUBLIC_API_URL=https://your-domain.com` in `.env.local`
before building. The Android cleartext setting
(`usesCleartextTraffic`) is needed while the backend is plain
`http://` on the LAN; remove it once you serve HTTPS.
