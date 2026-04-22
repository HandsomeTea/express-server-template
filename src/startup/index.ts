import crypto from 'node:crypto';

process.env.INSTANCEID = crypto.randomBytes(24).toString('hex').substring(0, 24);

import '#startup/exception';
