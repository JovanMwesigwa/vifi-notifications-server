import { Router } from "express";
import { fxtxRouter } from "./modules/fxtx.routes";

export const router = Router();

router.use("/fxtx", fxtxRouter);
