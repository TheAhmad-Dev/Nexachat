#!/usr/bin/env node

/*
 * ============================================================
 * scripts/build-apk.js
 * ============================================================
 *
 * Builds a release APK whose backend URL is injected AT BUILD
 * TIME from this PC's current LAN IP — the release companion to
 * the runtime auto-detection used in Expo Go.
 *
 * Why: a release APK has no Metro connection, so runtime
 * detection is impossible. Instead we bake the address in when
 * the APK is built:
 *
 *     node scripts/build-apk.js
 *       -> detects current WiFi IP (e.g. 192.168.1.175)
 *       -> EXPO_PUBLIC_API_URL=http://192.168.1.175:3000
 *       -> expo export / eas build with that env inlined
 *
 * Result: install the APK on any phone on the SAME WiFi as this
 * PC and it talks to the backend with zero configuration.
 *
 * Requirements:
 *   - backend running on this PC (npm run dev in App_Backend)
 *   - backend bound to 0.0.0.0 (it is, by default, in index.ts)
 *   - phone on the same WiFi network
 *
 * One caveat worth knowing: if your PC's WiFi IP LATER changes,
 * rebuild the APK (one command) or the old address goes stale —
 * the same problem as before, but now with a one-command fix
 * instead of hand-editing a file.
 * ============================================================
 */

const { execSync } = require("child_process");
const path = require("path");

const LAN_IP = execSync(`node "${path.join(__dirname, "get-lan-ip.js")}"`)
  .toString()
  .trim();

const PORT = process.env.EXPO_PUBLIC_API_PORT || "3000";
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${LAN_IP}:${PORT}`;

console.log("==============================================");
console.log("  Nexachat APK build");
console.log("==============================================");
console.log(`  Detected LAN IP : ${LAN_IP}`);
console.log(`  Backend URL     : ${API_URL}`);
console.log("==============================================");
console.log(
  "  Make sure the backend is running and your phone\n  is on the same WiFi network as this PC."
);
console.log("==============================================\n");

const profile = process.argv[2] || "preview"; // preview | production
const extraArg = process.argv.slice(3).join(" ");

// Child processes inherit this script's env, so setting the
// EXPO_PUBLIC_* vars here is enough — no cross-env needed.
process.env.EXPO_PUBLIC_API_URL = API_URL;
process.env.EXPO_PUBLIC_API_PORT = PORT;

const command = `eas build --profile ${profile} --platform android ${extraArg}`.trim();

console.log(`> ${command}\n`);

try {
  execSync(command, {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, EXPO_PUBLIC_API_URL: API_URL, EXPO_PUBLIC_API_PORT: PORT },
  });
} catch (error) {
  console.error("\nAPK build failed:", error.message);
  process.exit(error.status || 1);
}
