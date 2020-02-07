import 'reflect-metadata';
import { CustomMiddleware } from './types';

const ExtraMiddleware =
  (middleware: CustomMiddleware): MethodDecorator =>
    (target, key, descriptor): void => {
      const t = Reflect.getMetadata('extraMiddleware', descriptor.value);
      let a = new Array<CustomMiddleware>();
      if (Array.isArray(t)) {
        a = t;
      }
      a.push(middleware);
      Reflect.defineMetadata('extraMiddleware', a, descriptor.value);
    };

export {
  ExtraMiddleware
};