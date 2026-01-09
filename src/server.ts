import dotenv from "dotenv";
// Load base envs, then allow local and api-specific overrides if present
dotenv.config(); // .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.api" });
dotenv.config({ path: "env/api/.env" });
import { createApp } from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./lib/db";

async function main() {
  await connectToDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
