import { INJECTABLE_METADATA, MIDDLEWARE_METADATA } from '../constants';
import { Class } from '../utils';

export const UseMiddleware = (...middlewares: Class[]): MethodDecorator => {
  return (target: any, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    for (const middleware of middlewares) {
      const isInjectable = Reflect.getMetadata(INJECTABLE_METADATA, middleware);
      if (!isInjectable) throw new Error(`Middleware ${middleware.name} must be decorated with @Injectable()`);
    }
    Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewares, descriptor.value);
  };
};

