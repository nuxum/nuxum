import request from 'supertest';
import { NuxumApp } from '../../src/app/nuxum.app';
import { Express } from 'express';
import { beforeAll, describe, expect, it } from '@jest/globals';

describe('NuxumApp', () => {
  let instance: Express;

  beforeAll(() => {
    const nuxumApp = new NuxumApp({
      controllers: [],
      middlewares: [],
      cors: true,
      defaultResponseHeaders: { 'X-Powered-By': 'Nuxum' },
    });
    instance = nuxumApp['instance'];
  });

  it('should set default response headers', async () => {
    const response = await request(instance).get('/');
    expect(response.headers['x-powered-by']).toBe('Nuxum');
  });

  it('should handle 404 errors', async () => {
    const response = await request(instance).get('/not-found');
    expect(response.status).toBe(404);
  });
});
