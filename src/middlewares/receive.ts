import type { NextFunction, Request, Response } from 'express';
import type { RequestContext } from '#/configs/index';
import { contextStorage, generateTraceId, getContext, trace } from '#/configs/index';

const filteNotAllown = (str?: string) => {
	if (str) {
		str = str.trim();
		if (str && str !== 'undefined' && str !== 'null') {
			return str;
		}
	}
};

export default (req: Request, _res: Response, next: NextFunction): void => {
	const context: RequestContext = {
		userId: req.get('x-user-id') || '',
		traceId: filteNotAllown(req.get('x-b3-traceid')) || generateTraceId(),
		spanId: filteNotAllown(req.get('x-b3-spanid')) || generateTraceId(),
		parentSpanId: filteNotAllown(req.get('x-b3-parentspanid')) || ''
	};

	// 关键：将后续所有的异步操作包裹在 contextStorage.run 中
	contextStorage.run(context, () => {
		const ctx = getContext();

		if (ctx) {
			trace(
				{
					traceId: ctx.traceId,
					spanId: ctx.spanId,
					parentSpanId: ctx.parentSpanId,
					header: {
						...req.headers,
						...(req.headers.cookie ? { cookie: '******' } : {})
					},
					query: req.query || {},
					body: req.body || {}
				},
				'receive-request'
			).info(`[${req.method}] ${req.originalUrl}`);
		}

		next();
	});
};
