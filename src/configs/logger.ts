import { randomBytes } from 'node:crypto';
import type { Request } from 'express';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import getEnv from '#configs/envConfig';
import packageData from '../../package.json' with { type: 'json' };

const serverName = packageData.name;
const auditLogger = pino(
	{
		level: getEnv('LOG_LEVEL') || 'info',
		base: { app: serverName.toUpperCase() },
		timestamp: pino.stdTimeFunctions.isoTime
	},
	pino.transport({
		targets: [
			{
				target: 'pino-roll',
				level: 'info',
				options: {
					file: 'public/logs/audit.log',
					frequency: 'daily',
					mkdir: true,
					translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o'
				}
			}
		]
	})
);
// 打印在控制台终端的Logger
const terminalLogger = pino(
	{
		level: getEnv('LOG_LEVEL') || 'info',
		base: { app: serverName.toUpperCase() },
		timestamp: pino.stdTimeFunctions.isoTime
	},
	pino.transport({
		targets: [
			{
				target: 'pino-pretty',
				level: getEnv('LOG_LEVEL') || 'debug',
				options: { colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o' }
			}
		]
	})
);

// 3. 封装类似原来的 API 接口
export const log = (module = 'HTTP_REQUEST') => terminalLogger.child({ module: module.toUpperCase() });

export const system = (module: string) => terminalLogger.child({ module: `SYSTEM:${module.toUpperCase()}` });

export const audit = (module = 'AUDIT') => auditLogger.child({ module: module.toUpperCase(), type: 'audit' });

export const trace = (
	data: {
		traceId: string;
		spanId: string;
		parentSpanId: string;
		query?: Record<string, unknown>;
		body?: Record<string, unknown>;
		header?: Record<string, unknown>;
		response?: unknown;
	},
	module = serverName
) => {
	return terminalLogger.child({
		module: (module || 'default').toUpperCase(),
		...data
	});
};

export const generateTraceId = (): string => randomBytes(8).toString('hex');

/** Express 中间件 */
export const httpLogger = pinoHttp({
	logger: terminalLogger,
	genReqId: (req: Request) => req.headers['x-trace-id'] || generateTraceId(),
	customProps: (_req: Request) => ({
		module: 'HTTP_REQUEST'
	})
});
