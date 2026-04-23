import type { NextFunction, Request, Response } from 'express';
import { getContext, trace } from '../configs/index.js';

export default (req: Request, res: Response, next: NextFunction): void => {
	res.success = (data?: unknown) => {
		const ctx = getContext();

		if (ctx) {
			trace(
				{
					traceId: ctx.traceId,
					spanId: ctx.spanId,
					parentSpanId: ctx.parentSpanId,
					response: data
				},
				'return-response'
			).info(`[${req.method}] ${req.originalUrl} =>`);
		}
		res.status(200).send(data);
	};
	next();
};
