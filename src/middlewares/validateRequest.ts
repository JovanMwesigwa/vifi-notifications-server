import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";

type Schemas = {
	body?: AnyZodObject;
	query?: AnyZodObject;
	params?: AnyZodObject;
};

export function validateRequest(schemas: Schemas): RequestHandler {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			if (schemas.body) req.body = schemas.body.parse(req.body);
			if (schemas.query) req.query = schemas.query.parse(req.query);
			if (schemas.params) req.params = schemas.params.parse(req.params);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				next(error);
			} else {
				next(error as Error);
			}
		}
	};
}


