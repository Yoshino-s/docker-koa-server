import 'reflect-metadata';

export const Controller =
  (path?: string): ClassDecorator =>
    (target: any): void =>
      Reflect.defineMetadata('path', path || '', target);
