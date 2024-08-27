import express from 'express';
import path from 'path';
import prependPath from '../helpers/prependPath.js';
const router = express.Router();

// we (can) use regex inside the string in express router
// ^/$ - the string between ^ & $ - so, exactly '/'
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(prependPath(import.meta.url, '..', 'views', 'index.html'));
});

export default router;