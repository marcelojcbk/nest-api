import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data,
      //   select: {   //select utilizado para selecionar o que voce quer
      //     id: true, //que o prisma retorne ao finalizar a query
      //   },
    });
  }

  async listAll() {
    return this.prisma.user.findMany({});
  }

  async listOne(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { birthAt, name, email, password, role }: UpdateUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      data: {
        birthAt: birthAt ? new Date(birthAt) : null,
        name,
        email,
        password,
        role,
      },
      where: {
        id,
      },
    });
  }

  async updatePartial(id: number, data: UpdatePatchDTO) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    const updatedData = {
      ...data,
      birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: data.password
        ? await bcrypt.hash(data.password, salt)
        : undefined,
    };

    return this.prisma.user.update({
      data: updatedData,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
