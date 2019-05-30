# TS RPC

> A simple RPC-based API using TypeScript type checking to ensure correct API calls & implementation.

Make use of the power of TypeScript type checking for building a concistent API easly and quickly ! :D

## Structure

 * [`lib`](./lib) : The TS RPC engine
 * [`src`](./src) : An simple example

## Importants lines

 * [`src/definitions.ts`](./src/definitions.ts) : The centralized place for API definitions for both Back & Front-End
 * [`src/back/index.ts`](./src/back/index.ts#L15-L49) : The API implementation
 * [`src/front/index.ts`](./src/front/index.ts) : The API utilisation
