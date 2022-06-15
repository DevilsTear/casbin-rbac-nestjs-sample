import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { newEnforcer } from 'casbin';
import { authz } from './auth/authorization.middleware';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // authorization middleware that is registered as global middleware
  app.use(authz(async() => {
    // console.log(join(__dirname, '/config/model.conf'));
    
    const enforcer = await newEnforcer(join(__dirname, '/config/model.conf'), join(__dirname, '/config/policy.csv'));
    return enforcer;
  }));

  await app.listen(3000);
}
bootstrap();
