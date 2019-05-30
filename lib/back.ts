import * as express from 'express';
import { RPCSerializable, RPCError, RPCSerializedResult, RPCSerializedError } from './definitions';

export const call = async (resolvers: any, name: string, ...args: any[]) => {
  const resolver = resolvers[name];
  const result = await (resolver instanceof Function
    ? resolver.apply(resolvers, args)
    : resolver);
  return result instanceof HTTPRPCResult
    ? result
    : new HTTPRPCResult(result);
}

export default <TResolvers = never>({ resolvers, devMode = false }: { resolvers: TResolvers, devMode?: boolean }) => async (req: express.Request, res: express.Response) => {
  let toSend: RPCSerializable;
  try {
    if (!(req.params.name in resolvers))
      throw new HTTPRPCError(404, 'ROUTE_NOT_FOUND', `Route \`${req.params.name}\` not found`, {
        route: req.params.name
      });
    else if (!(req.method === 'GET' || req.method === 'POST'))
      throw new HTTPRPCError(405, 'METHOD_NOT_ALLOWED', 'Only `GET` & `POST` methods are allowed.', {
        allowedMethods: ['GET', 'POST']
      });
    else if (!(req.method === 'GET' || Array.isArray(req.body)))
      throw new HTTPRPCError(400, 'INVALID_OR_MISSING_BODY', 'Missing JSON array body in `POST` method.');
    else
      toSend = await call(resolvers, req.params.name, ...(Array.isArray(req.body) ? req.body : []));
  } catch (err) {
    toSend = err instanceof HTTPRPCError
      ? err
      : new HTTPRPCError(500, 'INTERNAL_SERVER_ERROR', 'An internal server error occured.', {
        code: err.code,
        message: err.message,
        stack: devMode ? err.stack : undefined
      });
  }
  return res.status(toSend.statusCode).json(toSend);
};

export class HTTPRPCResult implements RPCSerializable {
  public data: object;

  constructor(data: object) {
    this.data = data;
  }

  public get statusCode() {
    return this.data === undefined ? 204 : 200
  }

  public toJSON(): RPCSerializedResult {
    return this.data === undefined
      ? undefined
      : {
        data: this.data
      }
  }
}

export class HTTPRPCError extends Error implements RPCError, RPCSerializable {
  public statusCode: number;
  public code: string;
  public data: object;

  constructor(statusCode: number, code: string, message: string, data?: object) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
  }

  public toJSON(): RPCSerializedError {
    return {
      error: {
        code: this.code,
        message: this.message,
        data: this.data
      }
    }
  }
}
