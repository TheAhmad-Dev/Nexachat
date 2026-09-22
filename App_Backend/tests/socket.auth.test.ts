/*
 * ============================================================
 * Socket.IO auth contract
 * ============================================================
 *
 * Handshake rules, verified with a real socket.io-client:
 *   - valid access token  -> connects, auto-joins conversation
 *     rooms, and receives messages emitted to them
 *   - anything else       -> handshake rejected
 *
 * The rejection table at the bottom is the contract:
 *   credential        ->  expected rejection
 * ============================================================
 */

import assert from "node:assert/strict";
import axios from "axios";
import { io, Socket as ClientSocket } from "socket.io-client";
import jwt from "jsonwebtoken";

import { bootServer, stopTestDb, usingAtlasFallback } from "./setup.js";

/** Resolves on "connect", rejects with the connect_error message. */
const tryConnect = (url: string, token: string | null): Promise<ClientSocket> =>
  new Promise((resolve, reject) => {
    const socket: ClientSocket = io(url, {
      auth: token ? { token } : {},
      transports: ["websocket"],
      reconnection: false,
      timeout: 5_000,
    });

    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (error) => {
      socket.close();
      reject(new Error(error.message));
    });
    setTimeout(() => {
      socket.close();
      reject(new Error("handshake timed out"));
    }, 5_500);
  });

const main = async (): Promise<void> => {
  const httpOrigin = await bootServer();

  const register = async (name: string, email: string) => {
    const response = await axios.post(`${httpOrigin}/auth/register`, {
      name,
      email,
      password: "secret123",
      avatar: "",
    });
    return response.data as {
      token: string;
      refreshToken: string;
      user: { id: string };
    };
  };

  const alice = await register("Alice", "alice@sock.test");
  const bob = await register("Bob", "bob@sock.test");

  // ----------------------------------------------------------
  // happy path: connect -> auto-join room -> live delivery
  // ----------------------------------------------------------
  const aliceSocket = await tryConnect(httpOrigin, alice.token);

  const conversationId = await new Promise<string>((resolve, reject) => {
    aliceSocket.emit("newConversation", {
      type: "direct",
      participants: [alice.user.id, bob.user.id],
    });
    aliceSocket.on("newConversation", (payload: {
      success: boolean;
      data?: { _id: string };
    }) => {
      if (payload.success && payload.data?._id) {
        resolve(payload.data._id);
      }
    });
    setTimeout(() => reject(new Error("newConversation timed out")), 5_000);
  });

  const bobSocket = await tryConnect(httpOrigin, bob.token);

  const delivered = new Promise<string>((resolve) => {
    bobSocket.on("newMessage", (payload: {
      success: boolean;
      data?: { content: string };
    }) => {
      if (payload.success && payload.data) {
        resolve(payload.data.content);
      }
    });
    setTimeout(() => resolve("<timeout>"), 5_000);
  });

  aliceSocket.emit("newMessage", {
    conversationId,
    content: "hello from alice",
    attachment: null,
  });

  assert.equal(
    await delivered,
    "hello from alice",
    "bob must auto-join conversation rooms on connect and receive messages"
  );

  bobSocket.close();

  // ----------------------------------------------------------
  // rejection table: credential -> expected error pattern
  // ----------------------------------------------------------
  const expiredToken = jwt.sign(
    {
      user: {
        id: alice.user.id,
        email: "alice@sock.test",
        name: "Alice",
        avatar: "",
      },
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "-10s" }
  );

  const rejectionCases: {
    name: string;
    token: string | null;
    expect: RegExp;
  }[] = [
    { name: "missing token", token: null, expect: /No token provided/ },
    { name: "garbage token", token: "not-a-jwt", expect: /Invalid or expired token/ },
    // Distinct secrets -> signature check rejects it; either guard is correct.
    { name: "refresh token as access token", token: alice.refreshToken, expect: /Invalid/ },
    { name: "expired access token", token: expiredToken, expect: /Invalid or expired token/ },
  ];

  for (const { name, token, expect } of rejectionCases) {
    let error = "";

    try {
      await tryConnect(httpOrigin, token);
    } catch (caught) {
      error = (caught as Error).message;
    }

    assert.match(error, expect, name);
  }

  aliceSocket.close();
  console.log("[test] socket auth contract PASSED ✔");
};

const run = async (): Promise<void> => {
  let exitCode = 0;

  try {
    await main();
  } catch (error) {
    console.error("[test] FAILED:", error);
    exitCode = 1;
  } finally {
    try {
      await stopTestDb();
    } catch (error) {
      console.warn("[test] cleanup issue:", error);
    }
    console.log(
      `[test] database mode: ${
        usingAtlasFallback() ? "Atlas throwaway DB" : "in-memory mongod"
      }`
    );
    process.exit(exitCode);
  }
};

void run();
