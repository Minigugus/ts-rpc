import * as defs from './definitions';

const rpcCall = async (url: URL, name: string, ...args: any[]) => {
  const res = await fetch(new URL(name, url).href, {
    method: args.length ? 'POST' : 'GET',
    body: args.length ? JSON.stringify(args) : undefined,
    headers: args.length ? {
      'Content-Type': 'application/json; charset=utf-8'
    } : undefined
  });
  if (res.status === 204)
    return;
  const body: defs.RPCSerialized = await res.json();
  if ('error' in body)
    throw new RPCError(body.error);
  return body.data;
};

// https://stackoverflow.com/questions/49420657/how-to-remove-properties-and-promisify-method-via-mapped-type-in-typescript#49421381
type ArgsType<T> = T extends (...args: infer R) => any ? R : never
type Promisify<T> = T extends Promise<any> ? T : Promise<T>;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type PromisifiedFunction<T> = (...a: ArgsType<T>) => Promisify<ReturnType<T>>;

type RPCProxy<T> = {
  [name in keyof T]: T[name] extends Function ? PromisifiedFunction<T[name]> : (() => Promisify<T[name]>)
}

export default <TResolvers>(url: string | URL) => {
  if (typeof url === 'string')
    url = new URL(url, window.location.href);
  return new Proxy({}, {
    get(_, name) {
      return rpcCall.bind(undefined, url, name);
    }
  }) as RPCProxy<TResolvers>
};

export class RPCError extends Error {
  public code: string;
  public message: string;
  public data: object;

  constructor({ code, message, data }: { code?: string; message: any; data?: object; }) {
    super(message);
    this.code = code;
    this.data = data;
  }
}