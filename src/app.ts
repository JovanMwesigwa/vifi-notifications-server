import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { router } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/clock", (_req, res) => {
    res.json({
      success: true,
      data: {
        now: new Date().toISOString()
      }
    });
  });

  app.use("/api", router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
