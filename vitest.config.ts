import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			// 审计日志项目通常要求核心逻辑 100% 覆盖
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 70
			},
			// 排除掉不需要测试的目录
			exclude: ['node_modules/', 'public/logs/']
		},
		globals: true,
		environment: 'node'
	},
	resolve: {
		alias: {
			'#': path.resolve(__dirname, './src')
		}
	}
});
