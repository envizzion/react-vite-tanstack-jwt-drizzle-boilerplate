import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module, RequestMethod, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule, } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import * as schema from './db/schema';
import { validateSchemaEnv } from './helpers/validation-schema-env';
import { IamModule } from './iam/iam.module';
import {
  AllExceptionsFilter,
  BadRequestExceptionFilter,
  ForbiddenExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
  ValidationExceptionFilter,
} from './shared/filters';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.dev', '.env.stage', '.env.prod'],
      validate: validateSchemaEnv,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
        transport: process.env.NODE_ENV !== 'production' ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
          }
        } : undefined,
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              // headers: req.headers, // Include headers if necessary, or filter out sensitive headers
              traceId: req.headers['x-correlation-id'], // Ensure the correlation ID is logged
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode, // Log only the status code of the response
              // Do not include the body or headers to avoid leaking sensitive data
            };
          }
        },
        customProps: (req, res) => ({
          traceId: req.headers['x-correlation-id'],
        }),
        autoLogging: true, // Ensure that route logging is handled automatically
      },
      exclude: [{ method: RequestMethod.ALL, path: 'check' }], // Exclude logging for specific routes
    }),
    DrizzlePGModule.register({
      tag: 'DB',
      pg: {
        connection: 'pool',
        config: {
          connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:${parseInt(process.env.DB_PORT)}/${process.env.DB_NAME}`,
        },
      },
      config: { schema: { ...schema } },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL'),
          limit: config.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    IamModule,
    UsersModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
  ],
})
export class AppModule { }
