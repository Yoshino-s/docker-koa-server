import { Middleware } from 'koa';
import { Method } from '../types';
import Router = require('koa-router');

export type IRoute = {
  name?: string
  method: Method,
  path: string|RegExp,
  middlewares: Middleware[]
}

export function loadRouter(routers: IRoute[], prefix?: string): Router {
  const router = new Router({prefix});
  routers.forEach(r => {
    if (r.name) {
      router[r.method](r.name, r.path, ...r.middlewares);
    } else {
      router[r.method](r.path, ...r.middlewares);
    }
  });
  return router;
}