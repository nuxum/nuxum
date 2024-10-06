export class Logger {
  private static enabled: boolean = false;
  private static logger_colors = {
    nuxum: '0;35',
    log: '0;34',
    info: '0;36',
    warn: '0;33',
    error: '0;31',
    debug: '0;32',
    date: '0;90',
    method: '0;94',
    request: '0;92',
  };

  private static colorize(text: string, color: string): string {
    return process.env.FORCE_COLOR !== '0' ? `\x1b[${color}m${text}\x1b[0m` : text;
  }

  static initialize(enabled: boolean): void {
    this.enabled = enabled;
  }

  static controller(controller: string): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('NUXUM/CONTROLLER', this.logger_colors.nuxum)}] ${controller} initialized`);
  }

  static route(method: string, path: string): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('NUXUM/ROUTE', this.logger_colors.nuxum)}] ${this.colorize(method, this.logger_colors.method)} ${path} added`);
  }

  static middleware(middleware: string): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('NUXUM/MIDDLEWARE', this.logger_colors.nuxum)}] ${middleware} initialized`);
  }

  static server(port: string | number): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('NUXUM', this.logger_colors.nuxum)}] Listening on port ${port}`);
  }

  static request(method: string, path: string): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('REQUEST', this.logger_colors.request)}] ${this.colorize(method, this.logger_colors.method)} ${path}`);
  }

  static log(message: string): void {
    if (this.enabled) console.log(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('LOG', this.logger_colors.log)}] ${message}`);
  }

  static error(message: string): void {
    if (this.enabled) console.error(`[${this.colorize(new Date().toISOString(), this.logger_colors.date)}] [${this.colorize('ERROR', this.logger_colors.error)}] ${message}`);
  }
}
