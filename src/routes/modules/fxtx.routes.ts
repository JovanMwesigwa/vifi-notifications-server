import { Router } from "express";
import {
  handleCreateFxTx,
  handleGetAllFxTxsByWalletAddress,
  handleGetFxTxByHash,
  handleGetFxTxById,
  handleUpdateFxTxStatus,
} from "../../controllers/fxtx.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { apiAuth } from "../../middlewares/apiAuth";
import {
  createFxTxSchema,
  getFxTxsParamsSchema,
  getFxTxsQuerySchema,
  updateFxTxParamsSchema,
  updateFxTxStatusSchema,
} from "../../validators/fxTx.validators";

export const fxtxRouter = Router();

// Protect all FXTX endpoints
fxtxRouter.use(apiAuth);

fxtxRouter.post(
  "/",
  validateRequest({ body: createFxTxSchema }),
  handleCreateFxTx
);

fxtxRouter.put(
  "/:id",
  validateRequest({
    params: updateFxTxParamsSchema,
    body: updateFxTxStatusSchema,
  }),
  handleUpdateFxTxStatus
);

fxtxRouter.get(
  "/:walletAddress",
  validateRequest({ params: getFxTxsParamsSchema, query: getFxTxsQuerySchema }),
  handleGetAllFxTxsByWalletAddress
);
fxtxRouter.get("/hash/:hash", handleGetFxTxByHash);
fxtxRouter.get("/id/:id", handleGetFxTxById);
