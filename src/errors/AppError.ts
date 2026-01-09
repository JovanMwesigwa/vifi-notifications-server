export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly details?: Record<string, unknown> | undefined;
	public readonly isOperational: boolean;

	constructor(message: string, options?: { statusCode?: number; code?: string; details?: Record<string, unknown>; isOperational?: boolean }) {
		super(message);
		this.name = "AppError";
		this.statusCode = options?.statusCode ?? 400;
		this.code = options?.code ?? "BAD_REQUEST";
		this.details = options?.details;
		this.isOperational = options?.isOperational ?? true;
		Error.captureStackTrace?.(this, this.constructor);
	}
}


