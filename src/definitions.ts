/*
 * Put all your API definitions here.
 * Will be the same for both the server and the client code.
 * NOTE : Make sure types can be serialized (callback not supported for example).
 */

export type CoffeType = 'robusta' | 'arabica';

export interface Offer {
  name: string;
  type: CoffeType;
  amount: number;
}

export default interface MyAppResolvers {
  helloWorld(): string;

  createOffer(name: string, type: CoffeType, amount: number): Promise<void>;

  version: string;
  offers: Offer[];
}