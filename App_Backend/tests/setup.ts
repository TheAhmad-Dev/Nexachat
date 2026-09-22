/*
 * ============================================================
 * Test bootstrap — shared harness
 * ============================================================
 *
 * Boots the real app on port 3777 against an in-memory MongoDB
 * (mongodb-memory-server, first choice) or, when the mongod
 * download is unavailable, the Atlas cluster from .env pointed
 * at a throwaway `nexachat-test-<random>` database that is
 * dropped afterwards. Dev data in `letchat` is never touched.
 * ============================================================
 */

import axios from "axios";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "test-refresh-secret";
process.env.ACCESS_TOKEN_TTL = "15m";
process.env.REFRESH_TOKEN_TTL = "30d";
process.env.NODE_ENV = "test";

export const TEST_PORT = "3777";

let memoryServer: MongoMemoryServer | null = null;

/** True when running against the throwaway Atlas database. */
export const usingAtlasFallback = (): boolean => memoryServer === null;

const startTestDb = async (): Promise<string> => {
  try {
    // The first create() may download a mongod binary. If the
    // download endpoint is slow/blocked we must NOT hang forever
    // — race it with a hard timeout and fall back to Atlas.
    const createWithTimeout = <T,>(promise: Promise<T>, ms: number) =>
      Promise.race([
        promise,
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`mongod setup exceeded ${ms}ms`)),
            ms
          ),
        ),
      ]);

    memoryServer = await createWithTimeout(
      MongoMemoryServer.create({
        instance: { dbName: "nexachat-test" },
      }),
      45_000
    );

    return memoryServer.getUri("nexachat-test");
  } catch (error) {
    console.warn(
      "[test] mongodb-memory-server unavailable, falling back to Atlas throwaway DB:",
      error instanceof Error ? error.message : error
    );

    memoryServer = null;

    const devUri = process.env.Mongo_Uri;

    if (!devUri) {
      throw new Error(
        "No in-memory MongoDB available and no Mongo_Uri fallback configured"
      );
    }

    // Point the dev cluster at a unique throwaway database.
    return devUri.replace(
      /\/([a-zA-Z0-9_-]+)(\?|$)/,
      (_match, _dbName, query) =>
        `/nexachat-test-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}${query}`
    );
  }
};

export const stopTestDb = async (): Promise<void> => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
    return;
  }

  // Atlas fallback: drop the throwaway test database we created.
  const dbName = mongoose.connection.name;

  if (dbName.startsWith("nexachat-test-")) {
    try {
      await mongoose.connection.getClient().db(dbName).dropDatabase();
      console.log(`[test] dropped throwaway database: ${dbName}`);
    } catch (error) {
      console.warn("[test] failed to drop throwaway database:", error);
    }
  }
};

/** Boots the real app (env -> db -> import index.ts) and waits for /health. */
export const bootServer = async (): Promise<string> => {
  process.env.NODE_ENV = "test";
  process.env.PORT = TEST_PORT;

  const dotenv = await import("dotenv");
  dotenv.config();

  process.env.Mongo_Uri = await startTestDb();

  // Importing starts the server (top-level await in index.ts).
  await import("../index.js");

  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;
  const deadline = Date.now() + 15_000;
  let up = false;

  while (Date.now() < deadline && !up) {
    try {
      await axios.get(`${baseUrl}/health`);
      up = true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  if (!up) {
    throw new Error("server did not become healthy in time");
  }

  return baseUrl;
};
