import { AuthRegisterLoginDto } from '../auth/dtos/register.dto';
import { BaseService } from 'src/shared/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super(usersRepository);
  }

  async create(data: AuthRegisterLoginDto): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
