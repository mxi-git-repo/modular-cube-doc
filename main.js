import { Dom } from '@modular-cube';

await Dom.init(
    () => {
        console.info(
            `%c[INFO]%c Components instantiated.`,
            'color: #4169E1; font-weight: bold;', 'color: white;'
        );
    }
);