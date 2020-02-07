import 'reflect-metadata';
import { IRoute, loadRouter } from '../router/Router';
import { Method } from '../types';
import { CustomMiddleware } from './types';
export * from './Controller';
export * from './Method';
export * from './Middleware';
import {Stream} from 'stream';
import Router = require('koa-router');

export function parseClassController(instance: object): Router | null {
  const prototype = Object.getPrototypeOf(instance);
  const basePath = Reflect.getMetadata('path', prototype.constructor);

  if (typeof basePath !== 'string') {
    return null;
  }
  const mainMiddlewareWrapper = (middleware: CustomMiddleware): CustomMiddleware => {
    return async (ctx, next): Promise<void> => {
      try {
        const res = await middleware(ctx, next);
        if (res === undefined || res === null) {
          ctx.body = null;
        } else if(res instanceof Buffer || res instanceof Stream){
          ctx.body = res;
        } else if (res instanceof Function) {
          ctx.body = res();
        } else {
          ctx.body = res;
        }
      } catch (e) {
        if (Number.isInteger(e))
          ctx.throw(e);
        else {
          ctx.throw(500, e);
        }
      }
    }
  }

  const routers: IRoute[] = Object.getOwnPropertyNames(prototype)
    .filter(item => item !== 'constructor' &&
      prototype[item] instanceof Function).map(methodName => {
      const fn = prototype[methodName];
      const path = Reflect.getMetadata('path', fn) as string;
      if (!path) return;
      const method = Reflect.getMetadata('method', fn) as Method;
      const extraMiddlewares = (Reflect.getMetadata('extraMiddleware', fn) || []) as Array<CustomMiddleware>;
      return {
        path,
        method,
        middlewares: extraMiddlewares.reverse().concat(mainMiddlewareWrapper((ctx, next) => instance[methodName](ctx, next))),
      }
    });
    
  return loadRouter(routers, basePath);
}