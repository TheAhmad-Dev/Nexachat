import { API_URL } from "@/constants/config";

/*
 * ============================================================
 * apiHealth — backend connectivity check
 * ============================================================
 *
 * Pings the backend health endpoint so a wrong-host problem
 * surfaces as ONE clear log line instead of mysterious "no
 * response" errors on every screen. Used by the
 * BackendStatusBanner.
 * ============================================================
 */

export async function verifyApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) {
      console.log(`[Nexachat] API reachable but unhealthy: ${response.status}`);
      return false;
    }

    console.log(`[Nexachat] API connection verified: ${API_URL}/health ✅`);
    return true;
  } catch (error) {
    console.log(
      `[Nexachat] API unreachable at ${API_URL} — is the backend running and on the same WiFi?`,
      error,
    );
    return false;
  }
}
