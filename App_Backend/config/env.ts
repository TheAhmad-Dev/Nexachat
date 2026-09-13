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

export const env = {
    port: parsePort(process.env.PORT),
    mongoUri: requireEnv("Mongo_Uri"),
    jwtSecret: requireEnv("JWT_SECRET"),
    mongoDnsServers: process.env.MONGO_DNS_SERVERS?.trim(),
};
