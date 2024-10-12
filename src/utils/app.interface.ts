export type Class = new (...args: any[]) => any;

/**
 * AppOptions interface
 * @interface
 * @interfacedesc NuxumApp options
 */
export interface AppOptions {
  /**
   * App prefix
   * @default ''
   * @example
   * prefix: '/api'
   */
  prefix?: string;
  /**
   * Enable logger
   * @default false
   */
  logger?: boolean;
  /**
   * Enable cors
   * @default false
   * @example
   * cors: true
   * cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
   */
  cors?: boolean | { origin?: string, methods?: string[] };
  /**
   * Default response headers
   * @default {}
   * @example
   * defaultResponseHeaders: { 'X-Powered-By': 'Nuxum' }
   */
  defaultResponseHeaders?: Record<string, string>;
  /**
   * Middlewares to be loaded in the app
   * @default []
   * @example
   * middlewares: [LoggerMiddleware]
   */
  middlewares?: Class[];
  /**
   * Modules to be loaded in the app
   * @default []
   * @example
   * modules: [AppModule]
   */
  modules?: Class[];
}
