import * as joi from 'types-joi';
import { Context } from '../decorator/types';
import { PARAMS_FROM } from '../decorator/Parameter';

export function parameter<T extends joi.AnySchema<any>, K = joi.InterfaceFrom<T>>(schema: T, from: PARAMS_FROM, ctx: Context): K {
  let params: K;
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
  
  return params;
}

type ResponseDataList = {
  [code: number]: string;
}

export const respond = <T extends ResponseDataList>(responses: T) =>
  <K extends keyof T>(code: K, data?: object): {code: K, message: T[K], data?: object} => {
    const r = responses[code] as T[K];
    return {
      code,
      message: r,
      data
    };
  };