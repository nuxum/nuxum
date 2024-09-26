import cors from 'cors';
import type { Express, Request, Response } from 'express';
import { isConstructor, isFunction, RouterOptions } from '../utils';
import { METHOD_METADATA, PATH_METADATA } from '../constants';
import { MethodMetadata } from '../decorators';
import { validateBody, validateQuery } from '../validators';
import { RequestMethod } from '../enums';

export class Router {
  private app: Express;
  private options: RouterOptions;

  constructor(app: Express, options: RouterOptions) {
    this.app = app;
    this.options = options;

    this.setupMiddlewares();
    this.setupControllers();
    this.setupDefaultRoute();
  }

  private setupMiddlewares(): void {
    if (this.options.prefix) this.app.use(this.options.prefix, this.app);
    if (this.options.cors) this.app.use(cors(this.options.cors === true ? {} : this.options.cors));
    if (this.options.defaultResponseHeaders) this.app.use((req, res, next) => {
      for (const [key, value] of Object.entries(this.options.defaultResponseHeaders!)) res.setHeader(key, value);
      next();
    });
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

        this.registerRoute(method, path, handler);
      }
    }
  }

  private createHandler(method: Function): (req: Request, res: Response) => void {
    return (req: Request, res: Response) => {
      const routeOptions: MethodMetadata = Reflect.getMetadata(PATH_METADATA, method) || {};

      if (routeOptions.query && routeOptions.query.length !== 0 && !validateQuery(req, res, req.query, routeOptions.query)) return;
      if (routeOptions.body && routeOptions.body.length !== 0 && !validateBody(req, res, req.body, routeOptions.body)) return;

      method(req, res);
    };
  }

  private registerRoute(method: RequestMethod, path: string, handler: (req: Request, res: Response) => void) {
    const routePath = `${path}${Reflect.getMetadata(PATH_METADATA, handler) || '/'}`;
    switch (method) {
      case RequestMethod.GET: this.app.get(routePath, handler); break;
      case RequestMethod.POST: this.app.post(routePath, handler); break;
      case RequestMethod.PUT: this.app.put(routePath, handler); break;
      case RequestMethod.DELETE: this.app.delete(routePath, handler); break;
      case RequestMethod.PATCH: this.app.patch(routePath, handler); break;
      case RequestMethod.OPTIONS: this.app.options(routePath, handler); break;
      case RequestMethod.HEAD: this.app.head(routePath, handler); break;
      case RequestMethod.ALL: this.app.all(routePath, handler); break;
      default: throw new Error(`Unsupported request method: ${method}`);
    }
  }

  private setupDefaultRoute(): void {
    this.app.use((req, res) => {
      res.status(404).send({ message: 'Not Found' })
    });
  }
};
