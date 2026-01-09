## Notifications Server (Express + Zod + MongoDB)

TypeScript + Express + Mongoose + Zod, optimized for Bun.  
Includes `/api/fxtx/*` endpoints and a simple `/clock` health/time route.


### Setup
1. Install deps:
   ```bash
   bun install
   ```
2. Env:
   - Create `./.env`:
     ```
     NODE_ENV=development
     PORT=8000
     MONGODB_URI=mongodb://localhost:27017/notifications_server
     ```
   - Create API key file at `env/api/.env`:
     ```bash
     mkdir -p env/api
     echo "API_KEY=$(openssl rand -hex 32)" > env/api/output.txt
     # or set manually:
     # echo "API_KEY=your-long-random-string" > env/api/.env
     ```
   The server loads `.env`, optional `.env.local`, optional `.env.api`, and `env/api/.env`.
3. Run:
   ```bash
   bun run dev
   ```

### Scripts
- `bun run dev` — start in watch mode
- `bun run start` — start once
- `bun run test` — run tests in `test/`
- `bun run typecheck` — TypeScript checks

### Auth
- All `/api/fxtx/*` endpoints require an API key:
  - Header `Authorization: Bearer <API_KEY>` or `x-api-key: <API_KEY>`
- `/clock` is public.

### Endpoints
- GET `/clock` — returns current server time:
  ```bash
  curl http://localhost:8000/clock
  ```
  → `{"success":true,"data":{"now":"2026-01-09T12:34:56.789Z"}}`

- POST `/api/fxtx` — create FX transaction (auth required)
  ```bash
  curl -X POST http://localhost:8000/api/fxtx \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "walletAddress":"0x1234567890abcdef",
      "chain":"base",
      "hash":"0xabc123...",
      "fromToken":"USDV",
      "toToken":"NGNV",
      "fromAmount":1000000,
      "toAmount":10000
    }'
  ```

- GET `/api/fxtx/:walletAddress` — list transactions (auth)  
  Optional status filters: `status=CONFIRMED` or multiple `status=CONFIRMED&status=FAILED`
  ```bash
  curl "http://localhost:8000/api/fxtx/0x1234567890abcdef?status=CONFIRMED&status=FAILED" \
    -H "Authorization: Bearer $API_KEY"
  ```

- GET `/api/fxtx/hash/:hash` — get by hash (auth)
  ```bash
  curl "http://localhost:8000/api/fxtx/hash/0xabc123..." \
    -H "Authorization: Bearer $API_KEY"
  ```

- GET `/api/fxtx/id/:id` — get by MongoDB ObjectId (auth)
  ```bash
  curl "http://localhost:8000/api/fxtx/id/64fa0c5e2b3be0a1f0c12345" \
    -H "Authorization: Bearer $API_KEY"
  ```

- PUT `/api/fxtx/:id` — update status by ObjectId (auth)
  ```bash
  curl -X PUT "http://localhost:8000/api/fxtx/64fa0c5e2b3be0a1f0c12345" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"status":"CONFIRMED"}'
  ```

### Project Structure
```
src/
  app.ts
  server.ts
  config/
    env.ts
  errors/
    AppError.ts
  lib/
    db.ts
  middlewares/
    errorHandler.ts
    notherify project notesFound.ts
    validateRequest.ts
    apiAuth.ts
  models/
    fxtx.model.ts
  controllers/
    fxtx.controller.ts
  validators/
    fxTx.validators.ts
  routes/
    index.ts
    modules/
      fxtx.routes.ts
```

### Error shape
```json
{
  "success": false,
  "error": { "message": "text", "code": "CODE", "issues": [] }
}
```

