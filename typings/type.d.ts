declare interface HttpArgument {
	params?: Record<string, unknown>;
	data?: Record<string, unknown>;
	headers?: Record<string, string | string[] | undefined>;
}

declare interface ExceptionInstance {
	message: string;
	source: Array<string>;
	code: string;
	status: number;
	reason?: Array<string>;
}

declare interface ExceptionConstructor {
	new (messageOrErrorOrException: string | ExceptionInstance | Error, code?: string, reason?: Array<string>): ExceptionInstance;
	readonly prototype: ExceptionInstance;
}

declare const Exception: ExceptionConstructor;

declare const bundleActionlogCountMap: Record<string, number>;

declare namespace Express {
	interface Response {
		success: (result?: unknown) => void;
	}
}
