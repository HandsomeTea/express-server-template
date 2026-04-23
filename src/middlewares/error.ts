import type { NextFunction, Request, Response } from 'express';
import packageData from '../../package.json' with { type: 'json' };
import { getContext, log, trace } from '../configs/index.js';

const serverName = packageData.name;

export default (err: ExceptionInstance, req: Request, res: Response, _next: NextFunction) => {
	const { status, code, message, reason, source } = err;
	const result: ExceptionInstance = {
		message,
		source: source && Array.isArray(source) && !source.includes(serverName) ? source.concat(serverName) : source,
		code: code || 'INTERNAL_SERVER_ERROR',
		status,
		reason: reason || []
	};

	log('http-error').error(err);
	const ctx = getContext();

	if (ctx) {
		trace(
			{
				traceId: ctx.traceId,
				spanId: ctx.spanId,
				parentSpanId: ctx.parentSpanId,
				response: result
			},
			'http-error'
		).info(`[${req.method}] ${req.originalUrl} =>`);
	}
	res.status(status || 500).send(result);
};
