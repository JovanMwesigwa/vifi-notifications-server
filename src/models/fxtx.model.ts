import mongoose, { Schema, model } from "mongoose";

export enum FxTxStatus {
  INITIATED = "INITIATED",
  APPROVED = "APPROVED",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
}

export interface FxTxDocument extends mongoose.Document {
  walletAddress: string;
  chain: string;
  hash: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  status: FxTxStatus;
  timestamp: Date;
}

const fxtxSchema = new Schema<FxTxDocument>(
  {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    chain: { type: String, required: true },
    hash: { type: String, required: true },
    fromToken: { type: String, required: true, lowercase: true },
    toToken: { type: String, required: true, lowercase: true },
    fromAmount: { type: Number, required: true },
    toAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: FxTxStatus,
      default: FxTxStatus.INITIATED,
    },
    // Auto-generate timestamp at insert time
    timestamp: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure deduplication of the same tx on a chain
fxtxSchema.index({ chain: 1, hash: 1 }, { unique: true });

export const FxTxModel = model<FxTxDocument>("FxTx", fxtxSchema);
