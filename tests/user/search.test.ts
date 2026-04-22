// 压力测试
// import siege from 'siege';

// siege()
//     .on(3004)
//     // .post('/api/v1/user/user').for(3000).times//这个借口测试30000次
//     .post('/api/v1/user/user', {}).for(20).seconds//这个借口测试20秒
//     .attack();
import { describe, expect, it } from 'vitest';
import app from '../../src/routes/app.js';
// import assert from 'assert';

// describe('Array', () => {
//     describe('#indexOf()', () => {
//         it('should return -1 when the value is not present', () => {
//             assert.strictEqual([1, 2, 3].indexOf(4), -1);
//         });
//     });
// });

import server from 'supertest';

describe('POST /api/v1/user/user', () => {
	it('response with json', async () => {
		const response = await server(app)
			.post('/api/v1/user/user')
			.set('Accept', 'application/json')
			.timeout(10 * 1000);

		expect(response.headers['content-type']).toMatch(/json/);
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: 'ok' });
	});
});
