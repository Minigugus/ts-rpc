import { join } from 'path';

import * as express from 'express';

import rpcMiddleware from '../../lib/back';
import MyAppResolvers from '../definitions';

const app: express.Application = express.call(null);

const PRODUCTION = process.env.NODE_ENV === 'production';
const { PORT = '8080' } = process.env;

app.use('/rpc/:name', express.json(), rpcMiddleware<MyAppResolvers>({
  devMode: PRODUCTION,
  resolvers: {

    /*
     * Implement resolvers you defined here.
     * NOTE : Does not compile if does not match you definition.
     */
    
    // A property (will be exposed as function without arguments).
    version: '0.1.0-example',
    offers: [],

    // Can also be :
    //
    //  * A getter (not a setter as of now)
    //  | get offers() {
    //  |   return offers
    //  | }
    //
    //  * A Promise (will be awaited)
    //  | `version: Promise.resolve('0.1.0-example')`,

    // A function without arguments (accessible via `GET` or `POST`).
    helloWorld() {
      return 'Hello World!';
    },

    // An async function with arguments (arguments serialized in `POST` requests if there is at least 1).
    async createOffer(name: string, type: 'robusta' | 'arabica', amount: number) {
      this.offers.push({ name, type, amount });
    }
    
    // Even if it's not recommended, you can use this object as a state and dynamicaly update it.
    // You can also dynamicaly add/remove resolvers but it can be a bit dangerous ^^
  }
}));

app.get('*', express.static(join(__dirname, '..', 'public')));

app.listen(parseInt(PORT, 10), () => console.info('Ready. http://localhost:' + PORT + '/'));