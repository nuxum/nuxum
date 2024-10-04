import 'reflect-metadata';
import { Injectable } from '../../src/decorators';
import { describe, expect, it } from '@jest/globals';
import { INJECTABLE_METADATA } from '../../src/constants';

describe('Injectable Decorator', () => {
  it('should be defined', () => {
    @Injectable()
    class TestInjectable { }

    const isInjectable = Reflect.getMetadata(INJECTABLE_METADATA, TestInjectable);
    expect(isInjectable).toBe(true);
  });
});
