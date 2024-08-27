import path from 'path';
import { fileURLToPath } from 'url';

/**
 * use import.meta.url as first argument
 */
export default function prependPath(metaUrl, ...paths) {
    const __filename = fileURLToPath(metaUrl);
    return path.join(path.dirname(__filename), ...paths);
}