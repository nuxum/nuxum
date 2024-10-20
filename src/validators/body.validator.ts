import { isNumber } from '../utils';

type PrimitiveTypes = 'string' | 'number' | 'boolean';

interface BaseBody {
  name: string;
  type: PrimitiveTypes | 'object' | 'array';
  required?: boolean;
  match?: RegExp;
}

interface ObjectBody extends BaseBody {
  type: 'object';
  keys?: BodyData[];
}

interface ArrayBody extends BaseBody {
  type: 'array';
  itemType?: PrimitiveTypes | 'object' | 'array';
  nested?: BodyData[];
}

interface PrimitiveBody extends BaseBody {
  type: PrimitiveTypes;
}

export type BodyData = PrimitiveBody | ObjectBody | ArrayBody;

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
          if (option.keys) {
            const result = validateBody(value, option.keys);
            if (result !== true) return result
          }
          break;
        case 'array':
          if (!Array.isArray(value)) return `Invalid type for field: ${option.name}`;
          switch (option.itemType) {
            case 'object':
            case 'array':
              if (option.nested) for (const item of value) {
                const result = validateBody(item, option.nested);
                if (result !== true) return result;
              };
              break;
            default:
              if (typeof value !== option.itemType && !value.every((item: any) => typeof item === option.itemType)) return `Invalid type for item in field: ${option.name}`;
              break;
          }
          break;
      }
    }
  }
  return true;
};
