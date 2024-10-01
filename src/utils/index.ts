import { INJECTABLE_METADATA } from '../constants';
import { Class } from './app.interface';

export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
export const isNil = (obj: any): obj is null | undefined => isUndefined(obj) || obj === null;
export const isString = (obj: any): obj is string => typeof obj === 'string';
export const isNumber = (obj: any): obj is number => typeof obj === 'number';
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isObject = (obj: any): obj is object => typeof obj === 'object' && obj !== null;
export const isConstructor = (obj: any): boolean => obj === 'constructor';
export const isFunction = (obj: any): obj is Function => typeof obj === 'function';
export const isInjectable = (obj: Class): boolean => Reflect.getMetadata(INJECTABLE_METADATA, obj);

export * from './app.interface';
export * from './middleware.interface';
