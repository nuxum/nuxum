import 'reflect-metadata';
import { Controller } from '../../src/decorators';
import { describe, expect, it } from '@jest/globals';
import { PATH_METADATA } from '../../src/constants';

describe('Controller Decorator', () => {
  it('should define metadata on the class', () => {
    @Controller('/test')
    class TestController { }

    const path = Reflect.getMetadata(PATH_METADATA, TestController);
    expect(path).toBe('/test');
  });
});
