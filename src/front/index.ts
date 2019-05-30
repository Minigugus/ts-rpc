import rpcBuilder from '../../lib/front';

import MyAppResolvers from '../definitions';

const API = rpcBuilder<MyAppResolvers>('/rpc/');

/*
 * Use API as if it where a real object, the one in your back-end.
 * Arguments name and return value are preserved.
 * NOTE : All properties of API are mapped to Promises and
 * to function for non function properties of MyAppResolvers
 * (here `version` and `offers` for instance).
 */

(async () => {
  try {
    const message = await API.helloWorld();
    const version = await API.version();
    console.info(message + ' - v' + version);
    console.info('Offers', await API.offers());
    await API.createOffer('Rien', 'robusta', 1);
    console.info('Offers', await API.offers());
  } catch (err) {
    console.error(err);
  }
})();