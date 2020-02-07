import 'reflect-metadata';
import { Method } from '../types';

const Verb =
  (method: Method) => (path: string): MethodDecorator =>
    (target, key, descriptor): void => {
      Reflect.defineMetadata('path', path, descriptor.value);
      Reflect.defineMetadata('method', method, descriptor.value);
    };

const Get = Verb('get');
const Post = Verb('post');
const Put = Verb('put');
const Delete = Verb('delete');
const Patch = Verb('patch');

export {
  Get, Post, Put, Delete, Patch, Verb
}
