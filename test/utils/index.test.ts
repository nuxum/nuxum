import 'reflect-metadata';
import { describe, expect, it } from '@jest/globals';
import { Injectable } from '../../src/decorators';
import { isUndefined, isNil, isString, isNumber, isEmpty, isObject, isConstructor, isFunction, isInjectable } from '../../src/utils';

describe('Utils', () => {
  describe('isUndefined', () => {
    it('should return true', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false', () => {
      expect(isUndefined(null)).toBe(false);
    });
  });

  describe('isNil', () => {
    it('should return true', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });

    it('should return false', () => {
      expect(isNil('')).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true', () => {
      expect(isString('')).toBe(true);
    });

    it('should return false', () => {
      expect(isString(1)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true', () => {
      expect(isNumber(1)).toBe(true);
    });

    it('should return false', () => {
      expect(isNumber('')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false', () => {
      expect(isEmpty([1])).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return false', () => {
      expect(isObject('')).toBe(false);
    });
  });

  describe('isConstructor', () => {
    it('should return true', () => {
      expect(isConstructor('constructor')).toBe(true);
    });

    it('should return false', () => {
      expect(isConstructor('')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true', () => {
      expect(isFunction(() => { })).toBe(true);
    });

    it('should return false', () => {
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