import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UsersService } from '../../users/users.service';
import jwtConfig from '../login/config/jwt.config';
import { AccessTokenGuard } from '../login/guards/access-token/access-token.guard';
import { AuthenticationGuard } from '../login/guards/authentication/authentication.guard';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    MailerModule,
    UsersModule
  ],
  controllers: [ChangePasswordController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    ChangePasswordService,
    UsersService,
    JwtService,
  ],
})
export class ChangePasswordModule { }
