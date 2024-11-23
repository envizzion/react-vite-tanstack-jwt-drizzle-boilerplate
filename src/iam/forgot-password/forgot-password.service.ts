import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { forgotPasswordEmail } from '../../shared/mailer/mailer.constants';
import { UsersRepository } from '@/users/users.repository';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly hashingService: HashingService,
  ) { }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const userUpdate = await this.userRepository.findByEmail(forgotPasswordDto.email);
    const passwordRand = this.utilsService.generatePassword();
    this.sendMailForgotPassword(userUpdate.email, passwordRand);
    return await this.userRepository.updatePassword(forgotPasswordDto.email, passwordRand);
  }

  private sendMailForgotPassword(email: string, password: string): void {
    try {
      this.mailerService.sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        html: forgotPasswordEmail(password),
      });
      Logger.log('[MailService] Forgot Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Forgot Password: Send Mail Failed!', err);
    }
  }
}
