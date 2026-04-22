import { HttpErrorType } from '#/configs/errorCode';
import packageData from '../../package.json' with { type: 'json' };

const serverName = packageData.name;

// @ts-expect-error
global.Exception = class Exception extends Error {
	public message: string;
	public code!: string;
	public status!: number;
	public reason?: Record<string, unknown>;
	public source: Array<string> = [];

	constructor(
		error?: string | ExceptionInstance | Error | Record<string, unknown>,
		code?: string,
		reason?: Record<string, unknown>
	) {
		super();

		if (typeof error === 'string') {
			this.message = error;
		} else {
			// @ts-expect-error
			this.message = error?.message || JSON.stringify(error) || 'inner server error!';

			// @ts-expect-error
			this.code = error.code;

			// @ts-expect-error
			this.status = error.status;

			// @ts-expect-error
			this.reason = error.reason;

			// @ts-expect-error
			this.source = Array.from(error.source || '');
		}

		if (code && !this.code) {
			this.code = code;
		}

		if (!this.code) {
			this.code = 'INTERNAL_SERVER_ERROR';
		}

		if (!this.status) {
			// @ts-expect-error
			this.status = HttpErrorType[this.code];

			if (!this.status) {
				this.status = 500;
			}
		}

		if (!this.reason) {
			this.reason = {};
		}
		if (reason && Object.keys(reason).length > 0) {
			this.reason = {
				...this.reason,
				...reason
			};
		}

		if (!this.source.includes(serverName)) {
			this.source.push(serverName);
		}
	}
};
