import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '../../src/utils';

describe('Logger', () => {
  beforeAll(() => {
    Logger.initialize(true);
  });

  it('should be defined', () => {
    expect(Logger).toBeDefined();
  });

  it('should be correct when using controller', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.controller('TestController');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('TestController initialized'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using route', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.route('GET', '/test');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('GET /test added'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using middleware', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.middleware('TestMiddleware');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('TestMiddleware initialized'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using server', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.server(3000);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Listening on port 3000'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using request', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.request('GET', '/test');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('GET /test'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using log', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.log('Test');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test'));
    consoleSpy.mockRestore();
  });

  it('should be correct when using error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    Logger.error('Test');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test'));
    consoleSpy.mockRestore();
  });

  it('should not use color when disabled', () => {
    process.env.FORCE_COLOR = '0';
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    Logger.log('Hello from Nuxum jest test service');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hello from Nuxum jest test service'));
    consoleSpy.mockRestore();
  });
});
