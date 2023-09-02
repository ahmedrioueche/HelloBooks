import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry: './script.mjs',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist')
    }
};
