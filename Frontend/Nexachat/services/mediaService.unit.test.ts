/*
 * ============================================================
 * mediaService.unit.test.ts — headless contract for the
 * on-device media helpers (style matches the backend suites:
 * plain node:assert scripts, no test framework)
 * ============================================================
 *
 * Runs the real functions from mediaService.ts. The Expo/RN
 * modules are stubbed with a Module._load hook BEFORE anything
 * loads — necessary because react-native's Flow source can't
 * even be parsed under Node, so the real package must never be
 * reached. The library logic — URL extension parsing, the
 * save-to-gallery permission/download/persist chain, and
 * picker delegation — is exercised without physical hardware.
 *
 * Run: npx tsx services/mediaService.unit.test.ts
 * ============================================================
 */
import assert from "node:assert/strict";
import Module from "node:module";

// --- Call recorder + resolution-level mocks (pre-import) ---

let nextAssetId = 1;

const calls = {
  libraryPermissions: 0,
  pickerPermissions: 0,
  downloadFile: 0,
  createAsset: 0,
  launchPicker: 0,
  libraryGranted: true,
  pickerGranted: true,
  downloadThrows: false,
  lastDownloadUrl: "",
};

const alerts: string[] = [];

const mocks: Record<string, object> = {
  "expo-media-library": {
    requestPermissionsAsync: async () => {
      calls.libraryPermissions += 1;
      return { granted: calls.libraryGranted };
    },
    createAssetAsync: async (localUri: string) => {
      calls.createAsset += 1;
      return { id: `asset-${nextAssetId}`, localUri };
    },
  },
  "expo-file-system": {
    Paths: { cache: { uri: "file:///cache" } },
    File: class {
      uri: string;
      constructor(_dir: unknown, name: string) {
        this.uri = `file:///cache/${name}`;
      }
      static async downloadFileAsync(url: string, file: { uri: string }) {
        calls.downloadFile += 1;
        calls.lastDownloadUrl = url;
        if (calls.downloadThrows) {
          throw new Error("network down");
        }
        return { uri: file.uri };
      }
    },
  },
  "expo-image-picker": {
    requestMediaLibraryPermissionsAsync: async () => {
      calls.pickerPermissions += 1;
      return { granted: calls.pickerGranted };
    },
    launchImageLibraryAsync: async () => {
      calls.launchPicker += 1;
      return {
        canceled: false,
        assets: [{ uri: "file:///media/picked-asset.jpg" }],
      };
    },
  },
  "react-native": {
    Alert: {
      alert: (title: string) => {
        alerts.push(title);
      },
    },
  },
};

const realLoad = Module._load;
(Module as unknown as { _load: unknown })._load = function (
  request: string,
  parent: unknown,
  isMain: boolean
) {
  if (Object.prototype.hasOwnProperty.call(mocks, request)) {
    return mocks[request];
  }
  return (realLoad as (...args: unknown[]) => unknown).call(
    this,
    request,
    parent,
    isMain
  );
};

const main = async () => {
  // Import AFTER the hook is installed.
  const { extensionFromUrl, saveToGallery, pickChatImage, pickChatVideo } =
    await import("./mediaService");

  /* ==========================================================
   * 1. extensionFromUrl — URL parsing table
   * ========================================================== */

  const EXT_CASES: [string, string][] = [
    ["https://res.cloudinary.com/demo/video/upload/v1/clip.mp4", "mp4"],
    ["https://res.cloudinary.com/demo/image/upload/v1/photo.JPG", "jpg"],
    ["https://example.com/p/file.heic?token=abc&s=3", "heic"],
    ["https://example.com/no-extension", ""],
    ["https://example.com/dir.only/", ""],
  ];

  for (const [url, expected] of EXT_CASES) {
    assert.equal(extensionFromUrl(url), expected, `ext(${url})`);
  }
  console.log("[unit] extensionFromUrl table PASSED (5 cases)");

  /* ==========================================================
   * 2. saveToGallery — permission -> download -> persist chain
   * ========================================================== */

  const freshSave = () => {
    calls.libraryPermissions = 0;
    calls.downloadFile = 0;
    calls.createAsset = 0;
    calls.downloadThrows = false;
    calls.libraryGranted = true;
    alerts.length = 0;
  };

  // Happy path: image and video both persist; the URL is downloaded.
  freshSave();
  let res = await saveToGallery("https://x/y/clip", "video");
  assert.equal(res.success, true);
  assert.equal(calls.libraryPermissions, 1);
  assert.equal(calls.downloadFile, 1);
  assert.equal(calls.lastDownloadUrl, "https://x/y/clip");
  assert.equal(calls.createAsset, 1);
  assert.equal(alerts[alerts.length - 1], "Saved");

  freshSave();
  res = await saveToGallery("https://x/y/photo", "image");
  assert.equal(res.success, true);
  assert.equal(calls.createAsset, 1);
  assert.equal(alerts[alerts.length - 1], "Saved");

  console.log("[unit] saveToGallery happy path PASSED (image + video)");

  // Permission denied -> no download, no asset, explicit failure.
  freshSave();
  calls.libraryGranted = false;
  res = await saveToGallery("https://x/y/photo.jpg", "image");
  assert.equal(res.success, false);
  assert.equal(calls.downloadFile, 0);
  assert.equal(calls.createAsset, 0);
  console.log("[unit] saveToGallery permission-denied gate PASSED");

  // Download failure -> no asset persisted, failure surfaced.
  freshSave();
  calls.downloadThrows = true;
  res = await saveToGallery("https://x/y/photo.jpg", "image");
  assert.equal(res.success, false);
  assert.equal(calls.createAsset, 0);
  assert.equal(alerts[alerts.length - 1], "Error");
  console.log("[unit] saveToGallery download-failure gate PASSED");

  /* ==========================================================
   * 3. Pickers — permission gate + delegation to the launcher
   * ========================================================== */

  calls.pickerPermissions = 0;
  calls.launchPicker = 0;
  calls.pickerGranted = true;
  assert.equal(await pickChatVideo(), "file:///media/picked-asset.jpg");
  assert.equal(calls.launchPicker, 1);

  calls.pickerGranted = false;
  assert.equal(await pickChatImage(), null);
  assert.equal(calls.launchPicker, 1); // still 1: not launched without permission

  console.log("[unit] picker permission gate + delegation PASSED");

  console.log("[unit] mediaService unit contract PASSED ✔");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[unit] FAILED:", error);
    process.exit(1);
  });
