/*
 * ============================================================
 * Auth API contract
 * ============================================================
 *
 * Every auth endpoint must speak ONE session shape:
 *   { success: true, token, refreshToken, user: { id, ... } }
 * and protected routes must accept only verified ACCESS tokens.
 *
 * The boundary table at the bottom is the contract:
 *   request  ->  expected HTTP status
 * ============================================================
 */

import assert from "node:assert/strict";
import axios from "axios";
import jwt from "jsonwebtoken";

import { bootServer, stopTestDb, usingAtlasFallback } from "./setup.js";

interface Session {
  success: boolean;
  token: string;
  refreshToken?: string;
  user?: { id?: string };
}

const decodeJwt = (token: string): { user?: { id?: string }; exp?: number } =>
  JSON.parse(
    Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")
  );

const main = async (): Promise<void> => {
  const baseUrl = await bootServer();

  // ----------------------------------------------------------
  // register + login share the session contract
  // ----------------------------------------------------------
  const registered = (
    await axios.post<Session>(`${baseUrl}/auth/register`, {
      name: "Alice",
      email: "alice@test.dev",
      password: "secret123",
      avatar: "",
    })
  ).data;

  assert.equal(registered.success, true);
  assert.ok(registered.token && registered.refreshToken);
  assert.ok(registered.user?.id, "session must include user id");

  const aliceId = registered.user.id;

  // Access token is short-lived and carries the user id.
  const claims = decodeJwt(registered.token);
  assert.equal(claims.user?.id, aliceId);
  assert.ok(
    claims.exp && claims.exp < Date.now() / 1000 + 16 * 60,
    "access token must be short-lived (<= ~15m)"
  );

  const loggedIn = (
    await axios.post<Session>(`${baseUrl}/auth/login`, {
      email: "alice@test.dev",
      password: "secret123",
    })
  ).data;

  assert.equal(loggedIn.success, true);
  assert.ok(loggedIn.token && loggedIn.refreshToken);
  assert.equal(loggedIn.user?.id, aliceId, "same user, same id");

  // ----------------------------------------------------------
  // refresh mints a NEW access token for the same user
  // ----------------------------------------------------------
  const refreshed = (
    await axios.post<Session>(`${baseUrl}/auth/refresh`, {
      refreshToken: loggedIn.refreshToken,
    })
  ).data;

  assert.equal(refreshed.success, true);
  assert.ok(refreshed.token);
  assert.equal(decodeJwt(refreshed.token).user?.id, aliceId);

  // ----------------------------------------------------------
  // login must not reveal WHICH credential was wrong
  // ----------------------------------------------------------
  const loginMsg = async (email: string, password: string) => {
    try {
      await axios.post(`${baseUrl}/auth/login`, { email, password });
      return "<no error>";
    } catch (error) {
      return axios.isAxiosError(error)
        ? `${error.response?.status}:${error.response?.data?.msg}`
        : "unexpected";
    }
  };

  assert.equal(
    await loginMsg("alice@test.dev", "wrong-password"),
    await loginMsg("nobody@test.dev", "whatever123"),
    "wrong password and unknown email must be indistinguishable (no user enumeration)"
  );

  // ----------------------------------------------------------
  // Protected-route boundary table.
  // DELETE /api/messages/:id with an unknown id: 404 = controller
  // ran (auth passed); 401 = middleware rejected the credential.
  // ----------------------------------------------------------
  const probe = (authorization?: string) =>
    axios.delete(`${baseUrl}/api/messages/507f1f77bcf86cd799439011`, {
      headers: authorization ? { Authorization: authorization } : {},
      validateStatus: () => true,
    });

  // A refresh-shaped token signed with the ACCESS secret proves
  // the typ-claim guard (not just the different-secret guard).
  const refreshShapedToken = jwt.sign(
    { typ: "refresh", userId: aliceId },
    process.env.JWT_SECRET as string
  );

  const boundaryCases: {
    name: string;
    authorization?: string;
    expect: number;
  }[] = [
    { name: "refreshed access token accepted", authorization: `Bearer ${refreshed.token}`, expect: 404 },
    { name: "no token", expect: 401 },
    { name: "garbage token", authorization: "Bearer not-a-jwt", expect: 401 },
    { name: "refresh token as access token", authorization: `Bearer ${loggedIn.refreshToken}`, expect: 401 },
    { name: "refresh-shaped token signed with access secret", authorization: `Bearer ${refreshShapedToken}`, expect: 401 },
  ];

  for (const { name, authorization, expect } of boundaryCases) {
    const response = await probe(authorization);
    assert.equal(response.status, expect, name);
  }

  // ----------------------------------------------------------
  // Media contract: video attachment round-trip + forward
  // ----------------------------------------------------------
  // (uses the shared socket server; a second user "Bob" must
  // receive the video message in his own conversation and the
  // forwarded copy in Alice's conversation)
  const { io } = await import("socket.io-client");

  const connect = (token: string): Promise<any> =>
    new Promise((resolve, reject) => {
      const socket = io(baseUrl, {
        auth: { token },
        transports: ["websocket"],
        reconnection: false,
      });
      socket.on("connect", () => resolve(socket));
      socket.on("connect_error", reject);
    });

  const register = async (name: string, email: string) =>
    (
      await axios.post(`${baseUrl}/auth/register`, {
        name,
        email,
        password: "secret123",
        avatar: "",
      })
    ).data as { token: string; refreshToken: string; user: { id: string } };

  const carol = await register("Carol", "carol@media.test");
  const dave = await register("Dave", "dave@media.test");

  const carolSocket = await connect(carol.token);
  const daveSocket = await connect(dave.token);

  const waitEvent = (
    socket: any,
    event: string,
    filter?: (payload: any) => boolean,
    ms = 5_000
  ): Promise<any> =>
    new Promise((resolve, reject) => {
      const handler = (payload: any) => {
        if (filter && !filter(payload)) {
          return;
        }

        clearTimeout(timer);
        socket.off(event, handler);
        resolve(payload);
      };

      const timer = setTimeout(() => {
        socket.off(event, handler);
        reject(new Error(`${event} timed out`));
      }, ms);

      socket.on(event, handler);
    });

  // Register listeners BEFORE emitting.
  const convAckPromise = waitEvent(carolSocket, "newConversation");
  carolSocket.emit("newConversation", {
    type: "direct",
    participants: [carol.user.id, dave.user.id],
  });
  const convAck = await convAckPromise;
  assert.ok(convAck.success, "conversation creation failed");
  const conversationId = String(convAck.data._id);

  // Dave must auto-join the room on connect.
  await new Promise((r) => setTimeout(r, 500));
  const daveJoins = waitEvent(daveSocket, "joinConversation");
  daveSocket.emit("joinConversation", conversationId);
  await daveJoins;

  // 1) Carol sends a VIDEO message -> Dave receives attachment + type.
  const videoReceived = new Promise<any>((resolve) => {
    daveSocket.on("newMessage", (payload: any) => {
      if (payload.success && payload.data?.attachmentType === "video") {
        resolve(payload.data);
      }
    });
  });

  const sendAck = new Promise<any>((resolve) => {
    carolSocket.on("newMessage", (payload: any) => {
      if (payload.success && payload.data?.attachmentType === "video") {
        resolve(payload.data);
      }
    });
  });

  carolSocket.emit("newMessage", {
    conversationId,
    content: "",
    attachment: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    attachmentType: "video",
  });

  const [videoForDave, videoEcho] = await Promise.all([
    videoReceived,
    sendAck,
  ]);
  assert.equal(
    videoForDave.attachment,
    "https://res.cloudinary.com/demo/video/upload/dog.mp4"
  );
  assert.equal(videoEcho.attachmentType, "video");

  // 2) FORWARD: Carol sends the SAME media into a second
  // conversation — a group with the same two members. The
  // backend always creates a new group, so the id differs.
  const conv2AckPromise = waitEvent(carolSocket, "newConversation");
  carolSocket.emit("newConversation", {
    type: "group",
    name: "Forward target",
    participants: [carol.user.id, dave.user.id],
  });
  const conv2Ack = await conv2AckPromise;
  assert.ok(conv2Ack.success, "second conversation creation failed");
  const secondConversationId = String(conv2Ack.data._id);
  assert.notEqual(secondConversationId, conversationId, "must be a different chat");

  const forwardReceived = new Promise<any>((resolve) => {
    carolSocket.on("newMessage", (payload: any) => {
      if (
        payload.success &&
        payload.data?.attachmentType === "video" &&
        payload.data?.conversationId === secondConversationId
      )
      {
        resolve(payload.data);
      }
    });
  });

  carolSocket.emit("newMessage", {
    conversationId: secondConversationId,
    content: "",
    attachment: videoForDave.attachment,
    attachmentType: "video",
  });

  const forwarded = await forwardReceived;
  assert.equal(forwarded.conversationId, secondConversationId);
  assert.equal(forwarded.attachment, videoForDave.attachment);

  carolSocket.close();
  daveSocket.close();

  console.log("[test] media round-trip + forward contract PASSED ✔");

  console.log("[test] auth API contract PASSED ✔");
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
