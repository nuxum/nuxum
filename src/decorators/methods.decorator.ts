import { BODY_METADATA, METHOD_METADATA, PATH_METADATA, QUERY_METADATA } from '../constants';
import { RequestMethod } from '../enums';
import { isString, isUndefined } from '../utils';
import { BodyOption, QueryOption } from '../validators';

export interface MethodMetadata {
  path?: string | string[];
  method?: RequestMethod;
  query?: QueryOption[];
  body?: BodyOption[];
};

const defaultMetadata: MethodMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET,
};

export const Method = (
  metadata: MethodMetadata = defaultMetadata
): MethodDecorator => {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;
  const query = metadata[QUERY_METADATA];
  const body = metadata[BODY_METADATA];

  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    Reflect.defineMetadata(QUERY_METADATA, query, descriptor.value);
    Reflect.defineMetadata(BODY_METADATA, body, descriptor.value);
    return descriptor;
  };
};

const createMethodDecorator = (method: RequestMethod) => (pathOrOptions?: string | string[] | MethodMetadata): MethodDecorator => {
  const path = isUndefined(pathOrOptions)
    ? '/'
    : isString(pathOrOptions) || Array.isArray(pathOrOptions)
      ? pathOrOptions
      : pathOrOptions.path || '/';
  const query = !(isUndefined(pathOrOptions) || isString(pathOrOptions) || Array.isArray(pathOrOptions)) && pathOrOptions.query || [];
  const body = !(isUndefined(pathOrOptions) || isString(pathOrOptions) || Array.isArray(pathOrOptions)) && pathOrOptions.body || [];

  return Method({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: method,
    [QUERY_METADATA]: query,
    [BODY_METADATA]: body,
  });
};

export const Get = createMethodDecorator(RequestMethod.GET);
export const Post = createMethodDecorator(RequestMethod.POST);
export const Put = createMethodDecorator(RequestMethod.PUT);
export const Delete = createMethodDecorator(RequestMethod.DELETE);
export const Patch = createMethodDecorator(RequestMethod.PATCH);
export const Options = createMethodDecorator(RequestMethod.OPTIONS);
export const Head = createMethodDecorator(RequestMethod.HEAD);
export const All = createMethodDecorator(RequestMethod.ALL);
export const Search = createMethodDecorator(RequestMethod.SEARCH);
