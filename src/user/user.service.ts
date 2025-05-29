import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    if (
      await this.usersRepository.exist({
        where: {
          email: data.email,
        },
      })
    ) {
      throw new BadRequestException('Este e-mail ja esta sendo utilizado');
    }

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async listAll() {
    return this.usersRepository.find();
  }

  async listOne(id: number) {
    await this.exists(id);

    return this.usersRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { birthAt, name, email, password, role }: UpdateUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    await this.usersRepository.update(id, {
      birthAt: birthAt ? new Date(birthAt) : undefined,
      name,
      email,
      password,
      role,
    });

    return this.listOne(id);
  }

  async updatePartial(id: number, data: UpdatePatchDTO) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    const updatedData = {
      ...data,
      birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
      password: data.password
        ? await bcrypt.hash(data.password, salt)
        : undefined,
    };

    await this.usersRepository.update(id, updatedData);

    return this.listOne(id);
  }

  async delete(id: number) {
    await this.exists(id);

    return this.usersRepository.delete(id);
  }

  async exists(id: number) {
    const userExists = await this.usersRepository.exist({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
