const _protectedURL = (url: string) => {
	try {
		const address = new URL(url);

		address.username = '***';
		address.password = '***';

		return address.toString();
	} catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
		return url;
	}
};

// @ts-ignore

export function protectedURL(url: string): string;

// @ts-ignore
export function protectedURL(url: Array<string>): Array<string>;

// @ts-ignore
export const protectedURL = (url: string | Array<string>): string | Array<string> => {
	if (typeof url === 'string') {
		return _protectedURL(url);
	} else if (Array.isArray(url)) {
		return url.map(a => _protectedURL(a));
	}
	return url;
};
