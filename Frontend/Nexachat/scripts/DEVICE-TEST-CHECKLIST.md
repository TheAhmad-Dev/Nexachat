# Device verification checklist — media flows

Automated suites (backend contracts + `services/mediaService.unit.test.ts`) already
cover the socket/persist logic. **The behaviors below can only be verified on real
hardware** — native pickers, gallery writes, and video playback. Do not mark any
item done until you have seen it happen on the device.

## Setup (Expo Go on a physical phone)

1. **Backend:** in `App_Backend/` run `npm run dev` (port 3000). PC and phone on the
   **same Wi-Fi**.
2. **Frontend:** in `Frontend/Nexachat/` run `npx expo start -c` (the `-c` clears the
   Metro cache so the typed-routes registry and any `EXPO_PUBLIC_*` changes apply).
3. Watch the startup log for `[Nexachat] API_URL resolved to:` — it must show the
   PC's LAN IP (e.g. `http://192.168.x.x:3000`). If it's wrong, nothing else will work.
4. On the phone: open **Expo Go** → scan the QR code from the terminal (Android: scan
   in-app; iOS: scan with Camera).
5. If the backend-unreachable banner shows, the app cannot see the PC — re-check the
   Wi-Fi and the API_URL log line first.

## Smoke-test checklist

### A. Selecting an image
- [ ] Tap **+** in the composer → picker opens, images filtered
- [ ] Pick one → thumbnail preview appears in the attach button
- [ ] Tap **+** again → picker reopens (no crash, current selection replaced)

### B. Selecting a video
- [ ] With no attachment selected, tap **+** → video picker opens (videos filtered)
- [ ] Pick one → **video-camera badge** appears in the attach button
- [ ] Selecting a video after an image (or vice versa) replaces the selection — only
      one attachment is ever pending

### C. Uploading / sending
- [ ] Send an image-only message → bubble renders the image; no stuck spinner
- [ ] Send a video-only message → "Sending..." indicator clears after upload
- [ ] Send text + image together → both render in one bubble
- [ ] Airplane-mode the phone, try to send → upload error alert, **no phantom bubble**,
      composer keeps the content after re-enabling network

### D. Receiving media
- [ ] From a second account (second phone/browser session), send an image → it appears
      on the first device **without leaving the chat screen**
- [ ] Same with a video → bubble shows thumbnail **with play overlay**

### E. Forwarding media
- [ ] Long-press a media bubble → menu shows **Forward / Save to gallery / Delete**
- [ ] Forward → flat picker lists **all** conversations (DMs and groups together)
- [ ] Pick a group → open that group → the media arrived; also visible on other members' devices
- [ ] Pick a DM → media arrived there; the forwarded bubble is a normal message (it
      forwards/downloads/saves like any other)
- [ ] Long-press a **text-only** message → menu shows only Delete (no Forward/Save)

### F. Fullscreen image viewer
- [ ] Tap an image bubble → fullscreen viewer opens
- [ ] Tap backdrop or ✕ → closes back to the chat at the same scroll position

### G. Video playback
- [ ] Tap a video bubble → fullscreen player opens **and starts playing**
- [ ] Native controls work (seek, pause); ✕ / backdrop closes and playback stops
- [ ] Open the same video twice in a row → plays from the start both times

### H. Saving media to gallery
- [ ] Tap the **↓** button on a media bubble → "Saved" confirmation
- [ ] Open the phone's **Gallery/Photos** → the file is there and plays/renders correctly
- [ ] Long-press → "Save to gallery" does the same
- [ ] Save a video → it plays from the gallery (correct container/extension)

### I. Permissions & error paths
- [ ] First gallery save → OS permission dialog appears; **deny** → "Permission Required"
      alert, no crash; retry after granting in Settings → succeeds
- [ ] First pick with no media permission → same gate on the picker path
- [ ] Forward with the backend stopped → "Could not forward the media" alert (no crash)
- [ ] Save while offline → "Could not download the file" alert

## Result

Record every unchecked box here — those are exactly the behaviors that still need a
device before the media feature can be called verified.
