import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

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

        console.log(" There you go .MongoDB connected successfully  ✅");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default myconnectedDatabase;
