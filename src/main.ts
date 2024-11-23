import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import { configureAuthSwaggerDocs } from './helpers/configure-auth-swagger-docs.helper';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';  // Import CORS plugin
import { Logger as pinoLogger } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './shared/middlewares/correlationMiddleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  app.useLogger(app.get(pinoLogger));

  app.getHttpAdapter()
    .getInstance()
    .addHook('onRequest', new CorrelationIdMiddleware().use);


  const configService = app.get<ConfigService>(ConfigService);

  await app.register(fastifyCors, {
    origin: function (origin, callback) {
      const allowedOrigins = configService.get<string>('ENDPOINT_URL_CORS').split(',');
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders:
      'Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  configureAuthSwaggerDocs(app, configService);
  configureSwaggerDocs(app, configService);

  const port = configService.get<number>('SERVER_PORT') || 3000;
  const host = configService.get<number>('SERVER_HOST') || 'localhost';
  await app.listen(port, '0.0.0.0');
  if (configService.get<string>('NODE_ENV') !== 'production') {
    Logger.debug(
      `${await app.getUrl()} - Environment: ${configService.get<string>(
        'NODE_ENV',
      )}`,
      'Environment',
    );

    Logger.debug(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
  }
}
bootstrap();
