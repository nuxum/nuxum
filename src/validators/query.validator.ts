import { isNumber } from '../utils';

export interface QueryData {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  match?: RegExp;
};

export type QueryOption = string | QueryData;

export const validateQuery = (query: any, options: QueryOption[] = []): boolean | string => {
  for (const option of options) {
    if (typeof option === 'string') {
      if (!query[option]) return `Missing required query parameter: ${option}`;
    }
    else {
      if (option.required && query[option.name] === undefined) return `Missing required query parameter: ${option.name}`;

      switch (option.type) {
        case 'string':
          if (typeof query[option.name] !== 'string') return `Invalid type for query parameter: ${option.name}`;
          if (option.match && !option.match.test(query[option.name])) return `Invalid value for query parameter: ${option.name}`;
          break;
        case 'number':
          if (!isNumber(parseFloat(query[option.name]))) return `Invalid type for query parameter: ${option.name}`;
          break;
        case 'boolean':
          if (['true', 'false'].indexOf(query[option.name]) === -1) return `Invalid type for query parameter: ${option.name}`;
          break;
      }
    }
  }
  return true;
};
