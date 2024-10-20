# Nuxum

Nuxum is a simple and lightweight Express.js framework for building web applications.

## Getting Started

Use the [command line](https://github.com/nuxum/cli) to create a new Nuxum project:

```bash
$ npm install -g @nuxum/cli
$ nuxum create my-app
$ cd my-app
$ npm start
```

## Features

- **Routing**: Define routes with the `@<Get|Post|Put|Delete>` decorators.
- **Middleware**: Use middleware functions to execute code before processing a request.
- **Controllers**: Organize your application logic with controllers.

## Example

```typescript
import { NuxumApp, Get, Controller, Module } from '@nuxum/core';

@Controller()
class HomeController {
  @Get('/')
  index(req, res) {
    res.send('Hello, World!');
  }
}

@Module({
  controllers: [HomeController]
})
class AppModule {}

const app = new NuxumApp({
  modules: [AppModule]
});

app.listen(3000);
```
