import 'reflect-metadata';
import request from 'supertest';
import { NuxumApp } from '../../src/app/nuxum.app';
import { Express } from 'express';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { Controller, Get, Injectable, Post } from '../../src/decorators';
import type { Request, Response } from 'express';

describe('NuxumApp', () => {
  let instance: Express;

  beforeAll(() => {
    @Controller('/')
    class TestController {
      @Get()
      index(req: Request, res: Response) {
        res.send('Hello, World!');
      }

      @Post({
        path: '/post',
        query: [{ name: 'name', required: true, type: 'string' }],
        body: [{ name: 'age', required: true, type: 'number' }],
      })
      post(req: Request, res: Response) {
        res.send('Hello, Post!');
      }
    }

    const nuxumApp = new NuxumApp({
      controllers: [TestController],
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

  it('should work when using middlewares', () => {
    expect(() => {
      new NuxumApp({
        controllers: [],
        middlewares: [class TestMiddleware { use() { } }],
      });
    }).toThrowError('Middleware TestMiddleware must be decorated with @Injectable()');

    @Injectable()
    class TestMiddleware { use() { } }
    expect(() => {
      new NuxumApp({
        controllers: [],
        middlewares: [TestMiddleware],
      });
    }).not.toThrowError();
  });

  it('should work when using controllers', async () => {
    const response = await request(instance).get('/');
    expect(response.text).toBe('Hello, World!');

    const postResponse = await request(instance).post('/post?name=test');
    expect(postResponse.text).toBe('Hello, Post!');
  });
});
