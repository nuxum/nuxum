export type ControllerClass = new (...args: any[]) => any;

export interface RouterOptions {
  prefix?: string;
  cors?: boolean | { origin?: string, methods?: string[] };
  defaultResponseHeaders?: Record<string, string>;
  controllers?: ControllerClass[];
}
