import 'reflect-metadata';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import session = require('koa-session');
import redisStore = require('koa-redis');
import { parseClassController } from './decorator/index';
import User from './controller/User';

import * as log4js from 'log4js';
import log4jsConfig from './config/log4js.config';
import { createConnection, Connection } from 'typeorm';
import SecretConfig from './config/secret.config';
import ServerConfig from './config/server.config';

log4js.configure(log4jsConfig);

async function connectToDB(interval = 1000, times = 3): Promise<Connection> {
  let connection: Connection;
  let tryTime = 0;
  while (!connection||tryTime>times) {
    try {
      tryTime++;
      log4js.getLogger('debug').debug(`Try to connect db. Time: ${tryTime}`);
      connection = await createConnection();
    } catch {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  if (!connection)
    throw Error('Cannot link to db.');
  return connection;
}

async function connectToRedis(interval = 1000, times = 3): Promise<redisStore.RedisSessionStore> {
  const store = redisStore({
    host: ServerConfig.redis.server,
    port: ServerConfig.redis.port,
  });
  let tryTime = 0;
  while (['connect', 'ready'].indexOf(store.client.status) === -1) {
    if (tryTime > times) 
      throw Error('Cannot link to redis.');
    tryTime++;
    log4js.getLogger('debug').debug(`Try to connect redis. Time: ${tryTime}. Status: ${store.client.status}`);
    await (new Promise(resolve => setTimeout(resolve, interval)));
  }
  return store;
}

const main = async (): Promise<void> => {
  const app = new Koa();
  const connection = await connectToDB();
  
  app.keys = SecretConfig.koaKeys;

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = JSON.stringify({
        code: ctx.status,
        message: err.message || 'Error'
      });
      log4js.getLogger().error(err);
    }
  });

  app.use(session({
    key: 'PHPSESSION',
    store: await connectToRedis()
  }, app));
  
  app.use(koaBody({
    multipart: true,
  }));


  const router = parseClassController(new User());

  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(ServerConfig.server.port, () => {
    console.log(`app is listening on port: ${ServerConfig.server.port}`);
  });
}

main();
