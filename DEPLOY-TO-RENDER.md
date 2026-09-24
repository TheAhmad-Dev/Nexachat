# Deploy NexaChat Backend to Render (free) — 5 minutes, once

Goal: backend runs on the internet 24/7. The APK works on any network
(mobile data included). Your PC becomes unnecessary.

---

## Step 1 — Create the service (dashboard, ~2 min)

1. Open https://dashboard.render.com → **Sign in with GitHub** (free account, no card).
2. **New +** → **Blueprint** → authorize Render for the `TheAhmad-Dev/Nexachat` repo if asked.
3. Repository: `Nexachat` → **Branch: `media-messaging-forwarding-auth`** (contains `render.yaml`).
4. Click **Apply**. Render reads `render.yaml` and creates `nexachat-backend`.

## Step 2 — Paste the 3 secret values (from `App_Backend/.env` on this PC)

Render prompts for each `sync: false` variable at creation (or add them under
the service → **Environment**):

| Key | Value (copy from local .env) |
|---|---|
| `Mongo_Uri` | your Atlas connection string |
| `JWT_SECRET` | your JWT secret |
| `JWT_REFRESH_SECRET` | your refresh secret (if the local .env has none, paste the same value as JWT_SECRET) |

Do **not** set `PORT` — Render injects it and the backend already reads it.

## Step 3 — First deploy (~4 min)

Render builds automatically (`npm install && npm run build`, starts `node dist/index.js`).
Watch the **Logs** tab until you see `Server is running on port 10000 (production)`.

- If logs show a **MongoDB connection timeout**: open Atlas → your cluster →
  **Network Access** → **Add IP Address** → `0.0.0.0/0` → save. Render then
  redeploys on the next push, or hit **Manual Deploy**.

## Step 4 — Verify

Your URL is `https://nexachat-backend.onrender.com` (shown atop the service page).

```
curl https://nexachat-backend.onrender.com/health
→ {"success":true,"status":"healthy"}
```

## Step 5 — Rebuild the APK with the cloud URL

Ask the agent: "rebuild the APK against https://nexachat-backend.onrender.com".
That rebuild sets `EXPO_PUBLIC_API_URL` to the Render URL instead of the LAN IP.
Install the new APK — the app now works on Wi-Fi **or** mobile data, PC off.

---

## Free-tier facts (important)

- **Sleeps after 15 min without traffic.** First request after sleep takes
  ~50 s to wake (the app's first attempt may show a timeout — tap Try again).
  Socket.IO connections keep it awake while anyone is using the app.
- **750 hours/month free** — one service runs all month.
- **Auto-deploys on every push** to the selected branch (keep `render.yaml`).
- The local PC backend (`npm run dev` on port 3000) remains as a dev fallback;
  it is independent of the cloud one.
