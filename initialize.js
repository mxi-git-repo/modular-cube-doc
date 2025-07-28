import { Dom } from '@modular-cube';

/**
 *  Use cases
 * 
 *  function delay(ms) {
 *      return new Promise(resolve => setTimeout(resolve, ms));
 *  }
 *
 *  await dom.init(
 *      () => {
 *          console.log("Components instantiated");
 *      },
 *      async () => {
 *          console.log('init Waiting...');
 *          await delay(2000); // waits 2 seconds
 *          console.log('init Done waiting!');
 *      }
 *  )
*/
await Dom.init(() => {
    console.info(
        `%c[INFO]%c Components instantiated.`,
        'color: #4169E1; font-weight: bold;', 'color: white;'
    );
});