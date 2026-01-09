/// <reference types="bun-types" />
import { describe, it, expect, afterAll, beforeAll } from "bun:test";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const validPayload = {
  walletAddress: "0x1234567890abcdef",
  chain: "base",
  hash: "0x1234567890abcdef",
  fromToken: "USDV",
  toToken: "NGNV",
  fromAmount: 1000000,
  toAmount: 10000,
  timestamp: new Date().toISOString(),
};

let mongo: MongoMemoryServer;
let createApp: () => import("express").Express;
const TEST_API_KEY = "test_api_key_1234567890abcdef";

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.API_KEY = TEST_API_KEY;

  const { connectToDatabase } = await import("../src/lib/db");
  await connectToDatabase();

  const appModule = await import("../src/app");
  createApp = appModule.createApp;
});

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongo.stop();
// });

describe("POST /api/fxtx", () => {
  it("returns 500 if the payload is invalid and returns a JSON body with the error", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/fxtx")
      .set("authorization", `Bearer ${TEST_API_KEY}`)
      .send({});

    expect(res.status).toBe(500);
  });

  it("returns 500 if the payload does not have a wallet address", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/fxtx")
      .set("authorization", `Bearer ${TEST_API_KEY}`)
      .send({
        chain: "base",
        hash: "0x1234567890abcdef",
        fromToken: "USDV",
        toToken: "NGNV",
        fromAmount: 1000000,
        toAmount: 10000,
        timestamp: new Date().toISOString(),
      });

    expect(res.status).toBe(500);
  });

  it("returns 201 and a JSON body with the created FX transaction", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/fxtx")
      .set("authorization", `Bearer ${TEST_API_KEY}`)
      .send(validPayload);

    expect(res.status).toBe(201);
  }, 20000);
});

describe("GET /api/fxtx/:walletAddress", () => {
  it("returns 200 and a JSON body with the FX transactions", async () => {
    const app = createApp();

    const res = await request(app)
      .get(`/api/fxtx/${validPayload.walletAddress}`)
      .set("authorization", `Bearer ${TEST_API_KEY}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  }, 20000);
});
