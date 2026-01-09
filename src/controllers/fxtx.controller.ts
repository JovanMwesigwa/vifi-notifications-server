import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { FxTxModel, FxTxStatus } from "../models/fxtx.model";

export async function handleCreateFxTx(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Body has been validated by middleware; use as-is
    const fxtx = await FxTxModel.create(req.body);

    res.status(201).json({ success: true, data: fxtx });
  } catch (error) {
    // Let Zod errors (or any other) bubble to the centralized error handler
    next(error);
  }
}

export async function handleUpdateFxTxStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: FxTxStatus };
    const fxtx = await FxTxModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .lean()
      .exec();

    res.status(200).json({ success: true, data: fxtx });
  } catch (error) {
    next(error);
  }
}

export async function handleGetAllFxTxsByWalletAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { walletAddress } = req.params as { walletAddress: string };
    const { status } = req.query as { status?: string[] };
    const query: Record<string, unknown> = {
      walletAddress: walletAddress.toLowerCase(),
    };
    if (status && status.length > 0) {
      query.status = { $in: status };
    }
    const fxtxs = await FxTxModel.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({ success: true, data: fxtxs });
  } catch (error) {
    next(
      new AppError("Failed to get all FX transactions by wallet address", {
        statusCode: 500,
        code: "GET_ALL_FX_TXS_BY_WALLET_ADDRESS_ERROR",
      })
    );
  }
}

export async function handleGetFxTxByHash(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hash } = req.params as { hash: string };
    const fxtx = await FxTxModel.findOne({ hash }).lean().exec();

    res.status(200).json({ success: true, data: fxtx });
  } catch (error) {
    next(error);
  }
}

export async function handleGetFxTxById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const fxtx = await FxTxModel.findById(id).lean().exec();

    res.status(200).json({ success: true, data: fxtx });
  } catch (error) {
    next(error);
  }
}
