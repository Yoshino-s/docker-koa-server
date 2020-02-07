import { ParameterizedContext } from 'koa';
import { Files } from 'formidable';
import { Session } from 'koa-session';
export type Context = ParameterizedContext<any, {
  params: () => any;
}> & {
  request: {
    body?: any;
    files?: Files;
  }
  session: Session;
};
export type Next = () => Promise<any>;
export type CustomMiddleware = (ctx: Context, next: Next) => any;