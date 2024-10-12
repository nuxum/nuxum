import { CONTROLLER_METADATA, PATH_METADATA } from '../constants';
import { isString, isUndefined } from '../utils';

/**
 * Controller metadata
 * @param pathOrOptions Controller path or options
 * @returns ClassDecorator
 */
export interface ControllerMetadata {
  /**
   * Controller path
   * @default '/'
   * @example '/api'
   */
  path?: string | string[];
};

export const Controller = (pathOrOptions?: string | string[] | ControllerMetadata): ClassDecorator => {
  const path = isUndefined(pathOrOptions)
    ? '/'
    : isString(pathOrOptions) || Array.isArray(pathOrOptions)
      ? pathOrOptions
      : pathOrOptions.path || '/';

  return (target: object) => {
    Reflect.defineMetadata(CONTROLLER_METADATA, true, target);
    Reflect.defineMetadata(PATH_METADATA, path, target);
  };
};
