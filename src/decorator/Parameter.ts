/*
Because of some question. The type inferred in the decorators can't be accessed in the main function.
So the process method can only in the main function.
And the function itself should be a paramter of the process so that we can define the metadata.
*/

import * as joi from 'types-joi';
import { CustomMiddleware } from './types';
import { ExtraMiddleware } from './Middleware';

export enum PARAMS_FROM {
  body,
  query,
  path,
}

const ParameterVerify = <T extends joi.BaseSchema<any>, K = joi.InterfaceFrom<T>>(schema: T, from: PARAMS_FROM): CustomMiddleware => async (ctx, next): Promise<void> => {
  type parsed = joi.InterfaceFrom<T>;
  let params: parsed;
  try {
    switch (from) {
      case PARAMS_FROM.body:
        params = joi.attempt(ctx.request.body, schema);
        break;
      case PARAMS_FROM.query:
        params = joi.attempt(ctx.query, schema);
        break;
      case PARAMS_FROM.path:
        params = joi.attempt(ctx.params, schema);
        break;
    }
  } catch (e) {
    ctx.throw(400, 'Request params is invalid.\n' + e.message);
  }
  await next();
}

const Parameter = <T extends joi.BaseSchema<any>, K = joi.InterfaceFrom<T>>(schema: T, from: PARAMS_FROM):MethodDecorator => {
  return ExtraMiddleware(ParameterVerify(schema, from));
}

export {
  ParameterVerify,
  Parameter
}