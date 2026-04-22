import type { Level } from 'pino';

interface EnvConfigType {
	NODE_ENV: 'development' | 'production' | 'test'
	PORT: string
	LOG_LEVEL?: Level
	AUDIT_LOG_LEVEL?: Level
	MONGO_URL: string
}
const developConfig: EnvConfigType = {
	NODE_ENV: 'development',
	PORT: '3004',
	LOG_LEVEL: 'trace',
	AUDIT_LOG_LEVEL: 'warn',
	MONGO_URL: 'mongodb://admin:admin@localhost:27017/test?authSource=admin'
};

export default <K extends keyof EnvConfigType>(env: K): EnvConfigType[K] => {
	// @ts-ignore
	return process.env[env] || developConfig[env];
};
