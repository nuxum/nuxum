import 'reflect-metadata';
import request from 'supertest';
import { NuxumApp } from '../../src/app/nuxum.app';
import { Express } from 'express';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { All, Controller, Delete, Get, Head, Injectable, Options, Patch, Post, Put } from '../../src/decorators';
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

      @Put()
      put(req: Request, res: Response) {
        res.send('Hello, Put!');
      }

      @Delete()
      delete(req: Request, res: Response) {
        res.send('Hello, Delete!');
      }

      @Patch()
      patch(req: Request, res: Response) {
        res.send('Hello, Patch!');
      }

      @Options()
      options(req: Request, res: Response) {
        res.send('Hello, Options!');
      }

      @Head()
      head(req: Request, res: Response) {
        res.send('Hello, Head!');
      }

      @All()
      all(req: Request, res: Response) {
        res.send('Hello, All!');
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

    const postResponse = await request(instance).post('/post?name=test').send({ age: 18 });
    expect(postResponse.text).toBe('Hello, Post!');
  });

  it('should work when calling listen', async () => {
    const nuxumApp = new NuxumApp({
      controllers: [],
      middlewares: [],
    });
    const server = nuxumApp.listen(8080, () => {
      console.log('Listening on port 8080');
    });
    server.close();
  });
});
