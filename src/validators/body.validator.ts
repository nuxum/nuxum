import type { Request, Response } from 'express';
import { isNumber } from '../utils';

export interface BodyData {
  name: string;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  match?: RegExp;
  nested?: BodyData[];
};

export type BodyOption = string | BodyData;

export const validateBody = (req: Request, res: Response, body: any, options: BodyOption[] = []): boolean => {
  if (typeof body !== 'object' || body === null) {
    res.status(400).send('Invalid body');
    return false;
  }

  for (const option of options) {
    if (typeof option === 'string') {
      if (!body[option]) {
        res.status(400).send(`Missing required field: ${option}`);
        return false;
      }
    }
    else {
      const value = body[option.name];

      if (option.required && value === undefined) {
        res.status(400).send(`Missing required field: ${option.name}`);
        return false;
      }

      switch (option.type) {
        case 'string':
          if (typeof value !== 'string') {
            res.status(400).send(`Invalid type for field: ${option.name}`);
            return false;
          }
          if (option.match && !option.match.test(value)) {
            res.status(400).send(`Invalid value for field: ${option.name}`);
            return false;
          }
          break;
        case 'number':
          if (!isNumber(value)) {
            res.status(400).send(`Invalid type for field: ${option.name}`);
            return false;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            res.status(400).send(`Invalid type for field: ${option.name}`);
            return false;
          }
          break;
        case 'object':
          if (typeof value !== 'object' || value === null) {
            res.status(400).send(`Invalid type for field: ${option.name}`);
            return false;
          }
          if (option.nested && !validateBody(req, res, value, option.nested)) return false;
          break;
        case 'array':
          if (!Array.isArray(value)) {
            res.status(400).send(`Invalid type for field: ${option.name}`);
            return false;
          }
          if (option.nested && !value.every((item: any) => validateBody(req, res, item, option.nested))) return false;
          break;
        default:
          res.status(400).send(`Invalid type for field: ${option.name}`);
          return false;
      }
    }
  }
  return true;
};
