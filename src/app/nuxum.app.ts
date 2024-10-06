import cors from 'cors';
import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import { isConstructor, isFunction, AppOptions, isInjectable } from '../utils';
import { BODY_METADATA, METHOD_METADATA, PATH_METADATA, QUERY_METADATA } from '../constants';
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
    this.instance.use(express.json());
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
      const path = Reflect.getMetadata(PATH_METADATA, Controller);
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
        const method_path: string = Reflect.getMetadata(PATH_METADATA, prototype[property]);
        const method: RequestMethod = Reflect.getMetadata(METHOD_METADATA, prototype[property]);

        const route_path = (this.options.prefix || '') + path + method_path;
        this.registerRoute(method, this.cleanupPath(route_path), handler);
        Logger.route(RequestMethod[method], this.cleanupPath(route_path));
      }
      Logger.controller(Controller.name);
    }
  }

  private cleanupPath(path: string): string {
    return path.replace(/\/\//g, '/');
  }

  private createHandler(method: Function): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const routeOptions: MethodMetadata = {
        body: Reflect.getMetadata(BODY_METADATA, method),
        query: Reflect.getMetadata(QUERY_METADATA, method),
      };

      if (!routeOptions) return next();

      Logger.request(req.method, req.path);

      if (routeOptions.query) {
        const queryValidation = validateQuery(req.query, routeOptions.query);
        if (routeOptions.query.length !== 0 && typeof queryValidation === 'string') return res.status(400).send({ message: queryValidation });
      }

      if (routeOptions.body) {
        const bodyValidation = validateBody(req.body, routeOptions.body);
        if (routeOptions.body.length !== 0 && typeof bodyValidation === 'string') return res.status(400).send({ message: bodyValidation });
      }

      method(req, res, next);
    };
  }

  private registerRoute(method: RequestMethod, path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    const routePath = path + (Reflect.getMetadata(PATH_METADATA, handler) || '/');
    switch (method) {
      case RequestMethod.GET: this.instance.get(routePath, handler); break;
      case RequestMethod.POST: this.instance.post(routePath, handler); break;
      case RequestMethod.PUT: this.instance.put(routePath, handler); break;
      case RequestMethod.DELETE: this.instance.delete(routePath, handler); break;
      case RequestMethod.PATCH: this.instance.patch(routePath, handler); break;
      case RequestMethod.OPTIONS: this.instance.options(routePath, handler); break;
      case RequestMethod.HEAD: this.instance.head(routePath, handler); break;
      case RequestMethod.ALL: this.instance.all(routePath, handler); break;
    }
  }

  private setupDefaultRoute(): void {
    this.instance.use((req, res) => {
      res.status(404).send({ message: 'Not Found' })
    });
  }

  public listen(port: string | number, callback?: () => void) {
    return this.instance.listen(port, () => {
      Logger.server(port);
      if (callback) callback();
    });
  }
}
