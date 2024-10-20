import { describe, expect, it } from '@jest/globals';
import { validateBody } from '../../src/validators';

describe('Body Validation', () => {
  it('should work when no options is provided', () => {
    const emptyBody = validateBody({});
    expect(emptyBody).toBe(true);
  });

  it('should work when the body is not an object or null', () => {
    const emptyBody = validateBody('', ['id']);
    const nullBody = validateBody(null, ['id']);
    expect(emptyBody).toBe('Invalid body');
    expect(nullBody).toBe('Invalid body');
  });

  it('should work when using string', () => {
    const emptyBody = validateBody({}, ['id']);
    const filledBody = validateBody({ id: '1' }, ['id']);
    expect(emptyBody).toBe('Missing required field: id');
    expect(filledBody).toBe(true);
  });

  it('should work when using custom typing with string', () => {
    const emptyBody = validateBody({}, [{ name: 'id', type: 'string', required: true }]);
    const wrongTypeBody = validateBody({ id: 1 }, [{ name: 'id', type: 'string', required: true }]);
    const matchBody = validateBody({ id: 'a' }, [{ name: 'id', type: 'string', required: true, match: /^[0-9]+$/ }]);
    const filledBody = validateBody({ id: '1' }, [{ name: 'id', type: 'string', required: true }]);
    expect(emptyBody).toBe('Missing required field: id');
    expect(wrongTypeBody).toBe('Invalid type for field: id');
    expect(matchBody).toBe('Invalid value for field: id');
    expect(filledBody).toBe(true);
  });

  it('should work when using custom typing with number', () => {
    const emptyBody = validateBody({}, [{ name: 'id', type: 'number', required: true }]);
    const wrongTypeBody = validateBody({ id: 'test' }, [{ name: 'id', type: 'number', required: true }]);
    const filledBody = validateBody({ id: 1 }, [{ name: 'id', type: 'number', required: true }]);
    expect(emptyBody).toBe('Missing required field: id');
    expect(wrongTypeBody).toBe('Invalid type for field: id');
    expect(filledBody).toBe(true);
  });

  it('should work when using custom typing with boolean', () => {
    const emptyBody = validateBody({}, [{ name: 'id', type: 'boolean', required: true }]);
    const wrongTypeBody = validateBody({ id: 'true' }, [{ name: 'id', type: 'boolean', required: true }]);
    const filledBody = validateBody({ id: true }, [{ name: 'id', type: 'boolean', required: true }]);
    expect(emptyBody).toBe('Missing required field: id');
    expect(wrongTypeBody).toBe('Invalid type for field: id');
    expect(filledBody).toBe(true);
  });

  it('should work when using custom typing with object', () => {
    const emptyBody = validateBody({}, [{ name: 'id', type: 'object', required: true }]);
    const wrongTypeBody = validateBody({ id: '1' }, [{ name: 'id', type: 'object', required: true }]);
    const nestedBody = validateBody({ id: {} }, [{ name: 'id', type: 'object', required: true, keys: [{ name: 'name', type: 'string', required: true }] }]);
    const filledBody = validateBody({ id: {} }, [{ name: 'id', type: 'object', required: true }]);
    expect(emptyBody).toBe('Missing required field: id');
    expect(wrongTypeBody).toBe('Invalid type for field: id');
    expect(nestedBody).toBe('Missing required field: name');
    expect(filledBody).toBe(true);
  });

  it('should work when using custom typing with array', () => {
    const emptyBody = validateBody({}, [{ name: 'id', type: 'array', required: true }]);
    const wrongTypeBody = validateBody({ id: '1' }, [{ name: 'id', type: 'array', required: true }]);
    const nestedBody = validateBody({ id: [{}] }, [{ name: 'id', type: 'array', required: true, nested: [{ name: 'name', type: 'string', required: true }] }]);
    const filledBody = validateBody({ id: [] }, [{ name: 'id', type: 'array', required: true }]);
    expect(emptyBody).toBe('Missing required field: id');
    expect(wrongTypeBody).toBe('Invalid type for field: id');
    expect(nestedBody).toBe('Missing required field: name');
    expect(filledBody).toBe(true);
  });
});
