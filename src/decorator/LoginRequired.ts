import { CustomMiddleware, Context } from './types';
import { ExtraMiddleware } from './Middleware';

const DEFAULT_SESSION_NAME = 'hasLogin';

const LoginRequiredMiddleware = (action?: CustomMiddleware | string, sessionName = DEFAULT_SESSION_NAME): CustomMiddleware => async (ctx, next): Promise<void> => {
  if (ctx.session[sessionName]) {
    await next();
  } else if (action) {
    if (typeof action === 'string') {
      ctx.redirect(action);
    } else {
      await action(ctx, next);
    }
  } else {
    ctx.throw(400, 'Login required');
  }
}

const LoginRequired = (action?: CustomMiddleware | string, sessionName = DEFAULT_SESSION_NAME): MethodDecorator => ExtraMiddleware(LoginRequiredMiddleware(action, sessionName));

const login = (ctx: Context): void => { ctx.session[DEFAULT_SESSION_NAME] = true; };
const logout = (ctx: Context): void => { ctx.session[DEFAULT_SESSION_NAME] = false; };

export { LoginRequired, LoginRequiredMiddleware, login, logout};