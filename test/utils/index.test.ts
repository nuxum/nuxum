import 'reflect-metadata';
import { describe, expect, it } from '@jest/globals';
import { Injectable } from '../../src/decorators';
import { isUndefined, isNil, isString, isNumber, isEmpty, isObject, isConstructor, isFunction, isInjectable } from '../../src/utils';

describe('Utils', () => {
  describe('isUndefined', () => {
    it('should work', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
    });
  });

  describe('isNil', () => {
    it('should work', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
      expect(isNil('')).toBe(false);
    });
  });

  describe('isString', () => {
    it('should work', () => {
      expect(isString('')).toBe(true);
      expect(isString(1)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should work', () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber('')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should work', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should work', () => {
      expect(isObject({})).toBe(true);
      expect(isObject('')).toBe(false);
    });
  });

  describe('isConstructor', () => {
    it('should work', () => {
      expect(isConstructor('constructor')).toBe(true);
      expect(isConstructor('')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should work', () => {
      expect(isFunction(() => { })).toBe(true);
      expect(isFunction('')).toBe(false);
    });
  });

  describe('isInjectable', () => {
    it('should return true', () => {
      @Injectable()
      class TestInjectable { }

      expect(isInjectable(TestInjectable)).toBe(true);
    });

    it('should return false', () => {
      class TestInjectable { }

      expect(isInjectable(TestInjectable)).toBe(false);
    });
  });
});