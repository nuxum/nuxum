import type { Request, Response } from 'express';
import { isNumber } from '../utils';

export interface QueryData {
  name: string;
  type?: 'string' | 'number' | 'boolean';
  required?: boolean;
  match?: RegExp;
};

export type QueryOption = string | QueryData;

export const validateQuery = (req: Request, res: Response, query: any, options: QueryOption[] = []): boolean => {
  for (const option of options) {
    if (typeof option === 'string') {
      if (!query[option]) {
        res.status(400).send(`Missing required query parameter: ${option}`);
        return false;
      }
    }
    else {
      if (option.required && query[option.name] === undefined) {
        res.status(400).send(`Missing required query parameter: ${option.name}`);
        return false;
      }

      switch (option.type) {
        case 'string':
          if (typeof query[option.name] !== 'string') {
            res.status(400).send(`Invalid type for query parameter: ${option.name}`);
            return false;
          }
          if (option.match && !option.match.test(query[option.name])) {
            res.status(400).send(`Invalid value for query parameter: ${option.name}`);
            return false;
          }
          break;
        case 'number':
          if (!isNumber(parseFloat(query[option.name]))) {
            res.status(400).send(`Invalid type for query parameter: ${option.name}`);
            return false;
          }
          break;
        case 'boolean':
          if (['true', 'false'].indexOf(query[option.name]) === -1) {
            res.status(400).send(`Invalid type for query parameter: ${option.name}`);
            return false;
          }
          break;
        default:
          res.status(400).send(`Invalid type for query parameter: ${option.name}`);
          return false;
      }
    }
  }
  return true;
};
