import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

const configureMongoDns = (): void => {
    dns.setDefaultResultOrder("ipv4first");

    if (env.mongoDnsServers === "system") {
        return;
    }

    const servers = env.mongoDnsServers
        ? env.mongoDnsServers.split(",").map((server) => server.trim()).filter(Boolean)
        : ["8.8.8.8", "8.8.4.4"];

    dns.setServers(servers);
};

const myconnectedDatabase = async (): Promise<void> => {
    configureMongoDns();

    try {
        await mongoose.connect(env.mongoUri, {
            family: 4,
            serverSelectionTimeoutMS: 10_000,
        });

        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        throw error;
    }
};

export default myconnectedDatabase;
