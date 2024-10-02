export type Class = new (...args: any[]) => any;

export interface AppOptions {
  prefix?: string;
  logger?: boolean;
  cors?: boolean | { origin?: string, methods?: string[] };
  defaultResponseHeaders?: Record<string, string>;
  controllers?: Class[];
  middlewares?: Class[];
}
