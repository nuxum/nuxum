import 'reflect-metadata';
import { Controller } from '../../src/decorators';
import { describe, expect, it } from '@jest/globals';
import { PATH_METADATA } from '../../src/constants';

describe('Controller Decorator', () => {
  it('should be the correct path', () => {
    @Controller('/test')
    class TestController { }

    const path = Reflect.getMetadata(PATH_METADATA, TestController);
    expect(path).toBe('/test');
  });

  it('should be the default path', () => {
    @Controller()
    class TestController { }

    const path = Reflect.getMetadata(PATH_METADATA, TestController);
    expect(path).toBe('/');
  });

  it('should be correct when using options', () => {
    @Controller({ path: '/test' })
    class TestController { }

    const path = Reflect.getMetadata(PATH_METADATA, TestController);
    expect(path).toBe('/test');
  });

  it('should be correct when using empty options', () => {
    @Controller({})
    class TestController { }

    const path = Reflect.getMetadata(PATH_METADATA, TestController);
    expect(path).toEqual('/');
  });
});
