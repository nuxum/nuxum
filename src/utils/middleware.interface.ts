import type { Request, Response, NextFunction } from 'express';

export interface NuxumMiddleware {
  use(req: Request, res: Response, next: NextFunction): void;
}
