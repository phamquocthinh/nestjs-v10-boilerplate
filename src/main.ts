import { AppConfig, AppModule } from 'src/modules/app';
import { AuthTokenGuard } from './shared/guards/auth-token.guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { clusterize } from './utils/clustering';
import { initialize } from './utils/helper';
import { useContainer } from 'class-validator';

const { CLUSTERING, PORT } = process.env;

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    AppConfig.getFastifyInstance(),
    { bufferLogs: true }
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalGuards(new AuthTokenGuard(new Reflector()));

  initialize(app);

  // By default, Fastify only listens localhost, so we should to specify '0.0.0.0'
  app.listen(PORT, '0.0.0.0');
};
if (CLUSTERING === 'true') clusterize(bootstrap);
else bootstrap();
