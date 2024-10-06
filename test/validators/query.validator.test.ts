import { describe, expect, it } from '@jest/globals';
import { validateQuery } from '../../src/validators';

describe('Query Validation', () => {
  it('should work when no options is provided', () => {
    const emptyQuery = validateQuery({});
    expect(emptyQuery).toBe(true);
  });

  it('should work when using string', () => {
    const emptyQuery = validateQuery({}, ['id']);
    const filledQuery = validateQuery({ id: '1' }, ['id']);
    expect(emptyQuery).toBe('Missing required query parameter: id');
    expect(filledQuery).toBe(true);
  });

  it('should work when using custom typing with string', () => {
    const emptyQuery = validateQuery({}, [{ name: 'id', type: 'string', required: true }]);
    const wrongTypeQuery = validateQuery({ id: 1 }, [{ name: 'id', type: 'string', required: true }]);
    const matchQuery = validateQuery({ id: 'a' }, [{ name: 'id', type: 'string', required: true, match: /^[0-9]+$/ }]);
    const filledQuery = validateQuery({ id: '1' }, [{ name: 'id', type: 'string', required: true }]);
    expect(emptyQuery).toBe('Missing required query parameter: id');
    expect(wrongTypeQuery).toBe('Invalid type for query parameter: id');
    expect(matchQuery).toBe('Invalid value for query parameter: id');
    expect(filledQuery).toBe(true);
  });

  it('should work when using custom typing with number', () => {
    const emptyQuery = validateQuery({}, [{ name: 'id', type: 'number', required: true }]);
    const wrongTypeQuery = validateQuery({ id: 'test' }, [{ name: 'id', type: 'number', required: true }]);
    const filledQuery = validateQuery({ id: '1' }, [{ name: 'id', type: 'number', required: true }]);
    expect(emptyQuery).toBe('Missing required query parameter: id');
    expect(wrongTypeQuery).toBe('Invalid type for query parameter: id');
    expect(filledQuery).toBe(true);
  });

  it('should work when using custom typing with boolean', () => {
    const emptyQuery = validateQuery({}, [{ name: 'id', type: 'boolean', required: true }]);
    const wrongTypeQuery = validateQuery({ id: '123' }, [{ name: 'id', type: 'boolean', required: true }]);
    const filledQuery = validateQuery({ id: 'true' }, [{ name: 'id', type: 'boolean', required: true }]);
    expect(emptyQuery).toBe('Missing required query parameter: id');
    expect(wrongTypeQuery).toBe('Invalid type for query parameter: id');
    expect(filledQuery).toBe(true);
  });
});
