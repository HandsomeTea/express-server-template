import './src/startup/index.js';
import { audit, getEnv, log } from './src/configs/index.js';

process.on('unhandledRejection', (reason) => {
	log('SYSTEM').fatal(reason);
	audit('SYSTEM').fatal(reason);
});

process.on('uncaughtException', (reason) => {
	log('SYSTEM').fatal(reason);
	audit('SYSTEM').fatal(reason);
});

const port = ((val: string): number => {
	const port = parseInt(val, 10);

	if (port >= 0) {
		return port;
	}

	throw new Error('invalid port!');
})(getEnv('PORT') || '3000');

import http from 'node:http';
import app from './src/routes/app.js';

app.set('port', port);
const server = http.createServer(app);

import mongodb from './src/tools/mongodb.js';

const isHealth = async () => {
	if (!mongodb.isOK) {
		return log('STARTUP').error('mongodb connection is unusual');
	}

	log('SYSTEM-STATUS').debug('health check: system is normal.');
	return true;
};

import { createTerminus } from '@godaddy/terminus';

createTerminus(server, {
	signal: 'SIGINT',
	healthChecks: {
		'/healthcheck': async () => {
			if (!(await isHealth())) {
				throw new Error();
			}
		}
	}
});

process.on('SIGINT', () => {
	server.close(() => {
		process.exit(0);
	});
});

process.on('exit', async () => {
	await mongodb.close();

	log('SYSREM_STOP_CLEAN').info('server connection will stop normally.');
});

const onError = (error: { syscall: string; code: string }) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	switch (error.code) {
		case 'EACCES':
			log('STARTUP').error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			log('STARTUP').error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

import packageData from './package.json' with { type: 'json' };

const serverName = packageData.name;

import { createBlessing } from './src/startup/blessing.js';

server.on('error', onError);
server.listen(port, () => {
	const _check = setInterval(async () => {
		if (!(await isHealth())) {
			return;
		}
		if (process.send) {
			process.send('ready');
		}
		clearInterval(_check);
		createBlessing(`${serverName} start successful on port:${port}.`);
	}, 1000);
});
