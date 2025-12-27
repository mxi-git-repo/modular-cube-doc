import { Dom } from '@modular-cube';
import * as Examples from '../static/data/examples.js';

await Dom.init(
    () => {
        console.info(
            `%c[INFO]%c Components instantiated.`,
            'color: #4169E1; font-weight: bold;', 'color: white;'
        );
    }
);