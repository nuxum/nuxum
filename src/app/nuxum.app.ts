import cors from 'cors';
import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import { isConstructor, isFunction, AppOptions, isInjectable, Class } from '../utils';
import { METHOD_METADATA, PATH_METADATA } from '../constants';
import { RequestMethod } from '../enums';
import { MethodMetadata } from '../decorators';
import { validateBody, validateQuery } from '../validators';
import { Logger } from '../utils/logger.util';

export class NuxumApp {
  private instance: Express;
  private options: AppOptions;

  constructor(options: AppOptions) {
    this.instance = express();
    this.options = options;

    Logger.initialize(this.options.logger || false);

    this.setupMiddlewares();
    this.setupControllers();
    this.setupDefaultRoute();
  }

  private setupMiddlewares(): void {
    if (this.options.cors) this.instance.use(cors(this.options.cors === true ? {} : this.options.cors));
    if (this.options.defaultResponseHeaders) this.instance.use((req, res, next) => {
      for (const [key, value] of Object.entries(this.options.defaultResponseHeaders!)) res.setHeader(key, value);
      next();
    });

    if (this.options.middlewares && this.options.middlewares.length !== 0) for (const Middleware of this.options.middlewares) {
      if (!isInjectable(Middleware)) throw new Error(`Middleware ${Middleware.name} must be decorated with @Injectable()`);
      this.instance.use((req, res, next) => new Middleware().use(req, res, next));
      Logger.middleware(Middleware.name);
    }
  }

  private setupControllers(): void {
    if (this.options.controllers) for (const Controller of this.options.controllers) {
      const path = Reflect.getMetadata(PATH_METADATA, Controller) || '/';
      const prototype = Controller.prototype;

      for (const property of Object.getOwnPropertyNames(prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, property);

        if (
          !descriptor ||
          descriptor.set ||
          descriptor.get ||
          isConstructor(property) ||
          !isFunction(prototype[property])
        ) continue;

        const handler = this.createHandler(prototype[property]);
        const method: RequestMethod = Reflect.getMetadata(METHOD_METADATA, prototype[property]);

        this.registerRoute(method, this.options.prefix + path, handler);
        Logger.route(RequestMethod[method], this.options.prefix + path);
      }
      Logger.controller(Controller.name);
    }
  }

  private createHandler(method: Function): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const routeOptions: MethodMetadata = Reflect.getMetadata(PATH_METADATA, method) || {};

      Logger.request(req.method, req.path);

      if (routeOptions.query && routeOptions.query.length !== 0 && !validateQuery(req, res, req.query, routeOptions.query)) return;
      if (routeOptions.body && routeOptions.body.length !== 0 && !validateBody(req, res, req.body, routeOptions.body)) return;

      method(req, res, next);
    };
  }

  private registerRoute(method: RequestMethod, path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    const routePath = `${path}${Reflect.getMetadata(PATH_METADATA, handler) || '/'}`;
    switch (method) {
      case RequestMethod.GET: this.instance.get(routePath, handler); break;
      case RequestMethod.POST: this.instance.post(routePath, handler); break;
      case RequestMethod.PUT: this.instance.put(routePath, handler); break;
      case RequestMethod.DELETE: this.instance.delete(routePath, handler); break;
      case RequestMethod.PATCH: this.instance.patch(routePath, handler); break;
      case RequestMethod.OPTIONS: this.instance.options(routePath, handler); break;
      case RequestMethod.HEAD: this.instance.head(routePath, handler); break;
      case RequestMethod.ALL: this.instance.all(routePath, handler); break;
      default: throw new Error(`Unsupported request method: ${method}`);
    }
  }

  private setupDefaultRoute(): void {
    this.instance.use((req, res) => {
      res.status(404).send({ message: 'Not Found' })
    });
  }

  public use(middleware: Class): void {
    if (!isInjectable(middleware)) throw new Error(`Middleware ${middleware.name} must be decorated with @Injectable()`);
    this.instance.use((req, res, next) => new middleware().use(req, res, next));
  }

  public listen(port: string | number, callback?: () => void): void {
    this.instance.listen(port, () => {
      Logger.server(port);
      if (callback) callback();
    });
  }
}
