import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

import prependPath from '../helpers/prependPath.js';

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const dirPath = prependPath(import.meta.url, '..', 'logs');
        const fileName = path.join(dirPath, logFileName);
        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath);
        }
        await fsPromises.appendFile(fileName, logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);

    next();
}

export { logEvents, logger };