import { MODULE_METADATA, MODULE_METADATA_CONTROLLERS, MODULE_METADATA_IMPORTS } from '../constants';

/**
 * Module metadata
 * @param metadata Module metadata
 * @returns ClassDecorator
 */
export interface ModuleMetadata {
  /**
   * Modules to be imported in the module
   * @default []
   */
  imports?: any[];
  /**
   * Controllers to be loaded in the module
   * @default []
   */
  controllers?: any[];
}

export const Module = (metadata: ModuleMetadata): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(MODULE_METADATA, metadata, target);
    Reflect.defineMetadata(MODULE_METADATA_CONTROLLERS, metadata.controllers || [], target);
    Reflect.defineMetadata(MODULE_METADATA_IMPORTS, metadata.imports || [], target);
  };
};
