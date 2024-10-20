export type Class = new (...args: any[]) => any;

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>;

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: StaticOrigin) => void,
) => void;

interface CorsOptions {
  origin?: StaticOrigin | CustomOrigin | undefined;
  methods?: string | string[] | undefined;
  allowedHeaders?: string | string[] | undefined;
  exposedHeaders?: string | string[] | undefined;
  credentials?: boolean | undefined;
  maxAge?: number | undefined;
  preflightContinue?: boolean | undefined;
  optionsSuccessStatus?: number | undefined;
}

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
  cors?: boolean | CorsOptions;
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
