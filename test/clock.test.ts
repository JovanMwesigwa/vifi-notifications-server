/// <reference types="bun-types" />
import { describe, it, expect } from "bun:test";
import request from "supertest";
import { createApp } from "../src/app";

describe("GET /clock", () => {
  it("returns 200 and a JSON body with an ISO timestamp", async () => {
    const app = createApp();
    const res = await request(app).get("/clock");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          now: expect.any(String),
        }),
      })
    );

    // Validate ISO timestamp
    const d = new Date(res.body.data.now);
    expect(isNaN(d.getTime())).toBe(false);
  });
});
