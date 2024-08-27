import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/root.js'; 
import prependPath from './helpers/prependPath.js';

const app = express();
const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/', express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 