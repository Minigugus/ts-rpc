export type RPCSerializedResult = {
  data: any
};

export type RPCSerializedError = {
  error: {
    code: string,
    message: string,
    data?: object
  }
};

export type RPCSerialized = RPCSerializedResult | RPCSerializedError;

export interface RPCSerializable {
  readonly statusCode: number;
  readonly data?: object;

  toJSON(): RPCSerialized;
}

export interface RPCError extends Error {
  readonly code: string;
  readonly message: string;
  readonly data?: object;

  toJSON(): RPCSerializedError;
}