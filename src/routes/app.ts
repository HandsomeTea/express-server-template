import compression from 'compression';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { ErrorCode } from '../configs/index.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(helmet());
app.use(compression());
app.use(
	rateLimit({
		// --- 基础频率配置 ---
		windowMs: 15 * 60 * 1000, // 15 分钟窗口期
		limit: 100, // 每个 IP 在 windowMs 内允许的最大请求数
		// --- 响应处理 ---
		standardHeaders: 'draft-7', // 在响应头中返回 RateLimit 详情 (符合最新标准)
		legacyHeaders: false, // 禁用旧版的 X-RateLimit-* 头
		message: {
			status: 429,
			message: '请求过于频繁，请稍后再试。'
		},
		validate: { xForwardedForHeader: false }, // 禁用对 X-Forwarded-For 头的验证
		// --- 异常处理 ---
		skip: (req) => {
			// 可以在这里排除内网白名单或特定路径
			return req.ip === '127.0.0.1';
		}
	})
);

if (process.env.NODE_ENV === 'development') {
	// 假设你生成了 openapi.json
	app.get('/docs', (_req, res) => {
		res.send(`
            <script type="module">
                import { renderScalar } from 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
                renderScalar({ spec: { url: '/openapi.json' } })
            </script>
        `);
	});
}

import packageData from '../../package.json' with { type: 'json' };

app.get('/', (_req, res) => {
	res.json({
		service: 'TEMP-USER-MANAGER',
		status: 'UP',
		version: packageData.version
	});
});

import { acceptRequestHandle, errorHandle, successResponseHandle } from '../middlewares/index.js';

app.use(acceptRequestHandle);
app.use(successResponseHandle);

import v1 from './v1/index.js';

app.use('/api/v1', v1);
app.use('{*path}', (req) => {
	throw new Exception(`url: [{${req.method.toLowerCase()}} => ${req.originalUrl}] not found!`, ErrorCode.URL_NOT_FOUND);
});
app.use(errorHandle);

export default app;
