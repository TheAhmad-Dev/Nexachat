import dotenv from "dotenv";

dotenv.config();

const requireEnv = (name: string): string => {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

const parsePort = (value: string | undefined): number => {
    const port = Number.parseInt(value?.trim() ?? "", 10);
    return Number.isFinite(port) && port > 0 ? port : 3000;
};

const parseList = (value: string | undefined): string[] =>
    value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];

const nodeEnv = process.env.NODE_ENV?.trim() || "development";

export const env = {
    port: parsePort(process.env.PORT),
    mongoUri: requireEnv("Mongo_Uri"),
    jwtSecret: requireEnv("JWT_SECRET"),

    // Falls back to jwtSecret when not provided so existing
    // .env files keep working. Set JWT_REFRESH_SECRET in
    // production so access/refresh tokens have different keys.
    refreshTokenSecret:
        process.env.JWT_REFRESH_SECRET?.trim() || requireEnv("JWT_SECRET"),

    // Short-lived access token + long-lived refresh token.
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL?.trim() || "15m",
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL?.trim() || "30d",

    // Comma-separated list of origins allowed by CORS,
    // e.g. "https://nexachat.app,http://localhost:8081".
    // Native/mobile app requests send no Origin header and
    // are always allowed. When empty, all origins are allowed
    // (development only).
    allowedOrigins: parseList(process.env.ALLOWED_ORIGINS),

    mongoDnsServers: process.env.MONGO_DNS_SERVERS?.trim(),

    nodeEnv,
    isProd: nodeEnv === "production",
};
