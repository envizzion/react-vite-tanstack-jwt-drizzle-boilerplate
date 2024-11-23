import { Module } from '@nestjs/common';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { MailerModule } from '../shared/mailer/mailer.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { provideUsersRepository } from './repositories/users.repository.provider';
import { UsersRepository } from './users.repository';

@Module({
  imports: [MailerModule],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    // ...provideUsersRepository(),
    UsersRepository
  ],
  exports: [UsersService, UsersRepository]
})
export class UsersModule { }
