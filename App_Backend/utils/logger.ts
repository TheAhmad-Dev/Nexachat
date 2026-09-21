import { env } from "../config/env.js";

/*
 * ============================================================
 * Leveled logger
 * ============================================================
 *
 * Replaces raw console.log spam across the backend:
 *
 *   - debug  -> hidden in production, visible in development
 *   - info   -> always visible, tagged [info]
 *   - warn   -> always visible, tagged [warn]
 *   - error  -> always visible (stderr), tagged [error]
 *
 * Everything still prints in development, so the DX you had
 * with console.log is unchanged. Production logs stay readable
 * and quiet.
 * ============================================================
 */

const stamp = (level: string): string => {
    const time = new Date().toISOString();

    return `[${time}] [${level}]`;
};

const debug = (...args: unknown[]): void => {
    if (!env.isProd) {
        console.log(...args);
    }
};

const info = (...args: unknown[]): void => {
    console.log(`${stamp("info")}`, ...args);
};

const warn = (...args: unknown[]): void => {
    console.warn(`${stamp("warn")}`, ...args);
};

const error = (...args: unknown[]): void => {
    console.error(`${stamp("error")}`, ...args);
};

export const logger = { debug, info, warn, error };
