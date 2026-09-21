/*
 * Barrel re-export — the single source of truth for app
 * configuration lives in ./config.ts. Every module can import
 * from "@/constants", "../constants/index" or "@/constants/config"
 * and always receives the same runtime-resolved API_URL.
 *
 * (The backend health check lives in services/apiHealth.ts —
 * constants hold values, not network I/O.)
 */
export {
  API_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "./config";