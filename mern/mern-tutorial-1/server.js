import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './routes/root.js'; 
import prependPath from './helpers/prependPath.js';
import { logger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(express.json());

app.use('/', express.static(prependPath(import.meta.url, 'public')));

app.use('/', router); 

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(prependPath(import.meta.url, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 