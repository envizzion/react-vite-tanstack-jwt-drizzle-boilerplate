import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { Users } from '../../users/models/users.model';
import { UsersService } from '../../users/users.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [MailerModule, UtilsModule, UsersModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    UsersService,
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule { }
