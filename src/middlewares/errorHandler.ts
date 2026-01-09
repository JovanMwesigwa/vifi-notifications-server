import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose, { isValidObjectId } from "mongoose";
import { AppError } from "../errors/AppError";

function formatZodError(error: ZodError) {
	return error.errors.map((e) => ({
		path: e.path.join("."),
		message: e.message,
		code: e.code
	}));
}

function formatMongooseError(error: unknown) {
	if (error instanceof mongoose.Error.ValidationError) {
		return Object.values(error.errors).map((e) => ({
			path: (e as any).path,
			message: e.message,
			code: "MONGOOSE_VALIDATION_ERROR"
		}));
	}
	// Duplicate key
	if ((error as any)?.code === 11000) {
		const dup = (error as any).keyValue ?? {};
		return [
			{
				path: Object.keys(dup).join(","),
				message: "Duplicate value violates unique constraint",
				code: "MONGO_DUPLICATE_KEY",
				details: dup
			}
		];
	}
	return undefined;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	const isProd = process.env.NODE_ENV === "production";

	let status = 500;
	let code = "INTERNAL_SERVER_ERROR";
	let message = "An unexpected error occurred.";
	let issues: unknown;

	if (err instanceof AppError) {
		status = err.statusCode;
		code = err.code;
		message = err.message;
		issues = err.details;
	} else if (err instanceof ZodError) {
		status = 422;
		code = "VALIDATION_ERROR";
		message = "Request validation failed";
		issues = formatZodError(err);
	} else if (err instanceof mongoose.Error || (err && typeof err === "object" && "code" in err && (err as any).code === 11000)) {
		status = 400;
		code = "DATABASE_ERROR";
		message = "A database error occurred";
		issues = formatMongooseError(err);
	} else if (typeof err?.status === "number") {
		status = (err as any).status;
		message = (err as any).message ?? message;
	}

	const response = {
		success: false,
		error: {
			message,
			code,
			issues
		}
	} as const;

	if (!isProd && err && (err as any).stack) {
		(res as any).locals = res.locals || {};
		(res as any).locals.error = err;
	}

	res.status(status).json(response);
};


