# AGENTS.md — Nexachat project learnings

Monorepo: `App_Backend/` (Express + Socket.IO, **npm**) and `Frontend/Nexachat/` (Expo SDK 57 + expo-router, **pnpm**).

## Backend (App_Backend)

- Env var is `Mongo_Uri` (unusual casing) in `.env`. Optional: `JWT_REFRESH_SECRET` (falls back to `JWT_SECRET`), `ACCESS_TOKEN_TTL` (default 15m), `REFRESH_TOKEN_TTL` (default 30d), `ALLOWED_ORIGINS` (comma-separated; **empty = allow-all**, dev only — native/mobile requests send no Origin header and always pass).
- Server binds `0.0.0.0` on purpose — required for phones on the LAN. Don't "fix" it to localhost.
- `index.ts` has top-level `await` startup: **importing `../index.js` boots the server** (tests rely on this).
- Access-token JWT payload shape `{ user: { id, email, name, avatar } }` is load-bearing in 3 places: `socket/socket.ts` handshake, `middleware/auth.middleware.ts`, and frontend `jwtDecode<DecodedTokenProps>`. Changing `generateToken` breaks all of them at once.
- Refresh tokens carry `typ: "refresh"` and are rejected in TWO places that must stay in sync: socket handshake (`socket/socket.ts`) and `middleware/auth.middleware.ts`. Refresh tokens are not rotated on use (by design, see `controls/refresh.controls.ts`).
- `routes/message.routes.ts` only registers DELETE. A GET to `/api/messages/:id` returns **404 before auth middleware runs** — a 404 there means auth *passed* (controller ran), not that it failed.
- Message attachments carry `attachmentType: "image" | "video"` end-to-end (schema → `newMessage` event → `getMessages`/`getconversation` populate selects → frontend `MessageProps`). Adding a media kind means touching all of those. `attachment` is ONLY a Cloudinary URL — videos go to the `/video/upload` endpoint, images to `/image/upload` (`imageService.ts`).
- The backend returns sender-derived shapes; senders are `senderId` server-side but `sender: { id, name, avatar }` client-side. Conversation participants come populated with `_id` (no `id`) — compare with `String(p._id) !== String(currentUser?.id)`.

## Frontend (Frontend/Nexachat)

- `constants/index.ts` is a barrel re-exporting `constants/config.ts`; `API_URL` lives ONLY in `config.ts`. Don't redefine it elsewhere.
- `API_URL` resolution order in `config.ts`: explicit `EXPO_PUBLIC_API_URL` → runtime LAN detection via expo-constants (`hostUri`/`debuggerHost` — the Metro host IS the PC's WiFi IP) → platform fallbacks (`10.0.2.2` Android emulator, `localhost` otherwise). Tunnel hosts (`*.exp.direct`) are deliberately ignored — they can't proxy port 3000.
- `EXPO_PUBLIC_*` vars are inlined at bundle time: restart Metro with `npx expo start -c` after editing `.env.local` or they silently don't apply.
- Release APKs have no Metro connection → runtime detection is impossible. `npm run build:apk` (see `scripts/README-APK.md`) injects the PC's current LAN IP at build time. `android.usesCleartextTraffic: true` in `app.json` is required for plain-`http://` LAN backends in release builds.
- Socket singleton (`socket/sockets.ts`) uses `auth: (cb) => …` (callback form) so every reconnect re-reads the token from AsyncStorage — that's how post-refresh reconnects work. Don't convert to a static object.
- Expo SDK 57 API drift: `expo-video` exports `VideoView` + `useVideoPlayer` (NO `Video`/`ResizeMode` — `contentFit: 'contain'`, `nativeControls` props). `expo-file-system` new API is `File`/`Paths` + `File.downloadFileAsync(url, file)`; legacy `FileSystem.downloadAsync` throws at runtime. `StyleSheet.absoluteFillObject` missing in this RN typings build — spell out `position:'absolute', top/left/right/bottom:0`. New screens must be added to `app/_layout.tsx` AND appear in typed-routes: use `// @ts-expect-error` on the pathname until the registry regenerates.
- One typ-claim detail in the socket: refresh-token rejection there comes from *signature verification* (distinct secrets), so the error is `Invalid or expired token`, not `Invalid Token`. The typ guard is only observable when secrets are shared.

## Tests (App_Backend)

- `npm test` = typecheck + `tsx tests/auth.api.test.ts` + `tsx tests/socket.auth.test.ts`. No test framework — plain `node:assert` scripts with their own `process.exit` codes.
- Direct conversations are **upserts** (`$all` + `$size: 2` returns the existing one); groups always create. To get a guaranteed-distinct second conversation in a test, create a group.
- `tests/setup.ts` tries `mongodb-memory-server` (45s hard timeout — the mongod download hangs forever on this network) and falls back to the Atlas cluster on a throwaway `nexachat-test-<random>` DB, dropped afterwards. **Never point tests at the dev `letchat` DB.** Tests boot the server on port 3777 to avoid clashing with a running dev server.

## Debugging signatures seen here

- Axios "REQUEST SENT BUT NO RESPONSE" from the app = wrong/stale backend host (the original bug: malformed stale IPv6 in `.env.local`). Check the `[Nexachat] API_URL resolved to:` log line first.
- `EBUSY: resource busy or locked, rename …node_modules\mongodb-memory-server` on Windows: a hung earlier install keeps a lock. It released on its own after ~20 min; `rm -rf` of the locked dir fails too. Don't reinstall in a loop — verify disk state and proceed if packages are intact.
- `write_file` patch application intermittently failed on this repo's CRLF files; `str_replace` with exact file content (including `\r\n`) succeeded where full-file writes failed.

## Verification habits for this repo

- Backend: `npx tsc --noEmit` (strict + `verbatimModuleSyntax` + `exactOptionalPropertyTypes` — type-only imports are enforced).
- Frontend: `npx tsc --noEmit` in `Frontend/Nexachat`.
- `npm run build` in backend compiles to `dist/` (ESM, NodeNext — relative imports need `.js` extensions).
