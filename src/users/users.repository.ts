import { Users } from './models/users.model';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { HashingService } from '../shared/hashing/hashing.service';
import { AccountsUsers } from './interfaces/accounts-users.interface';
import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, Table } from 'drizzle-orm';


@Injectable()
export class UsersRepository {
  constructor(
    // private readonly usersRepository: Repository<Users>,
    @Inject('DB')
    private db: NodePgDatabase<typeof schema>,
    private readonly hashingService: HashingService,
  ) {

  }

  public async findAll(): Promise<Users[]> {
    // return await this.usersRepository.find();
    return await this.db.select().from(schema.users)
  }

  public async findByEmail(email: string) {
    // return await this.usersRepository.findOneBy({
    //   email: email,
    // });
    return await this.db.query.users.findFirst({ where: eq(schema.users.email, email) })
  }

  public async findBySub(sub: number): Promise<Users> {
    // return await this.usersRepository.findOneByOrFail({
    //   id: sub,
    // });
    return await this.db.query.users.findFirst({ where: eq(schema.users.id, sub) })
  }

  public async findById(userId: any): Promise<Users | null> {
    return await this.db.query.users.findFirst({ where: eq(schema.users.id, userId) })

  }

  public async create(userDto: UserDto): Promise<AccountsUsers> {
    return await this.db.insert(schema.users).values(userDto)
  }

  public async updateByEmail(email: string): Promise<Users> {
    // const user = await this.usersRepository.findOneBy({ email: email });
    const password = await this.hashingService.hash(
      Math.random().toString(36).slice(-8),
    );
    return await this.db.update(schema.users).set({ password }).where(eq(schema.users.email, email))
  }

  public async updatePassword(
    email: string,
    password: string,
  ): Promise<Users> {
    // const user = await this.usersRepository.findOneBy({ email: email });
    const pass = await this.hashingService.hash(password);

    // return await this.usersRepository.save(user);

    return await this.db.update(schema.users).set({ password: pass }).where(eq(schema.users.email, email))


  }

  public async updateUserProfile(
    id: any,
    userProfileDto: UserProfileDto,
  ): Promise<Users> {
    return await this.db.update(schema.users).set({ name: userProfileDto.name, email: userProfileDto.email, username: userProfileDto.username }).where(eq(schema.users.id, id))
  }

  public async updateUser(
    id: any,
    userUpdateDto: UserUpdateDto,
  ): Promise<Users> {
    return await this.db.update(schema.users).set({ ...userUpdateDto }).where(eq(schema.users.id, id))
  }

  public async deleteUser(user: any): Promise<void> {
    await this.db.delete(schema.users).where(eq(schema.users.id, user.id))

  }
}
