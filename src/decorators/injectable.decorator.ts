import { INJECTABLE_METADATA } from '../constants';

export const Injectable = (): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
};
