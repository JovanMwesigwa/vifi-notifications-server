import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  // Allow empty during boot; middleware will enforce presence
  API_KEY: z.string().optional().transform((v) => v ?? ""),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ?? process.env.MONGO_URI,
  API_KEY: process.env.API_KEY ?? process.env.API_TOKEN,
});
