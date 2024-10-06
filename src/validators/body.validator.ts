import { isNumber } from '../utils';

export interface BodyData {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  match?: RegExp;
  nested?: BodyData[];
};

export type BodyOption = string | BodyData;

export const validateBody = (body: any, options: BodyOption[] = []): boolean | string => {
  if (typeof body !== 'object' || body === null) return 'Invalid body';

  for (const option of options) {
    if (typeof option === 'string') {
      if (!body[option]) return `Missing required field: ${option}`;
    }
    else {
      const value = body[option.name];

      if (option.required && value === undefined) return `Missing required field: ${option.name}`;

      switch (option.type) {
        case 'string':
          if (typeof value !== 'string') return `Invalid type for field: ${option.name}`;
          if (option.match && !option.match.test(value)) return `Invalid value for field: ${option.name}`;
          break;
        case 'number':
          if (!isNumber(value)) return `Invalid type for field: ${option.name}`;
          break;
        case 'boolean':
          if (typeof value !== 'boolean') return `Invalid type for field: ${option.name}`;
          break;
        case 'object':
          if (typeof value !== 'object' || value === null) return `Invalid type for field: ${option.name}`;
          if (option.nested) return validateBody(value, option.nested);
          break;
        case 'array':
          if (!Array.isArray(value)) return `Invalid type for field: ${option.name}`;
          if (option.nested) for (const item of value) return validateBody(item, option.nested);
          break;
      }
    }
  }
  return true;
};
